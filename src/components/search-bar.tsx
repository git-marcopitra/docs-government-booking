"use client";

import { Div, Input } from "@stylin.js/elements";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Pesquisar instituição...",
}: SearchBarProps) {
  return (
    <Div mb="1rem">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        width="100%"
        padding="0.75rem 1rem"
        border="1px solid #d0d0d0"
        borderRadius="8px"
        fontSize="0.9375rem"
        outline="none"
        nFocus={{ borderColor: "#FFA800" }}
      />
    </Div>
  );
}
