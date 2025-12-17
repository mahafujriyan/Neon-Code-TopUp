"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import ImageUploader from "../ImageUploader";

export default function ChatInput({ chatId, user }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const send = async () => {
    if (!text && !image) return;

    // 🔥 Update root chat document (Inbox optimization)
    await setDoc(
      doc(db, "chats", chatId),
      {
        userId: user.uid,
        status: "open",
        lastMessage: text || "📷 Image",
        lastSender: "user",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    if (text) {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderRole: "user",
        type: "text",
        text,
        createdAt: serverTimestamp(),
      });
    }

    if (image?.url) {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderRole: "user",
        type: "image",
        imageUrl: image.url,
        createdAt: serverTimestamp(),
      });
    }

    setText("");
    setImage(null);
  };

  return (
    <div className="border-t p-2 space-y-2">
      <ImageUploader onUploadSuccess={setImage} />

      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-2"
          placeholder="Type message"
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
