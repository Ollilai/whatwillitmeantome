"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, you would handle the form submission here
      // For example, sending the data to your API route
      console.log(values)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-900/20"
        role="alert"
        aria-live="polite"
      >
        <h3 className="mb-2 text-xl font-medium text-green-800 dark:text-green-300">
          Message Sent!
        </h3>
        <p className="text-green-700 dark:text-green-400">
          Thank you for your message. We'll get back to you as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label="Contact form"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...field}
                  aria-required="true"
                  aria-describedby="name-description"
                />
              </FormControl>
              <FormDescription id="name-description" className="sr-only">
                Please enter your full name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  {...field}
                  aria-required="true"
                  aria-describedby="email-description"
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription id="email-description" className="sr-only">
                Please enter a valid email address where we can contact you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormControl>
                <Textarea
                  id="message"
                  placeholder="How can we help you? Please provide details about your inquiry."
                  className="min-h-[120px]"
                  {...field}
                  aria-required="true"
                  aria-describedby="message-description"
                />
              </FormControl>
              <FormDescription id="message-description" className="sr-only">
                Please enter your message with at least 10 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  )
}
