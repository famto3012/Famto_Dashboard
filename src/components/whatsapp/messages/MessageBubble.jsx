/* eslint-disable react/prop-types */
import {
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import MediaRenderer from "./MediaRender";
import { formatMessageTime } from "@/utils/whatsapp/formatters";

const statusIcons = {
  sending: ClockIcon,
  sent: CheckIcon,
  delivered: CheckCircleIcon,
  read: CheckCircleIcon,
};

const MessageBubble = ({ message }) => {
  const outbound = message.direction === "outbound";
  const StatusIcon = statusIcons[message.status] || CheckIcon;
  const isText = message.type === "text";
  const isTemplate = message.type === "template";

  return (
    <div className={`flex ${outbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm shadow-sm sm:max-w-[74%] ${
          outbound
            ? "rounded-br-md bg-emerald-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {message.replyTo?.content && (
          <div
            className={`mb-2 rounded-2xl border-l-4 px-3 py-2 text-xs ${
              outbound
                ? "border-white/40 bg-white/10 text-emerald-50"
                : "border-emerald-400 bg-emerald-50 text-emerald-800"
            }`}
          >
            {message.replyTo.content}
          </div>
        )}

        {isTemplate && (
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-75">
            <SparklesIcon className="h-4 w-4" />
            Template · {message.template?.name || "WhatsApp"}
          </div>
        )}

        {isText || isTemplate ? (
          <p className="whitespace-pre-line break-words leading-6">
            {message.content}
          </p>
        ) : (
          <MediaRenderer message={message} outbound={outbound} />
        )}

        <div
          className={`mt-2 flex items-center justify-end gap-1 text-[11px] ${
            outbound ? "text-emerald-50" : "text-slate-400"
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {outbound && (
            <StatusIcon
              className={`h-3.5 w-3.5 ${
                message.status === "read" ? "text-sky-200" : ""
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
