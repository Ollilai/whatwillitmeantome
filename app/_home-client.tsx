/**
 * @description
 * This client component is the main entry point for user input, AI analysis,
 * and displaying results on the homepage ("/").
 *
 * Responsibilities:
 *  - Render the form for capturing profession, experience, region, etc.
 *  - On submit, call onSubmitAction to query Mistral with user data
 *  - Store & display AI results (Outlook, Benefits/Risks, Steps, Placard)
 *  - Present a single disclaimer block in the main page (app/page.tsx)
 *  - Provide social sharing functionality via <SocialSharing> once the result is ready
 *
 * Key Features:
 *  - Validates input with zod + React Hook Form
 *  - Uses <Placard> to show a short summary text
 *  - Integrates <SocialSharing> to share the final placard on social media
 *
 * @dependencies
 * - React Hook Form, zod for form handling and validation
 * - onSubmitAction from "app/(marketing)/actions-whatwillitmeantome" for Mistral
 * - Placard for the AI summary
 * - SocialSharing for share buttons
 *
 * @notes
 * - We pass "result.placard" as the snippet to the SocialSharing component
 * - The user can share to Twitter, LinkedIn, Facebook, or Reddit
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
import Placard from "@/app/_components/placard"
import SocialSharing from "@/app/(marketing)/_components/social-sharing"

/**
 * Form schema using zod
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
 * @interface MistralResponse
 * The shape of data returned by handleMistralAction
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
 * Client-side logic for the main page:
 *  - Renders the user input form
 *  - Submits to onSubmitAction for AI analysis
 *  - Displays result if available, including <Placard> and <SocialSharing>
 */
export default function HomeClient() {
  const [result, setResult] = useState<MistralResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Setup React Hook Form
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
   * Calls onSubmitAction with user input to get AI-based analysis
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

        // If success, store the AI result in local state
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
      {/**
       * FORM SECTION
       */}
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

      {/**
       * RESULTS SECTION
       */}
      {result && (
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-semibold">
            Analysis Results for {result.profession}
          </h2>

          {/**
           * Display the analysis in a grid
           */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Outlook */}
            <div className="bg-card mx-auto w-full rounded-lg border p-5 text-left shadow-sm">
              <h3 className="text-primary mb-3 text-lg font-semibold">
                General Outlook
              </h3>
              <div
                className="text-foreground text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result.outlook }}
              />
            </div>

            {/* Steps to Adapt */}
            <div className="bg-card mx-auto w-full rounded-lg border p-5 text-left shadow-sm">
              <h3 className="text-primary mb-3 text-lg font-semibold">
                Steps to Adapt
              </h3>
              <div
                className="text-foreground text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result.steps }}
              />
            </div>

            {/* Benefits & Risks - Now spans full width */}
            <div className="bg-card mx-auto w-full rounded-lg border p-5 text-left shadow-sm md:col-span-2">
              <h3 className="text-primary mb-3 text-lg font-semibold">
                Potential Benefits &amp; Risks
              </h3>
              <div
                className="text-foreground text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result.benefitsAndRisks }}
              />
            </div>
          </div>

          {/**
           * Show the AI's short summary in a placard - Now moved below the analysis
           */}
          <div className="mx-auto mt-8 max-w-2xl">
            <h3 className="mb-4 text-lg font-medium">Key Takeaway</h3>
            <Placard summary={result.placard} />
          </div>
        </div>
      )}
    </div>
  )
}
