/* eslint-disable react/prop-types */
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorState = ({ title = "Unable to load this section", message, onRetry }) => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 px-6 py-8 text-center">
      <ExclamationTriangleIcon className="h-8 w-8 text-rose-500" />
      <h3 className="mt-3 text-sm font-semibold text-rose-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-rose-700">
        {message || "Please refresh and try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
