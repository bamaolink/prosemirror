import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import type { CommandItemType, PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import { commands, commandRootGroups } from '../../config/commands'
import { ChevronRightIcon, CircleQuestionMarkIcon } from '../../icons'
import { BmlPopover } from '../../components/Popover'
import './style.scss'

export const slashCommandsPluginKey = new PluginKey('slash-commands-plugin')

const _prefix = `${prefix}slash-commands`
const createDomElement = () => {
  const template = `<div id="bamao-link-slash-commands" class="${_prefix} hidden">
      <div class="${_prefix}-header">
        <div class="breadcrumbs"></div>
      </div>
      <div class="${_prefix}-list-wrapper">
          <ul class="${_prefix}-list"></ul>
      </div>
  </div>`
  const parser = new DOMParser()
  const doc = parser.parseFromString(template, 'text/html')
  const domElement = doc.body.firstChild as HTMLElement

  const trigger = document.createElement('button')
  trigger.appendChild(CircleQuestionMarkIcon.cloneNode(true))
  trigger.classList.add(`${prefix}button`, `${prefix}button-icon`)

  const tooltip = new BmlPopover({
    trigger,
    hover: false
  })

  tooltip.popover.classList.add('dark')

  tooltip.popover.innerHTML = `<div class="${_prefix}-tooltip-content">
    <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
    <span><kbd>Enter</kbd> to select</span>
    <span><kbd>←</kbd> to go back</span>
    <span><kbd>→</kbd> to next level</span>
  </div>`

  domElement.querySelector(`.${_prefix}-header`)?.append(trigger)
  domElement.appendChild(tooltip.popover)
  return domElement
}

interface SlashCommandsState {
  active: boolean
  query: string
  level: number
  rootCommands: CommandItemType[][] // 用来存储原始的命令列表，初始的是全量，按右箭头就会替换成当前层级的命令列表， 按左箭头就会替换成上一级的命令列表
  filteredCommands: CommandItemType[] // 用来存储过滤后的命令列表
  selectedIds: string[]
}

const initialState: SlashCommandsState = {
  active: false,
  query: '',
  level: 0,
  rootCommands: [commands],
  filteredCommands: commands,
  selectedIds: []
}

const filterCommands = (
  cmds: CommandItemType[],
  query: string,
  level: number = 0
) => {
  let res = cmds
    .filter((c) => c.name.toLowerCase().startsWith(query.toLowerCase()))
    .map((c) => {
      c.isSelected = false
      return c
    })
  if (level === 0) {
    res.forEach((c) => {
      const children = commands.filter((command) => command.pid === c.id)
      if (children.length > 0) {
        res = res.concat(children)
      }
    })
  }
  return res
}

const setSelectedItems = (selectedId: string, commands: CommandItemType[]) => {
  return commands.map((c) => {
    return {
      ...c,
      isSelected: c.id === selectedId
    }
  })
}

const findPrevItem = (currState: SlashCommandsState) => {
  const level = currState.level
  const id = currState.selectedIds[level]
  let filteredCommands = currState.filteredCommands

  if (level === 0) {
    filteredCommands = filteredCommands.filter((c) => !c.pid)
  }

  const index = filteredCommands.findIndex((c) => c.id === id)
  const prevItem = filteredCommands[index - 1]
  if (prevItem) {
    return prevItem
  }
  return filteredCommands[filteredCommands.length - 1]
}

const findNextItem = (currState: SlashCommandsState) => {
  const level = currState.level
  const id = currState.selectedIds[level]
  let filteredCommands = currState.filteredCommands

  if (level === 0) {
    filteredCommands = filteredCommands.filter((c) => !c.pid)
  }

  const index = filteredCommands.findIndex((c) => c.id === id)
  const nextItem = filteredCommands[index + 1]
  if (nextItem) {
    return nextItem
  }
  return filteredCommands[0]
}

export class SlashCommandsView {
  private view: EditorView
  private commands: CommandItemType[]
  private dom: HTMLElement
  private header: HTMLElement
  private breadcrumbs: HTMLElement
  private list: HTMLElement
  private options: PluginOptions

  constructor(
    view: EditorView,
    options: PluginOptions,
    commands: CommandItemType[]
  ) {
    this.view = view
    this.options = options
    this.commands = commands
    this.dom = createDomElement()

    this.view.dom.parentNode?.appendChild(this.dom)

    this.header = this.dom.querySelector(`.${_prefix}-header`)!
    this.breadcrumbs = this.header.querySelector('.breadcrumbs')!
    this.list = this.dom.querySelector(`.${_prefix}-list`)!

    this.update(view)
  }

  toggle() {
    if (this.dom.classList.contains('hidden')) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    this.dom.classList.remove('hidden')
  }

  close() {
    this.dom.classList.add('hidden')
  }

  formatFilteredCommands(state: SlashCommandsState) {
    const cmds = state.filteredCommands || commands

    // 先取type为group的，然后再取pid为group的，然后再取pid为command的
    const groups = cmds.filter((command) => command.type === 'group')
    const groupCommands = cmds.filter((command) => command.type === 'command')

    const firstLevelGroupCommands = groups.filter((command) => !command.pid)

    const findChildren = (parent: CommandItemType) => {
      const part1 = groups.filter((command) => command.pid === parent.id)
      if (part1.length > 0) {
        part1.forEach((child) => {
          child.children = findChildren(child)
          if (child?.children?.length === 0) {
            child.children = undefined
          }
        })
      }
      const part2 = groupCommands.filter((command) => command.pid === parent.id)
      return [...part1, ...part2]
    }

    firstLevelGroupCommands.forEach((command) => {
      command.children = findChildren(command)
      if (command.children.length === 0) {
        command.children = undefined
      }
    })

    let rootCommands: CommandItemType[] = []
    if (state.level === 0) {
      commandRootGroups.forEach((group) => {
        const part1 = firstLevelGroupCommands.filter(
          (command) => command.gid === group.id
        )
        const part2 = groupCommands.filter(
          (command) => command.gid === group.id
        )
        const children = [...part1, ...part2]
        children.sort((a, b) => {
          const aIndex = commands.findIndex((command) => command.id === a.id)
          const bIndex = commands.findIndex((command) => command.id === b.id)
          return aIndex - bIndex
        })

        if (children.length > 0) {
          rootCommands.push({
            ...group,
            children
          })
        }
      })
    } else {
      rootCommands = firstLevelGroupCommands
    }

    const part1 = groupCommands.filter(
      (command) => !command.pid && !command.gid
    )

    const part2 = groupCommands.filter((command) => {
      if (!command.pid || command.gid) {
        return false
      }
      const parent = cmds.find((group) => group.id === command.pid)
      return !parent
    })

    return [...rootCommands, ...part1, ...part2]
  }

  createEmptyItem() {
    const item = document.createElement('li')
    item.className = `${_prefix}-empty`
    item.textContent = 'No results found'
    return item
  }
  createGroupItem(command: CommandItemType) {
    const item = document.createElement('li')
    item.className = `${_prefix}-group-header`
    item.textContent = command.name
    return item
  }
  createItem(command: CommandItemType, state: SlashCommandsState) {
    const item = document.createElement('li')
    item.className = `${_prefix}-item`
    item.dataset.id = command.id
    const name = document.createElement('span')
    name.className = 'title'
    name.textContent = command.name

    if (command.pid) {
      item.classList.add(command.pid)
    }

    if (command.pid === 'emoji') {
      name.textContent = command.description
    }

    if (command.icon) {
      item.prepend(command.icon.cloneNode(true))
    }
    item.appendChild(name)
    if (command.children) {
      const arrow = document.createElement('span')
      arrow.className = 'submenu-arrow'
      arrow.appendChild(ChevronRightIcon.cloneNode(true))
      item.appendChild(arrow)
    }
    if (command?.isSelected) {
      item.classList.add('selected')
    }

    const { view } = this
    const actionHandler = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      if (command.type === 'group') {
        const selectedIds = [...state.selectedIds]
        const rootCommands = [...state.rootCommands]

        let _rootCommands = commands.filter((c) => c.pid === command.id)
        rootCommands.push(_rootCommands)

        // let filteredCommands = filterCommands(
        //   _rootCommands,
        //   state.query,
        //   state.level
        // )
        let filteredCommands = _rootCommands
        const firstChild = filteredCommands[0]
        if (firstChild) {
          filteredCommands = setSelectedItems(firstChild.id, filteredCommands)
          view.dispatch(
            view.state.tr.setMeta(slashCommandsPluginKey, {
              selectedIds: [...selectedIds, firstChild.id],
              rootCommands,
              filteredCommands,
              level: state.level + 1
            })
          )
        }
      } else {
        this.executeCommand(command)
      }
    }
    item.addEventListener('mouseup', actionHandler)
    item.addEventListener('touchend', actionHandler)

    return item
  }
  render(state: SlashCommandsState) {
    this.list.innerHTML = ''

    const fragment = document.createDocumentFragment()
    const data = this.formatFilteredCommands(state)
    if (data.length === 0) {
      this.list.appendChild(this.createEmptyItem())
      return
    }

    data.forEach((command) => {
      if (command.type === 'group') {
        fragment.appendChild(this.createGroupItem(command))
      } else {
        fragment.appendChild(this.createItem(command, state))
      }

      if (command.children && command.children.length > 0) {
        command.children.forEach((child) => {
          fragment.appendChild(this.createItem(child, state))
        })
      }
    })

    this.list.appendChild(fragment)
    this.list.querySelector('.selected')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
  }

  createBreadcrumbItem() {
    const item = document.createElement('span')
    item.className = 'breadcrumb-item'
    return item
  }

  createBreadcrumbSeparator() {
    const item = document.createElement('span')
    item.className = 'breadcrumb-separator'
    item.textContent = '/'
    return item
  }
  renderBreadcrumbs(state: SlashCommandsState) {
    this.breadcrumbs.innerHTML = ''
    const fragment = document.createDocumentFragment()
    const selectedIds = state.selectedIds

    const homeItem = this.createBreadcrumbItem()
    homeItem.textContent = 'Home'
    fragment.appendChild(homeItem)

    if (selectedIds.length > 1) {
      selectedIds.forEach((id, index) => {
        if (index < selectedIds.length - 1) {
          const command = this.commands.find((command) => command.id === id)
          if (command) {
            const item = document.createElement('span')
            item.textContent = command.name
            fragment.appendChild(this.createBreadcrumbSeparator())
            fragment.appendChild(item)
          }
        }
      })
    }
    this.breadcrumbs.appendChild(fragment)
  }

  update(view: EditorView) {
    const state: SlashCommandsState = slashCommandsPluginKey.getState(
      view.state
    )

    if (!state || !state.active) {
      this.close()
      return
    }

    this.open()

    const { from, to } = view.state.selection
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    const box = this.dom.offsetParent?.getBoundingClientRect()

    if (box) {
      const left = Math.max(start.left, end.left) - box.left
      const top = start.bottom - box.top + 10
      this.dom.style.left = `${left}px`
      this.dom.style.top = `${top}px`
    }

    this.render(state)
    this.renderBreadcrumbs(state)
  }

  executeCommand(command: CommandItemType) {
    const { view } = this
    const { $from } = view.state.selection
    const match = /\/([a-zA-Z0-9_\s]*)$/.exec(
      $from.parent.textContent.slice(0, $from.parentOffset)
    )
    if (match) {
      const tr = view.state.tr.delete($from.pos - match[0].length, $from.pos)
      view.dispatch(tr)
    }
    command?.action?.(view, view.state.schema)
    view.focus()
  }

  destroy() {
    this.dom.remove()
  }
}

export function slashCommandsPlugin(options: PluginOptions): Plugin {
  let slashView: SlashCommandsView

  return new Plugin({
    key: slashCommandsPluginKey,
    state: {
      init(): SlashCommandsState {
        return initialState
      },
      apply(tr, state: SlashCommandsState): SlashCommandsState {
        const meta = tr.getMeta(slashCommandsPluginKey)
        if (meta) {
          return { ...state, ...meta }
        }

        const { selection } = tr
        if (!selection.empty) {
          return { ...state, ...initialState }
        }

        const { $from } = selection
        const parent = $from.parent
        if (!parent.isTextblock || parent.textContent.length === 0) {
          return { ...state, ...initialState }
        }
        const text = parent.textContent

        const match = /\/([a-zA-Z0-9_\s]*)$/.exec(
          text.slice(0, $from.parentOffset)
        )

        if (match) {
          const query = match[1]
          const cmds: CommandItemType[] = state.rootCommands[state.level]
          let filteredCommands = filterCommands(cmds, query, state.level)

          const firstChild = filteredCommands[0]
          const selectedIds = [...state.selectedIds]
          if (firstChild) {
            filteredCommands = setSelectedItems(firstChild.id, filteredCommands)
            selectedIds[state.level] = firstChild.id
          }

          return {
            active: true,
            level: state.level ?? 0,
            query,
            rootCommands: state.rootCommands,
            filteredCommands,
            selectedIds
          }
        } else {
          return { ...state, ...initialState }
        }
      }
    },
    view(view) {
      slashView = new SlashCommandsView(view, options, commands)
      return slashView
    },
    props: {
      handleKeyDown(view, event) {
        const state: SlashCommandsState = slashCommandsPluginKey.getState(
          view.state
        )
        if (!state.active) {
          return false
          // return false 表示当前插件不处理，继续传递给其他插件处理 return true 表示当前插件处理了，其他插件不再处理
        }

        if (event.key === 'ArrowUp') {
          const prevItem = findPrevItem(state)
          state.selectedIds[state.level] = prevItem.id
          view.dispatch(
            view.state.tr.setMeta(slashCommandsPluginKey, {
              selectedIds: state.selectedIds,
              filteredCommands: setSelectedItems(
                prevItem.id,
                state.filteredCommands
              )
            })
          )
          return true
        }

        if (event.key === 'ArrowDown') {
          const nextItem = findNextItem(state)
          state.selectedIds[state.level] = nextItem.id
          view.dispatch(
            view.state.tr.setMeta(slashCommandsPluginKey, {
              selectedIds: state.selectedIds,
              filteredCommands: setSelectedItems(
                nextItem.id,
                state.filteredCommands
              )
            })
          )
          return true
        }

        if (event.key === 'ArrowRight') {
          const selectedId = state.selectedIds[state.level]
          if (!selectedId) {
            return false
          }
          const selectedItem = commands.find(
            (command) => command.id === selectedId
          )
          if (!selectedItem) {
            return false
          }
          if (selectedItem.type === 'group') {
            const selectedIds = [...state.selectedIds]
            const rootCommands = [...state.rootCommands]

            let _rootCommands = commands.filter((c) => c.pid === selectedId)
            rootCommands.push(_rootCommands)

            // let filteredCommands = filterCommands(
            //   _rootCommands,
            //   state.query,
            //   state.level
            // )
            let filteredCommands = _rootCommands
            const firstChild = filteredCommands[0]
            if (firstChild) {
              filteredCommands = setSelectedItems(
                firstChild.id,
                filteredCommands
              )

              view.dispatch(
                view.state.tr.setMeta(slashCommandsPluginKey, {
                  selectedIds: [...selectedIds, firstChild.id],
                  rootCommands,
                  filteredCommands,
                  level: state.level + 1
                })
              )
            }
            return true
          }
          return false
        }

        if (event.key === 'ArrowLeft') {
          if (state.level > 0) {
            state.selectedIds.pop()
            state.rootCommands.pop()

            const level = state.level - 1
            const selectedIds = state.selectedIds
            const rootCommands = state.rootCommands
            let selectedId = selectedIds[level]
            let filteredCommands = filterCommands(
              state.rootCommands[level],
              state.query,
              state.level
            )

            let isIn = filteredCommands.some((c) => c.id === selectedId)
            if (isIn) {
              filteredCommands = setSelectedItems(selectedId, filteredCommands)
            } else {
              const firstChild = filteredCommands[0]
              if (firstChild) {
                filteredCommands = setSelectedItems(
                  firstChild.id,
                  filteredCommands
                )
                selectedIds[level] = firstChild.id
              }
            }

            view.dispatch(
              view.state.tr.setMeta(slashCommandsPluginKey, {
                selectedIds: [...selectedIds],
                rootCommands,
                filteredCommands,
                level
              })
            )
            return true
          }
          return false
        }

        if (event.key === 'Enter') {
          const command = commands.find(
            (c) => c.id === state.selectedIds[state.level]
          )
          if (command) {
            if (command.type === 'group') {
              const selectedIds = [...state.selectedIds]
              const rootCommands = [...state.rootCommands]

              let _rootCommands = commands.filter((c) => c.pid === command.id)
              rootCommands.push(_rootCommands)

              // let filteredCommands = filterCommands(
              //   _rootCommands,
              //   state.query,
              //   state.level
              // )
              let filteredCommands = _rootCommands
              const firstChild = filteredCommands[0]
              if (firstChild) {
                filteredCommands = setSelectedItems(
                  firstChild.id,
                  filteredCommands
                )
                view.dispatch(
                  view.state.tr.setMeta(slashCommandsPluginKey, {
                    selectedIds: [...selectedIds, firstChild.id],
                    rootCommands,
                    filteredCommands,
                    level: state.level + 1
                  })
                )
              }
            } else {
              slashView.executeCommand(command)
            }
            return true
          }
          return false
        }

        if (event.key === 'Escape') {
          view.dispatch(
            view.state.tr.setMeta(slashCommandsPluginKey, { ...initialState })
          )
          return true
        }

        return false
      }
    }
  })
}
