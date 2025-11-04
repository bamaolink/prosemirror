import mitt from "mitt";
import type { Emitter } from "mitt";

export const emitter: Emitter<BamaoLinkEditorType.Events> = mitt();
