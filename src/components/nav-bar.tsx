"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, Div, Span } from "@stylin.js/elements";
import { useIsMobile } from "@/hooks/use-media-query";

interface NavItem {
  label: string;
  href: string;
}

interface NavBarProps {
  items: readonly NavItem[];
}

export function NavBar({ items }: NavBarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <Nav
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      gap={isMobile ? "0.5rem" : "2rem"}
      padding={isMobile ? "0.5rem 0.75rem" : "0.75rem 2rem"}
      bg="#ffffff"
      maxWidth={isMobile ? "100%" : "700px"}
      mx="auto"
      borderRadius="10px"
      mt="-1.5rem"
      position="relative"
      zIndex="1"
      boxShadow="0 2px 12px rgba(0,0,0,0.08)"
    >
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <Div
              padding={isMobile ? "0.375rem 0.5rem" : "0.5rem 1rem"}
              borderBottom={isActive ? "2px solid #FFA800" : "2px solid transparent"}
            >
              <Span
                fontSize={isMobile ? "0.8125rem" : "0.9375rem"}
                fontWeight={isActive ? "600" : "400"}
                color={isActive ? "#FFA800" : "#ABABAB"}
              >
                {item.label}
              </Span>
            </Div>
          </Link>
        );
      })}
    </Nav>
  );
}
