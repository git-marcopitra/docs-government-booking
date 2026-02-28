"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Div, H2, P } from "@stylin.js/elements";
import { BookingRow } from "@/components/booking-row";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useBookings } from "@/hooks/use-bookings";
import type { Booking } from "@/types";

export default function MarcacoesPage() {
  const router = useRouter();
  const { bookings, loading, cancel } = useBookings();
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  function handleReschedule(booking: Booking) {
    router.push(
      `/agendar/${booking.serviceCategory}/${booking.serviceType}?reschedule=${booking.id}`
    );
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    await cancel(cancelTarget.id);
    setCancelTarget(null);
  }

  return (
    <Div>
      <H2 fontSize="1.25rem" fontWeight="600" color="#373737" mb="1.5rem">
        Minhas Marcações
      </H2>

      {loading ? (
        <P color="#ABABAB">A carregar marcações...</P>
      ) : bookings.length === 0 ? (
        <P color="#ABABAB">Não tem marcações agendadas.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem">
          {bookings.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              onReschedule={handleReschedule}
              onCancel={setCancelTarget}
            />
          ))}
        </Div>
      )}

      {cancelTarget && (
        <ConfirmationDialog
          title="Cancelar Marcação"
          message={`Tem a certeza que deseja cancelar a marcação de ${cancelTarget.serviceType}?`}
          confirmLabel="Sim, cancelar"
          cancelLabel="Não"
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </Div>
  );
}
