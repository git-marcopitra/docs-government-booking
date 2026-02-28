import { Timestamp } from "firebase/firestore";

export function formatDate(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getCategoryLabel(categoryId: string): string {
  const labels: Record<string, string> = {
    "documentacao-pessoal": "Documentação Pessoal",
    "documentacao-habitacional": "Documentação Habitacional",
    "documentacao-automovel": "Documentação Automóvel",
    "documentacao-comercial": "Documentação Comercial",
  };
  return labels[categoryId] ?? categoryId;
}
