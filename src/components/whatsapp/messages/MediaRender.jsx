/* eslint-disable react/prop-types */
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  MapPinIcon,
  PhotoIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/utils/whatsapp/formatters";

const MediaRenderer = ({ message, outbound = false }) => {
  const media = message.media || {};
  const link = media.url || media.link;

  if (message.type === "image") {
    return (
      <figure className="space-y-2">
        {link ? (
          <img
            src={link}
            alt={media.fileName || "WhatsApp image"}
            className="max-h-[320px] w-full max-w-[360px] rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-44 w-72 items-center justify-center rounded-2xl bg-slate-100">
            <PhotoIcon className="h-8 w-8 text-slate-400" />
          </div>
        )}
        {message.content && <figcaption>{message.content}</figcaption>}
      </figure>
    );
  }

  if (message.type === "audio") {
    return (
      <div className="min-w-[240px]">
        <audio controls className="w-full">
          <source src={link} type={media.mimeType} />
        </audio>
        {message.content && <p className="mt-2 text-sm">{message.content}</p>}
      </div>
    );
  }

  if (message.type === "document") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className={`flex min-w-[250px] items-center gap-3 rounded-2xl border p-3 transition ${
          outbound
            ? "border-white/20 bg-white/10 hover:bg-white/15"
            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <div className={`rounded-xl p-2 ${outbound ? "bg-white/15" : "bg-white"}`}>
          <DocumentTextIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {media.fileName || "Document"}
          </p>
          <p className="text-xs opacity-75">
            {media.size ? `${(media.size / 1024 / 1024).toFixed(2)} MB` : "PDF preview"}
          </p>
        </div>
        <ArrowDownTrayIcon className="h-5 w-5 shrink-0" />
      </a>
    );
  }

  if (message.type === "location") {
    return (
      <div className="flex min-w-[230px] items-center gap-3 rounded-2xl bg-white/10 p-3">
        <MapPinIcon className="h-6 w-6" />
        <div>
          <p className="text-sm font-semibold">Shared location</p>
          <p className="text-xs opacity-75">
            {message.location?.latitude}, {message.location?.longitude}
          </p>
        </div>
      </div>
    );
  }

  if (message.type === "contacts") {
    return (
      <div className="flex min-w-[230px] items-center gap-3 rounded-2xl bg-white/10 p-3">
        <UserCircleIcon className="h-7 w-7" />
        <div>
          <p className="text-sm font-semibold">{message.contact?.fullName}</p>
          <p className="text-xs opacity-75">{message.contact?.phone}</p>
        </div>
      </div>
    );
  }

  if (message.type === "order") {
    return (
      <div className="min-w-[250px] rounded-2xl bg-white/10 p-3">
        <p className="text-sm font-semibold">Order {message.order?.id}</p>
        <p className="mt-1 text-xs opacity-75">{message.order?.status}</p>
        <p className="mt-2 text-sm font-semibold">
          {formatCurrency(message.order?.amount)}
        </p>
      </div>
    );
  }

  return null;
};

export default MediaRenderer;
