/* eslint-disable react/prop-types */
const LoadingRows = ({ count = 5, compact = false }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-2xl bg-slate-100 ${compact ? "h-12" : "h-20"}`}
        />
      ))}
    </div>
  );
};

export default LoadingRows;
