"use client";

import { Div, Button, P } from "@stylin.js/elements";
import { useIsMobile } from "@/hooks/use-media-query";
import type { TimeSlot } from "@/types";

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotSelector({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <Div>
      <P fontSize="0.9375rem" fontWeight="600" color="#373737" mb="0.75rem">
        Horários disponíveis
      </P>
      <Div display="grid" gridTemplateColumns={isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)"} gap="0.5rem">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.time;
          const isDisabled = !slot.available;
          return (
            <Button
              key={slot.time}
              onClick={() => !isDisabled && onSelect(slot.time)}
              disabled={isDisabled}
              bg={isSelected ? "#FFA800" : isDisabled ? "#f5f5f5" : "#ffffff"}
              color={isSelected ? "#ffffff" : isDisabled ? "#bbb" : "#373737"}
              border={
                isSelected
                  ? "1px solid #FFA800"
                  : "1px solid #d0d0d0"
              }
              padding="0.625rem 0.5rem"
              borderRadius="6px"
              cursor={isDisabled ? "not-allowed" : "pointer"}
              fontSize="0.875rem"
              fontWeight={isSelected ? "600" : "400"}
              transition="all 0.15s"
            >
              {slot.time}
            </Button>
          );
        })}
      </Div>
    </Div>
  );
}
