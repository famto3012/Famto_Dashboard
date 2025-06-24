import GlobalSearch from "@/components/others/GlobalSearch";
import Conversation from "@/components/whatsapp/Conversation";
import Messages from "@/components/whatsapp/Messages";
import DataContext from "@/context/DataContext";
import AddNewChat from "@/models/general/whatsapp/AddNewChat";
import { useContext, useState } from "react";

const Whatsapp = () => {
  const { waId, name } = useContext(DataContext);
  const [modal, setModal] = useState({ add: false });

  const closeModal = () => {
    setModal({ add: false });
  };

  return (
    <>
      <div className="bg-gray-100 h-[700px]">
        <GlobalSearch />
        <div className="mt-2">
          <div className="flex h-[600px] bg-gray-100">
            {/* Sidebar: Shown on Medium and Larger Screens */}
            <div className="w-80 h-[80%] bg-gray-100 p-2 hidden md:block">
              <div className="h-[600px] overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 z-10">
                  <div className="text-xl font-extrabold text-gray-700 p-3">
                    Famto
                  </div>
                </div>
                <div className="text-lg flex justify-between font-semibold text-gray-600 p-3">
                  <span>Recent</span>
                  <button
                    className="bg-teal-500 text-white p-1 text-sm rounded-md"
                    onClick={() => setModal({ add: true })}
                  >
                    New chat
                  </button>
                </div>
                <Conversation />
              </div>
            </div>

            {/* Main Content: Conditional Rendering on Small Screens */}
            <div className="flex-grow h-[600px] p-2 rounded-md hidden md:block">
              <Messages />
            </div>

            {/* Small Screens Handling */}
            {waId && name ? (
              <div className="w-full h-[600px] p-2 rounded-md block md:hidden">
                <Messages />
              </div>
            ) : (
              <div className="w-full h-[600px] bg-gray-100 p-2 block md:hidden">
                <div className="sticky top-0 bg-gray-100 z-10">
                  <div className="text-xl font-extrabold text-gray-700 p-3">
                    Famto
                  </div>
                </div>
                <div className="text-lg flex justify-between font-semibold text-gray-600 p-3">
                  <span>Recent</span>
                  <button
                    className="bg-teal-500 text-white p-1 text-sm rounded-md"
                    onClick={() => setModal({ add: true })}
                  >
                    New chat
                  </button>
                </div>
                <Conversation />
              </div>
            )}
          </div>
        </div>
      </div>
      <AddNewChat isOpen={modal.add} onClose={closeModal} />
    </>
  );
};

export default Whatsapp;
