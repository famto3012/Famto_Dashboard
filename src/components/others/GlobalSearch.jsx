import { useContext, useEffect, useState } from "react";
import RenderIcon from "@/icons/RenderIcon";
import Logout from "@/models/auth/Logout";
import { useSoundContext } from "@/context/SoundContext";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { Avatar, Button, Circle, Float } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSingleMerchantDetail } from "@/hooks/merchant/useMerchant";
import AuthContext from "@/context/AuthContext";
import MainSideBar from "../sideBar/MainSideBar";
import { toaster } from "../ui/toaster";

const GlobalSearch = () => {
  const [showModal, setShowModal] = useState(false);
  const [merchantId, setMerchantId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    playNewOrderNotificationSound,
    playNewNotificationSound,
    setShowBadge,
    showBadge,
    newOrder,
    orderRejected,
    scheduledOrder,
  } = useSoundContext();

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const handleNotificationLog = () => {
    navigate("/notification/logs");
    setShowBadge(false);
  };

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
  };

  const { data: merchantProfileData } = useQuery({
    queryKey: ["merchant-detail", merchantId],
    queryFn: () => fetchSingleMerchantDetail(role, merchantId, navigate),
    enabled: !!merchantId,
  });

  const handleNotification = (payload) => {
    if (
      payload.notification.title === newOrder ||
      payload.notification.title === orderRejected ||
      payload.notification.title === scheduledOrder
    ) {
      playNewOrderNotificationSound();
      toaster.create({
        title: payload.notification.title,
        description: payload.notification.body,
        image: payload.notification.image,
        type: "info",
      });
      setShowBadge(true);
      if (payload.notification.title === "New Whatsapp Message") {
        queryClient.invalidateQueries(["all-whatsapp-message-by-id"]);
        queryClient.invalidateQueries(["all-whatsapp-conversation"]);
      }
    } else {
      playNewNotificationSound();
      toaster.create({
        title: payload.notification.title,
        description: payload.notification.body,
        image: payload.notification.image,
        type: "info",
      });
      setShowBadge(true);
      if (payload.notification.title === "New Whatsapp Message") {
        queryClient.invalidateQueries(["all-whatsapp-message-by-id"]);
        queryClient.invalidateQueries(["all-whatsapp-conversation"]);
      }
    }
    // addNotificationToTable(payload.notification);
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "NOTIFICATION_RECEIVED") {
        const payload = event.data.payload;
        handleNotification(payload);
        setShowBadge(true);
      }
    });

    // Handle messages when the app is in the foreground
    onMessage(messaging, (payload) => {
      handleNotification(payload);
      setShowBadge(true);
    });
  }, []);

  useEffect(() => {
    if (role === "Merchant" && userId) {
      setMerchantId(userId);
    }
  }, [merchantProfileData, userId]);

  return (
    <>
      <div
        className={`flex items-center pt-[20px] pe-[30px] bg-gray-100 justify-between lg:justify-end `}
      >
        <Button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden ms-[20px] border-2 p-2 rounded-md"
        >
          <RenderIcon iconName="MenuIcon" size={28} loading={6} />
        </Button>

        <div className="flex items-center gap-[20px]">
          <Avatar.Root className="bg-gray-100" variant="subtle">
            <Avatar.Fallback onClick={handleNotificationLog}>
              <span className="bg-white">
                <RenderIcon iconName="NotificationIcon" size={18} loading={6} />
              </span>
            </Avatar.Fallback>
            {showBadge && (
              <Float placement="bottom-end" offsetX="2.5" offsetY="2.5">
                <Circle
                  bg="red.500"
                  size="10px"
                  outline="0.2em solid"
                  outlineColor="bg"
                />
              </Float>
            )}
          </Avatar.Root>

          <div className="hidden md:block relative me-4">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-0 top-0 mt-2 mr-4">
              <span className="text-xl text-gray-500">
                <RenderIcon iconName="SearchIcon" size={22} loading={6} />
              </span>
            </button>
          </div>

          <span
            onClick={() => setShowModal(!showModal)}
            className="cursor-pointer block"
          >
            <RenderIcon iconName="LogoutIcon" size={24} loading={6} />
          </span>

          <Logout isOpen={showModal} onClose={() => setShowModal(!showModal)} />
        </div>
      </div>

      {/* Background overlay */}
      {drawerOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={() => setDrawerOpen(false)} // Close sidebar when clicked
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-[-270px] min-h-full transform ${
          drawerOpen ? "translate-x-[270px]" : "translate-x-[-270px]"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <MainSideBar showClose={true} onClick={() => setDrawerOpen(false)} />
      </div>
    </>
  );
};

export default GlobalSearch;
