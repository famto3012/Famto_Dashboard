/* eslint-disable react/prop-types */
const SectionPanel = ({ title, description, action,create, children, className = "" }) => {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-950">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {action}
          {create}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
};

export default SectionPanel;
