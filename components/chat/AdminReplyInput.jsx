
"use client";

import { useState } from "react";

export default function AdminReplyInput({ chatId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReply = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, text }),
      });

      if (!res.ok) {
        throw new Error("Reply failed");
      }

      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t p-3 flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type reply…"
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        onClick={sendReply}
        disabled={loading}
        className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
