"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H2, Form, Input, Button, P, Img, Label, Span } from "@stylin.js/elements";

export default function ClientLoginPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { login } = useAuth();
  const [bi, setBi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(bi, password);
      router.push("/agendar");
    } catch {
      setError("Bilhete de Identidade ou password incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <Div
        display="flex"
        minHeight="calc(100vh - 80px)"
        alignItems="center"
        justifyContent="center"
      >
        <Div
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          maxWidth="900px"
          width="100%"
          gap={isMobile ? "2rem" : "4rem"}
          padding="2rem"
          alignItems="center"
        >
          <Div flex="1" display={isMobile ? "none" : "flex"} justifyContent="center">
            <Img
              src="/illustration-login.svg"
              alt="Login Cliente"
              width="100%"
              maxWidth="360px"
            />
          </Div>

          <Div flex="1" maxWidth="400px">
            <H2 fontSize="1.5rem" fontWeight="700" color="#373737" mb="1.5rem">
              Entrar na sua conta
            </H2>

            <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1.25rem">
              <Div display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">
                  Bilhete de Identidade
                </Label>
                <Input
                  type="text"
                  value={bi}
                  onChange={(e) => setBi(e.target.value)}
                  placeholder="Ex: 000000000LA000"
                  required
                  padding="0.75rem 1rem"
                  border="1px solid #d0d0d0"
                  borderRadius="8px"
                  fontSize="0.9375rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>

              <Div display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduza a sua password"
                  required
                  padding="0.75rem 1rem"
                  border="1px solid #d0d0d0"
                  borderRadius="8px"
                  fontSize="0.9375rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>

              {error && (
                <P fontSize="0.8125rem" color="#d32f2f">
                  {error}
                </P>
              )}

              <Button
                type="submit"
                disabled={loading}
                bg="#FFA800"
                color="#ffffff"
                border="none"
                padding="0.75rem"
                borderRadius="8px"
                cursor={loading ? "not-allowed" : "pointer"}
                fontSize="1rem"
                fontWeight="600"
                opacity={loading ? "0.7" : "1"}
              >
                {loading ? "A entrar..." : "Entrar"}
              </Button>
            </Form>

            <P fontSize="0.8125rem" color="#ABABAB" mt="1.25rem" textAlign="center">
              Ainda não tem conta?{" "}
              <Link href="/register">
                <Span color="#FFA800" fontWeight="500">
                  Registar-se
                </Span>
              </Link>
            </P>
          </Div>
        </Div>
      </Div>
    </>
  );
}
