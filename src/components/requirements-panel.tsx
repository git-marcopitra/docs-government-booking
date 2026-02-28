"use client";

import { Div, H3, Ul, Li, P } from "@stylin.js/elements";
import type { Service } from "@/types";

interface RequirementsPanelProps {
  service: Service;
}

export function RequirementsPanel({ service }: RequirementsPanelProps) {
  return (
    <Div
      bg="#f8f9fa"
      borderRadius="10px"
      padding="1.5rem"
      height="fit-content"
    >
      <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="1rem">
        Requisitos para {service.name}
      </H3>
      <P fontSize="0.875rem" color="#ABABAB" mb="1rem" lineHeight="1.5">
        Para dar continuidade ao processo após o agendamento, apresente os
        seguintes documentos:
      </P>
      <Ul
        listStyle="none"
        padding="0"
        margin="0"
        display="flex"
        flexDirection="column"
        gap="0.5rem"
      >
        {service.requirements.map((req, index) => (
          <Li
            key={index}
            display="flex"
            alignItems="center"
            gap="0.5rem"
            fontSize="0.875rem"
            color="#444"
          >
            <Div
              width="6px"
              height="6px"
              borderRadius="50%"
              bg="#FFA800"
              flexShrink="0"
            />
            {req}
          </Li>
        ))}
      </Ul>
    </Div>
  );
}
