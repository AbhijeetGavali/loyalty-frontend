"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  IndianRupee,
  Users,
  Link2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const COMMISSIONS = [
  { plan: "Basic", price: "₹499/mo", earn: "₹99", rate: "20%" },
  { plan: "Growth", price: "₹999/mo", earn: "₹199", rate: "20%" },
  { plan: "Pro", price: "₹1,999/mo", earn: "₹399", rate: "20%" },
];

const STEPS = [
  { n: "01", title: "Apply", desc: "Fill the form below. Takes 2 minutes." },
  {
    n: "02",
    title: "Get Approved",
    desc: "We review and send you login credentials.",
  },
  {
    n: "03",
    title: "Share Your Link",
    desc: "Get a unique referral link for your audience.",
  },
  {
    n: "04",
    title: "Earn Commission",
    desc: "₹99–₹399 per business that subscribes.",
  },
];

const BENEFITS = [
  "Unique referral link + dashboard",
  "Real-time referral tracking",
  "UPI / Bank Transfer payouts",
  "Minimum payout ₹500",
  "No cap on earnings",
  "Dedicated affiliate support",
];

export default function AffiliateLandingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    website: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/public/affiliate/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error?.message || data.error || "Submission failed",
        );
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0C0A09] text-stone-100">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-stone-900">
        <Link
          href="/"
          className="text-sm font-black text-amber-400 tracking-tight"
        >
          RegularsClub
        </Link>
        <Link
          href="/affiliate-login"
          className="text-xs text-stone-400 hover:text-stone-200"
        >
          Affiliate Login →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <IndianRupee className="size-3" /> Affiliate Program
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-b from-white to-stone-400 bg-clip-text text-transparent">
          Earn by referring
          <br />
          cafe owners
        </h1>
        <p className="text-stone-400 text-lg mb-8">
          Introduce other business owners to RegularsClub and earn{" "}
          <span className="text-amber-400 font-bold">20% commission</span> on
          every subscription they activate.
        </p>
        <a
          href="#apply"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-2xl text-sm transition-colors"
        >
          Apply Now <ArrowRight className="size-4" />
        </a>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs font-black text-stone-500 uppercase tracking-widest text-center mb-10">
          How It Works
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="bg-stone-900/50 border border-stone-800 rounded-2xl p-5 space-y-2"
            >
              <span className="text-2xl font-black text-amber-500/40">
                {s.n}
              </span>
              <p className="text-sm font-black text-stone-100">{s.title}</p>
              <p className="text-xs text-stone-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission table */}
      <section className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-xs font-black text-stone-500 uppercase tracking-widest text-center mb-6">
          Commission Rates
        </p>
        <div className="border border-stone-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 bg-stone-900 px-4 py-2.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            <span>Plan</span>
            <span>Price</span>
            <span>You Earn</span>
            <span>Rate</span>
          </div>
          {COMMISSIONS.map((c, i) => (
            <div
              key={c.plan}
              className={`grid grid-cols-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-[#14100E]" : "bg-stone-900/30"}`}
            >
              <span className="font-bold text-stone-200">{c.plan}</span>
              <span className="text-stone-400">{c.price}</span>
              <span className="font-black text-amber-400">{c.earn}</span>
              <span className="text-stone-500">{c.rate}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-stone-600 text-center mt-3">
          Commission credited on first paid subscription. Min payout ₹500.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Users className="size-5 text-amber-400" />
            <p className="text-sm font-black text-stone-100">What You Get</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-xs text-stone-400"
              >
                <Check className="size-3 text-amber-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="max-w-lg mx-auto px-6 py-16">
        <p className="text-xs font-black text-stone-500 uppercase tracking-widest text-center mb-2">
          Apply to Join
        </p>
        <h2 className="text-2xl font-black text-center text-stone-100 mb-8">
          Start earning today
        </h2>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-black text-stone-100">
              Application Submitted!
            </p>
            <p className="text-xs text-stone-400">
              We'll review your application and email you within 48 hours.
            </p>
            <Link
              href="/"
              className="inline-block text-xs text-amber-400 hover:underline mt-2"
            >
              ← Back to home
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#14100E] border border-stone-800 rounded-2xl p-6"
          >
            {[
              {
                key: "name",
                label: "Full Name",
                placeholder: "Your name",
                type: "text",
                required: true,
              },
              {
                key: "email",
                label: "Email Address",
                placeholder: "you@example.com",
                type: "email",
                required: true,
              },
              {
                key: "website",
                label: "Website / Social Handle",
                placeholder: "https://yourblog.com (optional)",
                type: "text",
                required: false,
              },
            ].map((f) => (
              <div key={f.key} className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {f.label}
                </label>
                <Input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  required={f.required}
                  className="bg-stone-900 border-stone-800 text-stone-100 text-xs rounded-xl h-10"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                How will you promote?{" "}
                <span className="text-stone-700">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Food blog with 10k monthly readers, YouTube channel for cafe owners..."
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-xl p-3 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Submit Application
            </Button>
            <p className="text-[10px] text-stone-600 text-center">
              By applying you agree to our{" "}
              <a
                href="/affiliate-program/terms"
                className="text-amber-500 hover:underline"
              >
                Affiliate Terms & Policy
              </a>
              .
              <br />
              We review all applications within 48 hours.
            </p>
          </form>
        )}
      </section>

      <footer className="border-t border-stone-900 py-8 text-center">
        <p className="text-xs text-stone-600">
          © 2025 RegularsClub ·{" "}
          <Link href="/terms" className="hover:text-stone-400">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="hover:text-stone-400">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link
            href="/affiliate-program/terms"
            className="text-amber-600 hover:text-amber-400"
          >
            Affiliate Policy
          </Link>
        </p>
      </footer>
    </main>
  );
}
