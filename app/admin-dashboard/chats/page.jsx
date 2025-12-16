"use client";

import { useState } from "react";
import AdminChatInbox from "@/components/chat/AdminChatInbox";
import AdminChatWindow from "@/components/chat/AdminChatWindow";

export default function AdminChatsPage() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-xl shadow">
      
      {/* LEFT: Inbox */}
      <AdminChatInbox onSelect={setActiveChat} />

      {/* RIGHT: Chat window */}
      <div className="flex-1">
        {activeChat ? (
          <AdminChatWindow
            chatId={activeChat.chatId}
            userId={activeChat.userId}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat
          </div>
        )}
      </div>

    </div>
  );
}
