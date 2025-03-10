"use client"

/**
 * @description
 * Renders social sharing buttons for Twitter, LinkedIn, Facebook, and Reddit.
 * Logs share usage events in the background using onShareAction.
 *
 * @responsibilities
 * - Provide clickable icons that open share links in new windows
 * - Call the server action to log usage
 */

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Linkedin, Facebook, Share2 } from "lucide-react"
import { onShareAction } from "../../actions-whatwillitmeantome"

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
   * Opens a share URL in a new window and logs the share event.
   */
  function handleShare(network: string, shareUrl: string) {
    // Open the share URL in a new window
    window.open(shareUrl, "_blank")

    // Log the share event
    startTransition(async () => {
      try {
        await onShareAction(network)
      } catch (error) {
        console.error(`Error logging ${network} share:`, error)
      }
    })

    // Show a toast notification
    toast({
      title: "Shared!",
      description: `Your analysis has been shared to ${network}.`
    })
  }

  // Encode the text and URL for sharing
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleShare(
            "twitter",
            `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
          )
        }
        disabled={isPending}
      >
        <Twitter className="mr-1 size-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleShare(
            "linkedin",
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
          )
        }
        disabled={isPending}
      >
        <Linkedin className="mr-1 size-4" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleShare(
            "facebook",
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
          )
        }
        disabled={isPending}
      >
        <Facebook className="mr-1 size-4" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleShare(
            "reddit",
            `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`
          )
        }
        disabled={isPending}
      >
        <Share2 className="mr-1 size-4" />
        Reddit
      </Button>
    </div>
  )
}
