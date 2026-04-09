import { motion } from "motion/react";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 md:px-8 bg-background selection:bg-accent/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground font-mono mb-10 border-b border-border pb-6">
          Last Updated: April 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>
            Welcome to CrossTable (“we,” “our,” or “us”), a chess tournament
            management platform. These Terms of Service (“Terms”) govern your
            access to and use of our website, services, and applications.
          </p>
          <p>
            By accessing or using CrossTable, you agree to be bound by these
            Terms. If you do not agree, you may not use the service.
          </p>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              1. Eligibility
            </h2>
            <p className="mb-3">
              You must be at least 13 years old (or the minimum legal age in
              your jurisdiction) to use CrossTable. By using our service, you
              represent that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You have the legal capacity to enter into these Terms</li>
              <li>The information you provide is accurate and complete</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Account Registration
            </h2>
            <p className="mb-3">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                Provide accurate information (email, FIDE ID, Chess.com
                username)
              </li>
              <li>Maintain the security of your account</li>
              <li>Accept responsibility for all activity under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that provide
              false or misleading information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Description of Service
            </h2>
            <p className="mb-3">CrossTable provides:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Chess tournament organization and management tools</li>
              <li>
                Integration with publicly available chess data (e.g., Chess.com)
              </li>
              <li>Player and match tracking features</li>
            </ul>
            <p>
              We may modify, suspend, or discontinue any part of the service at
              any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Use the platform for unlawful purposes</li>
              <li>
                Attempt to gain unauthorized access to systems or accounts
              </li>
              <li>Interfere with platform functionality or security</li>
              <li>Upload malicious code or exploit vulnerabilities</li>
              <li>Scrape, copy, or misuse platform data without permission</li>
            </ul>
            <p>
              Violation of this section may result in account suspension or
              termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. User Content and Data
            </h2>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              a. Ownership
            </h3>
            <p className="mb-3">
              You retain ownership of the data you provide (e.g., account
              details).
            </p>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              b. License to Us
            </h3>
            <p className="mb-2">
              You grant CrossTable a limited, non-exclusive license to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Use, store, and process your data</li>
              <li>Display tournament-related data as part of the service</li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              c. Public Data
            </h3>
            <p>
              Data retrieved from third-party platforms (e.g., Chess.com)
              remains subject to their respective terms and is considered
              publicly available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. Third-Party Services
            </h2>
            <p className="mb-3">
              CrossTable integrates with third-party services (e.g., Chess.com).
              We are not responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Accuracy of third-party data</li>
              <li>Availability or changes to external services</li>
            </ul>
            <p>Your use of third-party services is subject to their terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              7. Privacy
            </h2>
            <p>
              Your use of CrossTable is also governed by our Privacy Policy. We
              encourage you to review it to understand how we collect and use
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              8. Advertising
            </h2>
            <p className="mb-3">
              We may display advertisements, including through third-party
              vendors such as Google AdSense. By using CrossTable, you
              acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Ads may be personalized based on your activity</li>
              <li>
                Third-party vendors may use cookies and tracking technologies
              </li>
            </ul>
            <p>For more details, refer to our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              9. Intellectual Property
            </h2>
            <p className="mb-3">All platform content, including:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Design</li>
              <li>Branding</li>
              <li>Code</li>
              <li>Features</li>
            </ul>
            <p className="mb-3">
              are the property of CrossTable (unless otherwise stated) and are
              protected by applicable intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Copy, modify, distribute, or reverse-engineer any part of the
                service without permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              10. Termination
            </h2>
            <p className="mb-3">
              We may suspend or terminate your access if you:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Violate these Terms</li>
              <li>Engage in harmful or abusive behavior</li>
              <li>
                Use the service in a way that risks legal or security issues
              </li>
            </ul>
            <p>You may stop using the service at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              11. Disclaimers
            </h2>
            <p className="mb-3">
              CrossTable is provided “as is” and “as available.” We do not
              guarantee:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Continuous availability</li>
              <li>Accuracy of data (especially third-party data)</li>
              <li>That the service will be error-free or secure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              12. Limitation of Liability
            </h2>
            <p className="mb-3">
              To the fullest extent permitted by law, CrossTable shall not be
              liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of data, profits, or opportunities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              13. Indemnification
            </h2>
            <p className="mb-3">
              You agree to indemnify and hold CrossTable harmless from any
              claims, damages, or liabilities arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              14. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and interpreted in accordance
              with the laws of India, without regard to conflict of law
              principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              15. Changes to These Terms
            </h2>
            <p className="mb-3">We may update these Terms from time to time.</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Changes will be posted on this page</li>
              <li>
                Continued use of the service constitutes acceptance of updated
                Terms
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              16. Contact Information
            </h2>
            <p className="mb-4">
              For questions regarding these Terms:
              <br />
              Email:{" "}
              <a
                href="mailto:support.crosstable@gmail.com"
                className="text-accent hover:underline font-medium"
              >
                support.crosstable@gmail.com
              </a>
            </p>
            <p className="text-sm italic">
              Failure to enforce any provision of these Terms shall not be
              considered a waiver of that provision.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
