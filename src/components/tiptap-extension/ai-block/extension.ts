import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import AIBlockComponent from "./component";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiBlock: {
      setAIBlock: (attrs?: { selectedText?: string }) => ReturnType;
    };
  }
}

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

  addCommands() {
    return {
      setAIBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AIBlockComponent);
  },
});
