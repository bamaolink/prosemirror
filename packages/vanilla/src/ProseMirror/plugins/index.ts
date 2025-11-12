import { sideMenu } from './sideMenu'
import { basicStructure } from './basicStructure'
import { slashCommands } from './slashCommands'
import { placeholderPlugin } from './placeholder'
import { changeEvent } from './changeEvent'
import { selectedMarksAndNodes } from './selectedMarksAndNodes'
import { bubbleMenu } from './bubbleMenu'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules } from './inputrules'
import { buildKeymap } from './keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'

import type { PluginOptions } from '../types'

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
    keymap(baseKeymap),
    dropCursor({
      width: 2
    }),
    gapCursor(),
    history()
  ]
}
