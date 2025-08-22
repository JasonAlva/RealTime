import { useState,useEffect } from "react";
import {io,Socket} from "socket.io-client"

let socket:Socket;


const EditorPage = () => {
  const[text,setText]=useState  <string>("");
  useEffect (()=>{
    socket=io("http://localhost:8080");
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("text-update",(data:string)=>{

      setText(data);
    });
  },[]);
  const handleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
    setText(e.target.value);
    socket.emit("text-update",e.target.value);
  }
  return <div><h1>Testing</h1>
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <textarea
        value={text}
        onChange={handleChange}
        className="w-2/3 h-96 p-4 border rounded-lg shadow-md"
        placeholder="Start typing... multiple users can edit in real-time"
      />
    </div>
  </div>;
};

export default EditorPage;
