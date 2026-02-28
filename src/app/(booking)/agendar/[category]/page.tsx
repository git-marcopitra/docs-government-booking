"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Div, H2, P } from "@stylin.js/elements";
import { ServiceCard } from "@/components/service-card";
import { getServicesByCategory } from "@/services/service-service";
import { getCategoryLabel } from "@/lib/utils";
import type { Service, ServiceCategory } from "@/types";

export default function CategoryServicesPage() {
  const params = useParams();
  const category = params.category as ServiceCategory;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServicesByCategory(category).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <Div>
      <H2 fontSize="1.25rem" fontWeight="600" color="#373737" mb="0.5rem">
        {getCategoryLabel(category)}
      </H2>
      <P fontSize="0.9375rem" color="#ABABAB" mb="1.5rem">
        Selecione o serviço que pretende agendar
      </P>

      {loading ? (
        <P color="#ABABAB">A carregar serviços...</P>
      ) : services.length === 0 ? (
        <P color="#ABABAB">Nenhum serviço disponível nesta categoria.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem" maxWidth="600px">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryId={category}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}
