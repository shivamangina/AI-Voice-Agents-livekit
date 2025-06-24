import React from 'react'
import { Textarea } from './ui/textarea'

export default function Chat() {
  return (
    <div className="flex flex-col h-full  items-center justify-between p-6">
    <div className="flex flex-col">
      <span className="font-semibold">chat</span>
    </div>
    <div className="grid w-full gap-3">
      <Textarea placeholder="Type your message here." id="message-2" />
      <p className="text-muted-foreground text-sm">
        Your message will be copied to the support team.
      </p>
    </div>
  </div>
  )
}
