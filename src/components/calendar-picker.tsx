"use client";

import { DayPicker } from "react-day-picker";
import { Div } from "@stylin.js/elements";
import "react-day-picker/style.css";

interface CalendarPickerProps {
  availableDates: Date[];
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function CalendarPicker({
  availableDates,
  selectedDate,
  onSelect,
}: CalendarPickerProps) {
  const availableSet = new Set(
    availableDates.map((d) => d.toDateString())
  );

  function isDisabled(date: Date): boolean {
    return !availableSet.has(date.toDateString());
  }

  return (
    <Div>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        disabled={isDisabled}
        locale={undefined}
      />
    </Div>
  );
}
