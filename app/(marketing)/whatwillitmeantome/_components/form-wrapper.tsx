/**
 * @description
 * This client component wrapper handles the interaction between the client-side form
 * and the server action. It solves the "Event handlers cannot be passed to Client Component props"
 * error by using the server action directly in a client component.
 */

"use client"

import { useTransition } from "react"
import { onSubmitAction } from "../actions"
import FormInputs from "./form-inputs"
import { ActionState } from "@/types"

export default function FormWrapper() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (
    profession: string,
    experience: number,
    region: string,
    skillLevel: number,
    details?: string
  ): Promise<ActionState<unknown>> => {
    return onSubmitAction(profession, experience, region, skillLevel, details)
  }

  return <FormInputs onSubmitAction={handleSubmit} />
}
