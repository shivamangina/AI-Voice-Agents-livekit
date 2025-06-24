import { CheckCircle2Icon } from "lucide-react";
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function ChatHistory() {
  return (
    <div className="flex flex-col items-center justify-center p-1">
      <span className="font-semibold">Chat History</span>
      <div>
        {[1, 2, 3, 4, 5].map((message) => (
          <Alert key={message} className=" mt-2 w-full">
            <CheckCircle2Icon />
            <AlertTitle>What it schodinger cat doing?</AlertTitle>
            <AlertDescription>
              This is a description of the message
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
