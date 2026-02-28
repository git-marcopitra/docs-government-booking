"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, Main } from "@stylin.js/elements";

const ADMIN_ROLES = ["atendente", "supervisor", "admin", "proprietario"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={ADMIN_ROLES}>
      <Div display="flex" flexDirection="column" minHeight="100vh">
        <AdminHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <Div display="flex" flex="1">
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Main flex="1" ml={isMobile ? "0" : "240px"} bg="#f5f5f8">
            {children}
          </Main>
        </Div>
      </Div>
    </AuthGuard>
  );
}
