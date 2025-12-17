"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function ChatMessages({ chatId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, snap => {
      setMessages(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsub;
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {messages.map(m => (
        <div
          key={m.id}
          className={`max-w-xs p-2 rounded text-sm ${
            m.senderRole === "admin"
              ? "ml-auto bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {m.type === "text" && <p>{m.text}</p>}
          {m.type === "image" && (
            <img src={m.imageUrl} className="max-w-xs rounded" />
          )}
        </div>
      ))}
    </div>
  );
}
