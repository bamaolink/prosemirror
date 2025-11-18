import { NodeSpec } from 'prosemirror-model'

export const ImageBlockNodeName = 'image_block'

export const ImageBlockNode: NodeSpec = {
  leaf: true,
  attrs: {
    src: { default: '' },
    alt: { default: '' },
    height: { default: null }
  },
  inline: false,
  group: 'block',
  draggable: true,
  atomic: true,
  // toDOM(node) {
  //   const attrs = node.attrs
  //   return [
  //     'div',
  //     { class: classPrefix },

  //     [
  //       'div',
  //       {
  //         class: generateClassName('wrapper')
  //       },
  //       [
  //         'div',
  //         { class: generateClassName('operation') },
  //         [
  //           'div',
  //           { class: generateClassName('operation-item') },
  //           [
  //             'button',
  //             {
  //               class: generateClassName('button')
  //             },
  //             SquarePenIcon.cloneNode(true)
  //           ]
  //         ],
  //         [
  //           'div',
  //           { class: generateClassName('operation-item') },
  //           [
  //             'button',
  //             {
  //               class: generateClassName('button')
  //             },
  //             Trash2Icon.cloneNode(true)
  //           ]
  //         ]
  //       ],
  //       [
  //         'div',
  //         { class: generateClassName('image') },
  //         ['img', { src: attrs.src, style: 'width: 100%; height: auto;' }]
  //       ],
  //       ['div', { class: `${generateClassName('resize-handle')} hidden` }]
  //     ],

  //     [
  //       'div',
  //       {
  //         class: generateClassName('alt')
  //       },
  //       attrs.alt
  //     ]
  //   ]
  // },
  // parseDOM: [
  //   {
  //     tag: `div.${classPrefix}`,
  //     getAttrs(dom: HTMLElement) {
  //       return {
  //         src: dom.getAttribute('data-src'),
  //         alt: dom.getAttribute('data-alt')
  //       }
  //     }
  //   }
  // ]
  parseDOM: [
    {
      tag: 'img.bml-image-block[src]',
      getAttrs(dom: HTMLElement) {
        return {
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          height: dom.getAttribute('height')
            ? parseInt(dom.getAttribute('height')!, 10)
            : null
        }
      }
    }
  ],
  toDOM(node) {
    // 这个 toDOM 主要用于复制/粘贴等场景的序列化。
    // 实际在编辑器中的渲染由 NodeView 控制。
    const { src, alt, height } = node.attrs
    const attrs: { src: string; alt: string; height?: string } = { src, alt }
    if (height) {
      attrs.height = String(height)
    }
    return ['img', attrs]
  }
}
