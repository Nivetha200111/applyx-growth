import { formatDayLabel } from "@/lib/utils";

type SimpleBarChartProps = {
  title: string;
  description: string;
  data: Array<{
    day: string;
    value: number;
  }>;
  colorClassName: string;
};

export function SimpleBarChart({
  title,
  description,
  data,
  colorClassName
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      <div className="space-y-3">
        {data.map((point) => {
          const width = `${Math.max((point.value / maxValue) * 100, point.value > 0 ? 8 : 0)}%`;

          return (
            <div key={`${title}-${point.day}`} className="grid gap-2 md:grid-cols-[84px_1fr_40px] md:items-center">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {formatDayLabel(point.day)}
              </span>
              <div className="h-3 rounded-full bg-white/5">
                <div className={`h-3 rounded-full ${colorClassName}`} style={{ width }} />
              </div>
              <span className="text-right text-sm text-slate-200">{point.value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

