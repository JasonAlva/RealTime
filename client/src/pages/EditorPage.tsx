import { useState,useEffect } from "react";
import {io,Socket} from "socket.io-client"
import Editor from "@monaco-editor/react";

let socket:Socket;


const EditorPage = () => {
  const[code,setCode ]=useState<string>("");
  useEffect (()=>{
    socket=io("http://localhost:8080");
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("text-update",(data:string)=>{

      setCode(data);
    });
  },[]);
  const handleEditorChange=(value:string|undefined)=>{
    setCode(value||"");
    socket.emit("text-update",value);
  }
  return (
  <div>
    <h1>Testing</h1>
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
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
    </div> );       
};

export default EditorPage;
