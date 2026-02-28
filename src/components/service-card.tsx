"use client";

import Link from "next/link";
import { Div, H3, P } from "@stylin.js/elements";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  categoryId: string;
}

export function ServiceCard({ service, categoryId }: ServiceCardProps) {
  return (
    <Link
      href={`/agendar/${categoryId}/${service.id}`}
      style={{ textDecoration: "none" }}
    >
      <Div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="1.25rem 1.5rem"
        borderRadius="10px"
        border="1px solid #e0e0e0"
        bg="#ffffff"
        cursor="pointer"
        transition="box-shadow 0.2s"
        nHover={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Div>
          <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="0.25rem">
            {service.name}
          </H3>
          <P fontSize="0.8125rem" color="#ABABAB">
            Duração média: {service.averageDuration} min
          </P>
        </Div>
        <Div fontSize="1.25rem" color="#FFA800">→</Div>
      </Div>
    </Link>
  );
}
