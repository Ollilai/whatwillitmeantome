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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card mx-auto max-w-2xl space-y-6 rounded-lg border p-6 shadow-sm"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Analyze Your Career</h2>
            <p className="text-muted-foreground mt-2">
              Discover how AI might impact your profession in the future
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <input
                      placeholder="e.g. Software Engineer"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your current job title or role
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    How long you've been in this field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <input
                    placeholder="e.g. United States, Europe, Asia"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your geographic location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Technological Skill Level (1-10)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[value]}
                      onValueChange={vals => onChange(vals[0])}
                      className="py-2"
                      {...fieldProps}
                    />
                    <div className="text-center font-medium">{value}</div>
                  </div>
                </FormControl>
                <FormDescription>
                  How would you rate your technological skills?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any extra info about your career goals..."
                    className="min-h-[100px] resize-none"
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
            {isAnalyzing || isPending ? (
              <div className="flex items-center">
                <svg
                  className="-ml-1 mr-3 size-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing your career...
              </div>
            ) : (
              "Analyze My Career"
            )}
          </Button>
        </form>
      </Form>

      {/**
       * RESULTS SECTION
       */}
      {result && (
        <div className="space-y-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
          >
            Analysis Results for {result.profession}
          </motion.h2>

          {/**
           * Display the analysis in an animated, tabbed interface
           */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <Tabs defaultValue="outlook" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="outlook">General Outlook</TabsTrigger>
                <TabsTrigger value="benefits">Benefits & Risks</TabsTrigger>
                <TabsTrigger value="steps">Steps to Adapt</TabsTrigger>
              </TabsList>

              <TabsContent value="outlook">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card relative overflow-hidden rounded-xl border p-6 text-left shadow-md"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700" />
                  <h3 className="text-primary mb-4 flex items-center text-xl font-semibold">
                    <span className="mr-3 rounded-full bg-blue-100 p-2 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                    General Outlook
                  </h3>
                  <div
                    className="text-foreground text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: result.outlook }}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="benefits">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card relative overflow-hidden rounded-xl border p-6 text-left shadow-md"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-700" />
                  <h3 className="text-primary mb-4 flex items-center text-xl font-semibold">
                    <span className="mr-3 rounded-full bg-purple-100 p-2 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-scale"
                      >
                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="M7 21h10" />
                        <path d="M12 3v18" />
                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                      </svg>
                    </span>
                    Potential Benefits &amp; Risks
                  </h3>
                  <div
                    className="text-foreground text-base leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: result.benefitsAndRisks
                    }}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="steps">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card relative overflow-hidden rounded-xl border p-6 text-left shadow-md"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-700" />
                  <h3 className="text-primary mb-4 flex items-center text-xl font-semibold">
                    <span className="mr-3 rounded-full bg-green-100 p-2 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-route"
                      >
                        <circle cx="6" cy="19" r="3" />
                        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                        <circle cx="18" cy="5" r="3" />
                      </svg>
                    </span>
                    Steps to Adapt
                  </h3>
                  <div
                    className="text-foreground text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: result.steps }}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/**
           * Show the AI's short summary in a placard - Now moved below the analysis
           */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-12 max-w-2xl"
          >
            <h3 className="mb-4 flex items-center justify-center text-xl font-medium">
              <span className="mr-2 rounded-full bg-pink-100 p-2 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lightbulb"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </span>
              Key Takeaway
            </h3>
            <Placard summary={result.placard} />
          </motion.div>
        </div>
      )}
    </div>
  )
}
