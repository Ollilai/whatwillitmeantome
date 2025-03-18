// Filepath: components/landing/header.tsx

/**
 * @description
 * This client component provides the header for the app's marketing pages.
 *
 * It is responsible for:
 * - Displaying site navigation links
 * - Handling a mobile menu with framer-motion
 *
 * Key features:
 * - Clean, modern, minimalistic design with bold typography
 * - Refined gradient effect with subtle animation
 * - Responsive layout with emphasis on the central question
 * - Elegant hover and scroll interactions
 *
 * @dependencies
 * - framer-motion for animations
 * - lucide-react for icons
 *
 * @notes
 * - Authentication has been removed as it's not needed for this project
 */

"use client"

import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/about", label: "About" },
  {
    href: "https://github.com/Ollilai/whatwillitmeantome",
    label: "Documentation",
    external: true
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Text animation variants - simplified for a more modern look
  const textVariants: Variants = {
    initial: { opacity: 0.9 },
    animate: {
      opacity: 1,
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  }

  return (
    <header
      className={`bg-background/95 sticky top-0 z-50 w-full backdrop-blur transition-all duration-300 ${
        isScrolled ? "border-b shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile menu toggle - Left side */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-foreground/80 hover:text-foreground"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>

        {/* Logo - Centered with refined styling */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
          <Link href="/" className="flex items-center">
            <motion.div
              className="relative py-1"
              initial="initial"
              animate="animate"
              whileHover="hover"
              variants={textVariants}
            >
              <motion.span className="animate-gradient-x header-glow bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-2xl font-black leading-none tracking-tight text-transparent sm:text-3xl">
                What will it mean to me?
              </motion.span>
            </motion.div>
          </Link>
        </div>

        {/* Desktop nav - Right side */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 hover:text-foreground text-sm font-medium decoration-blue-500/50 decoration-2 underline-offset-4 transition-colors hover:underline"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Empty div to balance the layout on mobile */}
        <div className="w-10 md:hidden"></div>
      </div>

      {/* Mobile nav - Simplified and more elegant */}
      {isMenuOpen && (
        <motion.div
          className="container md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-background/95 border-border/50 flex flex-col space-y-1 border-t px-1 py-3 backdrop-blur">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setIsMenuOpen(false)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  )
}
