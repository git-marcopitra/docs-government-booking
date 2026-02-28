"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Div, P } from "@stylin.js/elements";
import { RequirementsPanel } from "@/components/requirements-panel";
import { InstitutionCard } from "@/components/institution-card";
import { SearchBar } from "@/components/search-bar";
import { useInstitutions } from "@/hooks/use-institutions";
import { useIsMobile } from "@/hooks/use-media-query";
import { useAuth } from "@/contexts/auth-context";
import { getServiceById } from "@/services/service-service";
import {
  pinInstitution,
  unpinInstitution,
} from "@/services/institution-service";
import type { Service } from "@/types";

export default function InstitutionSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const category = params.category as string;
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  const { institutions, loading, searchQuery, setSearchQuery } =
    useInstitutions(serviceId);

  useEffect(() => {
    getServiceById(serviceId).then(setService);
  }, [serviceId]);

  function handleSelect(institutionId: string) {
    router.push(`/agendar/${category}/${serviceId}/${institutionId}`);
  }

  async function handleTogglePin(institutionId: string) {
    if (!user) return;
    const isPinned = pinnedIds.has(institutionId);
    if (isPinned) {
      await unpinInstitution(user.uid, institutionId);
      setPinnedIds((prev) => {
        const next = new Set(prev);
        next.delete(institutionId);
        return next;
      });
    } else {
      await pinInstitution(user.uid, institutionId);
      setPinnedIds((prev) => new Set(prev).add(institutionId));
    }
  }

  const sorted = [...institutions].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id) ? 0 : 1;
    const bPinned = pinnedIds.has(b.id) ? 0 : 1;
    return aPinned - bPinned;
  });

  return (
    <Div display="flex" flexDirection={isMobile ? "column" : "row"} gap={isMobile ? "1.5rem" : "2rem"}>
      <Div flex="1" minWidth={isMobile ? "unset" : "280px"} maxWidth={isMobile ? "100%" : "340px"}>
        {service ? (
          <RequirementsPanel service={service} />
        ) : (
          <P color="#ABABAB">A carregar...</P>
        )}
      </Div>

      <Div flex={isMobile ? "unset" : "2"}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {loading ? (
          <P color="#ABABAB">A carregar instituições...</P>
        ) : sorted.length === 0 ? (
          <P color="#ABABAB">Nenhuma instituição encontrada.</P>
        ) : (
          <Div display="flex" flexDirection="column" gap="0.75rem">
            {sorted.map((inst) => (
              <InstitutionCard
                key={inst.id}
                institution={inst}
                isPinned={pinnedIds.has(inst.id)}
                onSelect={handleSelect}
                onTogglePin={handleTogglePin}
              />
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}
