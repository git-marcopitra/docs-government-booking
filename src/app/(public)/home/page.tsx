"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Div, H1, P, Span, Img } from "@stylin.js/elements";

export default function HomePage() {
  return (
    <>
      <Header />
      <Div
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="4rem 2rem"
        textAlign="center"
        minHeight="calc(100vh - 80px)"
      >
        <Img
          src="/illustration-home.svg"
          alt="Agendamento de serviços"
          width="320px"
          maxWidth="100%"
          mb="2rem"
        />

        <H1
          fontSize="2rem"
          fontWeight="700"
          color="#373737"
          mb="0.75rem"
        >
          Bem-vindo ao Gov Booking
        </H1>

        <P
          fontSize="1.0625rem"
          color="#ABABAB"
          mb="2.5rem"
          maxWidth="480px"
          lineHeight="1.6"
        >
          Agende os seus serviços governamentais de forma rápida e prática.
          Documentação pessoal, habitacional, automóvel e comercial.
        </P>

        <Link href="/login/cliente">
          <Span
            display="inline-block"
            bg="#FFA800"
            color="#ffffff"
            padding="0.875rem 2.5rem"
            borderRadius="8px"
            cursor="pointer"
            fontSize="1.0625rem"
            fontWeight="600"
            transition="background 0.2s"
            nHover={{ background: "#E69500" }}
          >
            Agendar
          </Span>
        </Link>
      </Div>
    </>
  );
}
