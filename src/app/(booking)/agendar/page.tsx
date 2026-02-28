"use client";

import { Div, H2 } from "@stylin.js/elements";
import { CategoryCard } from "@/components/category-card";
import { SERVICE_CATEGORIES } from "@/constants";

export default function AgendarPage() {
  return (
    <Div>
      <H2 fontSize="1.25rem" fontWeight="600" color="#373737" mb="1.5rem" textAlign="center">
        Escolha a categoria de serviço
      </H2>
      <Div
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap="1.25rem"
        maxWidth="960px"
        mx="auto"
      >
        {SERVICE_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </Div>
    </Div>
  );
}
