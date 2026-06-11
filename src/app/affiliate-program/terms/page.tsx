import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Affiliate Program Terms & Policy — RegularsClub",
  description:
    "Terms, commission policy, payout rules, and code of conduct governing the RegularsClub Affiliate Program.",
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="space-y-3 pt-8 border-t border-stone-200 first:border-0 first:pt-0"
  >
    <h2 className="text-xl font-bold text-stone-900">{title}</h2>
    <div className="text-sm text-stone-600 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

export default function AffiliatePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto py-16 px-6 space-y-2">
        {/* Header */}
        <div className="pb-8">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            Legal
          </p>
          <h1 className="text-4xl font-black text-stone-900 mb-3">
            Affiliate Program Terms & Policy
          </h1>
          <p className="text-sm text-stone-500">
            Last updated: June 2026 · Effective immediately for all new
            applications
          </p>
          <p className="text-sm text-stone-600 mt-3">
            This Affiliate Program Agreement ("Agreement") is between{" "}
            <strong>ABHIJEET BALASAHEB GAVALI</strong> trading as{" "}
            <strong>RegularsClub</strong> ("Company", "we", "us") and you
            ("Affiliate"). By submitting an application or using your affiliate
            referral link, you accept this Agreement in full.
          </p>
        </div>

        {/* ToC */}
        <nav className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-1 text-xs">
          <p className="font-bold text-stone-700 mb-2">Contents</p>
          {[
            ["#eligibility", "1. Eligibility & Approval"],
            ["#referral", "2. Referral Mechanics"],
            ["#commission", "3. Commission Structure"],
            ["#payout", "4. Payout Policy"],
            ["#prohibited", "5. Prohibited Conduct"],
            ["#ip", "6. Intellectual Property"],
            ["#termination", "7. Termination"],
            ["#liability", "8. Limitation of Liability"],
            ["#tax", "9. Tax Obligations"],
            ["#governing", "10. Governing Law"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block text-amber-700 hover:underline"
            >
              {label}
            </a>
          ))}
        </nav>

        <Section id="eligibility" title="1. Eligibility & Approval">
          <p>
            The Affiliate Program is open to individuals and entities aged 18 or
            older. Participation requires submission of an application and
            explicit written approval from RegularsClub. Approval is at our sole
            discretion.
          </p>
          <p>
            Employees, contractors, and immediate family members of RegularsClub
            are not eligible.
          </p>
          <p>
            Approved affiliates receive login credentials via email. Your
            account is personal and non-transferable.
          </p>
          <p>
            <strong>
              RegularsClub reserves the right to reject any application without
              providing a reason.
            </strong>
          </p>
        </Section>

        <Section id="referral" title="2. Referral Mechanics">
          <p>
            Upon approval you receive a unique referral code ("Code") and link
            in the format:{" "}
            <code className="bg-stone-100 px-1 rounded text-xs">
              https://loyalty.ideasprout.in/register-business?ref=YOUR_CODE
            </code>
          </p>
          <p>
            <strong>Attribution window:</strong> 30 days from when a prospect
            first clicks your link. If they register within 30 days, the
            referral is attributed to you.
          </p>
          <p>
            <strong>One referral per business:</strong> Only the first valid
            affiliate code applied to a business registration is credited.
            Subsequent codes are ignored.
          </p>
          <p>
            <strong>Self-referral is prohibited.</strong> You may not refer your
            own business, businesses you control, or fictitious businesses.
            Violation results in immediate termination and forfeiture of all
            earnings.
          </p>
          <p>
            Commission is earned only when the referred business activates a{" "}
            <em>paid</em> subscription. Free trials and expired trials do not
            generate commission.
          </p>
        </Section>

        <Section id="commission" title="3. Commission Structure">
          <p>
            Commission is calculated as a flat <strong>20%</strong> of the
            referred business's <em>first monthly subscription payment</em>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100">
                <tr>
                  {["Plan", "Monthly Price", "Your Commission"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-bold text-stone-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Basic", "₹499", "₹99.80"],
                  ["Growth", "₹999", "₹199.80"],
                  ["Pro", "₹1,999", "₹399.80"],
                ].map(([p, pr, c]) => (
                  <tr key={p} className="border-t border-stone-100">
                    <td className="px-4 py-2 font-medium">{p}</td>
                    <td className="px-4 py-2">{pr}/mo</td>
                    <td className="px-4 py-2 font-bold text-amber-700">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Commission is <strong>one-time per referred business</strong> (first
            payment only). Recurring payments do not generate additional
            commission unless explicitly amended in writing.
          </p>
          <p>
            Commission rates are subject to change. Changes apply to referrals
            made <em>after</em> the effective date of the change and will be
            communicated via email with 14 days' notice.
          </p>
          <p>
            No commission is payable if: (a) the referral is fraudulent or
            self-referred; (b) the business requests a refund and the payment is
            reversed; (c) the referred business was already known to us through
            other channels with documented prior contact.
          </p>
        </Section>

        <Section id="payout" title="4. Payout Policy">
          <p>
            <strong>Minimum threshold:</strong> ₹500 accumulated balance
            required before a payout can be requested.
          </p>
          <p>
            <strong>Methods:</strong> UPI or Bank Transfer (NEFT/IMPS).
            International wire transfers are not supported.
          </p>
          <p>
            <strong>Processing time:</strong> Payout requests are reviewed
            within 7 business days. Payment is transferred within 14 business
            days of approval.
          </p>
          <p>
            <strong>Verification:</strong> We may request KYC documents
            (government-issued ID, PAN card) before processing any payout above
            ₹10,000. Failure to provide requested documents within 30 days will
            result in forfeiture of the payout request (not the balance).
          </p>
          <p>
            <strong>Chargebacks:</strong> If a referred business reverses their
            payment after commission has been credited, the commission amount
            will be deducted from your pending balance. If your balance is
            insufficient, future earnings will offset the deficit.
          </p>
          <p>
            RegularsClub is not responsible for transfer delays caused by your
            bank or payment provider.
          </p>
        </Section>

        <Section id="prohibited" title="5. Prohibited Conduct">
          <p>
            The following are strictly prohibited and will result in immediate
            termination and forfeiture of all pending earnings:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Paid search ads using RegularsClub brand keywords (e.g.,
              "RegularsClub", "Regulars Club loyalty")
            </li>
            <li>
              Misleading claims about features, pricing, or guarantees not
              stated in our official materials
            </li>
            <li>
              Spam — bulk unsolicited email, WhatsApp blasts, SMS campaigns to
              purchased lists
            </li>
            <li>
              Creating fake businesses or accounts to generate fraudulent
              referrals
            </li>
            <li>Cookie stuffing or forced redirects</li>
            <li>
              Impersonating RegularsClub employees or official communications
            </li>
            <li>
              Promoting the program on adult content, gambling, or politically
              divisive platforms
            </li>
          </ul>
          <p>
            RegularsClub reserves the right to audit referral activity at any
            time. Suspicious activity will be investigated and may result in
            account suspension pending investigation.
          </p>
        </Section>

        <Section id="ip" title="6. Intellectual Property">
          <p>
            RegularsClub grants you a limited, revocable, non-exclusive licence
            to use our name, logo, and approved marketing materials solely for
            the purpose of promoting the Affiliate Program.
          </p>
          <p>
            You may not modify our logo, create derivative branding, or use our
            trademarks in a way that implies a partnership, endorsement, or
            ownership beyond the affiliate relationship.
          </p>
          <p>
            All content you create to promote RegularsClub remains your
            property, but you grant us a licence to share or feature it with
            attribution.
          </p>
        </Section>

        <Section id="termination" title="7. Termination">
          <p>
            <strong>By you:</strong> You may terminate your participation at any
            time by emailing{" "}
            <a
              href="mailto:hello@ideasprout.in"
              className="text-amber-700 underline"
            >
              hello@ideasprout.in
            </a>
            . Pending balance above ₹500 will be paid out within 30 days of
            termination if verification is complete.
          </p>
          <p>
            <strong>By us:</strong> We may suspend or terminate your affiliate
            account at any time, with or without cause, with 7 days' notice (or
            immediately for violations of Section 5).
          </p>
          <p>
            Upon termination: your referral link is deactivated, no new
            commissions accrue, and pending balance (if legitimate) is paid
            within 30 days subject to verification.
          </p>
        </Section>

        <Section id="liability" title="8. Limitation of Liability">
          <p>
            RegularsClub's total liability to any Affiliate under this Agreement
            shall not exceed the commission amounts paid to that Affiliate in
            the 3 months preceding the claim.
          </p>
          <p>
            We are not liable for indirect, incidental, or consequential damages
            including lost profits from your affiliate activities.
          </p>
          <p>
            We make no guarantees about the volume of referrals you will
            generate or income you will earn.
          </p>
        </Section>

        <Section id="tax" title="9. Tax Obligations">
          <p>
            You are responsible for reporting and paying all applicable taxes on
            commissions earned. RegularsClub will issue a payment summary upon
            request for amounts above ₹10,000 in a financial year.
          </p>
          <p>
            TDS (Tax Deducted at Source) may be applicable as per Indian Income
            Tax Act provisions. We will deduct TDS where required by law before
            disbursing payouts.
          </p>
        </Section>

        <Section id="governing" title="10. Governing Law">
          <p>
            This Agreement is governed by the laws of India. Any disputes shall
            be subject to the exclusive jurisdiction of courts in Pune,
            Maharashtra.
          </p>
          <p>
            We may update this Agreement at any time. Continued use of your
            affiliate link after 14 days of a notified change constitutes
            acceptance of the updated terms.
          </p>
          <p>
            For questions:{" "}
            <a
              href="mailto:hello@ideasprout.in"
              className="text-amber-700 underline"
            >
              hello@ideasprout.in
            </a>
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
