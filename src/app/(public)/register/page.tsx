"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Div, H2, Form, Input, Button, P, Label, Span } from "@stylin.js/elements";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [bi, setBi] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(
        bi,
        password,
        nomeCompleto,
        telefone || undefined,
        email || undefined
      );
      router.push("/agendar");
    } catch {
      setError("Erro ao registar. Verifique os dados e tente novamente.");
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
        padding="2rem"
      >
        <Div maxWidth="440px" width="100%">
          <H2 fontSize="1.5rem" fontWeight="700" color="#373737" mb="1.5rem" textAlign="center">
            Criar Conta
          </H2>

          <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1.25rem">
            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">
                Bilhete de Identidade *
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
                Nome Completo *
              </Label>
              <Input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Introduza o seu nome completo"
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
                Telefone
              </Label>
              <Input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: +244 900 000 000"
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
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: nome@email.com"
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
                Password *
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
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
              {loading ? "A registar..." : "Registar"}
            </Button>
          </Form>

          <P fontSize="0.8125rem" color="#ABABAB" mt="1.25rem" textAlign="center">
            Já tem conta?{" "}
            <Link href="/login">
              <Span color="#FFA800" fontWeight="500">
                Entrar
              </Span>
            </Link>
          </P>
        </Div>
      </Div>
    </>
  );
}
