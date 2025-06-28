"use client";
import React from "react";
import { Textarea } from "./ui/textarea";
import {  UIMessage } from "ai";


import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit }: any = useChat({});

  

  return (
    <div className="flex flex-col h-full  items-center justify-between p-6">
      <div className="flex flex-col">
        <span className="font-semibold">chat</span>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col h-full justify-end gap-2 overflow-y-auto w-full">
        <span className="flex flex-col items-start gap-2  border-gray-200 p-4 w-full">
          Who is the current president of the United States?
        </span>

        <span className="flex flex-col items-start gap-2  border-gray-200 p-4 w-full">
          Who is the current president of the United States?
        </span>
        {messages.map((message: UIMessage) => (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>

      <div className="grid w-full gap-3">
        <Textarea placeholder="Type your message here." id="message-2" />
        <p className="text-muted-foreground text-sm">
          Your message will be copied to the support team.
        </p>
        <form onSubmit={handleSubmit}>
          <input name="prompt" value={input} onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
