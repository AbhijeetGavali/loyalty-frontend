import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-slate-600">
          By using Regulars Club, you agree to these refund policies...
        </p>
        <div className="min-h-screen bg-background">
          <div className="container py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: May 2026
                </p>
                <p className="text-slate-600 mb-4">
                  These Refund Policies, along with the privacy policy
                  (“Terms”), constitute a binding agreement by and between{" "}
                  <strong className="font-semibold">
                    ABHIJEET BALASAHEB GAVALI
                  </strong>{" "}
                  (“Website Owner”, “we”, “us”, or “our”) and you (“you” or
                  “your”) regarding your use of the QR Code Generator website
                  and its services.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  1. Free Service
                </h2>
                <p className="text-muted-foreground mb-4">
                  Regulars Club is a free platform for customers. There are no
                  charges for collecting stamps or redeeming rewards through our
                  Service.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  2. Loyalty Rewards
                </h2>
                <p className="text-muted-foreground mb-4">
                  Rewards are provided by participating businesses. The terms
                  and conditions of each reward are set by the individual
                  business. Regulars Club is not responsible for the fulfillment
                  of rewards.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  3. Stamp Card Expiry
                </h2>
                <p className="text-muted-foreground mb-4">
                  Stamp cards may have expiry dates set by the business. Expired
                  stamps cannot be restored or refunded.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4. Business Subscription - Basic Plan
                </h2>
                <div className="text-muted-foreground mb-4">
                  For business partners using our Basic Plan (₹999/year):
                  <ul className="list-disc list-inside text-muted-foreground mt-2">
                    <li>3-day free trial with no payment required to start</li>
                    <li>Cancel anytime during trial at no cost</li>
                    <li>After trial, subscription is billed yearly</li>
                    <li>
                      Cancellation takes effect at the end of the current
                      billing period
                    </li>
                    <li>No partial refunds for unused subscription time</li>
                    <li>
                      Refund requests within 7 days of first payment may be
                      considered on a case-by-case basis
                    </li>
                  </ul>
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  5. Account Cancellation
                </h2>
                <p className="text-muted-foreground mb-4">
                  You may delete your account at any time. Upon deletion, all
                  your stamps and rewards will be permanently removed and cannot
                  be recovered.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  6. Disputes
                </h2>
                <p className="text-muted-foreground mb-4">
                  For any disputes regarding rewards or stamps, please contact
                  the participating business directly. For platform-related
                  issues, contact us at contact@ideasprout.in
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
