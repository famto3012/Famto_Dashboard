/* eslint-disable react/prop-types */
import { getInitials } from "@/utils/whatsapp/formatters";

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const Avatar = ({ name, src, online = false, size = "md" }) => {
  return (
    <div className={`relative shrink-0 ${sizeClasses[size] || sizeClasses.md}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-2xl object-cover ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-emerald-100 font-semibold text-emerald-700 ring-1 ring-emerald-200">
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
};

export default Avatar;
