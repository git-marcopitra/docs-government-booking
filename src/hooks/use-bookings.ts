"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getUserBookings,
  getBookingHistory,
  cancelBooking,
} from "@/services/booking-service";
import { useAuth } from "@/contexts/auth-context";
import type { Booking } from "@/types";

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserBookings(user.uid);
    setBookings(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function cancel(bookingId: string) {
    await cancelBooking(bookingId);
    await fetchBookings();
  }

  return { bookings, loading, cancel, refresh: fetchBookings };
}

export function useBookingHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getBookingHistory(user.uid).then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, [user]);

  return { history, loading };
}
