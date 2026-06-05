/* eslint-disable react/prop-types */
const StatCard = ({ label, value, hint, icon: Icon, tone = "emerald" }) => {
  const toneClasses = {
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    sky: "bg-sky-50 text-sky-600 ring-sky-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`rounded-2xl p-2 ring-1 ${toneClasses[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {hint && <p className="mt-3 text-xs font-medium text-slate-500">{hint}</p>}
    </div>
  );
};

export default StatCard;
