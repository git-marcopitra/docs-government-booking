"use client";

import { useEffect, useState, useMemo } from "react";
import { getInstitutionsByService } from "@/services/institution-service";
import type { Institution } from "@/types";

export function useInstitutions(serviceId: string) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    getInstitutionsByService(serviceId).then((data) => {
      setInstitutions(data);
      setLoading(false);
    });
  }, [serviceId]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return institutions;
    const q = searchQuery.toLowerCase();
    return institutions.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.address.toLowerCase().includes(q)
    );
  }, [institutions, searchQuery]);

  return { institutions: filtered, loading, searchQuery, setSearchQuery };
}
