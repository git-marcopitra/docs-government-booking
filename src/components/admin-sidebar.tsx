"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-media-query";
import { ADMIN_NAV_ITEMS, ROLE_LABELS, hasMinRole } from "@/constants";
import { Aside, Div, Span, Nav, Button } from "@stylin.js/elements";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  function handleNavClick() {
    if (isMobile && onClose) onClose();
  }

  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => user && hasMinRole(user.role, item.minRole)
  );

  return (
    <>
      {isMobile && isOpen && (
        <Div
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.4)"
          zIndex="9"
          onClick={onClose}
        />
      )}
      <Aside
        width={isMobile ? "280px" : "240px"}
        bg="#FFA800"
        display="flex"
        flexDirection="column"
        position="fixed"
        top={isMobile ? "0" : "61px"}
        left="0"
        bottom="0"
        zIndex="10"
        transform={isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)"}
        transition="transform 0.3s ease"
      >
        <Nav display="flex" flexDirection="column" padding="1.5rem 0" flex="1" gap="0.25rem">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }} onClick={handleNavClick}>
                <Div
                  padding="1rem 1.5rem"
                  transition="all 0.15s"
                  bg={isActive ? "rgba(255,255,255,0.15)" : "transparent"}
                  textAlign="center"
                  nHover={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Span
                    fontSize="1.25rem"
                    fontWeight={isActive ? "700" : "400"}
                    color="#ffffff"
                  >
                    {item.label}
                  </Span>
                </Div>
              </Link>
            );
          })}
        </Nav>

        {user && (
          <Div
            padding="1rem 1.5rem"
            borderTop="1px solid rgba(255,255,255,0.25)"
            display="flex"
            alignItems="center"
            gap="0.75rem"
          >
            <Div
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="36px"
              height="36px"
              borderRadius="50%"
              bg="#ffffff"
              color="#FFA800"
              fontSize="0.875rem"
              fontWeight="700"
              flexShrink="0"
            >
              {user.nomeCompleto.charAt(0).toUpperCase()}
            </Div>
            <Div overflow="hidden" flex="1">
              <Span
                display="block"
                fontSize="0.8125rem"
                fontWeight="600"
                color="#ffffff"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {user.nomeCompleto}
              </Span>
              <Span display="block" fontSize="0.6875rem" color="rgba(255,255,255,0.75)">
                {ROLE_LABELS[user.role] || user.role}
              </Span>
            </Div>
            <Button
              onClick={handleLogout}
              bg="transparent"
              border="none"
              color="rgba(255,255,255,0.6)"
              padding="0.25rem"
              cursor="pointer"
              fontSize="0.8125rem"
              transition="color 0.15s"
              nHover={{ color: "#ffffff" }}
              title="Sair"
            >
              Sair
            </Button>
          </Div>
        )}
      </Aside>
    </>
  );
}
