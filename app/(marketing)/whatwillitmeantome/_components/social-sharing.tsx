/**
 * @description
 * This client component provides social sharing buttons for Twitter, LinkedIn,
 * Facebook, and Reddit. It opens the appropriate share URL in a new tab,
 * and also calls the onShareAction server action to log usage (e.g., "shared_twitter").
 *
 * @responsibilities
 * - Render clickable icons or buttons to share the user's AI-generated result
 * - Open the social platform share links in a new tab or window
 * - Optionally call the usage log server action onShareAction(network)
 *
 * @notes
 * - We rely on Next.js server actions living in actions.ts to avoid direct server calls from client
 * - The "text" and "url" props are used to build share links
 * - We use startTransition for non-blocking server calls
 * - If the user is on a mobile device, these share links typically open in the default browser
 */

"use client"

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { onShareAction } from "../actions"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react"

interface SocialSharingProps {
  /**
   * The main text to share, typically the user's summary or highlight.
   */
  text: string

  /**
   * The URL that leads back to the user's generated report or the site homepage.
   */
  url: string
}

/**
 * SocialSharing - Renders a row of social share buttons for major platforms.
 * On click, opens share link in new tab and logs usage.
 * @param props.text The text or summary to share
 * @param props.url  The link to share
 * @returns a row of share buttons
 */
export default function SocialSharing({ text, url }: SocialSharingProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  /**
   * handleShare
   * Opens the social link in a new tab, then logs usage via the server action.
   * @param network e.g., "twitter", "linkedin", "facebook", "reddit"
   * @param shareUrl Fully constructed URL to the platform's share endpoint
   */
  function handleShare(network: string, shareUrl: string) {
    // 1) open in new tab
    window.open(shareUrl, "_blank", "noopener,noreferrer")

    // 2) log usage in background
    startTransition(async () => {
      const res = await onShareAction(network)
      if (!res.isSuccess) {
        toast({
          title: "Share Error",
          description: res.message,
          variant: "destructive"
        })
      }
    })
  }

  // For each platform, we build the share URL with the text and url.
  // These are standard sharing endpoints with query params for the message.
  // Using encodeURIComponent to ensure special characters are safely included.
  const encodedText = encodeURIComponent(text)
  const encodedURL = encodeURIComponent(url)

  // Pre-built share links for each platform
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedURL}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    reddit: `https://reddit.com/submit?url=${encodedURL}&title=${encodedText}`
  }

  // Render a row of share buttons
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="text-muted-foreground text-sm">Share your results:</span>

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter", shareLinks.twitter)}
        disabled={isPending}
      >
        <Twitter className="mr-1 size-4" />
        Twitter
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin", shareLinks.linkedin)}
        disabled={isPending}
      >
        <Linkedin className="mr-1 size-4" />
        LinkedIn
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook", shareLinks.facebook)}
        disabled={isPending}
      >
        <Facebook className="mr-1 size-4" />
        Facebook
      </Button>

      {/* Reddit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("reddit", shareLinks.reddit)}
        disabled={isPending}
      >
        <Share2 className="mr-1 size-4" />
        Reddit
      </Button>
    </div>
  )
}
