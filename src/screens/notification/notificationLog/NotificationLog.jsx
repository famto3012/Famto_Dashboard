import GlobalSearch from "@/components/others/GlobalSearch";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "@/utils/formatter";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { HStack, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { getNotificationLog } from "@/hooks/notification/useNotification";
import Error from "@/components/others/Error";
import ShowSpinner from "@/components/others/ShowSpinner";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { useSoundContext } from "@/context/SoundContext";
import { useSocket } from "@/context/SocketContext";

const NotificationLog = () => {
  const [notificationLogData, setNotificationLogData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const {
    playNewOrderNotificationSound,
    playNewNotificationSound,
    setShowBadge,
    newOrder,
    orderRejected,
    scheduledOrder,
  } = useSoundContext();
  const { socket } = useSocket();

  const getNotification = role || page || limit;

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
  };

  const {
    data: notificationLog,
    isLoading: notificationLogLoading,
    isError,
  } = useQuery({
    queryKey: ["get-all-notification-log", role, page, limit],
    queryFn: () => getNotificationLog({ role, page, limit, navigate }),
    enabled: !!getNotification,
  });

  const handleNotification = (payload) => {
    if (
      payload.notification.title === newOrder ||
      payload.notification.title === orderRejected ||
      payload.notification.title === scheduledOrder
    ) {
      console.log("New order sound");
      playNewOrderNotificationSound();
    } else {
      console.log("New Notification sound");
      playNewNotificationSound();
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
      }
    });

    // Handle messages when the app is in the foreground
    onMessage(messaging, (payload) => {
      console.log("Received foreground message ", payload);
      addNotificationToTable(payload);
      handleNotification(payload);
    });
  }, [socket]);

  useEffect(() => {
    if (notificationLog) {
      setNotificationLogData(notificationLog.data);
      setPagination(notificationLog);
      setShowBadge(false);
    }
  }, [notificationLog]);

  const addNotificationToTable = (data) => {
    console.log("Data", data);
    const newNotification = {
      title: data.notification.title, // Set the title
      description: data.notification.body, // Set the body as description
      imageUrl: data.notification.image, // Set the image URL
      createdAt: new Date().toISOString(),
      orderId: data?.data?.orderId,
    };

    setNotificationLogData((prevData) => [newNotification, ...prevData]);
  };

  if (isError) return <Error />;

  return (
    <>
      <div className="w-full h-screen bg-gray-100">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <div className="px-4 lg:px-11 mt-2">
          <h1 className="text-base lg:text-lg font-bold mb-4 lg:mb-[30px] flex">
            Notification Logs
          </h1>
        </div>

        <div className="overflow-x-auto">
          <Table.Root striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]">
                {["Order ID / Image", "Notification", "Date & Time"].map(
                  (header, index) => (
                    <Table.ColumnHeader
                      key={index}
                      color="white"
                      textAlign="center"
                    >
                      {header}
                    </Table.ColumnHeader>
                  )
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {notificationLogLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={6} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : notificationLogData?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={6} textAlign="center">
                    No notification logs available
                  </Table.Cell>
                </Table.Row>
              ) : (
                notificationLogData.map((notification) => (
                  <Table.Row key={notification._id} className="h-[70px]">
                    <Table.Cell textAlign="center">
                      {notification?.orderId ? (
                        <span className="font-semibold">
                          {notification?.orderId}
                        </span>
                      ) : notification?.imageUrl ? (
                        <div className="flex justify-center items-center">
                          <img
                            className="w-[150px] h-[80px] object-cover"
                            src={notification?.imageUrl}
                            alt="Order Image"
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <img
                            className="w-[150px] h-[80px]"
                            src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320384.svg?alt=media&token=0be47a53-43f3-4887-9822-3baad0edd31e"
                            alt="Order Image"
                          />
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <span className="font-bold block">
                        {notification?.title}
                      </span>
                      <span className="block">
                        {notification?.description?.length > 30
                          ? `${notification?.description.substring(0, 30)}...`
                          : notification?.description}
                      </span>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {`${formatDate(notification?.createdAt)} ${formatTime(
                        notification?.createdAt
                      )}`}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
          {/* <div className="flex justify-center bg-white mt-5 mb-4">
            <PaginationRoot
              count={pagination.totalDocuments || 0}
              page={page}
              pageSize={30}
              defaultPage={1}
              onPageChange={(e) => setPage(e.page)}
              variant="solid"
              className="py-[50px] flex justify-center"
            >
              <HStack>
                <PaginationPrevTrigger className="bg-gray-200 hover:bg-white" />
                <PaginationItems className="bg-gray-200 hover:bg-white" />
                <PaginationNextTrigger className="bg-gray-200 hover:bg-white" />
              </HStack>
            </PaginationRoot>
          </div> */}
          <div className="flex justify-center bg-white mt-5 mb-4 px-4">
            <PaginationRoot
              count={pagination.totalDocuments || 0}
              page={page}
              pageSize={30}
              defaultPage={1}
              onPageChange={(e) => setPage(e.page)}
              variant="solid"
              className="py-4 flex flex-wrap justify-center gap-2"
            >
              <HStack className="flex flex-wrap gap-2">
                <PaginationPrevTrigger className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
                <PaginationItems className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
                <PaginationNextTrigger className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
              </HStack>
            </PaginationRoot>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationLog;
