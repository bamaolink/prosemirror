import { sideMenu } from './sideMenu'
import { basicStructure } from './basicStructure'
import { slashCommands } from './slashCommands'
import { placeholderPlugin } from './placeholder'
import { changeEvent } from './changeEvent'
import { selectedMarksAndNodes } from './selectedMarksAndNodes'
import { bubbleMenu } from './bubbleMenu'
import { imageUploadPlaceholder } from './imageUploadPlaceholder'
import { imageBlock } from './imageBlock'
import { taskList } from './taskList'
import { codeBlock } from './codeBlock'
import { forceTrailingEmptyLine } from './forceTrailingEmptyLine'
import { tableCellMenu } from './tableCellMenu'
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
    basicStructure(options),
    placeholderPlugin(options),
    changeEvent(options),
    selectedMarksAndNodes(options),
    sideMenu(options),
    slashCommands(options),
    bubbleMenu(options),
    imageUploadPlaceholder(options),
    imageBlock(options),
    taskList(options),
    codeBlock(options),
    forceTrailingEmptyLine(options),

    columnResizing(), // 允许调整列宽
    tableEditing(), // 提供表格的核心编辑功能（如单元格选择）
    tableKeymap, // 应用我们上面创建的表格导航快捷键
    tableCellMenu(options),

    keymap(baseKeymap),
    dropCursor({
      width: 2
    }),
    gapCursor(),
    history()
  ]
}
