import { Schema, NodeSpec, MarkSpec } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

import { EmojiNode, EmojiNodeName } from './nodes/emoji'
import { StarNode, StarNodeName } from './nodes/star'
import { ImageBlockNode, ImageBlockNodeName } from './nodes/imageBlock'
import {
  ImageUploadPlaceholderNode,
  ImageUploadPlaceholderNodeName
} from './nodes/imageUploadPlaceholder'
import {
  NoteGroupNode,
  NoteGroupNodeName,
  NoteNode,
  NoteNodeName
} from './nodes/note'

import { SupMark, SupMarkName } from './marks/sup'
import { SubMark, SubMarkName } from './marks/sub'

const nodes: Record<string, NodeSpec> = {}
nodes[EmojiNodeName] = EmojiNode
nodes[StarNodeName] = StarNode
nodes[ImageUploadPlaceholderNodeName] = ImageUploadPlaceholderNode
nodes[NoteGroupNodeName] = NoteGroupNode
nodes[NoteNodeName] = NoteNode

const marks: Record<string, MarkSpec> = {}
marks[SupMarkName] = SupMark
marks[SubMarkName] = SubMark

export const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block')
    .update('doc', {
      content: '(block | note | notegroup)+'
    })
    .append(nodes)
    .addBefore('image', ImageBlockNodeName, ImageBlockNode),

  marks: basicSchema.spec.marks.append(marks)
})
