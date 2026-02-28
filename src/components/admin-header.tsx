"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-media-query";
import { Header as StyledHeader, Img, Span, Div, Button } from "@stylin.js/elements";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/marcacoes": "Marcações",
  "/admin/instituicoes": "Instituições",
  "/admin/servicos": "Serviços",
  "/admin/colaboradores": "Colaboradores",
};

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const title = PAGE_TITLES[pathname] || "Painel";

  return (
    <StyledHeader
      display="flex"
      alignItems="center"
      gap={isMobile ? "0.75rem" : "1.25rem"}
      padding={isMobile ? "0.75rem 1rem" : "1rem 2rem"}
      bg="#ffffff"
      borderBottom="1px solid #e0e0e0"
      width="100%"
      position="relative"
      zIndex="20"
    >
      {isMobile && (
        <Button
          onClick={onMenuToggle}
          bg="transparent"
          border="none"
          cursor="pointer"
          fontSize="1.5rem"
          padding="0.25rem"
          color="#373737"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          ☰
        </Button>
      )}
      <Link href="/admin">
        <Img src="/logo.png" alt="Gov Booking" height="36px" />
      </Link>
      <Div width="1px" height="24px" bg="#e0e0e0" />
      <Span fontSize={isMobile ? "1rem" : "1.125rem"} fontWeight="600" color="#373737">
        {title}
      </Span>
    </StyledHeader>
  );
}
