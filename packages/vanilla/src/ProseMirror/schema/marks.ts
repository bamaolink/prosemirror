import { schema } from "prosemirror-schema-basic";

const marks = schema.spec.marks.toObject();

marks.sub = {
  parseDOM: [{ tag: "sub" }],
  toDOM() {
    return ["sub", 0];
  },
};

marks.sup = {
  parseDOM: [{ tag: "sup" }],
  toDOM() {
    return ["sup", 0];
  },
};

export { marks };
