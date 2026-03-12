import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { formatPercent } from "@/lib/utils";
import { getDashboardMetrics } from "@/lib/growth/repository";

export const dynamic = "force-dynamic";

function MetricCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

export default async function AdminGrowthPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="page-shell py-16 sm:py-20">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Internal analytics</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Growth dashboard
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          Monitor growth funnels: page views, email captures,
          and conversion into the core ApplyX product.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="ATS checks today"
          value={String(metrics.atsChecksToday)}
          helper="Successful resume scoring events."
        />
        <MetricCard
          label="Score page views"
          value={String(metrics.scorePageViewsToday)}
          helper="Public score pages opened."
        />
        <MetricCard
          label="Cover letters"
          value={String(metrics.coverLettersToday)}
          helper="Cover letters generated today."
        />
        <MetricCard
          label="Email captures"
          value={String(metrics.emailCapturesToday)}
          helper="Newsletter signups today."
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          label="ApplyX redirects"
          value={String(metrics.applyxRedirectsToday)}
          helper="Clicked through to main product."
        />
        <MetricCard
          label="Conversion rate"
          value={formatPercent(metrics.conversionRate)}
          helper="Redirects ÷ ATS checks."
        />
        <MetricCard
          label="Total pages indexed"
          value={String(metrics.totalIndexablePages)}
          helper="Across all page types in sitemap."
        />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-2">
        <SimpleBarChart
          title="ATS checks"
          description="Successful resume scoring events over the last 14 days."
          data={metrics.atsChecksSeries}
          colorClassName="bg-brand-500"
        />
        <SimpleBarChart
          title="Cover letters generated"
          description="Cover letter tool usage over the last 14 days."
          data={metrics.coverLetterSeries}
          colorClassName="bg-emerald-500"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarChart
          title="Score page views"
          description="Public score share-page views over the last 14 days."
          data={metrics.scorePageViewsSeries}
          colorClassName="bg-cyan-500"
        />
        <SimpleBarChart
          title="Email captures"
          description="Newsletter signups over the last 14 days."
          data={metrics.emailCaptureSeries}
          colorClassName="bg-purple-500"
        />
      </section>

      <section className="mt-6">
        <SimpleBarChart
          title="ApplyX redirects"
          description="Users who clicked through to the main ApplyX product."
          data={metrics.applyxRedirectSeries}
          colorClassName="bg-amber-500"
        />
      </section>
    </div>
  );
}
