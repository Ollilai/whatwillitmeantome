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
            <p className="text-muted-foreground">
              Hi! I'm Olli from Kuusamo, Finland. I made whatwillitmeantome.com
              to raise conversation about the effect of AI and the imminent
              arrival of AGI. I hope the website gives you some ideas. This is
              an open-sourced project, you can find my GitHub repo from
              "Documents".
            </p>
          </CardContent>
        </Card>

        <Card id="terms-privacy">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-2xl font-semibold">Terms & Privacy</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="font-bold">
                Terms of Service & Privacy Policy (GDPR Compliant)
              </h3>

              <p className="italic">Last updated: March 17, 2024</p>

              <h4 className="mt-4 font-bold">1. Acceptance of Terms</h4>
              <p>
                By accessing or using Whatwillitmeantome.com ("Website"), you
                agree to be bound by these Terms of Service and Privacy Policy.
                If you disagree with any part of these terms, please discontinue
                use immediately.
              </p>

              <h4 className="mt-4 font-bold">2. Data Controller</h4>
              <p>
                The data controller for your personal information is:
                <br />
                What Will It Mean To Me, Helsinki, Finland,
                contact@whatwillitmeantome.com
              </p>

              <h4 className="mt-4 font-bold">3. Use of the Website</h4>
              <p>
                You agree to use the Website lawfully and ethically.
                Unauthorized use or distribution of Website content without
                permission is prohibited.
              </p>

              <h4 className="mt-4 font-bold">4. Intellectual Property</h4>
              <p>
                All content on this Website, including text, graphics, logos,
                and images, is the property of Whatwillitmeantome.com or its
                licensors and protected by copyright law.
              </p>

              <h4 className="mt-4 font-bold">5. Personal Data We Collect</h4>
              <p>
                We collect personal data such as name, email address, IP
                address, and usage data solely to enhance user experience,
                provide requested services, and ensure the functionality of our
                Website. We process this data based on your explicit consent or
                when necessary for the performance of our services.
              </p>

              <h4 className="mt-4 font-bold">6. Your Rights under GDPR</h4>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6">
                <li>Access your personal data</li>
                <li>Request rectification (correction)</li>
                <li>Request erasure (right to be forgotten)</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at the email below.
              </p>

              <h4 className="mt-4 font-bold">7. Cookies</h4>
              <p>
                Our Website uses cookies to personalize your experience and
                analyze site traffic. Cookies other than strictly necessary
                cookies require your explicit consent. You can disable cookies
                through your browser settings; however, this may affect Website
                functionality.
              </p>

              <h4 className="mt-4 font-bold">
                8. Third Parties and Data Transfers
              </h4>
              <p>
                We do not share your personal data with third parties unless
                explicitly required by law or with your explicit consent. Should
                any data transfer outside the EU/EEA occur, we will ensure
                compliance through appropriate safeguards (such as Standard
                Contractual Clauses).
              </p>

              <h4 className="mt-4 font-bold">9. Data Security</h4>
              <p>
                We implement robust industry-standard security measures to
                protect your personal information; however, no electronic
                transmission or storage can be guaranteed 100% secure.
              </p>

              <h4 className="mt-4 font-bold">10. Data Retention</h4>
              <p>
                We retain personal data only as long as necessary to fulfill the
                purposes for which it was collected or as required by applicable
                law.
              </p>

              <h4 className="mt-4 font-bold">
                11. Complaints and Contact Information
              </h4>
              <p>
                If you have concerns regarding your data privacy or processing,
                you have the right to lodge a complaint with the Finnish Data
                Protection Ombudsman (Tietosuojavaltuutettu) at:{" "}
                <a
                  href="https://tietosuoja.fi/en/home"
                  className="text-blue-600 hover:underline"
                >
                  https://tietosuoja.fi/en/home
                </a>
              </p>

              <p>
                For any questions or to exercise your rights, contact us at:
              </p>
              <ul className="list-none pl-0">
                <li>Email: contact@whatwillitmeantome.com</li>
                <li>Address: Helsinki, Finland</li>
              </ul>

              <h4 className="mt-4 font-bold">12. Changes to These Terms</h4>
              <p>
                We reserve the right to update our Terms and Privacy Policy
                periodically. All updates will be posted on this page with the
                effective date noted above. Continued use of the Website
                following changes constitutes acceptance of the updated terms.
              </p>

              <p className="mt-4">
                Thank you for using Whatwillitmeantome.com.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
