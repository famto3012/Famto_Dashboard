import { useState, useEffect, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import GlobalSearch from "@/components/others/GlobalSearch";
import RealTimeDataCount from "@/components/home/RealTimeDataCount";
import { Switch } from "@/components/ui/switch";
import { Radio, RadioGroup } from "@/components/ui/radio";
import "react-datepicker/dist/react-datepicker.css";
import { fetchGraphData } from "@/hooks/home/useHome";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthContext from "@/context/AuthContext";
import { useSoundContext } from "@/context/SoundContext";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/config/firebase";
import { toaster } from "@/components/ui/toaster";
import {
  fetchSingleMerchantDetail,
  updateMerchantStatusForMerchant,
} from "@/hooks/merchant/useMerchant";
import { useSocket } from "@/context/SocketContext";

// Register Chart.js components
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [status, setStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState("sales");
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 8)),
    new Date(new Date().setDate(new Date().getDate() - 1)),
  ]);
  const [merchantId, setMerchantId] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, userId, saveFcmTokenToStorage } = useContext(AuthContext);
  const {
    playNewOrderNotificationSound,
    playNewNotificationSound,
    newOrder,
    orderRejected,
    scheduledOrder,
    setShowBadge,
  } = useSoundContext();
  const { updateFcmToken } = useSocket();

  const handleNotification = (payload) => {
    if (
      payload.notification.title === newOrder ||
      payload.notification.title === orderRejected ||
      payload.notification.title === scheduledOrder
    ) {
      playNewOrderNotificationSound();
      setShowBadge(true);
      toaster.create({
        title: payload.notification.title,
        description: payload.notification.body,
        image: payload.notification.image,
        type: "info",
      });
    } else {
      playNewNotificationSound();
      setShowBadge(true);
      toaster.create({
        title: payload.notification.title,
        description: payload.notification.body,
        image: payload.notification.image,
        type: "info",
      });
    }
  };

  const { data: graphData } = useQuery({
    queryKey: ["get-graph-data", role, dateRange, selectedOption],
    queryFn: () =>
      fetchGraphData({
        role,
        startDate: dateRange[0],
        endDate: dateRange[1],
        navigate,
      }),
    enabled: !!selectedOption,
  });

  const { data: merchantProfileData } = useQuery({
    queryKey: ["merchant-detail", merchantId],
    queryFn: () => fetchSingleMerchantDetail(role, merchantId, navigate),
    enabled: !!merchantId,
  });

  const handleUpdateMerchantStatusMutation = useMutation({
    mutationKey: ["update-merchant-status"],
    mutationFn: () => updateMerchantStatusForMerchant(navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-detail"]);
      toaster.create({
        title: "Success",
        description: "Merchant status updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating customization",
        type: "error",
      });
    },
  });

  const convertRevenueDataToSalesChartFormat = (revenueData) => {
    return revenueData.map((entry) => {
      const date = new Date(entry.createdAt);

      // Format date as desired, e.g., "Jan 1"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        data: entry.sales, // Assuming sales corresponds to the Revenue in your chart
      };
    });
  };

  const convertRevenueDataToOrdersChartFormat = (revenueData) => {
    return revenueData.map((entry) => {
      const date = new Date(entry.createdAt);

      // Format date as desired, e.g., "Jan 1"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        data: entry.order, // Assuming sales corresponds to the Revenue in your chart
      };
    });
  };

  const convertRevenueDataToMerchantChartFormat = (revenueData) => {
    return revenueData.map((entry) => {
      const date = new Date(entry.createdAt);

      // Format date as desired, e.g., "Jan 1"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        data: entry.merchants, // Assuming sales corresponds to the Revenue in your chart
      };
    });
  };

  const convertRevenueDataToCommissionChartFormat = (revenueData) => {
    return revenueData.map((entry) => {
      const date = new Date(entry.createdAt);

      // Format date as desired, e.g., "Jan 1"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        data: entry.commission, // Assuming sales corresponds to the Revenue in your chart
      };
    });
  };

  const convertRevenueDataToSubscriptionChartFormat = (revenueData) => {
    return revenueData.map((entry) => {
      const date = new Date(entry.createdAt);

      // Format date as desired, e.g., "Jan 1"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: formattedDate,
        data: entry.subscription, // Assuming sales corresponds to the Revenue in your chart
      };
    });
  };

  useEffect(() => {
    if (!graphData || graphData.length === 0) return;

    // Determine which data to use based on selectedOption
    let processedData = [];
    switch (selectedOption) {
      case "sales":
        processedData = convertRevenueDataToSalesChartFormat(graphData);
        break;
      case "merchants":
        processedData = convertRevenueDataToMerchantChartFormat(graphData);
        break;
      case "order":
        processedData = convertRevenueDataToOrdersChartFormat(graphData);
        break;
      case "commission":
        processedData = convertRevenueDataToCommissionChartFormat(graphData);
        break;
      case "subscription":
        processedData = convertRevenueDataToSubscriptionChartFormat(graphData);
        break;
      default:
        break;
    }

    // Extract labels (dates) and data values
    const labels = processedData.map((entry) => entry.date);
    const dataValues = processedData.map((entry) => entry.data);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `Data for ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}`,
            data: dataValues,
            borderColor: "teal",
            backgroundColor: "teal",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: `Value (${selectedOption})`,
            },
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup the chart instance on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [graphData, selectedOption]);

  useEffect(() => {
    requestPermission();
    const unsubscribe = onMessage(messaging, (payload) => {
      handleNotification(payload);
      const { title, body } = payload.notification;
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
        });
        console.log("FCM registration token: ", token);
        if (token) {
          updateFcmToken(token);
          saveFcmTokenToStorage(token);
          // Send the token to your server and update the UI if necessary
        } else {
          console.log(
            "No registration token available. Ensure your service worker is registered correctly."
          );
        }
      } else {
        toaster.create({
          title: "Error",
          description: `Notification permission not granted`,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error retrieving token:", err);
    }
  };

  useEffect(() => {
    if (merchantProfileData) {
      setStatus(merchantProfileData?.status);
    }
    if (role === "Merchant" && userId) {
      setMerchantId(userId);
    }
  }, [merchantProfileData, userId]);

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex justify-between mx-5 mt-5">
        <div>
          <p className="text-[25px] text-teal-800 capitalize font-semibold">
            Hi! <span>{role}</span>
          </p>
        </div>

        <div className="flex items-center gap-[30px]">
          {role === "Merchant" && (
            <p className="flex flex-col items-center justify-center">
              <Switch
                checked={status}
                onCheckedChange={() =>
                  handleUpdateMerchantStatusMutation.mutate()
                }
                colorPalette="teal"
              />
              <span className="text-gray-500 text-[16px]">
                Accepting orders
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white mt-2 mx-5 py-4">
        <div className="flex flex-col md:flex-row gap-[30px] md:gap-0 lg:items-center mx-[20px] justify-start lg:justify-between">
          <div className="flex items-center justify-between overflow-x-auto">
            <RadioGroup
              value={selectedOption}
              colorPalette="teal"
              variant="solid"
              size="sm"
              onValueChange={(e) => setSelectedOption(e.value)}
              className="flex gap-[15px]"
            >
              <Radio
                value="sales"
                className="text-black text-[16px] cursor-pointer w-[110px] md:w-fit"
              >
                Sales (in ₹)
              </Radio>
              {role !== "Merchant" && (
                <Radio
                  value="merchants"
                  className="text-black text-[16px] cursor-pointer w-[110px] md:w-fit"
                >
                  Merchants
                </Radio>
              )}
              <Radio
                value="order"
                className="text-black text-[16px] cursor-pointer w-[110px] md:w-fit"
              >
                Orders
              </Radio>
              <Radio
                value="commission"
                className="text-black text-[16px] cursor-pointer w-[160px] md:w-fit"
              >
                Commission (in ₹)
              </Radio>
              {role !== "Merchant" && (
                <Radio
                  value="subscription"
                  className="text-black text-[16px] cursor-pointer w-[160px] md:w-fit"
                >
                  Subscription (in ₹)
                </Radio>
              )}
            </RadioGroup>
          </div>

          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            dateFormat="yyyy/MM/dd"
            withPortal
            className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none"
            placeholderText="Select Date range"
            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </div>

        {/* Line Chart */}
        <div className="mt-5 h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div>
        <RealTimeDataCount />
      </div>
    </div>
  );
};

export default Home;
