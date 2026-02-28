"use client";

import { Div, H3, P, Button, Span } from "@stylin.js/elements";
import type { Institution } from "@/types";

interface InstitutionCardProps {
  institution: Institution;
  isPinned: boolean;
  onSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function InstitutionCard({
  institution,
  isPinned,
  onSelect,
  onTogglePin,
}: InstitutionCardProps) {
  return (
    <Div
      display="flex"
      flexDirection="column"
      gap="0.75rem"
      padding="1.25rem"
      borderRadius="10px"
      border="1px solid #e0e0e0"
      bg="#ffffff"
    >
      <Div display="flex" justifyContent="space-between" alignItems="flex-start">
        <Div>
          <H3 fontSize="1rem" fontWeight="600" color="#373737">
            {institution.name}
          </H3>
          <P fontSize="0.8125rem" color="#ABABAB" mt="0.25rem">
            {institution.address}
          </P>
        </Div>
        <Button
          onClick={() => onTogglePin(institution.id)}
          bg="transparent"
          border="none"
          cursor="pointer"
          fontSize="1.25rem"
          padding="0.25rem"
          title={isPinned ? "Desafixar" : "Afixar"}
        >
          <Span>{isPinned ? "📌" : "📍"}</Span>
        </Button>
      </Div>

      <Button
        onClick={() => onSelect(institution.id)}
        bg="#FFA800"
        color="#ffffff"
        border="none"
        padding="0.625rem 1.25rem"
        borderRadius="6px"
        cursor="pointer"
        fontSize="0.875rem"
        fontWeight="600"
        width="100%"
        transition="background 0.2s"
        nHover={{ background: "#E69500" }}
      >
        Agendar aqui
      </Button>
    </Div>
  );
}
