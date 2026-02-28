"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RoleGuard } from "@/components/role-guard";
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "@/services/institution-service";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H3, P, Span, Button, Form, Input, Label, Textarea } from "@stylin.js/elements";
import type { Institution } from "@/types";

export default function InstituicoesAdminPage() {
  const isMobile = useIsMobile();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Institution | null>(null);

  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formLat, setFormLat] = useState("");
  const [formLng, setFormLng] = useState("");
  const [formHours, setFormHours] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  async function fetchInstitutions() {
    setLoading(true);
    const data = await getInstitutions();
    setInstitutions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchInstitutions();
  }, []);

  function resetForm() {
    setFormName("");
    setFormAddress("");
    setFormLat("");
    setFormLng("");
    setFormHours("");
    setFormImageUrl("");
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(inst: Institution) {
    setEditing(inst);
    setFormName(inst.name);
    setFormAddress(inst.address);
    setFormLat(String(inst.coordinates.lat));
    setFormLng(String(inst.coordinates.lng));
    setFormHours(inst.operatingHours || "");
    setFormImageUrl(inst.imageUrl || "");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: formName,
      address: formAddress,
      coordinates: { lat: Number(formLat), lng: Number(formLng) },
      operatingHours: formHours,
      imageUrl: formImageUrl,
      services: editing?.services || [],
      availableSlots: editing?.availableSlots || [],
      maxCapacity: editing?.maxCapacity || 20,
    };

    if (editing) {
      await updateInstitution(editing.id, data);
    } else {
      await createInstitution(data);
    }
    resetForm();
    await fetchInstitutions();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteInstitution(deleteTarget.id);
    setDeleteTarget(null);
    await fetchInstitutions();
  }

  const filtered = institutions.filter((inst) => {
    const term = search.toLowerCase();
    return (
      inst.name.toLowerCase().includes(term) ||
      inst.address.toLowerCase().includes(term)
    );
  });

  return (
    <RoleGuard minRole="admin">
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
          + Nova Instituição
        </Button>
      </Div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar por nome ou localização..."
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
            {editing ? "Editar Instituição" : "Nova Instituição"}
          </H3>
          <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="1rem">
            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">Nome</Label>
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
            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">Endereço</Label>
              <Textarea
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                required
                rows={2}
                padding="0.625rem 0.75rem"
                border="1px solid #d0d0d0"
                borderRadius="6px"
                fontSize="0.875rem"
                outline="none"
                fontFamily="inherit"
                resize="vertical"
                nFocus={{ borderColor: "#FFA800" }}
              />
            </Div>
            <Div display="flex" gap="1rem" flexDirection={isMobile ? "column" : "row"}>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formLat}
                  onChange={(e) => setFormLat(e.target.value)}
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
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formLng}
                  onChange={(e) => setFormLng(e.target.value)}
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
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Horário de Funcionamento</Label>
                <Input
                  type="text"
                  value={formHours}
                  onChange={(e) => setFormHours(e.target.value)}
                  placeholder="Ex: 08:00 - 16:00"
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">URL da Imagem</Label>
                <Input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
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
        <P color="#ABABAB">A carregar instituições...</P>
      ) : filtered.length === 0 ? (
        <P color="#ABABAB">Nenhuma instituição encontrada.</P>
      ) : (
        <Div
          display="grid"
          gridTemplateColumns={isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))"}
          gap="1.25rem"
        >
          {filtered.map((inst) => (
            <Div
              key={inst.id}
              bg="#ffffff"
              borderRadius="10px"
              border="1px solid #e0e0e0"
              overflow="hidden"
            >
              <Div
                height="140px"
                bg={inst.imageUrl ? undefined : "#f0f0f0"}
                backgroundImage={inst.imageUrl ? `url(${inst.imageUrl})` : undefined}
                backgroundSize="cover"
                backgroundPosition="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {!inst.imageUrl && (
                  <Span fontSize="2.5rem" color="#ABABAB">🏛️</Span>
                )}
              </Div>
              <Div padding="1.25rem">
                <P fontSize="1rem" fontWeight="600" color="#373737" mb="0.25rem">
                  {inst.name}
                </P>
                <P fontSize="0.8125rem" color="#ABABAB" mb="0.5rem">
                  {inst.address}
                </P>
                {inst.operatingHours && (
                  <Span
                    display="inline-block"
                    fontSize="0.75rem"
                    padding="0.2rem 0.5rem"
                    borderRadius="4px"
                    bg="#FFF3D6"
                    color="#FFA800"
                    mb="0.75rem"
                  >
                    {inst.operatingHours}
                  </Span>
                )}
                <Div display="flex" gap="0.5rem">
                  <Button
                    onClick={() => startEdit(inst)}
                    bg="transparent"
                    border="1px solid #FFA800"
                    color="#FFA800"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    flex="1"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(inst)}
                    bg="transparent"
                    border="1px solid #d32f2f"
                    color="#d32f2f"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    flex="1"
                  >
                    Remover
                  </Button>
                </Div>
              </Div>
            </Div>
          ))}
        </Div>
      )}

      {deleteTarget && (
        <ConfirmationDialog
          title="Remover Instituição"
          message={`Tem a certeza que deseja remover a instituição "${deleteTarget.name}"?`}
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
