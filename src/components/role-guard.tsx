"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { hasMinRole } from "@/constants";
import { Div, P } from "@stylin.js/elements";

interface RoleGuardProps {
  children: React.ReactNode;
  minRole: string;
}

export function RoleGuard({ children, minRole }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !hasMinRole(user.role, minRole)) {
      router.replace("/admin");
    }
  }, [user, loading, minRole, router]);

  if (loading) {
    return (
      <Div display="flex" alignItems="center" justifyContent="center" padding="4rem">
        <P color="#ABABAB">A carregar...</P>
      </Div>
    );
  }

  if (!user || !hasMinRole(user.role, minRole)) return null;

  return <>{children}</>;
}
