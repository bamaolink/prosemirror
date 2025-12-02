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
// <img class="bml-image-block" src="https://milkdown.dev/polar.jpeg" alt="view component section" height="600">

editor.setHtmlString(`<h2>Setting up an editor</h2>
<p>Setting up a full editor ‘from scratch’, using only the core libraries, requires quite a lot of code. To be able to get started quickly with a pre-configured editor, we provide the prosemirror-example-setup package, which creates an array of plugins for you, configured to create a passable editing interface for a given schema. In this example, we use the basic schema and extend it with lists.</p>
<p>This <a href="1" title="guide" target="_blank">guide describes</a> the various concepts used in the library, and how they relate to each other. To get a complete picture of the system, <star></star>it is recommended to go through it in the order it is presented in, at least up to the view component section.
</p>
<h2>Introduction<span data-emoji-id="smile"></span></h2>
<p>ProseMirror provides a set of tools and concepts for building rich text editors, using a user interface inspired by what-you-see-is-what-you-get, but trying to avoid the pitfalls of that style of editing.</p>
<p>The main principle of ProseMirror is that your code gets full control over the document and what happens to it. This document isn't a blob of HTML, but a custom data structure that only contains elements that you explicitly allow it to contain, in relations that you specified. All updates go through a single point, where you can inspect them and react to them.</p>
<p>The core library is not an easy drop-in component—we are prioritizing modularity and customizability over simplicity, with the hope that, in the future, people will distribute drop-in editors based on ProseMirror. As such, this is more of a Lego set than a Matchbox car.</p>
<p>There are four essential modules, which are required to do any editing at all, and a number of extension modules maintained by the core team, which have a status similar to that of 3rd party modules—they provide useful functionality, but you may omit them or replace them with other modules that implement similar functionality.</p>
<ul data-type="task-list"> 
<li data-type="task-list-item" data-checked="true"> <strong>Schema</strong>: This module defines the document structure, and the types of content that can be in it. It also defines the types of content that can be inserted into it, and the types of content that can be selected.</li>
<li data-type="task-list-item" data-checked="false"> <strong>View</strong>: This module defines the user interface, which is responsible for rendering the document, and for responding to user input.</li>
</ul>
<pre data-language="javascript">
<code>
import { SupMark, SupMarkName } from './marks/sup'
import { SubMark, SubMarkName } from './marks/sub'
console.log(editor?.getHTML())
</code>
</pre>
`)

document.querySelector('#getHtml')?.addEventListener('click', () => {
  console.log(editor?.getHTML())
})

document.querySelector('#getMD')?.addEventListener('click', () => {
  console.log(editor?.getMarkdown())
})
document.querySelector('#getText')?.addEventListener('click', () => {
  console.log(editor?.getText())
})
document.querySelector('#getNode')?.addEventListener('click', () => {
  console.log(editor?.getNode())
})
document.querySelector('#getJSON')?.addEventListener('click', () => {
  console.log(editor?.getJSON())
})
document.querySelector('#light')?.addEventListener('click', () => {
  const root = document.documentElement!
  root.classList.remove('light', 'dark')
  root.classList.add('light')
  document.documentElement.setAttribute('data-theme', 'light')
})
document.querySelector('#dark')?.addEventListener('click', () => {
  const root = document.documentElement!
  root.classList.remove('light', 'dark')
  root.classList.add('dark')
  document.documentElement.setAttribute('data-theme', 'dark')
})
