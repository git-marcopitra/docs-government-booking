"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RoleGuard } from "@/components/role-guard";
import { getAllActiveBookings, markBookingCompleted, deleteBooking } from "@/services/booking-service";
import { getUserProfile } from "@/services/auth-service";
import { formatDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, P, Span, Button, Select, Option } from "@stylin.js/elements";
import type { Booking, User } from "@/types";

interface EnrichedBooking extends Booking {
  userProfile?: User | null;
}

export default function MarcacoesAdminPage() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<EnrichedBooking | null>(null);
  const isMobile = useIsMobile();

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllActiveBookings();
      const userIds = [...new Set(data.map((b) => b.userId))];
      const profiles = await Promise.all(userIds.map((uid) => getUserProfile(uid)));
      const profileMap = new Map<string, User | null>();
      userIds.forEach((uid, i) => profileMap.set(uid, profiles[i]));

      const enriched: EnrichedBooking[] = data.map((b) => ({
        ...b,
        userProfile: profileMap.get(b.userId) ?? null,
      }));
      setBookings(enriched);
    } catch (err) {
      console.error("Erro ao carregar marcações:", err);
      setError("Não foi possível carregar as marcações. Verifique a consola para mais detalhes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleAtender(booking: Booking) {
    await markBookingCompleted(booking.id);
    await fetchBookings();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteBooking(deleteTarget.id);
    setDeleteTarget(null);
    await fetchBookings();
  }

  const serviceTypes = [...new Set(bookings.map((b) => b.serviceType))].sort();
  const institutionNames = [...new Set(bookings.map((b) => b.institutionName))].sort();

  const filtered = bookings.filter((b) => {
    const term = search.toLowerCase();
    const name = b.userProfile?.nomeCompleto?.toLowerCase() ?? "";
    const bi = b.userProfile?.bilheteIdentidade?.toLowerCase() ?? "";
    const matchesSearch =
      name.includes(term) ||
      bi.includes(term) ||
      b.serviceType.toLowerCase().includes(term) ||
      b.institutionName.toLowerCase().includes(term);
    const matchesService = selectedService === "all" || b.serviceType === selectedService;
    const matchesInstitution = selectedInstitution === "all" || b.institutionName === selectedInstitution;
    return matchesSearch && matchesService && matchesInstitution;
  });

  return (
    <RoleGuard minRole="atendente">
    <Div padding={isMobile ? "1rem" : "2rem"}>
      <Div display="flex" gap="1rem" mb="1rem" flexDirection={isMobile ? "column" : "row"}>
        <Select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          padding="0.5rem 1rem"
          border="1px solid #d0d0d0"
          borderRadius="8px"
          fontSize="0.875rem"
          outline="none"
          bg="#ffffff"
          nFocus={{ borderColor: "#FFA800" }}
        >
          <Option value="all">Todos os Serviços</Option>
          {serviceTypes.map((s) => (
            <Option key={s} value={s}>{s}</Option>
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
          {institutionNames.map((n) => (
            <Option key={n} value={n}>{n}</Option>
          ))}
        </Select>
      </Div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar por nome, BI ou serviço..."
      />

      {loading ? (
        <P color="#ABABAB">A carregar marcações...</P>
      ) : error ? (
        <P color="#d32f2f">{error}</P>
      ) : filtered.length === 0 ? (
        <P color="#ABABAB">Nenhuma marcação activa encontrada.</P>
      ) : (
        isMobile ? (
          <Div display="flex" flexDirection="column" gap="0.75rem">
            {filtered.map((booking) => (
              <Div
                key={booking.id}
                bg="#ffffff"
                borderRadius="10px"
                border="1px solid #e0e0e0"
                padding="1rem"
              >
                <Span fontSize="0.9375rem" fontWeight="600" color="#373737" display="block" mb="0.25rem">
                  {booking.userProfile?.nomeCompleto || "—"}
                </Span>
                <Span fontSize="0.8125rem" color="#ABABAB" display="block" mb="0.5rem">
                  BI: {booking.userProfile?.bilheteIdentidade || "—"}
                  {booking.userProfile?.telefone && ` · Tel: ${booking.userProfile.telefone}`}
                </Span>
                <Span fontSize="0.875rem" color="#373737" display="block">
                  {booking.serviceType}
                </Span>
                <Span fontSize="0.75rem" color="#ABABAB" display="block" mb="0.5rem">
                  {booking.institutionName}
                </Span>
                <Span fontSize="0.875rem" color="#373737" display="block" mb="0.75rem">
                  {formatDate(booking.date)} · {booking.timeSlot}
                </Span>
                <Div display="flex" gap="0.5rem">
                  <Button
                    onClick={() => handleAtender(booking)}
                    bg="#2e7d32"
                    color="#ffffff"
                    border="none"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    fontWeight="500"
                    flex="1"
                  >
                    Atender
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(booking)}
                    bg="transparent"
                    border="1px solid #d32f2f"
                    color="#d32f2f"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    flex="1"
                  >
                    Eliminar
                  </Button>
                </Div>
              </Div>
            ))}
          </Div>
        ) : (
          <Div
            bg="#ffffff"
            borderRadius="10px"
            border="1px solid #e0e0e0"
            overflow="hidden"
          >
            <Div
              display="grid"
              gridTemplateColumns="1.5fr 1fr 1fr 1fr 0.8fr 1fr"
              padding="0.75rem 1.25rem"
              bg="#f9f9f9"
              borderBottom="1px solid #e0e0e0"
            >
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">Nome</Span>
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">N. BI</Span>
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">Telefone</Span>
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">Serviço</Span>
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">Data / Hora</Span>
              <Span fontSize="0.75rem" fontWeight="600" color="#ABABAB" textTransform="uppercase">Acções</Span>
            </Div>
            {filtered.map((booking) => (
              <Div
                key={booking.id}
                display="grid"
                gridTemplateColumns="1.5fr 1fr 1fr 1fr 0.8fr 1fr"
                padding="0.875rem 1.25rem"
                borderBottom="1px solid #f0f0f0"
                alignItems="center"
                nHover={{ background: "#fafafa" }}
              >
                <Span fontSize="0.875rem" color="#373737">{booking.userProfile?.nomeCompleto || "—"}</Span>
                <Span fontSize="0.875rem" color="#373737">{booking.userProfile?.bilheteIdentidade || "—"}</Span>
                <Span fontSize="0.875rem" color="#373737">{booking.userProfile?.telefone || "—"}</Span>
                <Div>
                  <Span fontSize="0.875rem" color="#373737" display="block">{booking.serviceType}</Span>
                  <Span fontSize="0.75rem" color="#ABABAB">{booking.institutionName}</Span>
                </Div>
                <Div>
                  <Span fontSize="0.875rem" color="#373737" display="block">{formatDate(booking.date)}</Span>
                  <Span fontSize="0.75rem" color="#ABABAB">{booking.timeSlot}</Span>
                </Div>
                <Div display="flex" gap="0.5rem">
                  <Button
                    onClick={() => handleAtender(booking)}
                    bg="#2e7d32"
                    color="#ffffff"
                    border="none"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    fontWeight="500"
                    nHover={{ background: "#1b5e20" }}
                  >
                    Atender
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(booking)}
                    bg="transparent"
                    border="1px solid #d32f2f"
                    color="#d32f2f"
                    padding="0.375rem 0.75rem"
                    borderRadius="6px"
                    cursor="pointer"
                    fontSize="0.8125rem"
                    nHover={{ background: "#d32f2f", color: "#ffffff" }}
                  >
                    Eliminar
                  </Button>
                </Div>
              </Div>
            ))}
          </Div>
        )
      )}

      {deleteTarget && (
        <ConfirmationDialog
          title="Eliminar Marcação"
          message={`Tem a certeza que deseja eliminar esta marcação de ${deleteTarget.userProfile?.nomeCompleto || "utilizador"}?`}
          confirmLabel="Sim, eliminar"
          cancelLabel="Não"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Div>
    </RoleGuard>
  );
}
