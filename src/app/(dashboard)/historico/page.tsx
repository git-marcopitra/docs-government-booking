"use client";

import { Div, H2, P } from "@stylin.js/elements";
import { BookingRow } from "@/components/booking-row";
import { useBookingHistory } from "@/hooks/use-bookings";

export default function HistoricoPage() {
  const { history, loading } = useBookingHistory();

  return (
    <Div>
      <H2 fontSize="1.25rem" fontWeight="600" color="#373737" mb="1.5rem">
        Histórico
      </H2>

      {loading ? (
        <P color="#ABABAB">A carregar histórico...</P>
      ) : history.length === 0 ? (
        <P color="#ABABAB">Nenhuma marcação no histórico.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem">
          {history.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              showActions={false}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}
