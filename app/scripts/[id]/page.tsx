"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useScripts } from "@/hooks/useScripts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Save } from "lucide-react";

function extractPlainText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      const inline = Array.isArray(block.content)
        ? block.content
            .map((c: { type: string; text?: string }) => (c.type === "text" ? c.text ?? "" : ""))
            .join("")
        : "";
      const children =
        block.children && block.children.length > 0
          ? extractPlainText(block.children)
          : "";
      return [inline, children].filter(Boolean).join("\n");
    })
    .join("\n");
}

function EditorContent({
  title,
  initialContent,
  onTitleChange,
  onSave,
  onLoadAndGo,
  onEditorChange,
  saved,
}: {
  title: string;
  initialContent: Block[] | undefined;
  onTitleChange: (t: string) => void;
  onSave: (blocks: Block[]) => void;
  onLoadAndGo: (plainText: string, blocks: Block[]) => void;
  onEditorChange: () => void;
  saved: boolean;
}) {
  const router = useRouter();
  const editor = useCreateBlockNote({ initialContent });

  const handleSave = useCallback(() => {
    onSave(editor.document as Block[]);
  }, [editor, onSave]);

  const handleLoadAndGo = useCallback(() => {
    const blocks = editor.document as Block[];
    const plainText = extractPlainText(blocks);
    onLoadAndGo(plainText, blocks);
  }, [editor, onLoadAndGo]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/scripts")}
            className="text-neutral-500 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Scripts
          </Button>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 text-neutral-900 w-72"
            placeholder="Script title"
          />
        </div>
        <div className="flex items-center gap-2">
          {!saved && (
            <span className="text-xs text-neutral-400 mr-1">Unsaved changes</span>
          )}
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
          <Button size="sm" onClick={handleLoadAndGo} className="bg-black text-white hover:bg-neutral-800">
            <Play className="w-4 h-4 mr-1.5" />
            Load & Play
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto" onClick={() => editor.focus()}>
        <div className="max-w-3xl mx-auto py-12 px-4">
          <BlockNoteView
            editor={editor}
            onChange={onEditorChange}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}

export default function ScriptEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getScript, updateScript, loadIntoTeleprompter } = useScripts();
  const [title, setTitle] = useState("Untitled Script");
  const [saved, setSaved] = useState(true);
  const initialContentRef = useRef<Block[] | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = getScript(id);
    if (!script) {
      router.push("/scripts");
      return;
    }
    setTitle(script.title);
    if (script.content) {
      try {
        initialContentRef.current = JSON.parse(script.content);
      } catch {
        initialContentRef.current = undefined;
      }
    }
    setReady(true);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(
    (blocks: Block[]) => {
      const content = JSON.stringify(blocks);
      const plainText = extractPlainText(blocks);
      updateScript(id, { title, content, plainText });
      setSaved(true);
    },
    [id, title, updateScript]
  );

  const handleLoadAndGo = useCallback(
    (plainText: string, blocks: Block[]) => {
      updateScript(id, { title, content: JSON.stringify(blocks), plainText });
      loadIntoTeleprompter(plainText);
      router.push("/");
    },
    [id, title, updateScript, loadIntoTeleprompter, router]
  );

  const handleTitleChange = useCallback((t: string) => {
    setTitle(t);
    setSaved(false);
  }, []);

  const handleEditorChange = useCallback(() => setSaved(false), []);

  if (!ready) return null;

  return (
    <EditorContent
      title={title}
      initialContent={initialContentRef.current}
      onTitleChange={handleTitleChange}
      onSave={handleSave}
      onLoadAndGo={handleLoadAndGo}
      onEditorChange={handleEditorChange}
      saved={saved}
    />
  );
}
