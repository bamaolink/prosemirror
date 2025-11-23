import { MarkSpec } from 'prosemirror-model'

export const LinkName = 'link'

export const LinkMark: MarkSpec = {
  attrs: {
    href: { default: '' },
    title: { default: '' },
    target: { default: undefined }
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom: HTMLElement) {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
          target: dom.getAttribute('target')
        }
      }
    }
  ],
  toDOM(node) {
    // The '0' here means "render the content of the node".
    // So, this will be rendered as <a href="..." title="..." target="...">...content...</a>
    return ['a', node.attrs, 0]
  }
}
