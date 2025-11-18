// 压缩html
export function compressHTML(html: string) {
  // 去除注释
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  // 去除多余空白
  html = html.replace(/\s+/g, ' ')
  // 去除标签之间空格
  html = html.replace(/>\s+</g, '><')
  return html.trim()
}
