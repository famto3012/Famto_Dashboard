import { useQuery } from "@tanstack/react-query";
import ConversationItem from "./ConversationItem";
import { useNavigate } from "react-router-dom";
import { fetchAllWhatsappConversation } from "@/hooks/whatsapp/useWhatsapp";
import Error from "../others/Error";
import ShowSpinner from "../others/ShowSpinner";

const Conversation = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-whatsapp-conversation"],
    queryFn: () => fetchAllWhatsappConversation(navigate),
  });

  return (
    <div className="p-1">
      {isLoading ? (
        <ShowSpinner />
      ) : isError ? (
        <Error />
      ) : (
        data?.map((item, index) => (
          <ConversationItem
            message={item?.lastMessage}
            time={item?.timeAgo}
            name={item?.name}
            active={item?.active}
            waId={item?.waId}
            received={item?.received}
            key={index}
          />
        ))
      )}
    </div>
  );
};

export default Conversation;
