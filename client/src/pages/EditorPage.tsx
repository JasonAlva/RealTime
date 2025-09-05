import { useState, useEffect, useRef, useMemo, act } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import type { OnMount } from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Play,
  Download,
  Users,
  UserPlus,
  Settings,
  User,
  Menu,
  Code,
  Terminal,
  MessageCircle,
  X,
  FileText,
  Plus,
} from "lucide-react";

let socket: Socket;

interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
}
interface ActiveUser {
  id: string;
  name: string;
}
const COLORS = [
  "#FF6B6B",
  "#4D96FF",
  "#6BCB77",
  "#FFD93D",
  "#B980F0",
  "#00C9A7",
  "#F97316",
  "#22C55E",
  "#06B6D4",
  "#A78BFA",
];

const colorMap: Record<string, string> = {};
const ensureColor = (id: string) => {
  if (!colorMap[id])
    colorMap[id] = COLORS[Object.keys(colorMap).length % COLORS.length];
  return colorMap[id];
};

export default function EditorPage() {
  const { user } = useAuth();

  const [code, setCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");
  const [activeTab, setActiveTab] = useState<string>("main.js");
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: "main.js",
      name: "main.js",
      language: "javascript",
      content: "// Your code here\nconsole.log('Hello, World!');",
    },
  ]);
  const [output, setOutput] = useState<string>("");
  const [programInput, setProgramInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; user: string; message: string; timestamp: Date }>
  >([]);
  const [chatInput, setChatInput] = useState<string>("");
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  // Map of other users' highlights
  const [userSelections, setUserSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;

    socket = io("http://localhost:8080", {
      transports: ["websocket"],
      query: { userId: user.id, name: user.name },
    });

    socket.on("connect", () => {
      const color = ensureColor(user.id);
      socket!.emit("join", {
        room: "default",
        userId: user.id,
        name: user.name,
        color,
      });
    });

    socket.on("doc:sync", (serverCode: string) => setCode(serverCode ?? ""));
    socket.on("doc:update", (serverCode: string) => setCode(serverCode ?? ""));
    socket.on("users", (users: ActiveUser[]) => setActiveUsers(users));

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
  const handleMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;
    void _monaco;

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

    // Clear old decorations and add new ones
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
          inlineClassName: `highlight-inline-${color}`,
          after: {
            content: `"${uid}"`, // show userId
            inlineClassName: `highlight-label-${color}`,
          },
        },
      }))
    );
  }, [userSelections]);

  const handleRunCode = () => {
    // Simulate running code
    setOutput("Running code...\n");
    setTimeout(() => {
      setOutput((prev) => prev + "Hello, World!\nCode executed successfully!");
    }, 1000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${
      selectedLanguage === "javascript" ? "js" : selectedLanguage
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: user?.email || "Anonymous",
        message: chatInput,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatInput("");
    }
  };

  const addNewFile = () => {
    const newFile: FileTab = {
      id: `file-${Date.now()}`,
      name: `file-${files.length + 1}.${
        selectedLanguage === "javascript" ? "js" : selectedLanguage
      }`,
      language: selectedLanguage,
      content: `// New ${selectedLanguage} file`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveTab(newFile.id);
  };

  const closeFile = (fileId: string) => {
    if (files.length > 1) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      if (activeTab === fileId) {
        setActiveTab(files[0].id);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You must login to access the editor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentFile = files.find((f) => f.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          {/* Sidebar Icon */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>

          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CodeCollab</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            {/* Run Button */}
            <Button
              onClick={handleRunCode}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>

            {/* Download */}
            <Button variant="outline" onClick={handleDownloadCode}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            {/* Join */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Basic</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {activeUsers.map((u) => (
                    <DropdownMenuItem key={u.id}>{u.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Invite */}
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>

            {/* Profile/Login */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Editor */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="border-b bg-muted/50">
            <div className="flex items-center gap-1 px-2 py-1">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1"
              >
                <TabsList className="h-8">
                  {files.map((file) => (
                    <TabsTrigger
                      key={file.id}
                      value={file.id}
                      className="flex items-center gap-2 h-6 px-3 text-xs"
                    >
                      <FileText className="h-3 w-3" />
                      {file.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-destructive/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFile(file.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={addNewFile}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={handleMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Side - I/O and Chat */}
        <div className="w-96 border-l bg-muted/30">
          <Tabs defaultValue="console" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="console" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Console
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="flex-1 p-4">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Console</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs font-medium mb-2">Input</div>
                    <textarea
                      value={programInput}
                      onChange={(e) => setProgramInput(e.target.value)}
                      placeholder="Type input for your program..."
                      className="bg-muted p-3 rounded font-mono text-sm h-full resize-none outline-none"
                    />
                  </div>
                  <Separator />
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs font-medium mb-2">Output</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm h-full overflow-auto">
                      <pre>
                        {output ||
                          "No output yet. Run your code to see results."}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 p-4">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Team Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-auto space-y-3 mb-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {message.user}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1 p-2 bg-muted rounded">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button onClick={handleSendChat} size="sm">
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
