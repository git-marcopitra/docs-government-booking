"use client";

import { Div, Span, Button } from "@stylin.js/elements";
import { useIsMobile } from "@/hooks/use-media-query";
import { formatDate } from "@/lib/utils";
import { BOOKING_STATUS_LABELS } from "@/constants";
import type { Booking } from "@/types";

interface BookingRowProps {
  booking: Booking;
  onReschedule?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  showActions?: boolean;
}

export function BookingRow({
  booking,
  onReschedule,
  onCancel,
  showActions = true,
}: BookingRowProps) {
  const isMobile = useIsMobile();

  return (
    <Div
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems={isMobile ? "flex-start" : "center"}
      justifyContent="space-between"
      gap={isMobile ? "0.75rem" : "0"}
      padding="1rem 1.5rem"
      borderRadius="8px"
      border="1px solid #e0e0e0"
      bg="#ffffff"
    >
      <Div display="flex" flexDirection={isMobile ? "column" : "row"} gap={isMobile ? "0.25rem" : "2rem"} alignItems={isMobile ? "flex-start" : "center"}>
        <Div>
          <Span fontSize="0.875rem" fontWeight="600" color="#373737">
            {formatDate(booking.date)}
          </Span>
          <Span fontSize="0.875rem" color="#ABABAB" ml="0.5rem">
            {booking.timeSlot}
          </Span>
        </Div>
        <Span fontSize="0.875rem" color="#373737">
          {booking.serviceType}
        </Span>
        <Span fontSize="0.8125rem" color="#ABABAB">
          {booking.institutionName}
        </Span>
        <Span
          fontSize="0.75rem"
          padding="0.2rem 0.5rem"
          borderRadius="4px"
          bg={booking.status === "scheduled" ? "#FFF3D6" : "#f5f5f5"}
          color={booking.status === "scheduled" ? "#FFA800" : "#666"}
        >
          {BOOKING_STATUS_LABELS[booking.status]}
        </Span>
      </Div>

      {showActions && (
        <Div display="flex" gap="0.5rem" width={isMobile ? "100%" : "auto"}>
          {onReschedule && (
            <Button
              onClick={() => onReschedule(booking)}
              bg="transparent"
              border="1px solid #FFA800"
              color="#FFA800"
              padding="0.375rem 0.75rem"
              borderRadius="6px"
              cursor="pointer"
              fontSize="0.8125rem"
            >
              Reagendar
            </Button>
          )}
          {onCancel && (
            <Button
              onClick={() => onCancel(booking)}
              bg="transparent"
              border="1px solid #d32f2f"
              color="#d32f2f"
              padding="0.375rem 0.75rem"
              borderRadius="6px"
              cursor="pointer"
              fontSize="0.8125rem"
            >
              Cancelar
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}
