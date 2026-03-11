"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardMouseGlow from "@/components/DashboardMouseGlow";
import Loader from "@/components/Loader";
import TeamMemberSidebar from "@/components/TeamMemberSidebar";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";

export default function TeamMemberLayout({ children }) {
  const router = useRouter();
  const { authReady, loadingRole, user, role } = useFirebaseAuth();

  useEffect(() => {
    if (!authReady || loadingRole) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "team_member") return;

    if (role === "admin" || role === "manager") {
      router.replace("/admin-dashboard/overview");
      return;
    }

    router.replace("/user-dashboard/overview");
  }, [authReady, loadingRole, role, router, user]);

  if (!authReady || loadingRole || !user || role !== "team_member") {
    return <Loader />;
  }

  return (
    <div className="dashboard-shell neon-grid flex h-screen w-full overflow-hidden">
      <DashboardMouseGlow />
      <TeamMemberSidebar />
      <div className="dashboard-content min-w-0 flex-1 overflow-y-auto pt-16 lg:pt-0">{children}</div>
    </div>
  );
}
