/* eslint-disable react/prop-types */
const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusTone = {
  open: "emerald",
  running: "emerald",
  approved: "emerald",
  verified: "emerald",
  success: "emerald",
  delivered: "sky",
  clicked: "sky",
  read: "sky",
  pending: "amber",
  scheduled: "amber",
  draft: "amber",
  medium: "amber",
  failed: "rose",
  rejected: "rose",
  urgent: "rose",
  high: "rose",
  completed: "slate",
  resolved: "slate",
};

const StatusBadge = ({ children, tone, size = "sm", dot = false }) => {
  const label = String(children || "");
  const resolvedTone = tone || statusTone[label.toLowerCase()] || "slate";
  const sizeClass = size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ${sizeClass} ${toneClasses[resolvedTone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
};

export default StatusBadge;
