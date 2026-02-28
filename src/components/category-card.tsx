"use client";

import Link from "next/link";
import { Div, H3, P } from "@stylin.js/elements";
import type { CategoryInfo } from "@/constants";

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/agendar/${category.id}`} style={{ textDecoration: "none" }}>
      <Div
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="2rem"
        borderRadius="12px"
        border="1px solid #e0e0e0"
        bg="#ffffff"
        cursor="pointer"
        textAlign="center"
        transition="box-shadow 0.2s, transform 0.2s"
        nHover={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        }}
      >
        <Div
          width="64px"
          height="64px"
          bg="#FFF3D6"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb="1rem"
        >
          <Div fontSize="1.5rem">📄</Div>
        </Div>
        <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="0.5rem">
          {category.label}
        </H3>
        <P fontSize="0.8125rem" color="#ABABAB" lineHeight="1.4">
          {category.description}
        </P>
      </Div>
    </Link>
  );
}
