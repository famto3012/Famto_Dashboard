/* eslint-disable react/prop-types */
const TypingIndicator = ({ name = "Customer" }) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-400">
      <span>{name} is typing</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
      </span>
    </div>
  );
};

export default TypingIndicator;
