"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useScripts } from "@/hooks/useScripts";
import { Script } from "@/types/teleprompter";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Play, ArrowLeft, FileText } from "lucide-react";

export default function ScriptsPage() {
  const router = useRouter();
  const { scripts, createScript, deleteScript, loadIntoTeleprompter } = useScripts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleNew() {
    const script = createScript("Untitled Script");
    router.push(`/scripts/${script.id}`);
  }

  function handleLoad(script: Script) {
    loadIntoTeleprompter(script.plainText);
    router.push("/");
  }

  function handleDelete(id: string) {
    if (deletingId === id) {
      deleteScript(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">Scripts</h1>
          </div>
          <Button onClick={handleNew} className="bg-white text-black hover:bg-neutral-200">
            <Plus className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </div>

        {/* List */}
        {scripts.length === 0 ? (
          <div className="text-center py-24 text-neutral-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No scripts yet</p>
            <p className="text-sm mt-1">Create your first script to get started.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {scripts.map((script) => (
              <li
                key={script.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{script.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Updated {formatDate(script.updatedAt)}
                  </p>
                  {script.plainText && (
                    <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
                      {script.plainText.slice(0, 120)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoad(script)}
                    title="Load into teleprompter"
                    className="text-neutral-400 hover:text-white"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/scripts/${script.id}`)}
                    title="Edit"
                    className="text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(script.id)}
                    title={deletingId === script.id ? "Click again to confirm" : "Delete"}
                    className={
                      deletingId === script.id
                        ? "text-red-500 hover:text-red-400"
                        : "text-neutral-400 hover:text-red-500"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
