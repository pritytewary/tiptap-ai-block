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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateTextGemini } from "./gemini";
import MarkdownIt from "markdown-it"; // parse markdown content markdown -> html to properly render markdown content
import Markdown from "react-markdown"; // render markdown content in AIResponse component

const API_KEY_LOCAL_STORAGE_KEY = "ai-block-api-key";

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
  const [apiKey, setApiKey] = useState(() => {
    const key = localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
    return key || "";
  });
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateAttributes = (attrs: Partial<AIBlockAttributes>) => {
    editor?.commands.updateAttributes("aiBlock", attrs);
  };

  const deleteNode = () => {
    editor?.commands.deleteNode("aiBlock");
  };

  const handleSubmit = async () => {
    // reset any previous error
    setError(null);
    setIsGenerating(true);

    localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey); // save api key to local storage for later

    try {
      const generated = await generateTextGemini({
        apiKey,
        prompt,
      });

      setResponse(generated);
      updateAttributes({
        response: generated,
        prompt: prompt,
      });

      setIsEditing(false); // this will go to next screen
    } catch (error) {
      console.error("Error generating response:", error);
      setError(`Error generating response: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (!editor || !response) return;

    const markdownParser = new MarkdownIt();

    const htmlContent = markdownParser.render(response); // will properly render markdown content

    editor.chain().focus().insertContent(htmlContent).run();

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
              Selected text: {node.attrs.selectedText}
            </p>
          )}

          {isEditing ? (
            <AIPromptForm
              onSubmit={handleSubmit}
              onDiscard={deleteNode}
              prompt={prompt}
              setPrompt={setPrompt}
              apiKey={apiKey}
              setApiKey={setApiKey}
              isGenerating={isGenerating}
            />
          ) : (
            <AIResponse
              response={response}
              onEdit={() => setIsEditing(true)}
              onInsert={handleInsert}
              onDiscard={deleteNode}
            />
          )}

          {error && (
            <p className="text-xs text-red-500 border bg-red-50 p-2 rounded-lg border-red-200">
              {error}
            </p>
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
  apiKey,
  isGenerating,
  setApiKey,
}: {
  onSubmit: () => void;
  onDiscard: () => void;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
}) {
  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit();
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        rows={3}
      />

      <div className="space-y-1">
        <Label htmlFor="api-key">Gemini API Key</Label>
        <Input
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          type="password"
        />

        <p className="text-xs text-muted-foreground">
          You api key will be stored into your browser local storage.
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onDiscard}>
          <X className="h-4 w-4 " />
          Discard
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              <Wand2 className="h-4 w-4 " />
              Generate
            </>
          )}
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
        <Markdown>{response}</Markdown>
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
