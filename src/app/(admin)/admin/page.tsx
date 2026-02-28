"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useIsMobile } from "@/hooks/use-media-query";
import { Div, H3, P, Span } from "@stylin.js/elements";

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export default function AdminDashboardPage() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bookingsSnap, servicesSnap, institutionsSnap, scheduledSnap] =
          await Promise.all([
            getCountFromServer(collection(db, "bookings")),
            getCountFromServer(collection(db, "services")),
            getCountFromServer(collection(db, "institutions")),
            getCountFromServer(
              query(collection(db, "bookings"), where("status", "==", "scheduled"))
            ),
          ]);

        setStats([
          {
            label: "Total de Marcações",
            value: bookingsSnap.data().count,
            icon: "📅",
            color: "#FFA800",
          },
          {
            label: "Marcações Activas",
            value: scheduledSnap.data().count,
            icon: "⏳",
            color: "#2e7d32",
          },
          {
            label: "Serviços",
            value: servicesSnap.data().count,
            icon: "📋",
            color: "#1a73e8",
          },
          {
            label: "Instituições",
            value: institutionsSnap.data().count,
            icon: "🏛️",
            color: "#7b1fa2",
          },
        ]);
      } catch {
        setStats([
          { label: "Total de Marcações", value: 0, icon: "📅", color: "#FFA800" },
          { label: "Marcações Activas", value: 0, icon: "⏳", color: "#2e7d32" },
          { label: "Serviços", value: 0, icon: "📋", color: "#1a73e8" },
          { label: "Instituições", value: 0, icon: "🏛️", color: "#7b1fa2" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <Div padding={isMobile ? "1rem" : "2rem"}>
      <Div
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(220px, 1fr))"}
        gap="1.25rem"
        mb="2rem"
      >
        {stats.map((stat) => (
          <Div
            key={stat.label}
            bg="#ffffff"
            borderRadius="10px"
            padding="1.5rem"
            border="1px solid #e0e0e0"
            display="flex"
            alignItems="center"
            gap="1rem"
          >
            <Div
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="48px"
              height="48px"
              borderRadius="10px"
              bg={`${stat.color}15`}
              fontSize="1.5rem"
            >
              {stat.icon}
            </Div>
            <Div>
              <P fontSize="0.8125rem" color="#ABABAB" mb="0.125rem">
                {stat.label}
              </P>
              <Span fontSize="1.5rem" fontWeight="700" color="#373737">
                {loading ? "—" : stat.value}
              </Span>
            </Div>
          </Div>
        ))}
      </Div>

      <Div
        bg="#ffffff"
        borderRadius="10px"
        padding="1.5rem"
        border="1px solid #e0e0e0"
      >
        <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="1rem">
          Acesso Rápido
        </H3>
        <Div display="flex" gap="1rem" flexWrap="wrap" flexDirection={isMobile ? "column" : "row"}>
          <Div
            flex="1"
            minWidth="200px"
            padding="1.25rem"
            borderRadius="8px"
            bg="#FFF3D6"
            cursor="pointer"
            transition="transform 0.15s"
            nHover={{ transform: "translateY(-2px)" }}
            onClick={() => window.location.href = "/admin/marcacoes"}
          >
            <Span fontSize="1.5rem" display="block" mb="0.5rem">📅</Span>
            <P fontSize="0.9375rem" fontWeight="600" color="#373737">
              Gerir Marcações
            </P>
            <P fontSize="0.8125rem" color="#ABABAB" mt="0.25rem">
              Ver e atender marcações activas
            </P>
          </Div>
          <Div
            flex="1"
            minWidth="200px"
            padding="1.25rem"
            borderRadius="8px"
            bg="#FFF3D6"
            cursor="pointer"
            transition="transform 0.15s"
            nHover={{ transform: "translateY(-2px)" }}
            onClick={() => window.location.href = "/admin/instituicoes"}
          >
            <Span fontSize="1.5rem" display="block" mb="0.5rem">🏛️</Span>
            <P fontSize="0.9375rem" fontWeight="600" color="#373737">
              Gerir Instituições
            </P>
            <P fontSize="0.8125rem" color="#ABABAB" mt="0.25rem">
              Adicionar e editar instituições
            </P>
          </Div>
          <Div
            flex="1"
            minWidth="200px"
            padding="1.25rem"
            borderRadius="8px"
            bg="#FFF3D6"
            cursor="pointer"
            transition="transform 0.15s"
            nHover={{ transform: "translateY(-2px)" }}
            onClick={() => window.location.href = "/admin/servicos"}
          >
            <Span fontSize="1.5rem" display="block" mb="0.5rem">📋</Span>
            <P fontSize="0.9375rem" fontWeight="600" color="#373737">
              Gerir Serviços
            </P>
            <P fontSize="0.8125rem" color="#ABABAB" mt="0.25rem">
              Criar, editar e remover serviços
            </P>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
