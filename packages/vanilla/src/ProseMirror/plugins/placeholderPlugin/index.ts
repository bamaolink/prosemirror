import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
export const createPlaceholderPlugin = (
  placeholderText: string,
  pluginKey = new PluginKey("placeholder-plugin")
) => {
  return new Plugin({
    key: pluginKey,
    props: {
      decorations: (state: EditorState) => {
        const decorations: Decoration[] = [];
        if (state.doc.textContent.length === 0) {
          decorations.push(
            Decoration.node(0, state.doc.content.size, {
              class: "bamao-link-prosemirror-placeholder",
              "data-placeholder": placeholderText,
            })
          );
        }
        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
};
