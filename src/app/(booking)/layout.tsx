"use client";

import { Header } from "@/components/header";
import { NavBar } from "@/components/nav-bar";
import { DashboardHero } from "@/components/dashboard-hero";
import { AuthGuard } from "@/components/auth-guard";
import { useIsMobile } from "@/hooks/use-media-query";
import { NAV_ITEMS } from "@/constants";
import { Main } from "@stylin.js/elements";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <AuthGuard allowedRoles={["citizen"]}>
      <Header />
      <DashboardHero />
      <NavBar items={NAV_ITEMS} />
      <Main maxWidth="1100px" mx="auto" padding={isMobile ? "1rem" : "2rem"}>
        {children}
      </Main>
    </AuthGuard>
  );
}
