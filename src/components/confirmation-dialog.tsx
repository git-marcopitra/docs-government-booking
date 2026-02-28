"use client";

import { Div, H2, P, Button } from "@stylin.js/elements";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Div
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.4)"
      zIndex="1000"
    >
      <Div
        bg="#ffffff"
        borderRadius="12px"
        padding="2rem"
        maxWidth="400px"
        width="90%"
        boxShadow="0 8px 32px rgba(0,0,0,0.15)"
      >
        <H2 fontSize="1.125rem" fontWeight="600" color="#373737" mb="0.75rem">
          {title}
        </H2>
        <P fontSize="0.9375rem" color="#ABABAB" mb="1.5rem" lineHeight="1.5">
          {message}
        </P>
        <Div display="flex" gap="0.75rem" justifyContent="flex-end">
          <Button
            onClick={onCancel}
            bg="transparent"
            border="1px solid #d0d0d0"
            color="#ABABAB"
            padding="0.5rem 1.25rem"
            borderRadius="6px"
            cursor="pointer"
            fontSize="0.875rem"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            bg="#d32f2f"
            color="#ffffff"
            border="none"
            padding="0.5rem 1.25rem"
            borderRadius="6px"
            cursor="pointer"
            fontSize="0.875rem"
            fontWeight="600"
          >
            {confirmLabel}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
