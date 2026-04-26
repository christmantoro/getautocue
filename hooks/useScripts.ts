"use client";

import { useState, useEffect, useCallback } from "react";
import { Script } from "@/types/teleprompter";

const SCRIPTS_KEY = "autocue-scripts";

function loadScripts(): Script[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCRIPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveScripts(scripts: Script[]) {
  try {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
  } catch {}
}

export function useScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    setScripts(loadScripts());
  }, []);

  const createScript = useCallback((title: string): Script => {
    const now = new Date().toISOString();
    const script: Script = {
      id: crypto.randomUUID(),
      title: title || "Untitled Script",
      content: "",
      plainText: "",
      createdAt: now,
      updatedAt: now,
    };
    setScripts((prev) => {
      const next = [script, ...prev];
      saveScripts(next);
      return next;
    });
    return script;
  }, []);

  const updateScript = useCallback(
    (id: string, updates: Partial<Pick<Script, "title" | "content" | "plainText">>) => {
      setScripts((prev) => {
        const next = prev.map((s) =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        );
        saveScripts(next);
        return next;
      });
    },
    []
  );

  const deleteScript = useCallback((id: string) => {
    setScripts((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveScripts(next);
      return next;
    });
  }, []);

  const getScript = useCallback(
    (id: string): Script | undefined => {
      return loadScripts().find((s) => s.id === id);
    },
    []
  );

  const loadIntoTeleprompter = useCallback((plainText: string) => {
    try {
      localStorage.setItem("teleprompter-script", plainText);
    } catch {}
  }, []);

  return { scripts, createScript, updateScript, deleteScript, getScript, loadIntoTeleprompter };
}
