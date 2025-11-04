import { EditorState, Plugin, PluginKey, Transaction } from "prosemirror-state";
export const createChangePlugin = (
  emitter: BamaoLinkEditorType.Emitter,
  pluginKey = new PluginKey("change-plugin")
) => {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return null;
      },
      apply(
        tr: Transaction,
        value: any,
        oldState: EditorState,
        newState: EditorState
      ) {
        if (tr.docChanged) {
          emitter.emit("change", {
            newDoc: newState.doc,
            oldDoc: oldState.doc,
            tr,
          });
        }
        return null;
      },
    },
  });
};
