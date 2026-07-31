import { useContext, useEffect, useMemo, useState } from "react";
import DataContext from "@/context/DataContext";
import ChatSidebar from "./ChatSidebar";
import CustomerInfoSidebar from "./CustomerInfoSidebar";
import MessagesContainer from "../messages/MessageContainer";
import { useFlattenedConversations, useSelectedConversation, useWhatsappConversations } from "@/hooks/whatsapp/useConversation";
import { useWhatsappSocketEvents } from "@/hooks/whatsapp/useSocketMessage";

const defaultFilters = {
  search: "",
  status: "all",
  tag: "all",
  assignee: "all",
};

const ChatLayout = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedId, setSelectedId] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("list");
  const { setWaId, setName } = useContext(DataContext) || {};

  const conversationsQuery = useWhatsappConversations(filters);
  const conversations = useFlattenedConversations(conversationsQuery);
  const selectedConversation = useSelectedConversation(conversations, selectedId);

  useWhatsappSocketEvents(selectedId);

  useEffect(() => {
    if (!selectedId && conversations.length) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  useEffect(() => {
    if (selectedConversation) {
      setWaId?.(selectedConversation.waId);
      setName?.(selectedConversation.name);
    }
  }, [selectedConversation, setName, setWaId]);

  const handleSelect = (conversation) => {
    setSelectedId(conversation.id);
    setMobilePanel("chat");
  };

  const gridClass = useMemo(() => {
    if (mobilePanel === "list") return "grid-cols-[1fr_0_0]";
    return "grid-cols-[0_1fr_0]";
  }, [mobilePanel]);

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`grid h-full min-h-0 transition-[grid-template-columns] duration-300 lg:grid-cols-[360px_minmax(0,1fr)_340px] ${gridClass}`}
      >
        <div className="min-w-0 overflow-hidden border-r border-slate-200">
          <ChatSidebar
            filters={filters}
            setFilters={setFilters}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <div className="min-w-0 overflow-hidden">
          <MessagesContainer
            conversation={selectedConversation}
            onBack={() => setMobilePanel("list")}
          />
        </div>

        <div className="hidden min-w-0 overflow-hidden border-l border-slate-200 lg:block">
          <CustomerInfoSidebar conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
