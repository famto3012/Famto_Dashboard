import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getOrderChat } from "@/hooks/order/useOrder";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AgentChat = ({ orderId }) => {
  const navigate = useNavigate();

  const { data: chat, isLoading } = useQuery({
    queryKey: ["order-chat", orderId],
    queryFn: () => getOrderChat(orderId, navigate),
    enabled: !!orderId,
  });

  const messages = chat?.messages || [];
  const participants = chat?.participants || [];

  const participantLabel = participants
    .map((p) => `${p.fullName}${p.phoneNumber ? ` (${p.phoneNumber})` : ""}`)
    .join(" & ");

  return (
    <div className="bg-white mx-5 rounded-lg mt-5 p-5">
      <h3 className="font-semibold text-[16px] mb-4">Agent - Customer Chat</h3>

      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading chat...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400 text-sm">No chat messages for this order.</p>
      ) : (
        <>
          {participantLabel && (
            <p className="text-xs text-gray-400 mb-4">
              Conversation between: <span className="font-medium text-gray-600">{participantLabel}</span>
            </p>
          )}

          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isAgent = participants.find(
                (p) =>
                  p.id?.toString() === msg.sender?.toString() &&
                  p.fullName?.toLowerCase().includes("agent")
              );

              const alignRight = !!isAgent;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${alignRight ? "items-end" : "items-start"}`}
                >
                  <span className="text-[11px] text-gray-400 mb-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                      alignRight
                        ? "bg-teal-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.img && (
                      <img
                        src={msg.img}
                        alt="attachment"
                        className="rounded-md mb-2 max-w-full max-h-40 object-contain"
                      />
                    )}
                    {msg.text && <p className="break-words">{msg.text}</p>}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentChat;
