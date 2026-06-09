import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-600">
          Your privacy is important to Regulars Club. We are committed to
          protecting your data...
        </p>
        <div className="min-h-screen bg-background">
          <div className="container py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: January 2025
                </p>
                <p className="text-slate-600 mb-4">
                  These Terms and Conditions, along with the privacy policy
                  (“Terms”), constitute a binding agreement by and between{" "}
                  <strong className="font-semibold">
                    ABHIJEET BALASAHEB GAVALI
                  </strong>{" "}
                  (“Website Owner”, “we”, “us”, or “our”) and you (“you” or
                  “your”) regarding your use of the QR Code Generator website
                  and its services.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly, including phone
                  number, name, email, and location data when you use our
                  Service.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use your information to provide and improve the Service,
                  process loyalty rewards, verify your location for stamp
                  collection, and communicate with you about your account.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  3. Location Data
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect location data to verify that you are at a
                  participating business when scanning QR codes. This data is
                  used only for verification purposes and is not stored
                  permanently.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4. Data Sharing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share data
                  with participating businesses for the purpose of providing
                  loyalty rewards.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures
                  to protect your data against unauthorized access, alteration,
                  or destruction.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  6. Your Rights
                </h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to access, correct, or delete your personal
                  data. Contact us at contact@ideasprout.in to exercise these rights.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  7. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use local storage and session data to maintain your login
                  status and preferences. We do not use third-party tracking
                  cookies.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  8. Business Partner Data
                </h2>
                <p className="text-muted-foreground mb-4">
                  For business partners using our Basic Plan (₹999/year), we
                  collect additional information including business details,
                  payment information for subscription billing, and analytics
                  data about customer visits and rewards. This data is used to
                  provide the loyalty platform service and generate insights for
                  business owners.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  9. Contact
                </h2>
                <p className="text-muted-foreground mb-4">
                  For privacy-related inquiries, please contact us at{" "}
                  <a
                    href="mailto:contact@ideasprout.in"
                    className="text-primary hover:underline"
                  >
                    contact@ideasprout.in
                  </a>
                </p>
              </div>

              {/* Affiliate-specific privacy notice */}
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-2">Affiliate Program — Data We Collect</h2>
                <p className="text-sm text-stone-600 mb-2">
                  When you apply for or participate in our Affiliate Program, we collect:
                </p>
                <ul className="text-sm text-stone-600 list-disc pl-5 space-y-1 mb-3">
                  <li>Name, email address, and website/social handle provided in your application</li>
                  <li>Referral activity: which businesses registered using your code and their subscription status</li>
                  <li>Payout details: UPI ID or bank account information for commission disbursement</li>
                  <li>KYC documents (government ID, PAN) for payouts above ₹10,000 as required by Indian law</li>
                </ul>
                <p className="text-sm text-stone-600 mb-3">
                  This data is used solely to operate the affiliate program, calculate and pay commissions, and comply with tax regulations. It is never sold to third parties.
                </p>
                <a
                  href="/affiliate-program/terms"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline"
                >
                  Read the full Affiliate Program Terms & Policy →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
