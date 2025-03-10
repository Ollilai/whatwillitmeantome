"use client"

/**
 * @description
 * Renders social sharing buttons for Twitter, LinkedIn, Facebook, and Reddit.
 * Logs share usage events in the background using onShareAction.
 *
 * @responsibilities
 * - Provide clickable icons that open share links in new windows
 * - Call the server action to log usage
 *
 * @notes
 * - Must import onShareAction from our new location
 */

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react"
import { onShareAction } from "../actions-whatwillitmeantome"

interface SocialSharingProps {
  /**
   * The text or summary to share, typically from Mistral's one-sentence summary.
   */
  text: string

  /**
   * The URL that leads back to the site or a user-specific link.
   */
  url: string
}

/**
 * Provides social share buttons. On click, opens share URL in a new tab
 * and logs a usage event with onShareAction.
 */
export default function SocialSharing({ text, url }: SocialSharingProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  /**
   * Composes a share URL, opens in new tab, logs usage in background.
   */
  function handleShare(network: string, shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer")

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

  // Build share URLs
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
