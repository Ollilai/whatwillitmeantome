/**
 * @description
 * Renders social sharing buttons for LinkedIn and Reddit, along with options to copy text and download as image.
 * On click, logs share usage events in the background via onShareAction.
 *
 * Responsibilities:
 * - Provide clickable icons that open share links in new windows
 * - Allow copying text to clipboard
 * - Enable downloading the content as an image
 * - Call the server action to log usage for share events
 * - Display error toasts on failure
 *
 * Key Features:
 * - Each button calls handleShare(network, shareUrl)
 * - Copy text uses clipboard API
 * - Download image uses html2canvas
 * - All actions log usage via onShareAction
 *
 * @dependencies
 * - onShareAction from app/(marketing)/actions-whatwillitmeantome
 * - React Hook useTransition & useToast from Shadcn
 * - html2canvas for image generation (dynamically imported)
 *
 * @notes
 * - The "text" prop is typically the short AI placard from the result
 * - The elementRef is used to capture the element for image download
 */

"use client"

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Linkedin, Share2, Copy, Download } from "lucide-react"
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

  /**
   * Optional reference to the element to capture for image download
   */
  elementRef?: React.RefObject<HTMLElement>
}

/**
 * @function SocialSharing
 * A client component that renders social share buttons for multiple platforms.
 * On click, it calls onShareAction(network) in the background to log usage,
 * and opens a new tab with the share URL.
 *
 * @param text - The snippet text or summary to share
 * @param url - The link you want included in the share
 * @param elementRef - Optional reference to the element to capture for image download
 */
export default function SocialSharing({
  text,
  url,
  elementRef
}: SocialSharingProps) {
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

  /**
   * Copies the text to clipboard
   */
  function handleCopyText() {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: "Text copied to clipboard"
        })

        // Log usage
        startTransition(async () => {
          await onShareAction("copy_text")
        })
      },
      err => {
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard",
          variant: "destructive"
        })
        console.error("Could not copy text: ", err)
      }
    )
  }

  /**
   * Downloads the element as an image
   */
  async function handleDownloadImage() {
    if (!elementRef?.current) {
      toast({
        title: "Download failed",
        description: "Could not generate image",
        variant: "destructive"
      })
      return
    }

    try {
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(elementRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null,
        logging: false
      })

      // Create download link
      const link = document.createElement("a")
      link.download = "ai-insight.png"
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast({
        title: "Downloaded!",
        description: "Image saved to your downloads"
      })

      // Log usage
      startTransition(async () => {
        await onShareAction("download_image")
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Download failed",
        description: "Could not generate image",
        variant: "destructive"
      })
    }
  }

  // Build share URLs, encoding the snippet text and site URL
  const encodedText = encodeURIComponent(text)
  const encodedURL = encodeURIComponent(url)

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
    reddit: `https://reddit.com/submit?url=${encodedURL}&title=${encodedText}`
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Copy Text */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyText}
        className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
      >
        <Copy className="mr-1 size-4" />
        Copy Text
      </Button>

      {/* Download Image */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadImage}
        className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
        disabled={!elementRef?.current}
      >
        <Download className="mr-1 size-4" />
        Download Image
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin", shareLinks.linkedin)}
        disabled={isPending}
        className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
      >
        <Linkedin className="mr-1 size-4" />
        LinkedIn
      </Button>

      {/* Reddit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("reddit", shareLinks.reddit)}
        disabled={isPending}
        className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50"
      >
        <Share2 className="mr-1 size-4" />
        Reddit
      </Button>
    </div>
  )
}
