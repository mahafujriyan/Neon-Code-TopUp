"use client";

import { useEffect } from "react";
import ChatMessages from "./ChatMessages";
import AdminReplyInput from "./AdminReplyInput";

export default function AdminChatWindow({ chatId }) {

  // 🔔 admin opens chat → unread reset
  useEffect(() => {
    if (!chatId) return;

    fetch("/api/admin/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    });
  }, [chatId]);

  return (
    <div className="h-full flex flex-col">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessages chatId={chatId} />
      </div>

      {/* ✅ Admin reply input */}
      <AdminReplyInput chatId={chatId} />

    </div>
  );
}
