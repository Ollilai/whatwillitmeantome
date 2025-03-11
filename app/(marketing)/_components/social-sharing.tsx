/**
 * @description
 * Renders social sharing buttons for Twitter, LinkedIn, Facebook, and Reddit.
 * On click, logs share usage events in the background via onShareAction.
 *
 * Responsibilities:
 * - Provide clickable icons that open share links in new windows
 * - Call the server action to log usage for share events
 * - Display error toasts on failure
 *
 * Key Features:
 * - Each button calls handleShare(network, shareUrl)
 * - handleShare opens a new tab for sharing & calls onShareAction in the background
 * - We display a small "Share your results:" label plus buttons for each network
 *
 * @dependencies
 * - onShareAction from app/(marketing)/actions-whatwillitmeantome
 * - React Hook useTransition & useToast from Shadcn
 *
 * @notes
 * - This code was updated to confirm that usage logs are created
 * - The "text" prop is typically the short AI placard from the result
 */

"use client"

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react"
import { onShareAction } from "../actions-whatwillitmeantome"

interface SocialSharingProps {
  /**
   * The text or summary to share, typically from Mistral's one-sentence summary (placard).
   */
  text: string

  /**
   * The URL that leads back to the site or a relevant page link.
   */
  url: string
}

/**
 * @function SocialSharing
 * A client component that renders social share buttons for multiple platforms.
 * On click, it calls onShareAction(network) in the background to log usage,
 * and opens a new tab with the share URL.
 *
 * @param text - The snippet text or summary to share
 * @param url - The link you want included in the share
 */
export default function SocialSharing({ text, url }: SocialSharingProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  /**
   * Composes a share URL, opens in new tab, logs usage in background
   */
  function handleShare(network: string, shareUrl: string) {
    // Open the share link in a new window
    window.open(shareUrl, "_blank", "noopener,noreferrer")

    // Log usage asynchronously
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

  // Build share URLs, encoding the snippet text and site URL
  const encodedText = encodeURIComponent(text)
  const encodedURL = encodeURIComponent(url)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedURL}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    reddit: `https://reddit.com/submit?url=${encodedURL}&title=${encodedText}`
  }

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
        <Twitter className="mr-1" />
        Twitter
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin", shareLinks.linkedin)}
        disabled={isPending}
      >
        <Linkedin className="mr-1" />
        LinkedIn
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook", shareLinks.facebook)}
        disabled={isPending}
      >
        <Facebook className="mr-1" />
        Facebook
      </Button>

      {/* Reddit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("reddit", shareLinks.reddit)}
        disabled={isPending}
      >
        <Share2 className="mr-1" />
        Reddit
      </Button>
    </div>
  )
}
