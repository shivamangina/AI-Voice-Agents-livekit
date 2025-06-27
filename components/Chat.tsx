"use client";
import React from "react";
import { Textarea } from "./ui/textarea";
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"


export default function Chat() {


  
  const handleSend = async () => {
    const { text } = await generateText({
      model: openai("o3-mini"),
      prompt: "What is love?"
    })
    console.log(text)
  }



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
      </div>


     
      <div className="grid w-full gap-3">
        <Textarea placeholder="Type your message here." id="message-2" />
        <p className="text-muted-foreground text-sm">
          Your message will be copied to the support team.
        </p>
        <button
          onClick={() => {
            handleSend()
          }}
          className="h-10 rounded-lg border border-gray-200 p-2 hover:bg-gray-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}
