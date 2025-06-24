// export default ConversationItem;
import DataContext from "@/context/DataContext";
import RenderIcon from "@/icons/RenderIcon";
import { useContext } from "react";

const ConversationItem = ({ active, time, name, message, waId, received }) => {
  const { setWaId, setName, waId: selectedWaId } = useContext(DataContext);

  const formattedWaId = (waId) => {
    const waIdStr = waId.toString();
    return `+${waIdStr.slice(0, 2)} ${waIdStr.slice(2)}`;
  };

  return (
    <div>
      <div
        onClick={() => {
          setWaId(waId);
          setName(name ? name : formattedWaId(waId));
        }}
        className={`conversation-item p-1 m-1 rounded-md cursor-pointer 
          ${selectedWaId === waId ? "bg-gray-200" : received ? "bg-teal-100" : "hover:bg-gray-200"}
        `}
      >
        <div className="flex items-center p-2">
          <div className="w-7 h-7 m-1">
            <img
              className="rounded-full"
              src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            <div className="flex justify-between text-md">
              <div className="text-sm font-medium text-gray-700">
                {name ? name : formattedWaId(waId)}
              </div>
              <div className="text-xs text-gray-400">{time}</div>
            </div>
            <div className="text-sm text-gray-500 w-40 truncate">
              {message ? (
                message
              ) : (
                <RenderIcon iconName="MediaIcon" size={16} loading={16} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
