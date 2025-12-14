"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Users,
  Copy,
  Check,
  TrendingUp,
  Wallet,
  Gift,
  ArrowRight,
} from "lucide-react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import WithdrawModal from "@/components/WithdrawModal"; // Ensure this path is correct

/* ================= CONFIG ================= */
const LEVEL1_MILESTONES = [
  { count: 10, reward: 50 },
  { count: 25, reward: 150 },
  { count: 50, reward: 400 },
];
const MIN_TOPUP_FOR_COMMISSION = 2000; // $2000 total topup for commission

export default function AffiliatePage() {
  const { userData } = useFirebaseAuth();
  const [copied, setCopied] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  /* ================= BACKEND DATA ================= */
  const totalReferIncome = userData?.referralStats?.totalReferIncome || 0;
  const totalPayout = userData?.referralStats?.totalPayout || 0;
  const totalReferrers = userData?.referralStats?.totalReferrers || 0;

  // Level 1 completed referrals (users who hit the $2000 topup threshold)
  const completedUsers = userData?.level1DepositCount || 0; 
  // NOTE: Assuming userData?.level1DepositCount is the count of users who hit the threshold

  /* ================= REFERRAL LINK ================= */
  const referralLink = `https://neonstudio.com/ref/${
    userData?.referralCode || "loading..."
  }`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= UI RENDER ================= */
  return (
    <div className="p-4 md:p-10 space-y-12 max-w-7xl mx-auto">
      
      {/* ================= HEADER & WITHDRAW ACTION ================= */}
      <div className="py-20 md:pt-0 flex flex-col md:flex-row justify-between items-start  gap-5 border-b pb-3 border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Partnership Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Earn <b>$10</b> per referral who completes <b>${MIN_TOPUP_FOR_COMMISSION} total topup</b>.
          </p>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
        >
           Withdraw Funds
        </button>
      </div>

      {/* ================= STATS CARD SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Referral Income"
          value={`$${totalReferIncome}`}
          sub="Direct commissions & rewards"
          icon={DollarSign}
          color="indigo"
        />
        <StatCard
          label="Milestone Rewards Claimed"
          value={`$${totalPayout}`}
          sub="Total milestone bonus paid"
          icon={Gift}
          color="teal"
        />
        <StatCard
          label="Total Referrals"
          value={totalReferrers}
          sub="Users joined using your code"
          icon={Users}
          color="pink"
        />
      </div>

      {/* ================= REFERRAL LINK & PRO TIP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Referral Link Card */}
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl text-white shadow-xl">
          <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
            <Copy size={18} className="text-lime-400"/> Your Unique Referral Link
          </h3>

          <div className="flex bg-gray-700 rounded-xl p-1.5 border border-gray-600">
            <input
              value={referralLink}
              readOnly
              className="bg-transparent flex-1 px-4 text-sm outline-none overflow-hidden truncate"
            />
            <button
              onClick={copyLink}
              className={`flex items-center gap-2 text-sm font-semibold p-2 rounded-lg transition duration-200 ${
                copied 
                  ? "bg-green-500 text-white" 
                  : "bg-lime-400 text-gray-900 hover:bg-lime-300"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
        
        {/* Pro Tip Card */}
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200 shadow-md">
          <h4 className="font-bold text-purple-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-600" /> Growth Strategy
          </h4>
          <p className="text-sm text-purple-700 mt-2">
            Focus on quality! Every completed referral brings you closer to massive milestone rewards 🚀.
          </p>
        </div>
      </div>

      {/* ================= MILESTONES & THRESHOLD PROGRESS ================= */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Milestones & Progress
        </h2>

        {/* Referral Threshold Progress */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500"/> $10 Commission Threshold Progress
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-3 transition-all duration-500 ease-in-out"
              style={{
                width: `${Math.min(
                    (completedUsers / LEVEL1_MILESTONES[0].count) * 100, // Using the smallest milestone as the visual target
                    100
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span className="font-semibold text-gray-700">
              {completedUsers} users have met the ${MIN_TOPUP_FOR_COMMISSION} top-up requirement.
            </span>

            <span className="text-gray-500 font-semibold">
              {Math.min(completedUsers, LEVEL1_MILESTONES[LEVEL1_MILESTONES.length - 1].count)} / {LEVEL1_MILESTONES[LEVEL1_MILESTONES.length - 1].count} (Max Milestone Target)
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Users must complete ${MIN_TOPUP_FOR_COMMISSION} total topup for you to earn the $10 commission and count towards milestones.
          </p>
        </div>
        
        {/* MILESTONES CARDS */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
           Milestones Rewards
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {LEVEL1_MILESTONES.map((m, i) => {
              const progress = Math.min(
                (completedUsers / m.count) * 100,
                100
              ).toFixed(0);

              const completed = completedUsers >= m.count;

              return (
                <div
                  key={i}
                  className={`bg-white border rounded-2xl p-6 shadow-md transition duration-300 ${
                    completed 
                      ? "border-green-500 ring-4 ring-green-50 ring-opacity-50" 
                      : "border-gray-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-2xl text-gray-900">
                      {m.count} Referrals
                    </h3>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        completed
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      Bonus ${m.reward}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-2 transition-all duration-500 ${
                        completed ? "bg-green-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-semibold mt-2">
                    <span className="text-gray-700">
                      {completedUsers} / {m.count}
                    </span>
                    <span className="text-gray-500">{progress}% Done</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Goal: Earn <b>${m.reward}</b> bonus when you reach{" "}
                    <b>{m.count}</b> qualifying referrals.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ================= WITHDRAW MODAL ================= */}
      {withdrawOpen && (
        <WithdrawModal
          balance={totalReferIncome}
          onClose={() => setWithdrawOpen(false)}
        />
      )}
    </div>
  );
}

/* ================= SMALL COMPONENT (Gradient Stat Card) ================= */
const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const gradientStyles = {
    indigo: "from-indigo-500 to-blue-500",
    teal: "from-teal-500 to-green-500",
    pink: "from-pink-500 to-red-500",
  };
  const bg = gradientStyles[color] || gradientStyles.indigo;

  return (
    <div className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-xl transition duration-300 hover:shadow-2xl`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
            </div>
            
            {/* Gradient Icon */}
            <div className={`p-3 rounded-full bg-gradient-to-br ${bg} shadow-md`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>
    </div>
  );
};