"use client";

import { useState } from "react";
import ImageUploader from "../ImageUploader";
import { SendHorizontal, Paperclip, X, Loader2 } from "lucide-react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";

export default function ChatInput({ chatId }) {
  const { token } = useFirebaseAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);

  const send = async () => {
    if ((!text.trim() && !image) || sending || !token) return;

    try {
      setSending(true);

      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId,
          type: image?.url ? "image" : "text",
          text: text.trim(),
          imageUrl: image?.url || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setText("");
      setImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="bg-[#214311] ">
      {image && (
        <div className="mb-3">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/10">
            <img src={image.url} alt="preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="relative flex items-end gap-2 rounded-2xl border p-2 ">
        <div className="flex items-center text-gray-300 hover:text-blue-600 transition">
          <ImageUploader onUploadSuccess={setImage} customIcon={<Paperclip size={18} />} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your message..."
          className="flex-1 resize-none  text-sm text-white placeholder:text-gray-400 focus:outline-none px-2 py-2 max-h-32"
        />

        <button
          onClick={send}
          disabled={(!text.trim() && !image) || sending || !token}
          className={`
            h-10 w-10 flex items-center justify-center rounded-full transition-all
            ${
              text.trim() || image
                ? "bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow-md hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
        </button>
      </div>
    </div>
  );
}
