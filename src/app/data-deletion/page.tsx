import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Account & Data Deletion</h1>
        <div className="min-h-screen bg-background">
          <div className="container py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: May 2026
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  How to Delete Your Account
                </h2>
                <p className="text-muted-foreground mb-4">
                  From the app: Profile → Account → Delete Account. Or email
                  privacy@ideasprout.in with subject &quot;Account Deletion Request&quot;
                  and your registered phone number.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  What Gets Deleted
                </h2>
                <p className="text-muted-foreground mb-4">
                  Profile data, subscriptions, delivery history, and proof
                  photos are permanently deleted within 30 days. Push tokens are
                  revoked immediately. Wallet balance is refunded per our Refund
                  Policy.
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  What We Retain
                </h2>
                <p className="text-muted-foreground mb-4">
                  Transaction records are retained for 7 years (IT Act, 2000).
                  Grievance records for 3 years (Consumer Protection Act, 2019).
                </p>
                <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  Contact
                </h2>

                <p className="text-muted-foreground mb-4">
                  Email: privacy@ideasprout.in
                </p>
                <p className="text-muted-foreground mb-4">
                  Grievance Officer: grievance@ideasprout.in
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
