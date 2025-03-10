/**
 * @description
 * This client page is the current marketing homepage.
 *
 * It is responsible for:
 *  - Displaying a hero section or other marketing content for the top-level route "/"
 *
 * Key features:
 *  - Renders a <HeroSection /> from our "landing" directory
 *  - Showcases a big headline and a CTA button
 *
 * @notes
 *  - In Step 3, we will replace this with or unify it to "WhatWillItMeantome" logic
 *  - Currently no blocking references or placeholders that conflict with upcoming steps
 */

"use client"

import { HeroSection } from "@/components/landing/hero"

export default function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
    </div>
  )
}
