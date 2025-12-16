
"use client";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatWindow({ user, onClose }) {
  const chatId = `support_${user.uid}`;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[520px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
      <div className="p-3 border-b flex justify-between">
        <b>Live Support</b>
        <button onClick={onClose}>✕</button>
      </div>

      <ChatMessages chatId={chatId} />
      <ChatInput chatId={chatId} user={user} />
    </div>
  );
}
