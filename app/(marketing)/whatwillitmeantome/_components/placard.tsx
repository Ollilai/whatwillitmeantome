/**
 * @description
 * This client component generates a shareable "placard" that highlights
 * the user's profession and a short AI-generated summary. It uses
 * html2canvas to create an image from the rendered DOM.
 *
 * It is responsible for:
 * - Rendering a stylized "Spotify Wrapped"-inspired layout with user data
 * - Providing a button to capture the DOM as an image and download it
 *
 * Key features:
 * - Visual design using Tailwind for a "wrapped" aesthetic
 * - "Generate Image" button triggers html2canvas
 * - On success, the user can download or preview the resulting image
 *
 * @dependencies
 * - React: For building the UI
 * - html2canvas: For converting DOM to an image
 * - Shadcn UI components: For styling
 *
 * @notes
 * - The data includes the user's profession, region, or summary. Here,
 *   we primarily highlight the summary and profession, but we can customize more.
 * - We store a local "imageURL" state to show the generated image if we want.
 */

"use client"

import React, { useCallback, useRef, useState } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { MistralReportData } from "./report-display"

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
 * Placard component that captures a "wrapped style" DOM node as an image
 * and lets the user download the resulting PNG.
 */
export default function Placard({ profession, data }: PlacardProps) {
  // This ref is where we store the portion of the DOM we want to screenshot
  const placardRef = useRef<HTMLDivElement>(null)

  // We'll store the generated image URL in state so we can show a preview
  const [imageURL, setImageURL] = useState<string | null>(null)

  /**
   * Function to generate an image using html2canvas.
   * We then create a blob url so the user can download or see a preview.
   */
  const handleGenerateImage = useCallback(async () => {
    if (!placardRef.current) return

    try {
      // Capture the DOM
      const canvas = await html2canvas(placardRef.current, {
        scale: 2 // higher scale => higher resolution
      })

      // Convert to a data URL
      const dataUrl = canvas.toDataURL("image/png")

      setImageURL(dataUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }, [])

  /**
   * Provide a convenient "Download" button for the user.
   * If imageURL is set, we can create an anchor link and programmatically click it.
   */
  const handleDownload = useCallback(() => {
    if (!imageURL) return

    const link = document.createElement("a")
    link.download = "my-career-placard.png"
    link.href = imageURL
    link.click()
  }, [imageURL])

  return (
    <div className="my-8 w-full max-w-3xl space-y-4">
      {/* The "placard" section: visually styled portion we will screenshot */}
      <div
        ref={placardRef}
        className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl"
      >
        {/* Some decorative shapes or gradient could be placed here */}
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
    </div>
  )
}
