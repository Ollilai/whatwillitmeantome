"use server"

/**
 * @description
 * This server page displays the product's primary AI-driven features and capabilities.
 *
 * It is responsible for:
 * - Showcasing an updated set of "features" that relate to the "WhatWillItMeanToMe" platform
 * - Providing a more production-ready UI (cards, icons, concise text)
 *
 * Key features:
 * - Replaces the old placeholder features with new bullet points relevant to AI analysis
 * - Uses Shadcn <Card> components for consistent design
 * - Maintains a server component approach (no async data fetching needed, so no Suspense)
 *
 * @dependencies
 * - Card, CardContent from "@/components/ui/card"
 * - Icons from "lucide-react" for consistency with the rest of the app
 *
 * @notes
 * - This page has no dynamic data; it simply renders static content.
 * - You can further refine the text or style as your marketing strategy evolves.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Lightbulb,
  Globe2,
  Cpu,
  Users,
  CheckCircle2,
  Eye,
  LucideIcon
} from "lucide-react"

/**
 * Defines the structure for each feature. The icon uses the LucideIcon type
 * from "lucide-react" to allow any icon from the library.
 */
interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * A server page that displays a list of AI-focused features. These highlight
 * the key capabilities of the "WhatWillItMeantome" analysis or any advanced AI
 * functionality.
 *
 * This is a server component. No asynchronous data fetching is required here,
 * so we can directly return the JSX without Suspense.
 */
export default async function FeaturesPage() {
  /**
   * A new array of features relevant to an AI/AGI analysis product. Each feature
   * includes a title, description, and a LucideReact icon.
   */
  const features: FeatureProps[] = [
    {
      title: "AI-Powered Insights",
      description:
        "Leverage cutting-edge Large Language Models to generate career impact analyses quickly.",
      icon: Lightbulb
    },
    {
      title: "Global Scope",
      description:
        "Assess trends worldwide to see how region-specific automation might affect you.",
      icon: Globe2
    },
    {
      title: "Real-Time Analysis",
      description:
        "Stay up-to-date with rapid AI development to see how changes affect your field.",
      icon: Eye
    },
    {
      title: "Skill Mapping",
      description:
        "Identify skill gaps and recommendations, backed by data from various AI-driven insights.",
      icon: Cpu
    },
    {
      title: "Collaboration Ready",
      description:
        "Share reports with peers, mentors, or recruiters to gather feedback and align on goals.",
      icon: Users
    },
    {
      title: "Confidence Checks",
      description:
        "We highlight uncertainties and disclaimers to ensure you maintain realistic expectations.",
      icon: CheckCircle2
    }
  ]

  // Return the final UI
  return (
    <div className="container mx-auto py-12">
      {/** Main heading section */}
      <h1 className="mb-8 text-center text-4xl font-bold">
        AI Impact Analysis Features
      </h1>

      <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center">
        Explore how our advanced AI predictions and analysis capabilities
        empower you to stay ahead in an ever-evolving world.
      </p>

      {/**
       * Feature grid:
       * Each feature is displayed in a Card with an icon, bold title, and a short description.
       * We use a responsive grid layout so it looks good on mobile and larger screens.
       */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/** Icon from lucide-react */}
                <feature.icon className="size-5" />
                {feature.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
