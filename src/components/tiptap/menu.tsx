import { useCurrentEditor } from "@tiptap/react";
import { Button } from "../ui/button";
import { WandSparklesIcon } from "lucide-react";

export default function MenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="pb-10 flex w-full justify-center">
      <div className="flex flex-wrap gap-2 max-w-5xl">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "default" : "secondary"}
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "default" : "secondary"}
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          variant={editor.isActive("strike") ? "default" : "secondary"}
        >
          Strike
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          variant={editor.isActive("code") ? "default" : "secondary"}
        >
          Code
        </Button>
        <Button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          variant="secondary"
        >
          Clear marks
        </Button>
        <Button
          onClick={() => editor.chain().focus().clearNodes().run()}
          variant="secondary"
        >
          Clear nodes
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant={editor.isActive("paragraph") ? "default" : "secondary"}
        >
          Paragraph
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "secondary"
          }
        >
          H1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "secondary"
          }
        >
          H2
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "secondary"
          }
        >
          H3
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          variant={
            editor.isActive("heading", { level: 4 }) ? "default" : "secondary"
          }
        >
          H4
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          variant={
            editor.isActive("heading", { level: 5 }) ? "default" : "secondary"
          }
        >
          H5
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          variant={
            editor.isActive("heading", { level: 6 }) ? "default" : "secondary"
          }
        >
          H6
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive("bulletList") ? "default" : "secondary"}
        >
          Bullet list
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive("orderedList") ? "default" : "secondary"}
        >
          Ordered list
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant={editor.isActive("codeBlock") ? "default" : "secondary"}
        >
          Code block
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant={editor.isActive("blockquote") ? "default" : "secondary"}
        >
          Blockquote
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          variant="secondary"
        >
          Horizontal rule
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          variant="secondary"
        >
          Hard break
        </Button>
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          variant="secondary"
        >
          Undo
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          variant="secondary"
        >
          Redo
        </Button>

        <Button
          onClick={() => {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, " ");

            editor.commands.setTextSelection(to);

            editor.commands.insertContent({
              type: "aiBlock",
              attrs: {
                selectedText,
              },
            });
          }}
          variant="default"
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          <WandSparklesIcon className="size-5" /> AI Block
        </Button>
      </div>
    </div>
  );
}
