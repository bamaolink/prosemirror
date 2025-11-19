import { Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import type { PluginOptions } from '../../types'

import { EditorView } from 'prosemirror-view'
import { ResolvedPos } from 'prosemirror-model'
import { CellSelection } from 'prosemirror-tables'
import {
  addRowAfter,
  addRowBefore,
  addColumnAfter,
  addColumnBefore,
  mergeCells,
  splitCell
} from 'prosemirror-tables'

import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  ArrowUpFromLineIcon,
  ArrowDownFromLineIcon,
  TableCellsMergeIcon,
  TableCellsSplitIcon
} from '../../icons'
import BmlButton from '../../components/Button'
import BmlTooltip from '../../components/Tooltip'

export const pluginKey = new PluginKey('table-cell-menu')
export const allButtons = [
  {
    value: 'add-row-before',
    label: '在上方插入行',
    command: addRowBefore,
    icon: ArrowUpFromLineIcon
  },
  {
    value: 'add-row-after',
    label: '在下方插入行',
    command: addRowAfter,
    icon: ArrowDownFromLineIcon
  },
  {
    value: 'add-column-before',
    label: '在左侧添加列',
    command: addColumnBefore,
    icon: ArrowLeftFromLineIcon
  },
  {
    value: 'add-column-after',
    label: '在右侧添加列',
    command: addColumnAfter,
    icon: ArrowRightFromLineIcon
  },
  {
    value: 'merge-cells',
    label: '合并单元格',
    command: mergeCells,
    icon: TableCellsMergeIcon
  },
  {
    value: 'split-cells',
    label: '拆分单元格',
    command: splitCell,
    icon: TableCellsSplitIcon
  }
]
/**
 * 一个辅助函数，从一个位置向上查找所在的单元格节点
 * @param pos ProseMirror 的 ResolvedPos 对象
 */
function findContainingCell(pos: ResolvedPos): number | null {
  for (let i = pos.depth; i > 0; i--) {
    const node = pos.node(i)
    if (node.type.name === 'table_cell' || node.type.name === 'table_header') {
      return pos.before(i)
    }
  }
  return null
}

function createTooltip(item: (typeof allButtons)[number], view: EditorView) {
  const { value, label, icon, command } = item
  const trigger = new BmlButton()
  trigger.setIcon(icon)
  trigger.element.addEventListener('mousedown', (e) => {
    e.preventDefault()
    command(view.state, view.dispatch)
  })

  const tooltip = new BmlTooltip({
    trigger: trigger.element,
    popoverId: `${value}-tooltip`,
    anchorName: `${value}-tooltip-anchor`,
    hover: true
  })
  tooltip.popover.textContent = label
  return {
    trigger,
    tooltip
  }
}

class CellMenuManager {
  private dom: HTMLElement
  private view: EditorView
  private options: PluginOptions

  constructor(view: EditorView, options: PluginOptions) {
    this.view = view
    this.options = options
    this.dom = document.createElement('div')
    this.dom.style.display = 'none'
    this.dom.classList.add(`table-cell-menu`)
    this.view.dom.parentNode?.appendChild(this.dom)
  }

  update(view: EditorView) {
    this.view = view
    const { state } = view
    const { selection } = state
    let anchorPos: number | null = null

    // 1. 查找定位点
    if (selection instanceof CellSelection) {
      anchorPos = selection.$anchorCell.pos
    } else if (selection instanceof TextSelection && selection.empty) {
      anchorPos = findContainingCell(selection.$from)
    }

    // 2. 如果没有定位点，则隐藏菜单并返回
    if (anchorPos === null) {
      this.dom.style.display = 'none'
      return
    }

    // 3. 如果有定位点，则计算位置并显示菜单
    // 获取单元格相对于视口(viewport)的屏幕坐标
    const coords = view.coordsAtPos(anchorPos)

    // 清空并重新创建按钮
    this.createButtons()

    // 如果菜单中没有任何按钮（因为所有命令都不可用），则不显示
    if (this.dom.childElementCount === 0) {
      this.dom.style.display = 'none'
      return
    }

    // 计算菜单的最终屏幕位置
    const menuHeight = this.dom.offsetHeight
    let top: number

    if (coords.top < menuHeight + 10) {
      // 检查上方空间是否充足（额外10px缓冲）
      // 显示在下方
      top = coords.bottom
    } else {
      // 显示在上方
      top = coords.top - menuHeight
    }

    // 设置菜单位置并显示
    const wrapper = this.view.dom.parentNode as HTMLElement
    const wrapperRect = wrapper.getBoundingClientRect()

    const coordsWidth = coords.right - coords.left
    this.dom.style.left = `${parseInt(
      (
        coords.left -
        wrapperRect.left +
        coordsWidth / 2 -
        this.dom.offsetWidth / 2
      ).toString()
    )}px`
    this.dom.style.top = `${
      top - wrapperRect.top + this.dom.offsetHeight / 2
    }px`
    this.dom.style.display = 'flex'
  }

  private createButtons() {
    // 清空旧按钮
    this.dom.innerHTML = ''

    allButtons.forEach((item) => {
      if (item.command(this.view.state)) {
        const { trigger, tooltip } = createTooltip(item, this.view)
        this.dom.appendChild(trigger.element)
        this.dom.appendChild(tooltip.popover)
      }
    })
  }

  destroy() {
    // 隐藏并清空菜单
    this.dom.style.display = 'none'
    this.dom.innerHTML = ''
    this.dom.remove()
  }
}

export function tableCellMenu(options: PluginOptions) {
  return new Plugin({
    key: pluginKey,
    view(editorView) {
      const menuManager = new CellMenuManager(editorView, options)
      return {
        update(view) {
          menuManager.update(view)
        },
        destroy() {
          menuManager.destroy()
        }
      }
    }
  })
}
