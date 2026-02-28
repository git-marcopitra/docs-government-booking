"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RoleGuard } from "@/components/role-guard";
import {
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
} from "@/services/service-service";
import {
  getInstitutions,
  addServiceToInstitution,
  removeServiceFromInstitution,
} from "@/services/institution-service";
import { SERVICE_CATEGORIES } from "@/constants";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H3, P, Span, Button, Form, Input, Label, Select, Option, Textarea } from "@stylin.js/elements";
import type { Service, ServiceCategory, Institution } from "@/types";

export default function ServicosAdminPage() {
  const isMobile = useIsMobile();
  const [services, setServices] = useState<Service[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("documentacao-pessoal");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState("30");
  const [formCapacity, setFormCapacity] = useState("10");
  const [formRequirements, setFormRequirements] = useState("");
  const [formInstitutions, setFormInstitutions] = useState<string[]>([]);

  async function fetchData() {
    setLoading(true);
    const [servicesData, institutionsData] = await Promise.all([
      getServicesByCategory(selectedCategory),
      getInstitutions(),
    ]);
    setServices(servicesData);
    setInstitutions(institutionsData);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  function resetForm() {
    setFormName("");
    setFormDuration("30");
    setFormCapacity("10");
    setFormRequirements("");
    setFormInstitutions([]);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(service: Service) {
    setEditing(service);
    setFormName(service.name);
    setFormDuration(String(service.averageDuration));
    setFormCapacity(String(service.maxCapacity));
    setFormRequirements(service.requirements.join("\n"));
    setFormInstitutions(
      institutions.filter((i) => i.services.includes(service.id)).map((i) => i.id)
    );
    setShowForm(true);
  }

  function toggleInstitution(instId: string) {
    setFormInstitutions((prev) =>
      prev.includes(instId) ? prev.filter((id) => id !== instId) : [...prev, instId]
    );
  }

  function getServiceInstitutions(serviceId: string): string[] {
    return institutions.filter((i) => i.services.includes(serviceId)).map((i) => i.id);
  }

  function getInstitutionNames(serviceId: string): string {
    return institutions
      .filter((i) => i.services.includes(serviceId))
      .map((i) => i.name)
      .join(", ");
  }

  async function syncInstitutions(serviceId: string, newInstIds: string[]) {
    const currentInstIds = getServiceInstitutions(serviceId);
    const toAdd = newInstIds.filter((id) => !currentInstIds.includes(id));
    const toRemove = currentInstIds.filter((id) => !newInstIds.includes(id));

    await Promise.all([
      ...toAdd.map((instId) => addServiceToInstitution(instId, serviceId)),
      ...toRemove.map((instId) => removeServiceFromInstitution(instId, serviceId)),
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: formName,
      category: selectedCategory,
      averageDuration: Number(formDuration),
      maxCapacity: Number(formCapacity),
      requirements: formRequirements.split("\n").filter(Boolean),
    };

    if (editing) {
      await updateService(editing.id, data);
      await syncInstitutions(editing.id, formInstitutions);
    } else {
      const newId = await createService(data);
      await Promise.all(
        formInstitutions.map((instId) => addServiceToInstitution(instId, newId))
      );
    }
    resetForm();
    await fetchData();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const linkedInsts = getServiceInstitutions(deleteTarget.id);
    await Promise.all(
      linkedInsts.map((instId) => removeServiceFromInstitution(instId, deleteTarget.id))
    );
    await deleteService(deleteTarget.id);
    setDeleteTarget(null);
    await fetchData();
  }

  const filtered = services.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(term);
    if (selectedInstitution === "all") return matchesSearch;
    const inst = institutions.find((i) => i.id === selectedInstitution);
    return matchesSearch && inst?.services.includes(s.id);
  });

  return (
    <RoleGuard minRole="supervisor">
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
          + Novo Serviço
        </Button>
      </Div>

      <Div display="flex" gap="1rem" mb="1rem" flexDirection={isMobile ? "column" : "row"}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
          padding="0.5rem 1rem"
          border="1px solid #d0d0d0"
          borderRadius="8px"
          fontSize="0.875rem"
          outline="none"
          bg="#ffffff"
          nFocus={{ borderColor: "#FFA800" }}
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.label}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}
          padding="0.5rem 1rem"
          border="1px solid #d0d0d0"
          borderRadius="8px"
          fontSize="0.875rem"
          outline="none"
          bg="#ffffff"
          nFocus={{ borderColor: "#FFA800" }}
        >
          <Option value="all">Todas as Instituições</Option>
          {institutions.map((inst) => (
            <Option key={inst.id} value={inst.id}>
              {inst.name}
            </Option>
          ))}
        </Select>
      </Div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar serviço por nome..."
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
            {editing ? "Editar Serviço" : "Novo Serviço"}
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
            <Div display="flex" gap="1rem" flexDirection={isMobile ? "column" : "row"}>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Duração (min)</Label>
                <Input
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  required
                  min="1"
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
              <Div flex="1" display="flex" flexDirection="column" gap="0.375rem">
                <Label fontSize="0.875rem" fontWeight="500" color="#555">Capacidade</Label>
                <Input
                  type="number"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                  required
                  min="1"
                  padding="0.625rem 0.75rem"
                  border="1px solid #d0d0d0"
                  borderRadius="6px"
                  fontSize="0.875rem"
                  outline="none"
                  nFocus={{ borderColor: "#FFA800" }}
                />
              </Div>
            </Div>
            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">
                Requisitos (um por linha)
              </Label>
              <Textarea
                value={formRequirements}
                onChange={(e) => setFormRequirements(e.target.value)}
                rows={4}
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
            <Div display="flex" flexDirection="column" gap="0.375rem">
              <Label fontSize="0.875rem" fontWeight="500" color="#555">
                Instituições
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
        <P color="#ABABAB">A carregar serviços...</P>
      ) : filtered.length === 0 ? (
        <P color="#ABABAB">Nenhum serviço encontrado.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem">
          {filtered.map((service) => (
            <Div
              key={service.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem 1.25rem"
              borderRadius="8px"
              border="1px solid #e0e0e0"
              bg="#ffffff"
            >
              <Div>
                <P fontSize="1rem" fontWeight="600" color="#373737">
                  {service.name}
                </P>
                <Div display="flex" gap="1.5rem" mt="0.25rem">
                  <Span fontSize="0.8125rem" color="#ABABAB">
                    Duração: {service.averageDuration} min
                  </Span>
                  <Span fontSize="0.8125rem" color="#ABABAB">
                    Capacidade: {service.maxCapacity}
                  </Span>
                </Div>
                {getInstitutionNames(service.id) && (
                  <P fontSize="0.75rem" color="#ABABAB" mt="0.375rem">
                    Instituições: {getInstitutionNames(service.id)}
                  </P>
                )}
              </Div>
              <Div display="flex" gap="0.5rem">
                <Button
                  onClick={() => startEdit(service)}
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
                  onClick={() => setDeleteTarget(service)}
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
          title="Remover Serviço"
          message={`Tem a certeza que deseja remover o serviço "${deleteTarget.name}"?`}
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
