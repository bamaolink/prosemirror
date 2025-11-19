import { tableNodes as prosemirrorTableNodes } from 'prosemirror-tables'

export const tableNodes = prosemirrorTableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom) {
        return dom.style.backgroundColor || null
      },
      setDOMAttr(value, attrs) {
        if (value)
          attrs.style = (attrs.style || '') + `background-color: ${value};`
      }
    }
  }
})
