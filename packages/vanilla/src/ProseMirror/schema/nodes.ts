import { addListNodes } from "prosemirror-schema-list";
import { schema } from "prosemirror-schema-basic";

const nodes = addListNodes(
  schema.spec.nodes,
  "paragraph block*",
  "block"
).toObject();

nodes.doc.content = "(block | note | notegroup)+";

nodes.star = {
  inline: true,
  group: "inline",
  toDOM() {
    return ["star", { style: "color: red" }, "🟊"];
  },
  parseDOM: [{ tag: "star" }],
};

nodes.note = {
  content: "(star | text)*",
  toDOM() {
    return ["note", 0];
  },
  parseDOM: [{ tag: "note" }],
};

nodes.notegroup = {
  content: "note+",
  toDOM() {
    return ["notegroup", 0];
  },
  parseDOM: [{ tag: "notegroup" }],
};

export { nodes };
