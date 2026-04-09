import { motion } from "motion/react";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 md:px-8 bg-background selection:bg-accent/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground font-mono mb-10 border-b border-border pb-6">
          Last Updated: April 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>
            CrossTable (“we,” “our,” or “us”) operates a chess tournament
            management platform. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            services.
          </p>
          <p>
            This policy is designed to comply with applicable data protection
            laws, including the General Data Protection Regulation (GDPR) and
            California Consumer Privacy Act (CCPA/CPRA) where applicable. By
            using CrossTable, you agree to this Privacy Policy.
          </p>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We follow the principle of data minimization and collect only what
              is necessary.
            </p>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              a. Information You Provide
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                <strong>Email Address</strong> – for account creation, login,
                and OTP verification
              </li>
              <li>
                <strong>FIDE ID</strong> – for identifying official chess
                records
              </li>
              <li>
                <strong>Chess.com Username</strong> – to retrieve publicly
                available chess data
              </li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              b. Automatically Collected Information
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Usage data (pages visited, interactions, timestamps)</li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              c. Public Data from Third Parties
            </h3>
            <p>
              We retrieve publicly available chess data (e.g., ratings, match
              history) from platforms like Chess.com using your provided
              username.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Legal Basis for Processing (GDPR)
            </h2>
            <p className="mb-3">
              If you are located in the European Economic Area (EEA), we process
              your data under the following legal bases:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contractual Necessity</strong> – to provide account
                access and platform functionality
              </li>
              <li>
                <strong>Legitimate Interests</strong> – to improve services,
                prevent fraud, and ensure security
              </li>
              <li>
                <strong>Consent</strong> – for cookies, advertising, and
                optional features
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-3">We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create and manage your account</li>
              <li>Authenticate users via OTP</li>
              <li>Operate and maintain tournaments</li>
              <li>Fetch and display public chess data</li>
              <li>Improve platform performance and features</li>
              <li>Ensure security and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Session Management and Security
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                We use JSON Web Tokens (JWT) stored in local storage for
                authentication.
              </li>
              <li>
                We implement safeguards against unauthorized access, including
                secure backend validation and token expiration.
              </li>
              <li>
                Despite our efforts, no method of transmission or storage is
                100% secure.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. Data Sharing and Disclosure
            </h2>
            <p className="mb-3">
              We do not sell personal data. We may share information with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Service Providers</strong> (e.g., hosting, analytics,
                infrastructure providers)
              </li>
              <li>
                <strong>Legal Authorities</strong> when required by law
              </li>
              <li>
                <strong>Third-Party APIs</strong> (e.g., Chess.com) for public
                data retrieval
              </li>
            </ul>
            <p>
              All third-party processors are required to handle data in
              accordance with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. International Data Transfers
            </h2>
            <p className="mb-3">
              Your data may be processed in countries outside your jurisdiction.
              Where required, we implement safeguards such as:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Equivalent data protection measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              7. Data Retention
            </h2>
            <p className="mb-3">
              We retain personal data only for as long as necessary to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Provide our services</li>
              <li>Meet legal obligations</li>
              <li>Resolve disputes</li>
            </ul>
            <p>You may request deletion at any time (see Section 10).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              8. Advertising and Cookies (AdSense-Compliant)
            </h2>
            <p className="mb-3">
              We use Google AdSense and other third-party advertising vendors.
            </p>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              a. Use of Cookies
            </h3>
            <p className="mb-2">
              Cookies and similar technologies are used to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Maintain sessions</li>
              <li>Analyze usage</li>
              <li>Serve advertisements</li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              b. Third-Party Vendors
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                Third-party vendors, including Google, use cookies to serve ads
                based on prior visits to this and other websites.
              </li>
              <li>
                Google’s use of advertising cookies enables it and its partners
                to serve ads based on your browsing behavior.
              </li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              c. Personalized Advertising
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>We may display personalized ads based on user interests.</li>
              <li>
                These ads are powered by third-party cookies and tracking
                technologies.
              </li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              d. Opt-Out Options
            </h3>
            <p className="mb-2">
              You can opt out of personalized advertising by:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                Visiting Google Ads Settings:{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  adssettings.google.com
                </a>
              </li>
              <li>
                Visiting{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  www.aboutads.info
                </a>{" "}
                or{" "}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  optout.networkadvertising.org
                </a>
              </li>
              <li>Adjusting your browser settings to block cookies</li>
            </ul>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              e. Consent (Where Required)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                In jurisdictions requiring consent (e.g., EEA), we will request
                your consent before setting non-essential cookies.
              </li>
              <li>You may withdraw consent at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              9. Your Privacy Rights
            </h2>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              a. GDPR Rights (EEA Users)
            </h3>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Access your data</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data (“Right to be Forgotten”)</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mb-4">
              You also have the right to lodge a complaint with a data
              protection authority.
            </p>

            <h3 className="font-semibold text-foreground mt-4 mb-2">
              b. CCPA/CPRA Rights (California Users)
            </h3>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Know what personal data is collected</li>
              <li>Request deletion of your data</li>
              <li>Correct inaccurate data</li>
              <li>Opt out of “sale” or “sharing” of personal data</li>
            </ul>
            <p>
              Note: We do not sell personal data. To exercise your rights,
              contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              10. Data Deletion Requests
            </h2>
            <p className="mb-3">
              You may request deletion of your account and associated data by
              contacting us. We will:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify your identity</li>
              <li>Process your request within a reasonable timeframe</li>
              <li>Retain minimal data if legally required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              11. Children’s Privacy
            </h2>
            <p>
              CrossTable is not intended for individuals under the age of 13 (or
              equivalent minimum age in your jurisdiction). We do not knowingly
              collect personal data from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              12. Third-Party Links
            </h2>
            <p>
              Our platform may contain links to third-party websites. We are not
              responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              13. Data Security
            </h2>
            <p className="mb-3">
              We implement appropriate technical and organizational measures,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Encryption in transit (HTTPS)</li>
              <li>Secure authentication mechanisms</li>
              <li>Access controls</li>
            </ul>
            <p>However, no system is completely secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              14. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Updates will be
              reflected with a revised “Last Updated” date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              15. Contact Information
            </h2>
            <p>
              For privacy-related inquiries or requests:
              <br />
              Email:{" "}
              <a
                href="mailto:support.crosstable@gmail.com"
                className="text-accent hover:underline font-medium"
              >
                support.crosstable@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              16. Consent
            </h2>
            <p>
              By using CrossTable, you acknowledge that you have read and
              understood this Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
