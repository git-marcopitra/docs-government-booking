"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { Div, H2, Form, Input, Button, P, Label } from "@stylin.js/elements";

export default function PerfilPage() {
  const { user } = useAuth();
  const [telefone, setTelefone] = useState(user?.telefone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    await updateDoc(doc(db, "users", user.uid), {
      telefone: telefone || null,
      email: email || null,
    });
    setSuccess(true);
    setSaving(false);
  }

  if (!user) {
    return <P color="#ABABAB">A carregar perfil...</P>;
  }

  return (
    <Div maxWidth="480px">
      <H2 fontSize="1.25rem" fontWeight="600" color="#373737" mb="1.5rem">
        Perfil
      </H2>

      <Div mb="1.5rem">
        <Div display="flex" flexDirection="column" gap="0.75rem">
          <Div>
            <P fontSize="0.8125rem" color="#ABABAB">Nome Completo</P>
            <P fontSize="1rem" fontWeight="500" color="#373737">{user.nomeCompleto}</P>
          </Div>
          <Div>
            <P fontSize="0.8125rem" color="#ABABAB">Bilhete de Identidade</P>
            <P fontSize="1rem" fontWeight="500" color="#373737">{user.bilheteIdentidade}</P>
          </Div>
        </Div>
      </Div>

      <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1.25rem">
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

        {success && (
          <P fontSize="0.8125rem" color="#2e7d32">
            Perfil actualizado com sucesso.
          </P>
        )}

        <Button
          type="submit"
          disabled={saving}
          bg="#FFA800"
          color="#ffffff"
          border="none"
          padding="0.75rem"
          borderRadius="8px"
          cursor={saving ? "not-allowed" : "pointer"}
          fontSize="1rem"
          fontWeight="600"
          opacity={saving ? "0.7" : "1"}
        >
          {saving ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </Form>
    </Div>
  );
}
