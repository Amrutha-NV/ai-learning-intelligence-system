import React from "react";

export default function Heading({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-3xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}