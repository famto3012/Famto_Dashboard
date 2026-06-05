/* eslint-disable react/prop-types */
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange, placeholder = "Search chats, phone, order ID" }) => {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
