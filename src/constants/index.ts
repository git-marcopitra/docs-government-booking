import type { ServiceCategory } from "@/types";

export interface CategoryInfo {
  id: ServiceCategory;
  label: string;
  description: string;
  icon: string;
}

export const SERVICE_CATEGORIES: CategoryInfo[] = [
  {
    id: "documentacao-pessoal",
    label: "Documentação Pessoal",
    description: "Bilhete de Identidade, Passaporte, Registo Criminal",
    icon: "/icons/pessoal.svg",
  },
  {
    id: "documentacao-habitacional",
    label: "Documentação Habitacional",
    description: "Registos de propriedade, licenças habitacionais",
    icon: "/icons/habitacional.svg",
  },
  {
    id: "documentacao-automovel",
    label: "Documentação Automóvel",
    description: "Carta de condução, registo de veículos",
    icon: "/icons/automovel.svg",
  },
  {
    id: "documentacao-comercial",
    label: "Documentação Comercial",
    description: "Licenças comerciais, registos empresariais",
    icon: "/icons/comercial.svg",
  },
];

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  cancelled: "Cancelado",
  rescheduled: "Reagendado",
};

export const NAV_ITEMS = [
  { label: "Agendar", href: "/agendar" },
  { label: "Minhas Marcações", href: "/marcacoes" },
  { label: "Histórico", href: "/historico" },
  { label: "Perfil", href: "/perfil" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Marcações", href: "/admin/marcacoes", minRole: "atendente" as const },
  { label: "Instituições", href: "/admin/instituicoes", minRole: "admin" as const },
  { label: "Serviços", href: "/admin/servicos", minRole: "supervisor" as const },
  { label: "Colaboradores", href: "/admin/colaboradores", minRole: "proprietario" as const },
] as const;

const ROLE_HIERARCHY: Record<string, number> = {
  atendente: 1,
  supervisor: 2,
  admin: 3,
  proprietario: 4,
};

export function hasMinRole(userRole: string, minRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 999);
}

export const ROLE_LABELS: Record<string, string> = {
  atendente: "Atendente",
  supervisor: "Supervisor",
  admin: "Administrador",
  proprietario: "Proprietário",
};
