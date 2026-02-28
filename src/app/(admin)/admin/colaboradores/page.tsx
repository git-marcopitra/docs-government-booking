"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RoleGuard } from "@/components/role-guard";
import {
  getCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from "@/services/collaborator-service";
import { getInstitutions } from "@/services/institution-service";
import { ROLE_LABELS } from "@/constants";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H3, P, Span, Button, Form, Input, Label, Select, Option } from "@stylin.js/elements";
import type { Collaborator, Institution, UserRole } from "@/types";

const ADMIN_ROLES: { value: Exclude<UserRole, "citizen">; label: string; description: string }[] = [
  { value: "atendente", label: "Atendente", description: "Pode apenas atender clientes nas instituições/serviços atribuídos" },
  { value: "supervisor", label: "Supervisor", description: "Atendente + pode gerir serviços nas instituições atribuídas" },
  { value: "admin", label: "Administrador", description: "Supervisor + pode gerir instituições" },
  { value: "proprietario", label: "Proprietário", description: "Administrador + pode gerir colaboradores" },
];

export default function ColaboradoresAdminPage() {
  const isMobile = useIsMobile();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collaborator | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collaborator | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<Exclude<UserRole, "citizen">>("atendente");
  const [formInstitutions, setFormInstitutions] = useState<string[]>([]);

  async function fetchData() {
    setLoading(true);
    const [collabData, instData] = await Promise.all([
      getCollaborators(),
      getInstitutions(),
    ]);
    setCollaborators(collabData);
    setInstitutions(instData);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function resetForm() {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("atendente");
    setFormInstitutions([]);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(collab: Collaborator) {
    setEditing(collab);
    setFormName(collab.nomeCompleto);
    setFormEmail(collab.email);
    setFormPhone(collab.telefone || "");
    setFormRole(collab.role);
    setFormInstitutions(collab.institutionIds);
    setShowForm(true);
  }

  function toggleInstitution(instId: string) {
    setFormInstitutions((prev) =>
      prev.includes(instId) ? prev.filter((id) => id !== instId) : [...prev, instId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      nomeCompleto: formName,
      email: formEmail,
      telefone: formPhone || undefined,
      role: formRole,
      institutionIds: formInstitutions,
      serviceIds: editing?.serviceIds || [],
    };

    if (editing) {
      await updateCollaborator(editing.uid, data);
    } else {
      await createCollaborator(data);
    }
    resetForm();
    await fetchData();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteCollaborator(deleteTarget.uid);
    setDeleteTarget(null);
    await fetchData();
  }

  const filtered = collaborators.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.nomeCompleto.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  function getInstitutionNames(ids: string[]): string {
    return ids
      .map((id) => institutions.find((i) => i.id === id)?.name || id)
      .join(", ");
  }

  const roleColorMap: Record<string, string> = {
    atendente: "#1a73e8",
    supervisor: "#2e7d32",
    admin: "#FFA800",
    proprietario: "#7b1fa2",
  };

  return (
    <RoleGuard minRole="proprietario">
    <Div padding={isMobile ? "1rem" : "2rem"}>
      <Div display="flex" justifyContent="flex-end" mb="1.5rem">
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          bg="#FFA800"
          color="#ffffff"
          border="none"
          padding="0.5rem 1.25rem"
          borderRadius="6px"
          cursor="pointer"
          fontSize="0.875rem"
          fontWeight="600"
          nHover={{ background: "#E69500" }}
        >
          + Novo Colaborador
        </Button>
      </Div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar por nome ou email..."
      />

      {showForm && (
        <Div
          bg="#ffffff"
          borderRadius="10px"
          padding="1.5rem"
          mb="1.5rem"
          border="1px solid #e0e0e0"
        >
          <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="1rem">
            {editing ? "Editar Colaborador" : "Novo Colaborador"}
          </H3>
          <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1rem">
            <Div display="flex" gap="1rem" flexDirection={isMobile ? "column" : "row"}>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Nome Completo</Label>
                <Input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Email</Label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
            </Div>
            <Div display="flex" gap="1rem" flexDirection={isMobile ? "column" : "row"}>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Telefone</Label>
                <Input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+244 ..."
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Cargo</Label>
                <Select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as Exclude<UserRole, "citizen">)}
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  bg="#ffffff"
                  nFocus={{ borderColor: "#FFA800" }}
                >
                  {ADMIN_ROLES.map((r) => (
                    <Option key={r.value} value={r.value}>
                      {r.label}
                    </Option>
                  ))}
                </Select>
              </Div>
            </Div>

            <Div
              bg="#f9f9f9"
              padding="0.75rem"
              borderRadius="6px"
              fontSize="0.8125rem"
              color="#ABABAB"
            >
              {ADMIN_ROLES.find((r) => r.value === formRole)?.description}
            </Div>

            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">
                Instituições Atribuídas
              </Label>
              <Div display="flex" flexWrap="wrap" gap="0.5rem">
                {institutions.map((inst) => {
                  const isSelected = formInstitutions.includes(inst.id);
                  return (
                    <Button
                      key={inst.id}
                      type="button"
                      onClick={() => toggleInstitution(inst.id)}
                      bg={isSelected ? "#FFA800" : "#ffffff"}
                      color={isSelected ? "#ffffff" : "#373737"}
                      border={isSelected ? "1px solid #FFA800" : "1px solid #d0d0d0"}
                      padding="0.375rem 0.75rem"
                      borderRadius="6px"
                      cursor="pointer"
                      fontSize="0.8125rem"
                      transition="all 0.15s"
                    >
                      {inst.name}
                    </Button>
                  );
                })}
                {institutions.length === 0 && (
                  <Span fontSize="0.8125rem" color="#ABABAB">
                    Nenhuma instituição disponível
                  </Span>
                )}
              </Div>
            </Div>

            <Div display="flex" gap="0.75rem">
              <Button
                type="submit"
                bg="#FFA800"
                color="#ffffff"
                border="none"
                padding="0.5rem 1.25rem"
                borderRadius="6px"
                cursor="pointer"
                fontSize="0.875rem"
                fontWeight="600"
              >
                {editing ? "Guardar" : "Criar"}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                bg="transparent"
                border="1px solid #d0d0d0"
                color="#ABABAB"
                padding="0.5rem 1.25rem"
                borderRadius="6px"
                cursor="pointer"
                fontSize="0.875rem"
              >
                Cancelar
              </Button>
            </Div>
          </Form>
        </Div>
      )}

      {loading ? (
        <P color="#ABABAB">A carregar colaboradores...</P>
      ) : filtered.length === 0 ? (
        <P color="#ABABAB">Nenhum colaborador encontrado.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem">
          {filtered.map((collab) => (
            <Div
              key={collab.uid}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              justifyContent="space-between"
              gap={isMobile ? "0.75rem" : "0"}
              padding="1rem 1.25rem"
              borderRadius="8px"
              border="1px solid #e0e0e0"
              bg="#ffffff"
            >
              <Div display="flex" alignItems="center" gap="1rem">
                <Div
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="40px"
                  height="40px"
                  borderRadius="50%"
                  bg={`${roleColorMap[collab.role] || "#FFA800"}15`}
                  color={roleColorMap[collab.role] || "#FFA800"}
                  fontSize="0.875rem"
                  fontWeight="700"
                >
                  {collab.nomeCompleto.charAt(0).toUpperCase()}
                </Div>
                <Div>
                  <P fontSize="1rem" fontWeight="600" color="#373737">
                    {collab.nomeCompleto}
                  </P>
                  <Div display="flex" gap="1rem" mt="0.125rem">
                    <Span fontSize="0.8125rem" color="#ABABAB">
                      {collab.email}
                    </Span>
                    <Span
                      fontSize="0.75rem"
                      padding="0.15rem 0.5rem"
                      borderRadius="4px"
                      bg={`${roleColorMap[collab.role] || "#FFA800"}15`}
                      color={roleColorMap[collab.role] || "#FFA800"}
                      fontWeight="600"
                    >
                      {ROLE_LABELS[collab.role] || collab.role}
                    </Span>
                  </Div>
                  {collab.institutionIds.length > 0 && (
                    <P fontSize="0.75rem" color="#ABABAB" mt="0.25rem">
                      {getInstitutionNames(collab.institutionIds)}
                    </P>
                  )}
                </Div>
              </Div>
              <Div display="flex" gap="0.5rem" width={isMobile ? "100%" : "auto"}>
                <Button
                  onClick={() => startEdit(collab)}
                  bg="transparent"
                  border="1px solid #FFA800"
                  color="#FFA800"
                  padding="0.375rem 0.75rem"
                  borderRadius="6px"
                  cursor="pointer"
                  fontSize="0.8125rem"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => setDeleteTarget(collab)}
                  bg="transparent"
                  border="1px solid #d32f2f"
                  color="#d32f2f"
                  padding="0.375rem 0.75rem"
                  borderRadius="6px"
                  cursor="pointer"
                  fontSize="0.8125rem"
                >
                  Remover
                </Button>
              </Div>
            </Div>
          ))}
        </Div>
      )}

      {deleteTarget && (
        <ConfirmationDialog
          title="Remover Colaborador"
          message={`Tem a certeza que deseja remover o colaborador "${deleteTarget.nomeCompleto}"?`}
          confirmLabel="Sim, remover"
          cancelLabel="Não"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Div>
    </RoleGuard>
  );
}
