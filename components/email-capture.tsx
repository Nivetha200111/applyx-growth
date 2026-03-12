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
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-center">
        <p className="text-sm font-medium text-emerald-100">
          You&apos;re in! We&apos;ll send you job search tips, resume
          strategies, and career insights — no spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <h3 className="text-lg font-semibold text-white">
        Get weekly job search tips in your inbox
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        Resume strategies, interview prep, salary negotiation tips, and career insights.
        No spam — unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="whitespace-nowrap rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-800"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-rose-300">{error}</p>
      )}
    </div>
  );
}

