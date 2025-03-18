/*
This server page displays information about the company, mission, and team.
It also includes Terms & Privacy information.
*/

"use server"

import { Card, CardContent } from "@/components/ui/card"

export default async function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>

      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Hi! I'm Olli from Kuusamo, Finland. I created
                WhatWillItMeanToMe.com to spark meaningful conversations about
                artificial intelligence (AI) and the approaching era of
                artificial general intelligence (AGI). My hope is that this
                website inspires curiosity, raises awareness, and encourages
                thoughtful reflection about the profound impacts AI and AGI
                could have on our lives, society, and future.
              </p>

              <h3 className="text-foreground mt-6 text-lg font-medium">
                How It's Built
              </h3>
              <p>
                This app was developed almost entirely vibe-coding with ChatGPT
                O1 Pro and Cursor, following the fantastic guide created by
                McKay Wrigley (
                <a
                  href="https://www.youtube.com/watch?v=Y4n_p9w8pGY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch it here
                </a>
                ).
              </p>

              <h3 className="text-foreground mt-6 text-lg font-medium">
                Get in Touch
              </h3>
              <p>
                Feel free to reach out if you have questions, thoughts, or just
                want to connect. You can contact me through my{" "}
                <a
                  href="https://github.com/Ollilai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub profile
                </a>{" "}
                or on{" "}
                <a
                  href="https://www.linkedin.com/in/olli-laitinen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
                .
              </p>

              <p>
                This project is open-source—you're invited to explore and see
                how it works behind the scenes. You can access the GitHub
                repository through the "Documents" section.
              </p>

              <p>
                Thank you for visiting and joining this important discussion!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="terms-privacy">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-2xl font-semibold">Terms & Privacy</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="font-bold">Privacy Notice (GDPR Compliant)</h3>

              <p className="italic">Last Updated: March 17, 2024</p>

              <h4 className="mt-4 font-bold">Who We Are</h4>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.whatwillitmeantome.com"
                  className="text-blue-600 hover:underline"
                >
                  www.whatwillitmeantome.com
                </a>
                <br />
                <strong>Contact:</strong> whatwillitmeantome@gmail.com
              </p>

              <h4 className="mt-4 font-bold">What Data We Collect and Why</h4>
              <p>
                We prioritize your privacy and handle your data responsibly:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  We collect anonymous usage data (such as IP address and
                  browser information) solely for ensuring website functionality
                  and improving user experience.
                </li>
                <li>
                  We do not store any personal information you submit (such as
                  profession, experience, or region).
                </li>
              </ul>

              <h4 className="mt-4 font-bold">How Your Data is Processed</h4>
              <p>When you request an analysis:</p>
              <ul className="list-disc pl-6">
                <li>
                  Your submitted information is immediately sent to a
                  third-party AI service (e.g., Mistral AI) to generate the
                  analysis.
                </li>
                <li>
                  We do not store or save any part of your personal input or the
                  resulting analysis in our database.
                </li>
                <li>
                  We log only anonymous usage events (e.g., counting the number
                  of analyses requested) without linking them to your identity
                  or submitted information.
                </li>
              </ul>

              <h4 className="mt-4 font-bold">
                Third-party AI Service & Consent
              </h4>
              <p>
                By submitting information on our website, you explicitly consent
                to this data being transmitted directly to third-party AI
                services for processing. We do not control or monitor these
                third-party services' use of your data once it is transmitted.
                If you do not consent, please do not submit personal data.
              </p>

              <h4 className="mt-4 font-bold">Cookies</h4>
              <p>
                We use cookies to enhance your experience and analyze site
                usage. You can manage your cookie preferences through your
                browser.
              </p>

              <h4 className="mt-4 font-bold">Your Rights</h4>
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6">
                <li>
                  Access, rectify, or erase your data (although we do not store
                  personal data beyond immediate processing)
                </li>
                <li>Object to or restrict processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise your rights, please contact us at:
                whatwillitmeantome@gmail.com
                <br />
                We will respond to your requests within one month.
              </p>

              <h4 className="mt-4 font-bold">Complaints</h4>
              <p>
                If you have privacy concerns, you can lodge a complaint with the
                Finnish Data Protection Ombudsman:{" "}
                <a
                  href="https://tietosuoja.fi/en/home"
                  className="text-blue-600 hover:underline"
                >
                  https://tietosuoja.fi/en/home
                </a>
              </p>

              <h4 className="mt-4 font-bold">Updates</h4>
              <p>
                This notice may be updated periodically. Check this page
                regularly for the latest information.
              </p>

              <p className="mt-4">
                Thank you for visiting Whatwillitmeantome.com.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
