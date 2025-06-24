import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import AuthContext from "@/context/AuthContext";

import GlobalSearch from "@/components/others/GlobalSearch";
import Error from "@/components/others/Error";
import Loader from "@/components/others/Loader";

import Details from "@/components/order/detail/Details";
import OrderItems from "@/components/order/detail/OrderItem";
import OrderBill from "@/components/order/detail/OrderBill";
import OrderActivity from "@/components/order/detail/OrderActivity";

import RenderIcon from "@/icons/RenderIcon";

import {
  downloadOrderBill,
  getOrderDetail,
  markOrderAsCompletedForAdmin,
  markPaymentReceived,
  markScheduledOrderAsViewed,
} from "@/hooks/order/useOrder";

import CancelOrder from "@/models/general/order/CancelOrder";

const OrderDetail = () => {
  const [showCancel, setShowCancel] = useState(false);

  const { orderId, deliveryMode } = useParams();
  const { role, userId } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: orderDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => getOrderDetail(orderId, deliveryMode, role, navigate),
    enabled: !!orderId,
  });

  const downloadBill = useMutation({
    mutationKey: ["download-order-bill"],
    mutationFn: () => downloadOrderBill(orderId, navigate),
  });

  const markScheduledOrderAsViewedForMerchant = useMutation({
    mutationKey: ["mark-scheduled-order-viewed-for-merchant"],
    mutationFn: () => markScheduledOrderAsViewed(orderId, userId, navigate),
  });

  const markOrderAsCompleted = useMutation({
    mutationKey: ["mark-as-completed"],
    mutationFn: () => markOrderAsCompletedForAdmin(orderId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toaster.create({
        title: "Success",
        description: "Order marked as completed",
        type: "success",
      });
    },
    onError: (message) => {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      });
    },
  });

  const markOrderAsPaid = useMutation({
    mutationKey: ["mark-as-paid"],
    mutationFn: () => markPaymentReceived(orderId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toaster.create({
        title: "Success",
        description: "Payment marked as completed",
        type: "success",
      });
    },
    onError: (message) => {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      });
    },
  });

  const handleDownloadBill = () => {
    const promise = new Promise((resolve, reject) => {
      downloadBill.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Order_Bill( ${orderId} ).pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        },
        onError: (error) => {
          reject(new Error(error.message || "Failed to download the bill"));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Downloading...",
        description: "Preparing your bill",
      },
      success: {
        title: "Download Successful",
        description: "Bill has been downloaded successfully.",
      },
      error: {
        title: "Download Failed",
        description: "Something went wrong while downloading the bill",
      },
    });
  };

  useEffect(() => {
    if (role === "Merchant") {
      markScheduledOrderAsViewedForMerchant.mutate();
    }
  }, [role, orderId, userId, navigate]);

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex flex-col md:flex-row justify-between gap-[20px] md:gap-0 mx-5 mt-[20px]">
        <p className="flex items-center gap-[10px] mb-0">
          <span onClick={() => navigate("/order")} className="cursor-pointer">
            <RenderIcon iconName="LeftArrowIcon" size={24} loading={6} />
          </span>

          <p className="font-[600] mb-0 text-[18px]">
            Order information #{orderDetail?._id}{" "}
            {orderDetail?.scheduledOrderId && (
              <>
                <span className="text-black me-2">of</span>
                <span className="text-gray-500">
                  [ #{orderDetail?.scheduledOrderId} ]
                </span>
              </>
            )}
          </p>
        </p>

        <div className="flex gap-[20px] justify-center md:justify-end">
          {orderId.charAt(0) === "O" &&
            role !== "Merchant" &&
            orderDetail?.orderStatus === "On-going" &&
            orderDetail?.deliveryAgentDetail?._id && (
              <Button
                className="bg-teal-700 text-white p-2 rounded-md"
                onClick={() => markOrderAsCompleted.mutate()}
              >
                Mark as Completed
              </Button>
            )}

          {orderId.charAt(0) === "O" &&
            role !== "Merchant" &&
            orderDetail?.orderStatus === "On-going" && (
              <Button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={() => setShowCancel(true)}
              >
                Mark as cancelled
              </Button>
            )}

          {orderId[0] === "O" &&
            role !== "Merchant" &&
            orderDetail.paymentCollectedFromCustomer === "Pending" && (
              <Button
                onClick={() => markOrderAsPaid.mutate()}
                className="bg-teal-700 text-white p-2 rounded-md"
              >
                Received Payment
              </Button>
            )}

          {orderId.charAt(0) === "O" && (
            <Button
              onClick={handleDownloadBill}
              className="bg-blue-100 px-4 p-2 rounded-md cursor-pointer"
            >
              <span>
                <RenderIcon iconName="DownloadIcon" size={24} loading={6} />
              </span>
              Bill
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row bg-white mx-5 rounded-lg mt-5 lg:gap-16 p-5">
        <div className="w-full lg:w-1/3">
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              Order Status
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.orderStatus}
            </p>
          </div>
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              Payment Status
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.paymentStatus}
            </p>
          </div>
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              Payment Mode
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.paymentMode}
            </p>
          </div>
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              Delivery Mode
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.deliveryMode}
            </p>
          </div>
        </div>

        <div className="hidden lg:block h-[7rem] w-[2px] bg-gray-300 rounded-full"></div>

        <div className="w-full lg:w-1/3">
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              Delivery option
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.deliveryOption}
            </p>
          </div>
          {orderId?.charAt(0) === "O" ? (
            <>
              <div className="flex justify-between mb-[10px]">
                <label className="text-[14px] text-gray-500 w-3/5">
                  Vehicle Type
                </label>
                <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
                  {orderDetail?.vehicleType}
                </p>
              </div>
              <div className="flex justify-between mb-[10px]">
                <label className="text-[14px] text-gray-500 w-3/5">
                  Order Time
                </label>
                <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
                  {orderDetail?.orderTime}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between mb-[10px]">
                <label className="text-[14px] text-gray-500 w-3/5">
                  Order From
                </label>
                <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
                  {orderDetail?.orderTime?.split("||")[0]}
                </p>
              </div>
              <div className="flex justify-between mb-[10px]">
                <label className="text-[14px] text-gray-500 w-3/5">
                  Order To
                </label>
                <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
                  {orderDetail?.orderTime?.split("||")[1]}
                </p>
              </div>
            </>
          )}
          <div className="flex justify-between mb-[10px]">
            <label className="text-[14px] text-gray-500 w-3/5">
              {orderId?.charAt(0) === "O"
                ? "Delivery Time"
                : "Next Delivery Time"}
            </label>
            <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
              {orderDetail?.deliveryTime}
            </p>
          </div>
        </div>
      </div>

      <Details data={orderDetail} />

      <OrderItems data={orderDetail} />

      <OrderBill data={orderDetail} />

      {orderId.startsWith("O") && <OrderActivity orderDetail={orderDetail} />}

      <CancelOrder
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        orderId={orderId}
      />
    </div>
  );
};

export default OrderDetail;
