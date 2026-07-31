/* eslint-disable react/prop-types */
const DateSeparator = ({ label }) => {
  return (
    <div className="sticky top-2 z-10 flex justify-center py-2">
      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        {label}
      </span>
    </div>
  );
};

export default DateSeparator;
