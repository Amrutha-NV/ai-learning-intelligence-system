import React from "react";

export default function Graph({ title, subtitle, data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{subtitle}</h2>
      </div>

      <div className="space-y-5">
        {data.map((segment) => {
          const percentage = total ? Math.round((segment.value / total) * 100) : 0;
          return (
            <div key={segment.name}>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span>{segment.name}</span>
                </div>
                <span>{segment.value} hrs</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: segment.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Total</span>
          <strong>{total} hrs</strong>
        </div>
      </div>
    </div>
  );
}