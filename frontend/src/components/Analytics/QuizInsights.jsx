import React from "react";
import { Brain, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const iconMap = {
  TrendingUp,
  Brain,
  CheckCircle2,
  Clock,
};

export default function QuizInsights({ title, subtitle, insights }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{subtitle}</h2>
      </div>

      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = iconMap[item.icon] || Clock;
          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ${item.color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}