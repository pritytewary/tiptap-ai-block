import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import AIBlockComponent from "./component";

export const AIBlock = Node.create({
  name: "aiBlock",

  group: "block",

  content: "inline*",

  draggable: true,

  addAttributes() {
    return {
      prompt: {
        default: "",
      },
      response: {
        default: "",
      },
      selectedText: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "ai-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIBlockComponent);
  },
});
