"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export default function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={className}
      type="submit"
      isLoading={pending}
      variant={variant || "primary"}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
