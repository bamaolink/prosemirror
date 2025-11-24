import { Plugin, PluginKey, EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Slice, Fragment, Node as PMNode } from 'prosemirror-model'
import type { PluginOptions } from '../../types'

export const linkHandlerPluginKey = new PluginKey('link-handler')

/**
 * 简单的 URL 校验正则
 */
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
export const linkHandlerPlugin = (options: PluginOptions) => {
  return new Plugin({
    key: linkHandlerPluginKey,
    props: {
      handleClick(view: EditorView, pos: number, event: MouseEvent) {
        if (!event.ctrlKey && !event.metaKey) return false

        const { schema } = view.state
        const attrs = getLinkAttrsAtPos(view.state.doc, pos, schema.marks.link)

        if (attrs && attrs.href) {
          event.preventDefault()
          window.open(attrs.href, attrs.target || '_blank')
          return true
        }
        return false
      },

      // 2. 处理粘贴事件 (Magic Paste: 选中文字后粘贴 URL，变成链接)
      handlePaste(view: EditorView, event: ClipboardEvent) {
        const { state, dispatch } = view
        const { selection, schema } = state

        if (selection.empty) return false

        const pastedText = event.clipboardData?.getData('text/plain')
        if (!pastedText || !URL_REGEX.test(pastedText)) {
          return false
        }

        const linkMark = schema.marks.link.create({ href: pastedText })
        const tr = state.tr.addMark(selection.from, selection.to, linkMark)
        dispatch(tr)

        event.preventDefault()
        return true
      }
    }
  })
}

// 辅助函数：获取指定位置的 Link 属性
function getLinkAttrsAtPos(doc: PMNode, pos: number, linkType: any) {
  const $pos = doc.resolve(pos)
  const { parent, parentOffset } = $pos

  // 检查当前位置的 mark
  const mark =
    parent
      .childAfter(parentOffset)
      .node?.marks.find((m) => m.type === linkType) ||
    parent
      .childBefore(parentOffset)
      .node?.marks.find((m) => m.type === linkType)

  // 如果没找到，再精确检查 nodeAt
  if (!mark) {
    const node = doc.nodeAt(pos)
    return node?.marks.find((m) => m.type === linkType)?.attrs
  }

  return mark?.attrs
}
