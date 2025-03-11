/**
 * @description
 * This client component is the main entry point for user input, AI analysis,
 * and displaying results on the homepage ("/").
 *
 * Responsibilities:
 *  - Render the form for capturing profession, experience, region, etc.
 *  - On submit, call onSubmitAction to query Mistral with user data
 *  - Store & display AI results (Outlook, Benefits/Risks, Steps, Placard)
 *  - Present a single disclaimers block in the main page (app/page.tsx)
 *
 * Key features:
 *  - Validates input with zod + React Hook Form
 *  - Uses a distinct <Placard> component for the short summary text
 *  - Ensures the results are center-aligned and disclaimers are not duplicated
 *
 * @dependencies
 * - React Hook Form for form management
 * - Zod for input validation
 * - The handleMistralAction (via onSubmitAction) for calling Mistral
 * - The new <Placard> component for the one-sentence summary
 *
 * @notes
 *  - Step 5 specifically addresses making the "Placard" visually appealing.
 *    This file now imports <Placard> to show the summary in a Shadcn card.
 *  - We'll add social sharing enhancements (Step 6) in a later step.
 */

"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { onSubmitAction } from "@/app/(marketing)/actions-whatwillitmeantome"
import type { ActionState } from "@/types"
import Placard from "./_components/placard" // Our newly created component

/**
 * @description
 * The shape of form inputs, validated with zod:
 */
const formSchema = z.object({
  profession: z
    .string()
    .min(2, { message: "Profession must be at least 2 characters." })
    .max(50, { message: "Profession must be less than 50 characters." }),
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0 years." })
    .max(50, { message: "Experience must be less than 50 years." }),
  region: z
    .string()
    .min(2, { message: "Region must be at least 2 characters." })
    .max(50, { message: "Region must be less than 50 characters." }),
  skillLevel: z
    .number()
    .min(1, { message: "Skill level must be between 1 and 10." })
    .max(10, { message: "Skill level must be between 1 and 10." }),
  details: z
    .string()
    .max(500, { message: "Details must be less than 500 characters." })
    .optional()
})

type FormInputsType = z.infer<typeof formSchema>

/**
 * @description
 * The shape of data returned by Mistral:
 *  - profession
 *  - outlook
 *  - benefitsAndRisks
 *  - steps
 *  - placard
 */
interface MistralResponse {
  profession: string
  outlook: string
  benefitsAndRisks: string
  steps: string
  placard: string
}

/**
 * @function HomeClient
 * Client component for the homepage: handles the entire user journey of
 * entering data -> getting a Mistral-based analysis -> displaying results.
 *
 * @returns React element
 *
 * @notes
 *  - We store the AI result in local state (result).
 *  - If there's a valid result, we display the placard + other sections.
 *  - We ensure disclaimers are only once (in app/page.tsx).
 *  - Step 5 ensures the placard is visually appealing and production-ready.
 */
export default function HomeClient() {
  const [result, setResult] = useState<MistralResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Setup form
  const form = useForm<FormInputsType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession: "",
      experience: 0,
      region: "",
      skillLevel: 5,
      details: ""
    }
  })

  /**
   * @function onSubmit
   * Submit the user input for AI analysis via onSubmitAction, then
   * store the Mistral response in local state if successful.
   *
   * @param {FormInputsType} data - user-provided form inputs
   */
  async function onSubmit(data: FormInputsType) {
    setIsAnalyzing(true)
    startTransition(async () => {
      try {
        const response = await onSubmitAction(
          data.profession,
          data.experience,
          data.region,
          data.skillLevel,
          data.details
        )

        if (!response.isSuccess) {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive"
          })
          return
        }

        // If success, store Mistral result
        const typedData = response.data as MistralResponse
        setResult(typedData)
        toast({
          title: "Success",
          description: "Your career analysis is ready!"
        })
      } catch (error) {
        console.error("Error analyzing career:", error)
        toast({
          title: "Error",
          description:
            "An unexpected error occurred while analyzing. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsAnalyzing(false)
      }
    })
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* FORM SECTION */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profession */}
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession / Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Software Engineer"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>
                  Enter your current or desired profession
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="e.g. 5"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many years have you worked in this field?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geographic Region</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. United States" {...field} />
                </FormControl>
                <FormDescription>
                  Where are you located or planning to work?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Skill Level */}
          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skill Level (1-10)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={value => field.onChange(value[0])}
                    />
                    <div className="text-center font-medium">
                      {field.value}/10
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  How would you rate your technical skill?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional details */}
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any extra info about your career goals..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include any specific goals, concerns, or questions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isAnalyzing || isPending}
            className="w-full"
          >
            {isAnalyzing || isPending ? "Analyzing..." : "Analyze My Career"}
          </Button>
        </form>
      </Form>

      {/* RESULTS SECTION */}
      {result && (
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">
            Analysis Results for {result.profession}
          </h2>

          {/**
           * Step 5 improvement:
           * We replace the old raw block with our new <Placard> for the one-sentence summary.
           */}
          <Placard summary={result.placard} />

          {/* Outlook & Benefits/Risks & Steps in a grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Outlook */}
            <div className="mx-auto w-full max-w-md rounded-md border p-4 text-left">
              <h3 className="mb-2 text-base font-semibold">General Outlook</h3>
              <p className="text-foreground whitespace-pre-line text-sm">
                {result.outlook}
              </p>
            </div>

            {/* Benefits & Risks */}
            <div className="mx-auto w-full max-w-md rounded-md border p-4 text-left">
              <h3 className="mb-2 text-base font-semibold">
                Potential Benefits &amp; Risks
              </h3>
              <p className="text-foreground whitespace-pre-line text-sm">
                {result.benefitsAndRisks}
              </p>
            </div>

            {/* Steps to Adapt (span two columns on wide screens) */}
            <div className="mx-auto w-full max-w-3xl rounded-md border p-4 text-left md:col-span-2">
              <h3 className="mb-2 text-base font-semibold">Steps to Adapt</h3>
              <p className="text-foreground whitespace-pre-line text-sm">
                {result.steps}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
