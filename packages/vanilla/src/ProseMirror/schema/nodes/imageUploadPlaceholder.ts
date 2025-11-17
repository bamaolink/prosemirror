import { NodeSpec } from 'prosemirror-model'

export const ImageUploadPlaceholderNodeName = 'image_upload_placeholder'

export const ImageUploadPlaceholderNode: NodeSpec = {
  attrs: {
    // 用来追踪上传状态
    status: { default: 'waiting' }, // waiting, uploading, finished
    progress: { default: 0 },
    file: { default: null }
  },
  inline: false,
  group: 'block',
  draggable: true,
  toDOM(node) {
    const attrs = node.attrs
    return [
      'div',
      {
        class: 'bml-image-upload-placeholder',
        'data-placeholder-status': attrs.status
      }
    ]
  }
}
