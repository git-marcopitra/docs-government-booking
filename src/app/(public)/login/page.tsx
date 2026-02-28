"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { FirstLoginError } from "@/services/auth-service";
import { Header } from "@/components/header";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H2, Form, Input, Button, P, Img, Label } from "@stylin.js/elements";

export default function AdminLoginPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { loginAdmin, setupCollaboratorPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (firstLogin) {
        if (password !== confirmPassword) {
          setError("As passwords não coincidem.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("A password deve ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }
        await setupCollaboratorPassword(email, password);
        router.push("/admin");
      } else {
        await loginAdmin(email, password);
        router.push("/admin");
      }
    } catch (err) {
      if (err instanceof FirstLoginError) {
        setFirstLogin(true);
        setPassword("");
        setError("");
      } else {
        setError("Email ou password incorretos, ou acesso não autorizado.");
      }
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
              alt="Login Administrador"
              width="100%"
              maxWidth="360px"
            />
          </Div>

          <Div flex="1" maxWidth="400px">
            <H2 fontSize="1.5rem" fontWeight="700" color="#373737" mb="0.25rem">
              {firstLogin ? "Criar Password" : "Painel do Administrador"}
            </H2>
            <P fontSize="0.875rem" color="#ABABAB" mb="1.5rem">
              {firstLogin
                ? "Primeiro acesso — crie a sua password"
                : "Acesso restrito a administradores"}
            </P>

            <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1.25rem">
              <Div display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gov.ao"
                  required
                  disabled={firstLogin}
                  padding="0.75rem 1rem"
                  border="1px solid #d0d0d0"
                  borderRadius="8px"
                  fontSize="0.9375rem"
                  outline="none"
                  bg={firstLogin ? "#f5f5f5" : "#ffffff"}
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>

              <Div display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">
                  {firstLogin ? "Nova Password" : "Password"}
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={firstLogin ? "Crie a sua password" : "Introduza a sua password"}
                  required
                  padding="0.75rem 1rem"
                  border="1px solid #d0d0d0"
                  borderRadius="8px"
                  fontSize="0.9375rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>

              {firstLogin && (
                <Div display="flex" flexDirection="column" gap="0.375rem">
                  <Label fontSize="0.875rem" fontWeight="500" color="#555">
                    Confirmar Password
                  </Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a sua password"
                    required
                    padding="0.75rem 1rem"
                    border="1px solid #d0d0d0"
                    borderRadius="8px"
                    fontSize="0.9375rem"
                    outline="none"
                    nFocus={{ borderColor: "#FFA800" }}
                  />
                </Div>
              )}

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
                {loading
                  ? (firstLogin ? "A criar..." : "A entrar...")
                  : (firstLogin ? "Criar Password e Entrar" : "Entrar")}
              </Button>

              {firstLogin && (
                <Button
                  type="button"
                  onClick={() => { setFirstLogin(false); setPassword(""); setConfirmPassword(""); setError(""); }}
                  bg="transparent"
                  border="none"
                  color="#ABABAB"
                  padding="0"
                  cursor="pointer"
                  fontSize="0.8125rem"
                  textAlign="center"
                >
                  Voltar ao login
                </Button>
              )}
            </Form>
          </Div>
        </Div>
      </Div>
    </>
  );
}
