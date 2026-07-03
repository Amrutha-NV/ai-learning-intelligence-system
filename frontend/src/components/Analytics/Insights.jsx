import React from "react";

export default function Insights({ insights }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {insights.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}>
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <div className={`h-2 w-16 rounded-full ${item.accentBar ?? "bg-slate-200"}`} />
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}