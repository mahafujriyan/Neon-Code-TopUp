"use client";

import { use, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import AdminReplyInput from "./AdminReplyInput";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";

export default function AdminChatWindow({ chatId }) {

  const { token } = useFirebaseAuth();


  // 🔔 admin opens chat → unread reset

  console.log("admin chat window" ,chatId)

  useEffect(() => {
    if (!chatId || !token) return;

    

    fetch("/api/admin/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

       },
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
