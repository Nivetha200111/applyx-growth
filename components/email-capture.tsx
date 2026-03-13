"use client";

import { type FormEvent, useState } from "react";

type EmailCaptureProps = {
  context: string;
};

export function EmailCapture({ context }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, context })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to subscribe right now.");
      }

      setSuccess(true);
      setEmail("");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="retro-panel px-5 py-5 text-center">
        <p className="retro-kicker">You&apos;re subscribed</p>
        <p className="mt-3 text-sm font-medium text-brand-200">
          We&apos;ll send you job search tips, resume strategies, and career
          insights. No spam. Easy unsubscribe.
        </p>
      </div>
    );
  }

  return (
    <div className="retro-panel rounded-[2rem] p-6 sm:p-8">
      <p className="retro-kicker">Stay updated</p>
      <h3 className="mt-2 text-2xl font-black uppercase text-white">
        Weekly career tips in your inbox
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        Resume strategies, interview prep, salary negotiation tips, and career insights.
        Useful content only — no spam.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="min-w-0 flex-1 rounded-full border border-brand-400/20 bg-slate-950/80 px-5 py-3 text-sm text-slate-100 outline-none transition focus:border-brand-400 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="retro-button whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-rose-300">{error}</p>
      )}
    </div>
  );
}
