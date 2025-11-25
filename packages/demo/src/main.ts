import BamaoLinkProseMirror from '@bamaolink/prosemirror'

const editor = new BamaoLinkProseMirror('#app', {
  initialValue: ''
})
editor.on('change', (v) => {
  console.log(editor.getHTML())
})
