"use client";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";

export default function AdminChatInbox({ onSelect }) {
  const [chats, setChats] = useState([]);
  const { token } = useFirebaseAuth();

  useEffect(() => {
    if (!token) return; 

    const fetchChats = async () => {
      try {
        const res = await fetch("/api/admin/chat/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await res.json();
       

        setChats(data.chats || []);
      } catch (err) {
        console.error("Chat fetch error:", err);
      }
    };

    fetchChats();
  }, [token]); // ✅ token dependency

  return (
    <div className="w-80 border-r h-full overflow-y-auto">
      <h2 className="font-bold p-3 border-b">Live Chats</h2>

      {chats.length === 0 && (
        <p className="text-sm text-gray-400 p-3">No active chats</p>
      )}

      {chats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => onSelect(chat)}
          className="p-3 cursor-pointer hover:bg-gray-100 border-b"
        >
          <p className="font-semibold text-sm">
            {chat.guestName || chat.userId || "Unknown User"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {chat.lastMessage || "New chat"}
          </p>
        </div>
      ))}
    </div>
  );
}
