import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-shell py-20">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Not found</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">
          The page you requested does not exist yet or the score page may have expired.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

