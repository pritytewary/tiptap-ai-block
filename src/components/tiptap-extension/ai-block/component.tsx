"use client";

import { useState } from "react";
import {
  NodeViewWrapper,
  NodeViewContent,
  useCurrentEditor,
  NodeViewRendererProps,
} from "@tiptap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, PenLine, Wand2, X } from "lucide-react";

interface AIBlockAttributes {
  selectedText?: string;
  response?: string;
  prompt?: string;
}

export default function AIBlockComponent({ node }: NodeViewRendererProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = useState(true);
  const [response, setResponse] = useState(node.attrs.response || "");
  const [prompt, setPrompt] = useState("");

  const updateAttributes = (attrs: Partial<AIBlockAttributes>) => {
    // Update the attributes of the node
    editor?.commands.updateAttributes("aiBlock", attrs);
  };

  const deleteNode = () => {
    editor?.commands.deleteNode("aiBlock");
  };

  const handleSubmit = async (promptText: string) => {
    try {
      // Placeholder for API call
      const mockResponse = `This is not calling any API for now. You wrote: ${promptText}`;

      setResponse(mockResponse);
      updateAttributes({
        response: mockResponse,
        prompt: promptText,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error generating response:", error);
      // Handle error state
    }
  };

  const handleInsert = () => {
    if (!editor || !response) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "paragraph",
        content: [{ type: "text", text: response }],
      })
      .run();

    deleteNode();
  };

  return (
    <NodeViewWrapper>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Type what you want to insert
          </CardTitle>
        </CardHeader>
        <CardContent>
          {node.attrs.selectedText && (
            <p className="text-sm text-muted-foreground mb-4">
              Selected text: {node.attrs.selectedText} // Show selected text if
              available
            </p>
          )}

          {isEditing ? (
            <AIPromptForm
              onSubmit={handleSubmit}
              onDiscard={deleteNode}
              prompt={prompt}
              setPrompt={setPrompt}
            />
          ) : (
            <AIResponse
              response={response}
              onEdit={() => setIsEditing(true)}
              onInsert={handleInsert}
              onDiscard={deleteNode}
            />
          )}
        </CardContent>
      </Card>
      <NodeViewContent className="hidden" />
    </NodeViewWrapper>
  );
}

function AIPromptForm({
  onSubmit,
  onDiscard,
  prompt,
  setPrompt,
}: {
  onSubmit: (prompt: string) => void;
  onDiscard: () => void;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        rows={3}
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onDiscard}>
          <X className="h-4 w-4 " />
          Discard
        </Button>
        <Button onClick={handleSubmit} disabled={!prompt.trim()}>
          <Wand2 className="h-4 w-4 " />
          Generate
        </Button>
      </div>
    </div>
  );
}

function AIResponse({
  response,
  onEdit,
  onInsert,
  onDiscard,
}: {
  response: string;
  onEdit: () => void;
  onInsert: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="px-4 py-3 bg-secondary rounded-md">
        <p className="text-secondary-foreground my-0 text-sm">{response}</p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onDiscard}>
          <X className="h-4 w-4 " />
          Discard
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <PenLine className="h-4 w-4 " />
          Edit
        </Button>
        <Button onClick={onInsert}>
          <Check className="h-4 w-4 " />
          Insert
        </Button>
      </div>
    </div>
  );
}
