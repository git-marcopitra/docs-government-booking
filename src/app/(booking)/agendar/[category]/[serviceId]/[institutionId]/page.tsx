"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { Div, P, Button } from "@stylin.js/elements";
import { MapView } from "@/components/map-view";
import { CalendarPicker } from "@/components/calendar-picker";
import { TimeSlotSelector } from "@/components/time-slot-selector";
import { SuccessMessage } from "@/components/success-message";
import { useIsMobile } from "@/hooks/use-media-query";
import { useAuth } from "@/contexts/auth-context";
import { getInstitutionById } from "@/services/institution-service";
import { getServiceById } from "@/services/service-service";
import { createBooking } from "@/services/booking-service";
import { formatDate } from "@/lib/utils";
import type { Institution, Service, ServiceCategory, TimeSlot } from "@/types";

function generateAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(d);
    }
  }
  return dates;
}

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let h = 8; h < 17; h++) {
    for (const m of [0, 30]) {
      if (h === 12 && m === 0) continue;
      if (h === 12 && m === 30) continue;
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ time, available: true, currentBookings: 0, maxCapacity: 10 });
    }
  }
  return slots;
}

export default function DateTimePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const category = params.category as ServiceCategory;
  const serviceId = params.serviceId as string;
  const institutionId = params.institutionId as string;

  const isMobile = useIsMobile();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    getInstitutionById(institutionId).then(setInstitution);
    getServiceById(serviceId).then(setService);
  }, [institutionId, serviceId]);

  async function handleConfirm() {
    if (!user || !selectedDate || !selectedSlot || !institution || !service) return;
    setSubmitting(true);
    try {
      await createBooking({
        userId: user.uid,
        serviceCategory: category,
        serviceType: service.name,
        institutionId,
        institutionName: institution.name,
        date: Timestamp.fromDate(selectedDate),
        timeSlot: selectedSlot,
      });
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed && selectedDate && selectedSlot && institution && service) {
    return (
      <SuccessMessage
        serviceName={service.name}
        institutionName={institution.name}
        date={formatDate(selectedDate)}
        time={selectedSlot}
        onFinish={() => router.push("/agendar")}
      />
    );
  }

  return (
    <Div display="flex" flexDirection={isMobile ? "column" : "row"} gap={isMobile ? "1.5rem" : "2rem"}>
      <Div flex="1" minHeight={isMobile ? "250px" : "400px"}>
        {institution ? (
          <MapView
            lat={institution.coordinates.lat}
            lng={institution.coordinates.lng}
            name={institution.name}
          />
        ) : (
          <Div
            bg="#f0f0f0"
            borderRadius="10px"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <P color="#ABABAB">A carregar mapa...</P>
          </Div>
        )}
      </Div>

      <Div flex="1" display="flex" flexDirection="column" gap="1.5rem">
        <CalendarPicker
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedSlot(null);
          }}
        />

        {selectedDate && (
          <TimeSlotSelector
            slots={timeSlots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}

        {selectedDate && selectedSlot && (
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            bg="#FFA800"
            color="#ffffff"
            border="none"
            padding="0.75rem 2rem"
            borderRadius="8px"
            cursor={submitting ? "not-allowed" : "pointer"}
            fontSize="1rem"
            fontWeight="600"
            textAlign="center"
            opacity={submitting ? "0.7" : "1"}
            transition="background 0.2s"
            width="100%"
            nHover={{ background: "#E69500" }}
          >
            {submitting ? "A confirmar..." : "Confirmar Agendamento"}
          </Button>
        )}
      </Div>
    </Div>
  );
}
