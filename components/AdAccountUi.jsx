"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  MoreHorizontal,
  Loader2,
  Wallet,
} from "lucide-react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import IncreaseBudgetModal from "./IncreaseBudgetModal";
import TopupModal from "./TopupModal";

/* ================= STATUS MAPPER ================= */
const getAdStatusMeta = (status) => {
  switch (status) {
    case 1:
      return {
        label: "Active",
        className: "bg-green-100 text-green-700 ring-1 ring-green-600/20",
      };
    case 2:
      return {
        label: "Disabled",
        className: "bg-red-100 text-red-700 ring-1 ring-red-600/20",
      };
    default:
      return {
        label: "Unknown",
        className: "bg-gray-100 text-gray-500 ring-1 ring-gray-400/20",
      };
  }
};

const AdAccountUi = () => {
  const { token, userData } = useFirebaseAuth();

  const [adAccounts, setAdAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  /* ---- modal state ---- */
  const [increaseModal, setIncreaseModal] = useState({
    open: false,
    adAccountId: null,
    oldLimit: null,
  });
  const [topupModal, setTopupModal] = useState(false);

  /* ================= FETCH AD ACCOUNTS ================= */
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/ads-request/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.ok) setAdAccounts(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ typo fixed


  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async (adAccountId) => {
    if (!adAccountId || balances[adAccountId]) return;

    try {
      const res = await fetch(
        `/api/ads-request/balance?ad_account_id=${adAccountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();

      setBalances((prev) => ({
        ...prev,
        [adAccountId]: res.ok ? json : { error: json.error },
      }));
    } catch (err) {
      setBalances((prev) => ({
        ...prev,
        [adAccountId]: { error: err.message },
      }));
    }
  };

  useEffect(() => {
    adAccounts.forEach((acc) => {
      if (acc?.MetaAccountID) fetchBalance(acc.MetaAccountID);
    });
  }, [adAccounts]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="text-black rounded-3xl shadow-xl pb-20 overflow-hidden">
        {/* ---------- HEADER ---------- */}
        <div className="px-6 py-5 flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet />
            <h2 className="text-lg font-semibold">Your Ad Accounts</h2>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search account..."
                className="pl-10 pr-4 py-2 rounded-xl text-sm border border-gray-300"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 ">
              <tr className="divide-gray-200 divide-y">
                <th className="px-6 py-4 text-left">Account</th>
                <th className="px-6 py-4 text-left"> Meta Ad ID</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Spend Cap</th>
                <th className="px-6 py-4 text-left">Spent</th>
                <th className="px-6 py-4 text-left">Remaining</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-gray-200 divide-y">
              {adAccounts.map((account, i) => {
                const balance = balances[account.MetaAccountID];
                const statusMeta =
                  balance && !balance.error
                    ? getAdStatusMeta(balance.status)
                    : null;

                // ✅ FIXED LOGIC (rule based)
                const showIncrease = (userData?.walletBalance || 0) > 0;
                const showTopup = (userData?.walletBalance || 0) === 0;

                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {account.accountName || "N/A"}
                    </td>

                    <td className="px-6 py-4 font-mono text-blue-600">
                      {account.MetaAccountID}
                    </td>

                    <td className="px-6 py-4">
                      {statusMeta ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </span>
                      ) : (
                        <Loader2 className="animate-spin w-4 h-4 text-gray-400" />
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {balance ? `$${balance.spendCap}` : "—"}
                    </td>

                    <td className="px-6 py-4 text-red-500">
                      {balance ? `$${balance.amountSpent}` : "—"}
                    </td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      {balance ? `$${balance.remaining}` : "—"}
                    </td>

                    {/* ======= ACTION ======= */}
                    <td className="px-6 py-4 flex justify-end items-center gap-3">
                      {showIncrease && (
                        <button
                          onClick={() =>
                            setIncreaseModal({
                              open: true,
                              adAccountId: account?.MetaAccountID,
                              oldLimit: balance?.spendCap,
                            })
                          }
                          className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs"
                        >
                          Increase Budget
                        </button>
                      )}

                      {showTopup && (
                        <button
                          onClick={() => setTopupModal(true)}
                          className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs"
                        >
                          Top Up
                        </button>
                      )}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- MODALS ---------- */}
      <IncreaseBudgetModal
        open={increaseModal.open}
        adAccountId={increaseModal.adAccountId}
        oldLimit={increaseModal.oldLimit}
        onClose={() =>
          setIncreaseModal({
            open: false,
            adAccountId: null,
            oldLimit: null,
          })
        }
        onSuccess={() => setBalances({})}
      />

      <TopupModal open={topupModal} onClose={() => setTopupModal(false)} />
    </>
  );
};

export default AdAccountUi;
