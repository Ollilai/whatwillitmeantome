/**
 * @description
 * This client component provides the user input form about their career,
 * then calls a server action (passed in via props) to do Mistral AI analysis.
 *
 * It is responsible for:
 * - Rendering and validating form fields using React Hook Form + Zod
 * - Displaying a loading indicator while awaiting the response
 * - Handling errors (passed up or displayed in a toast)
 *
 * Key features:
 * - Profession/job title text field
 * - Years of experience numeric field
 * - Region text field
 * - Technical skill slider (0-10)
 * - Optional details field
 *
 * @dependencies
 * - react-hook-form for form state
 * - zod for schema validation
 * - Shadcn UI for styling (Button, Input, etc.)
 *
 * @notes
 * - We no longer store the result data here. Instead, we rely on a callback
 *   from the parent to handle the successful result.
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

/**
 * Zod schema for our form fields.
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
    .min(0, { message: "Skill level must be at least 0." })
    .max(10, { message: "Skill level must be at most 10." }),
  details: z
    .string()
    .max(500, { message: "Details must be less than 500 characters." })
    .optional()
})

type FormInputsType = z.infer<typeof formSchema>

/**
 * Props for FormInputs, including the server action callback for submission.
 */
interface FormInputsProps {
  /**
   * The function to call on form submit. This is typically a server action
   * that returns an ActionState<someData>.
   */
  onSubmitAction: (
    profession: string,
    experience: number,
    region: string,
    skillLevel: number,
    details?: string
  ) => Promise<ActionState<unknown>>
}

/**
 * Renders the form UI for collecting career info, then calls the provided
 * server action on submit.
 */
export default function FormInputs({ onSubmitAction }: FormInputsProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Initialize react-hook-form
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
   * Called when the user submits the form. We handle loading state, etc.
   */
  async function onSubmit(data: FormInputsType) {
    setIsLoading(true)
    try {
      const result = await onSubmitAction(
        data.profession,
        data.experience,
        data.region,
        data.skillLevel,
        data.details
      )

      if (!result.isSuccess) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      } else {
        // We rely on the parent callback logic to do the rest.
        // We'll also show a final toast here for success if we want, but
        // the parent might do it, so let's be minimal.
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
    </div>
  )
}
