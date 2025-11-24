import { sideMenuPlugin } from './sideMenu'
import { basicStructurePlugin } from './basicStructure'
import { slashCommandsPlugin } from './slashCommands'
import { placeholderPlugin } from './placeholder'
import { changeEventPlugin } from './changeEvent'
import { selectedMarksAndNodesPlugin } from './selectedMarksAndNodes'
import { bubbleMenuPlugin } from './bubbleMenu'
import { imageUploadPlaceholderPlugin } from './imageUploadPlaceholder'
import { imageBlockPlugin } from './imageBlock'
import { taskListPlugin } from './taskList'
import { codeBlockPlugin } from './codeBlock'
import { forceTrailingEmptyLinePlugin } from './forceTrailingEmptyLine'
import { tableCellMenuPlugin } from './tableCellMenu'
import { linkHandlerPlugin } from './linkHandler'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules } from './inputrules'
import { buildKeymap } from './keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'
import { columnResizing, tableEditing, goToNextCell } from 'prosemirror-tables'

import type { PluginOptions } from '../types'

const tableKeymap = keymap({
  Tab: goToNextCell(1), // Tab 键移动到下一个单元格
  'Shift-Tab': goToNextCell(-1) // Shift-Tab 移动到上一个单元格
})

export const createPlugins = (options: PluginOptions) => {
  return [
    buildInputRules(options),
    keymap(buildKeymap(options)),
    basicStructurePlugin(options),
    placeholderPlugin(options),
    changeEventPlugin(options),
    selectedMarksAndNodesPlugin(options),
    sideMenuPlugin(options),
    slashCommandsPlugin(options),
    bubbleMenuPlugin(options),
    imageUploadPlaceholderPlugin(options),
    imageBlockPlugin(options),
    taskListPlugin(options),
    codeBlockPlugin(options),
    forceTrailingEmptyLinePlugin(options),
    linkHandlerPlugin(options),

    columnResizing(), // 允许调整列宽
    tableEditing(), // 提供表格的核心编辑功能（如单元格选择）
    tableKeymap, // 应用我们上面创建的表格导航快捷键
    tableCellMenuPlugin(options),

    keymap(baseKeymap),
    dropCursor({
      width: 2
    }),
    gapCursor(),
    history()
  ]
}
