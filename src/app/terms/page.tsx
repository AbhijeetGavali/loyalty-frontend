import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-600">
          By using Regulars Club, you agree to these terms and conditions...
        </p>
        <div className="min-h-screen bg-background">
          <div className="container py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: May 2026
                </p>
                <p className="text-slate-600 mb-4">
                  These Terms and Conditions, along with the privacy policy
                  (“Terms”), constitute a binding agreement by and between{" "}
                  <strong className="font-semibold">ABHIJEET BALASAHEB GAVALI</strong> (“Website Owner”,
                  “we”, “us”, or “our”) and you (“you” or “your”) regarding your
                  use of the QR Code Generator website and its services.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground mb-4">
                  By accessing or using the Regulars Club platform ("Service"),
                  you agree to be bound by these Terms and Conditions. If you do
                  not agree to these terms, please do not use our Service.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground mb-4">
                  Regulars Club is a digital loyalty rewards platform that
                  allows customers to earn stamps by visiting participating
                  businesses. Upon completing a stamp card, customers can redeem
                  rewards offered by the establishment.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground mb-4">
                  You must provide accurate information when creating an
                  account. You are responsible for maintaining the
                  confidentiality of your account credentials and for all
                  activities under your account.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4. Loyalty Rewards
                </h2>
                <p className="text-muted-foreground mb-4">
                  Rewards are offered by individual participating businesses and
                  are subject to their terms. Regulars Club does not guarantee
                  the availability of any reward and is not responsible for the
                  quality of rewards provided by businesses.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  5. User Conduct
                </h2>
                <p className="text-muted-foreground mb-4">
                  You agree not to misuse the Service, attempt to earn stamps
                  fraudulently, or interfere with the platform's operation.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  6. Limitation of Liability
                </h2>
                <p className="text-muted-foreground mb-4">
                  Regulars Club is provided "as is" without warranties. We are
                  not liable for any indirect, incidental, or consequential
                  damages arising from your use of the Service.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  7. Changes to Terms
                </h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time.
                  Continued use of the Service after changes constitutes
                  acceptance of the new terms.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  8. Business Subscription Plans
                </h2>
                <p className="text-muted-foreground mb-4">
                  For businesses and partners, Regulars Club offers the "Basic
                  Plan" at ₹999/year. This includes a 3-day free trial with no
                  payment required to start. Features include unlimited loyalty
                  cards, custom rewards &amp; stamps, QR code generation, and
                  analytics dashboard. Subscription can be cancelled at any
                  time. Post-trial, businesses will be billed yearly. Refund
                  policy for subscriptions is outlined in our Refund &amp;
                  Cancellation section.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  9. Governing Law
                </h2>
                <p className="text-muted-foreground mb-4">
                  These Terms shall be governed by the laws ofIndia. All
                  disputes are subject to the exclusive jurisdiction of the
                  courts in Pune, Maharashtra.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  10. Contact
                </h2>
                <p className="text-muted-foreground mb-4">
                  For questions about these terms, please contact us at{" "}
                  <a
                    href="mailto:contact@ideasprout.in"
                    className="text-primary hover:underline"
                  >
                    contact@ideasprout.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
