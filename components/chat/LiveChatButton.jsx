"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { auth } from "@/lib/firebaseClient";
import { ensureAuth } from "@/hooks/useEnsureAuth";

export default function LiveChatButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    try {
      setLoading(true);

      // ✅ Guest / Logged-in — both supported
      await ensureAuth();

      setOpen(true);
    } catch (err) {
      console.error("Failed to start live chat:", err);
      alert("Unable to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black">
      {/* Floating Button */}
      <button
        onClick={handleOpenChat}
        disabled={loading}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-4 rounded-full shadow-xl"
        aria-label="Live Chat"
      >
        <MessageCircle />
      </button>

      {/* Chat Window */}
      {open && auth.currentUser && (
        <ChatWindow
          user={auth.currentUser}   // ✅ always valid (guest or real)
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
