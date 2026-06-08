/* eslint-disable react/prop-types */
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const EmptyState = ({
  icon: Icon = ChatBubbleLeftRightIcon,
  title = "Nothing here yet",
  description = "When new WhatsApp activity arrives, it will appear here.",
  action,
}) => {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
