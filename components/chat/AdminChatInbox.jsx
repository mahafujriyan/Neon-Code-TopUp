
"use client";

import { useEffect, useState } from "react";

export default function AdminChatInbox({ onSelect }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("/api/admin/chat/list");
      const data = await res.json();
      setChats(data.chats || []);
    };

    fetchChats();
  }, []);

  return (
    <div className="w-80 border-r h-full overflow-y-auto">
      <h2 className="font-bold p-3 border-b">Live Chats</h2>

      {chats.map(chat => (
        <div
          key={chat.chatId}
          onClick={() => onSelect(chat)}
          className="p-3 cursor-pointer hover:bg-gray-100 border-b"
        >
          <p className="font-semibold text-sm">
            {chat.guestName || chat.userId}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {chat.lastMessage || "New chat"}
          </p>
        </div>
      ))}
    </div>
  );
}
