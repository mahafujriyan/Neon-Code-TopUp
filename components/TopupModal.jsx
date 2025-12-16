"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopupModal({ open, onClose }) {
  const router = useRouter();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 text-black bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h3 className="text-lg font-semibold mb-3">Wallet Balance insufficient</h3>
        <p className="text-sm text-gray-600 mb-5">
          Please top up your wallet to continue running ads.
        </p>

        <button
          onClick={() => router.push("/user-dashboard/payment-methods")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Go to Top Up
        </button>
      </div>
    </div>
  );
}
