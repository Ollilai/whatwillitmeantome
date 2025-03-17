/*
This client component provides a video dialog for the hero section.
*/

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, XIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import Image from "next/image"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  }
}

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  // Generate unique IDs for accessibility
  const dialogId = "hero-video-dialog"
  const dialogLabelId = "hero-video-dialog-title"

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isVideoOpen}
        aria-controls={dialogId}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsVideoOpen(true)
          }
        }}
      >
        <span className="sr-only">Play video</span>
        {!imageError ? (
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            width={1920}
            height={1080}
            className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex aspect-video w-full items-center justify-center rounded-md border bg-gray-100 shadow-lg"
            aria-label="Video thumbnail image not available"
          >
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
        <div
          className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100"
          aria-hidden="true"
        >
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogLabelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <h2 id={dialogLabelId} className="sr-only">
                Video Player
              </h2>
              <motion.button
                className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
                onClick={e => {
                  e.stopPropagation()
                  setIsVideoOpen(false)
                }}
                aria-label="Close video"
              >
                <XIcon className="size-5" aria-hidden="true" />
              </motion.button>
              <div
                className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white"
                onClick={e => e.stopPropagation()}
              >
                <iframe
                  src={videoSrc}
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title="Embedded video content"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
