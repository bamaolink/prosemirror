import { createPlaceholderPlugin } from './placeholderPlugin'
import { createChangePlugin } from './changePlugin'
import { createSelectedPlugin } from './selectedPlugin'
import { createSlashCommandsPlugin } from './slashCommandsPlugin'
import { createBubbleMenuPlugin } from './bubbleMenuPlugin'
import { sideMenu } from './sideMenu'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules } from './inputrules'
import { buildKeymap } from './keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'

import type { Schema } from 'prosemirror-model'
import type { Emitter } from '../types'

export const createPlugins = (
  schema: Schema,
  emitter: Emitter,
  options: BamaoLinkEditorType.PluginsOptions = {}
) => {
  const { placeholder = 'Write something...' } = options

  return [
    buildInputRules(schema),
    keymap(buildKeymap(schema)),
    createPlaceholderPlugin(placeholder),
    createChangePlugin(emitter),
    createSelectedPlugin(emitter, schema),
    createSlashCommandsPlugin(),
    createBubbleMenuPlugin(),
    sideMenu(emitter),
    // keymap({
    //   "Ctrl-Shift-s": insertStar,
    //   "Alt-Shift-b": toggleMark(mySchema.marks.sub),
    //   "Alt-Shift-p": toggleMark(mySchema.marks.sup),
    // }),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history()
  ]
}
