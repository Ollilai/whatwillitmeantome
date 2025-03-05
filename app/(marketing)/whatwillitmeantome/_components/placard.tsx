/**
 * @description
 * This client component generates a shareable "placard" that highlights
 * the user's profession and a short AI-generated summary. It uses
 * html2canvas to create an image from the rendered DOM. We have now
 * incorporated a SocialSharing component for Step 8 (social share).
 *
 * @responsibilities
 * - Renders a stylized "wrapped style" DOM node as an image
 * - Provides a "Generate Image" button that calls html2canvas
 * - Offers a "Download" button for the user
 * - Now includes <SocialSharing> for major platforms
 *
 * @notes
 * - The entire file is re-provided with the new social sharing import & usage
 * - We also pass the user's summary text and a site link to the SocialSharing
 */

"use client"

import React, { useCallback, useRef, useState } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { MistralReportData } from "./report-display"
import SocialSharing from "./social-sharing"

interface PlacardProps {
  /**
   * The user's profession for displaying in the placard.
   */
  profession: string

  /**
   * The AI analysis data, specifically the summary field is used on the placard.
   */
  data: MistralReportData
}

/**
 * Placard
 * Renders the stylized placard with the user's profession & summary,
 * plus share + download image functionality.
 */
export default function Placard({ profession, data }: PlacardProps) {
  // This ref is where we store the portion of the DOM we want to screenshot
  const placardRef = useRef<HTMLDivElement>(null)

  // We'll store the generated image URL in state so we can show a preview
  const [imageURL, setImageURL] = useState<string | null>(null)

  /**
   * handleGenerateImage
   * Uses html2canvas to capture the DOM segment and produce a data URL.
   * Stores the resulting base64 image in state.
   */
  const handleGenerateImage = useCallback(async () => {
    if (!placardRef.current) return

    try {
      // Capture the DOM
      const canvas = await html2canvas(placardRef.current, {
        scale: 2 // higher scale => higher resolution
      })

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png")

      setImageURL(dataUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }, [])

  /**
   * handleDownload
   * If imageURL is set, we create an anchor link & programmatically click it
   * so the user can download the PNG file.
   */
  const handleDownload = useCallback(() => {
    if (!imageURL) return

    const link = document.createElement("a")
    link.download = "my-career-placard.png"
    link.href = imageURL
    link.click()
  }, [imageURL])

  /**
   * We also want to provide a share link that leads back to the site or
   * a user-specific link. For MVP, we can just use the site link or
   * a placeholder. If we had a more robust system, we'd pass in a
   * param-based route for the user's specific result.
   */
  const siteURL = "https://whatwillitmeantome.com/" // or a dynamic link

  return (
    <div className="my-8 w-full max-w-3xl space-y-4">
      {/* The "placard" section to screenshot */}
      <div
        ref={placardRef}
        className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl"
      >
        <h2 className="text-xl font-bold uppercase tracking-wider">
          whatwillitmeantome.com
        </h2>

        <div className="mt-4 text-center">
          <p className="text-sm font-light opacity-80">Profession</p>
          <h1 className="text-2xl font-extrabold">{profession}</h1>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-light opacity-80">1-Sentence Summary</p>
          <h3 className="text-lg font-semibold italic">“{data.summary}”</h3>
        </div>

        {/* Sublabel to indicate the brand or year, etc. */}
        <div className="absolute bottom-3 text-xs opacity-60">
          Capture & Share Your Future
        </div>
      </div>

      {/* Buttons to generate image and/or download it */}
      <div className="flex gap-3">
        <Button onClick={handleGenerateImage} variant="default">
          Generate Image
        </Button>
        <Button onClick={handleDownload} variant="outline" disabled={!imageURL}>
          Download
        </Button>
      </div>

      {/* If we have generated an image, we can show a preview. */}
      {imageURL && (
        <div className="mt-4 rounded-md border p-3">
          <p className="text-muted-foreground mb-2 text-sm">
            Preview (right-click to save or use the "Download" button):
          </p>
          <img
            src={imageURL}
            alt="Preview"
            className="max-h-80 w-auto rounded-md border"
          />
        </div>
      )}

      {/* Social sharing row - using the summary as text, site link as url */}
      <SocialSharing text={data.summary} url={siteURL} />
    </div>
  )
}
