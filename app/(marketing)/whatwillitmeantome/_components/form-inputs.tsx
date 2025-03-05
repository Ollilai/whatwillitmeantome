/**
 * @description
 * This client component provides a form for collecting user input about their career,
 * including profession, years of experience, region, technical skill level, and optional details.
 *
 * It is responsible for:
 * - Rendering and validating form fields using React Hook Form + Zod
 * - Displaying a loading state while awaiting a response from the server
 * - Handling errors and showing a basic result or error status to the user
 *
 * Key features:
 * - Profession/job title text field
 * - Years of experience numeric field
 * - Geographic region text field
 * - Technical skill slider (0-10)
 * - Optional details field
 * - OnSubmit triggers an async server action provided by props (onSubmitAction)
 *
 * @dependencies
 * - react-hook-form: used for form state management
 * - zod & @hookform/resolvers/zod: for schema-based validation
 * - @/components/ui/input, @/components/ui/form, etc. (Shadcn UI) for form styling
 *
 * @notes
 * - We accept an `onSubmitAction` prop from the parent server component, which calls handleMistralAction internally
 * - We do not directly import the server action in this client file due to the project rule:
 *   "Never use server actions in client components."
 * - We display the returned data in a minimal format for now; a more robust display will be implemented in future steps.
 */

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ActionState } from "@/types"

// -----------------------------------------------------
// Zod schema for form validation
// -----------------------------------------------------
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
    .min(0, { message: "Skill level must be at least 0." })
    .max(10, { message: "Skill level must be at most 10." }),
  details: z
    .string()
    .max(500, { message: "Details must be less than 500 characters." })
    .optional()
})

// -----------------------------------------------------
// FormInputsProps: We accept onSubmitAction from the server page
// We'll store the result in local state and show it below
// -----------------------------------------------------
interface FormInputsProps {
  onSubmitAction: (
    profession: string,
    experience: number,
    region: string,
    skillLevel: number,
    details?: string
  ) => Promise<ActionState<unknown>> // You can refine the 'unknown' type to MistralResponse or similar
}

type FormInputsType = z.infer<typeof formSchema>

/**
 * Form component for collecting career information
 * @param onSubmitAction - Server action to call on form submission
 */
export default function FormInputs({ onSubmitAction }: FormInputsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ActionState<unknown> | null>(null)

  // Initialize form
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

  // Form submission handler
  async function onSubmit(data: FormInputsType) {
    setIsLoading(true)
    setResult(null)

    try {
      const result = await onSubmitAction(
        data.profession,
        data.experience,
        data.region,
        data.skillLevel,
        data.details
      )

      setResult(result)

      if (result.isSuccess) {
        toast({
          title: "Success!",
          description: "Your career analysis is ready."
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession / Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Software Engineer" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your current or desired profession
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

          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skill Level (0-10)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0}
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
                  How would you rate your technical skills?
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
                    placeholder="Any other information you'd like to share..."
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Analyzing..." : "Analyze My Career"}
          </Button>
        </form>
      </Form>

      {result && result.isSuccess && (
        <div className="bg-muted mt-8 rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Analysis Complete</h3>
          <p>Your career analysis is ready!</p>
          {/* You can display more structured results here based on the response */}
        </div>
      )}
    </div>
  )
}
