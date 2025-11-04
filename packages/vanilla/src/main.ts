import BamaoLinkProseMirror from './ProseMirror'

const editor = new BamaoLinkProseMirror('#app', {
  initialValue: ''
})
// editor.on("initialization", (e) => console.log("foo", e));
// editor.on("change", (e) =>
//   console.log("change", e.newDoc.textContent, e.oldDoc.textContent)
// );
// editor.on('selected', (e) => console.log('selected', e))
// console.log(editor);
// editor.setMarkdown(`## Hello World

//   - [ ] Task 1
//   - [ ] Task 2`);

// editor.focus();

editor.setHtmlString(`<p>This is a <star></star>nice<star></star> paragraph, it can have <shouting>anything</shouting> in it.</p>
    <p class=boring>This paragraph is boring, it can't have anything.
      <star></star>
    </p>
    <p>Press ctrl/cmd-space to insert a star, ctrl/cmd-b to toggle shouting, and ctrl/cmd-q to add or remove a link.</p>
    <note>Do laundry</note>
    <note><strong>Water</strong> the tomatoes</note>
    <notegroup>
      <note>Buy flour</note>
      <note>Get toilet paper</note>
    </notegroup><p class=boring>This paragraph is boring, it can't have anything.
      <star></star>
    </p>`)
