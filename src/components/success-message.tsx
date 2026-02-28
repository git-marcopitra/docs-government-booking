"use client";

import { Div, H2, P, Button } from "@stylin.js/elements";

interface SuccessMessageProps {
  serviceName: string;
  institutionName: string;
  date: string;
  time: string;
  onFinish: () => void;
}

export function SuccessMessage({
  serviceName,
  institutionName,
  date,
  time,
  onFinish,
}: SuccessMessageProps) {
  return (
    <Div
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      padding="3rem 2rem"
    >
      <Div
        width="80px"
        height="80px"
        borderRadius="50%"
        bg="#e8f5e9"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb="1.5rem"
        fontSize="2.5rem"
      >
        ✓
      </Div>

      <H2 fontSize="1.5rem" fontWeight="700" color="#2e7d32" mb="0.75rem">
        Agendamento Concluído!
      </H2>

      <P fontSize="0.9375rem" color="#ABABAB" mb="2rem" lineHeight="1.6" maxWidth="400px">
        O seu agendamento para <strong>{serviceName}</strong> foi confirmado
        com sucesso.
      </P>

      <Div
        bg="#f8f9fa"
        borderRadius="10px"
        padding="1.25rem 2rem"
        mb="2rem"
        display="flex"
        flexDirection="column"
        gap="0.5rem"
        width="100%"
        maxWidth="360px"
      >
        <Div display="flex" justifyContent="space-between">
          <P fontSize="0.875rem" color="#ABABAB">Data</P>
          <P fontSize="0.875rem" fontWeight="600" color="#373737">{date}</P>
        </Div>
        <Div display="flex" justifyContent="space-between">
          <P fontSize="0.875rem" color="#ABABAB">Hora</P>
          <P fontSize="0.875rem" fontWeight="600" color="#373737">{time}</P>
        </Div>
        <Div display="flex" justifyContent="space-between">
          <P fontSize="0.875rem" color="#ABABAB">Local</P>
          <P fontSize="0.875rem" fontWeight="600" color="#373737">{institutionName}</P>
        </Div>
      </Div>

      <Button
        onClick={onFinish}
        bg="#FFA800"
        color="#ffffff"
        border="none"
        padding="0.75rem 2rem"
        borderRadius="8px"
        cursor="pointer"
        fontSize="1rem"
        fontWeight="600"
        transition="background 0.2s"
        nHover={{ background: "#E69500" }}
      >
        Concluir
      </Button>
    </Div>
  );
}
