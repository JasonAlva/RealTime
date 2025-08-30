import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";

let socket: Socket;

export default function EditorPage() {
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Map of other users' highlights
  const [userSelections, setUserSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;

    socket = io("http://localhost:8080");

    socket.on("connect", () => console.log("Connected:", socket.id));

    socket.on("text-update", (data: string) => {
      setCode(data);
    });

    // Listen for selection updates
    socket.on("cursor-update", ({ userId, range, color }) => {
      setUserSelections((prev) => ({
        ...prev,
        [userId]: { range, color },
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
    socket.emit("text-update", value);
  };

  // Capture selection changes
  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeCursorSelection((e) => {
      const range = e.selection;

      socket.emit("cursor-update", {
        userId: user?.id,
        range,
        color: getUserColor(user?.id), // assign user color
      });
    });
  };

  // Apply highlights whenever selections change
  useEffect(() => {
    if (!editorRef.current) return;

    const monaco = editorRef.current._monaco;
    const editor = editorRef.current;

    // Clear old decorations
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      Object.entries(userSelections).map(([uid, { range, color }]) => ({
        range: new monaco.Range(
          range.startLineNumber,
          range.startColumn,
          range.endLineNumber,
          range.endColumn
        ),
        options: {
          inlineClassName: `highlight-${color}`, // now maps to your CSS
        },
      }))
    );
  }, [userSelections]);

  if (!user) {
    return (
      <p className="text-center mt-10">You must login to access the editor.</p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Welcome {user.email} 🎉</h1>
      <div className="h-screen flex flex-col">
        <h2 className="text-2xl font-bold p-4 bg-gray-800 text-white">
          Realtime Code Editor
        </h2>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            onMount={handleMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Simple color generator (replace with something better if needed)
const colors = ["red", "blue", "green", "yellow", "purple"];
const userColorMap: Record<string, string> = {};

function getUserColor(userId: string | undefined) {
  if (!userId) return "red";
  if (!userColorMap[userId]) {
    userColorMap[userId] =
      colors[Object.keys(userColorMap).length % colors.length];
  }
  return userColorMap[userId];
}
