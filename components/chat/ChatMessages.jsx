
"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function ChatMessages({ chatId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    return onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => d.data()));
    });
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {messages.map((m, i) => (
        <div key={i}>
          {m.type === "text" && <p>{m.text}</p>}
          {m.type === "image" && (
            <img src={m.imageUrl} className="max-w-xs rounded" />
          )}
        </div>
      ))}
    </div>
  );
}
