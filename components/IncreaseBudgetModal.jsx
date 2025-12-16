"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";

export default function IncreaseBudgetModal({
  open,
  onClose,
  adAccountId,
  oldLimit,
  onSuccess,
}) {
  const { token } = useFirebaseAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  if (!open) return null;

  const submit = async () => {
    if (!amount || Number(amount) <= 0) {
      return setError("Enter valid amount");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ads-request/update-limit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ad_account_id: adAccountId,
          old_limit: Number(oldLimit),
          new_limit: Number(oldLimit) + Number(amount),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 text-black bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h3 className="text-lg font-semibold mb-4">Increase Budget</h3>

        <input
          type="number"
          placeholder="Increase amount"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Update Budget"}
        </button>
      </div>
    </div>
  );
}
