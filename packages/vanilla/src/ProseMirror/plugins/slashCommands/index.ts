import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { setBlockType } from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
import type { PluginOptions } from '../../types'
import { prefix } from '../../components/consts'
import {
  Heading1Icon,
  Heading2Icon,
  ListOrderedIcon,
  ListIcon
} from '../../icons'

export const pluginKey = new PluginKey('slash-commands')

// Define the structure of a command
interface Command {
  name: string
  description: string
  icon?: SVGElement
  action: (view: EditorView, schema: Schema) => void
}

// Example commands
const commands: Command[] = [
  {
    name: 'Heading 1',
    description: 'Large section heading',
    icon: Heading1Icon,
    action: (view, schema) => {
      setBlockType(schema.nodes.heading, { level: 1 })(
        view.state,
        view.dispatch
      )
    }
  },
  {
    name: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2Icon,
    action: (view, schema) => {
      setBlockType(schema.nodes.heading, { level: 2 })(
        view.state,
        view.dispatch
      )
    }
  },
  {
    name: 'Numbered List',
    description: 'Create a list with numbers',
    icon: ListOrderedIcon,
    action: (view, schema) => {
      wrapInList(schema.nodes.ordered_list)(view.state, view.dispatch)
    }
  },
  {
    name: 'Bulleted List',
    description: 'Create a list with bullets',
    icon: ListIcon,
    action: (view, schema) => {
      wrapInList(schema.nodes.bullet_list)(view.state, view.dispatch)
    }
  }
]

// The plugin state
interface SlashCommandsState {
  active: boolean
  query: string
  filteredCommands: Command[]
  selectedIndex: number
}

// The plugin view
class SlashCommandsView {
  private view: EditorView
  private popup: HTMLElement
  private commandList: HTMLElement
  private options: PluginOptions

  constructor(view: EditorView, options: PluginOptions) {
    this.view = view
    this.options = options
    this.popup = document.createElement('div')
    this.popup.className = `${prefix}slash-commands-popup`
    this.popup.style.display = 'none'

    this.commandList = document.createElement('div')
    this.commandList.className = `${prefix}slash-commands-list`
    this.popup.appendChild(this.commandList)

    this.view.dom.parentNode?.appendChild(this.popup)

    this.update(view)
  }

  update(view: EditorView) {
    const state: SlashCommandsState = pluginKey.getState(view.state)

    if (!state || !state.active) {
      this.popup.style.display = 'none'
      return
    }

    this.popup.style.display = 'block'

    const { from, to } = view.state.selection
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    const box = this.popup.offsetParent?.getBoundingClientRect()

    if (box) {
      const left = Math.max(start.left, end.left) - box.left
      const top = start.bottom - box.top + 10
      this.popup.style.left = `${left}px`
      this.popup.style.top = `${top}px`
    }

    this.commandList.innerHTML = ''

    if (state.filteredCommands.length === 0) {
      const item = document.createElement('div')
      item.className = `${prefix}slash-commands-item empty`
      item.textContent = 'No commands found'
      this.commandList.appendChild(item)
      return
    }

    state.filteredCommands.forEach((command, index) => {
      const item = document.createElement('div')
      item.className = `${prefix}slash-commands-item`
      if (index === state.selectedIndex) {
        item.classList.add('selected')
      }
      item.textContent = command.name
      item.onclick = () => {
        this.executeCommand(command)
      }

      if (command.icon) {
        item.prepend(command.icon)
      }
      this.commandList.appendChild(item)
    })
  }

  executeCommand(command: Command) {
    const { view } = this
    const { $from } = view.state.selection
    const match = /\/([a-zA-Z0-9_\s]*)$/.exec(
      $from.parent.textContent.slice(0, $from.parentOffset)
    )
    if (match) {
      const tr = view.state.tr.delete($from.pos - match[0].length, $from.pos)
      view.dispatch(tr)
    }
    command.action(view, view.state.schema)
    view.focus()
  }

  destroy() {
    this.popup.remove()
  }
}

export function slashCommands(options: PluginOptions): Plugin {
  let slashView: SlashCommandsView

  return new Plugin({
    key: pluginKey,
    state: {
      init(): SlashCommandsState {
        return {
          active: false,
          query: '',
          filteredCommands: [],
          selectedIndex: 0
        }
      },
      apply(tr, state: SlashCommandsState): SlashCommandsState {
        const meta = tr.getMeta(pluginKey)
        if (meta) {
          return { ...state, ...meta }
        }

        const { selection } = tr
        if (!selection.empty) {
          return { ...state, active: false, query: '' }
        }

        const { $from } = selection
        const parent = $from.parent
        if (!parent.isTextblock || parent.textContent.length === 0) {
          return { ...state, active: false, query: '' }
        }
        const text = parent.textContent

        const match = /\/([a-zA-Z0-9_\s]*)$/.exec(
          text.slice(0, $from.parentOffset)
        )

        if (match) {
          const query = match[1]
          const filteredCommands = commands.filter((c) =>
            c.name.toLowerCase().startsWith(query.toLowerCase())
          )
          return {
            active: true,
            query,
            filteredCommands,
            selectedIndex: 0
          }
        } else {
          return { ...state, active: false, query: '' }
        }
      }
    },
    view(view) {
      slashView = new SlashCommandsView(view, options)
      return slashView
    },
    props: {
      handleKeyDown(view, event) {
        const state: SlashCommandsState = pluginKey.getState(view.state)
        if (!state.active) {
          return false
        }

        if (event.key === 'ArrowUp') {
          const selectedIndex =
            (state.selectedIndex - 1 + state.filteredCommands.length) %
            state.filteredCommands.length
          view.dispatch(view.state.tr.setMeta(pluginKey, { selectedIndex }))
          return true
        }

        if (event.key === 'ArrowDown') {
          const selectedIndex =
            (state.selectedIndex + 1) % state.filteredCommands.length
          view.dispatch(view.state.tr.setMeta(pluginKey, { selectedIndex }))
          return true
        }

        if (event.key === 'Enter') {
          const command = state.filteredCommands[state.selectedIndex]
          if (command) {
            slashView.executeCommand(command)
          }
          return true
        }

        if (event.key === 'Escape') {
          view.dispatch(
            view.state.tr.setMeta(pluginKey, {
              active: false,
              query: ''
            })
          )
          return true
        }

        return false
      }
    }
  })
}
