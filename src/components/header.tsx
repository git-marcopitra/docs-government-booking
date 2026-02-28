"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-media-query";
import { Header as StyledHeader, Div, Button, Span, Img } from "@stylin.js/elements";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <StyledHeader
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      padding={isMobile ? "0.75rem 1rem" : "1rem 2rem"}
      borderBottom="1px solid #e0e0e0"
      bg="#ffffff"
    >
      <Link href="/">
        <Img src="/logo.png" alt="Gov Booking" height="40px" />
      </Link>

      <Div position="absolute" right={isMobile ? "0.75rem" : "2rem"} display="flex" alignItems="center" gap={isMobile ? "0.5rem" : "1rem"}>
        {user ? (
          <>
            {!isMobile && (
              <Span fontSize="0.875rem" color="#373737">
                {user.nomeCompleto}
              </Span>
            )}
            <Button
              onClick={handleLogout}
              bg="transparent"
              border="1px solid #FFA800"
              color="#FFA800"
              padding="0.5rem 1rem"
              borderRadius="6px"
              cursor="pointer"
              fontSize="0.875rem"
            >
              Sair
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Span
              display="inline-block"
              bg="#FFA800"
              color="#ffffff"
              padding="0.5rem 1.5rem"
              borderRadius="6px"
              cursor="pointer"
              fontSize="0.875rem"
              fontWeight="600"
            >
              Entrar
            </Span>
          </Link>
        )}
      </Div>
    </StyledHeader>
  );
}
