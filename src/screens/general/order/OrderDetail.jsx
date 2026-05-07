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
import AgentChat from "@/components/order/detail/AgentChat";
import PrintBill from "@/components/order/detail/PrintBill";

import RenderIcon from "@/icons/RenderIcon";

import {
  downloadOrderBill,
  getOrderDetail,
  markOrderAsCompletedForAdmin,
  markPaymentReceived,
  markScheduledOrderAsViewed,
} from "@/hooks/order/useOrder";

import CancelOrder from "@/models/general/order/CancelOrder";
import ReassignAgent from "@/models/general/order/ReassignAgent";

const OrderDetail = () => {
  const [showCancel, setShowCancel] = useState(false);
  const [showReassign, setShowReassign] = useState(false);

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
  <div className="bg-gray-100 min-h-screen w-full">
    <GlobalSearch />

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row justify-between gap-4 mx-4 md:mx-6 mt-5">
      
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          onClick={() => navigate("/order")}
          className="cursor-pointer"
        >
          <RenderIcon iconName="LeftArrowIcon" size={24} loading={6} />
        </span>

        <h1 className="font-semibold text-base md:text-lg">
          Order information #{orderDetail?._id}
          {orderDetail?.scheduledOrderId && (
            <span className="ml-2 text-gray-500 text-sm">
              of [#{orderDetail?.scheduledOrderId}]
            </span>
          )}
        </h1>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
        
        {orderId.startsWith("O") &&
          role !== "Merchant" &&
          orderDetail?.orderStatus === "On-going" &&
          orderDetail?.deliveryAgentDetail?._id &&
          orderDetail?.deliveryAgentDetail?._id !== "-" && (
            <Button
              className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm"
              onClick={() => setShowReassign(true)}
            >
              Reassign Agent
            </Button>
          )}

        {orderId.startsWith("O") &&
          role !== "Merchant" &&
          orderDetail?.orderStatus === "On-going" &&
          orderDetail?.deliveryAgentDetail?._id && (
            <Button
              className="bg-teal-700 text-white px-3 py-2 rounded-md text-sm"
              onClick={() => markOrderAsCompleted.mutate()}
              disabled={markOrderAsCompleted.isPending}
            >
              {markOrderAsCompleted.isPending
                ? "Saving..."
                : "Mark Completed"}
            </Button>
          )}

        {orderId.startsWith("O") &&
          role !== "Merchant" &&
          orderDetail?.orderStatus === "On-going" && (
            <Button
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
              onClick={() => setShowCancel(true)}
              disabled={showCancel}
            >
              Cancel
            </Button>
          )}

        {orderId.startsWith("O") &&
          role !== "Merchant" &&
          orderDetail?.paymentCollectedFromCustomer === "Pending" && (
            <Button
              onClick={() => markOrderAsPaid.mutate()}
              disabled={markOrderAsPaid.isPending}
              className="bg-teal-700 text-white px-3 py-2 rounded-md text-sm"
            >
              {markOrderAsPaid.isPending
                ? "Saving..."
                : "Received Payment"}
            </Button>
          )}

        {orderId.startsWith("O") && (
          <Button
            onClick={handleDownloadBill}
            disabled={downloadBill.isPending}
            className="bg-blue-100 px-3 py-2 rounded-md flex items-center gap-2 text-sm"
          >
            <RenderIcon iconName="DownloadIcon" size={18} loading={6} />
            {downloadBill.isPending ? "Downloading..." : "Bill"}
          </Button>
        )}

        {orderId.startsWith("O") && orderDetail && (
          <PrintBill orderDetail={orderDetail} />
        )}
      </div>
    </div>

    {/* ORDER SUMMARY */}
    <div className="bg-white mx-4 md:mx-6 mt-5 rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* COLUMN 1 */}
      <div className="space-y-2">
        <InfoRow label="Order Status" value={orderDetail?.orderStatus} />
        <InfoRow label="Payment Status" value={orderDetail?.paymentStatus} />
        <InfoRow label="Payment Mode" value={orderDetail?.paymentMode} />
        <InfoRow label="Delivery Mode" value={orderDetail?.deliveryMode} />
      </div>

      {/* COLUMN 2 */}
      <div className="space-y-2">
        <InfoRow label="Delivery option" value={orderDetail?.deliveryOption} />

        {orderId.startsWith("O") ? (
          <>
            <InfoRow label="Vehicle Type" value={orderDetail?.vehicleType} />
            <InfoRow label="Order Time" value={orderDetail?.orderTime} />
          </>
        ) : (
          <>
            <InfoRow
              label="Order From"
              value={orderDetail?.orderTime?.split("||")[0]}
            />
            <InfoRow
              label="Order To"
              value={orderDetail?.orderTime?.split("||")[1]}
            />
          </>
        )}

        <InfoRow
          label={
            orderId.startsWith("O")
              ? "Delivery Time"
              : "Next Delivery Time"
          }
          value={orderDetail?.deliveryTime}
        />
      </div>
    </div>

    {/* OTHER COMPONENTS */}
    <Details data={orderDetail} />
    <OrderItems data={orderDetail} />
    <OrderBill data={orderDetail} />

    {orderId.startsWith("O") && <OrderActivity orderDetail={orderDetail} />}

    {orderId.startsWith("O") && role !== "Merchant" && (
      <AgentChat orderId={orderId} />
    )}

    <CancelOrder
      isOpen={showCancel}
      onClose={() => setShowCancel(false)}
      orderId={orderId}
    />

    <ReassignAgent
      isOpen={showReassign}
      onClose={() => setShowReassign(false)}
      orderId={orderId}
      currentAgentId={orderDetail?.deliveryAgentDetail?._id}
    />
  </div>
);

  // return (
  //   <div className="bg-gray-100 min-h-full min-w-full">
  //     <GlobalSearch />

  //     <div className="flex flex-col md:flex-row justify-between gap-[20px] md:gap-0 mx-5 mt-[20px]">
  //       <p className="flex items-center gap-[10px] mb-0">
  //         <span onClick={() => navigate("/order")} className="cursor-pointer">
  //           <RenderIcon iconName="LeftArrowIcon" size={24} loading={6} />
  //         </span>

  //         <p className="font-[600] mb-0 text-[18px]">
  //           Order information #{orderDetail?._id}{" "}
  //           {orderDetail?.scheduledOrderId && (
  //             <>
  //               <span className="text-black me-2">of</span>
  //               <span className="text-gray-500">
  //                 [ #{orderDetail?.scheduledOrderId} ]
  //               </span>
  //             </>
  //           )}
  //         </p>
  //       </p>

  //       <div className="flex gap-[20px] justify-center md:justify-end">
  //         {orderId.charAt(0) === "O" &&
  //           role !== "Merchant" &&
  //           orderDetail?.orderStatus === "On-going" &&
  //           orderDetail?.deliveryAgentDetail?._id &&
  //           orderDetail?.deliveryAgentDetail?._id !== "-" && (
  //             <Button
  //               className="bg-orange-500 text-white p-2 rounded-md"
  //               onClick={() => setShowReassign(true)}
  //             >
  //               Reassign Agent
  //             </Button>
  //           )}

  //         {orderId.charAt(0) === "O" &&
  //           role !== "Merchant" &&
  //           orderDetail?.orderStatus === "On-going" &&
  //           orderDetail?.deliveryAgentDetail?._id && (
  //             <Button
  //               className="bg-teal-700 text-white p-2 rounded-md"
  //               onClick={() => markOrderAsCompleted.mutate()}
  //               disabled={markOrderAsCompleted.isPending}
  //             >
  //               {markOrderAsCompleted.isPending ? "Saving..." : "Mark as Completed"}
  //             </Button>
  //           )}

  //         {orderId.charAt(0) === "O" &&
  //           role !== "Merchant" &&
  //           orderDetail?.orderStatus === "On-going" && (
  //             <Button
  //               className="bg-red-500 text-white p-2 rounded-md"
  //               onClick={() => setShowCancel(true)}
  //               disabled={showCancel}
  //             >
  //               Mark as cancelled
  //             </Button>
  //           )}

  //         {orderId[0] === "O" &&
  //           role !== "Merchant" &&
  //           orderDetail.paymentCollectedFromCustomer === "Pending" && (
  //             <Button
  //               onClick={() => markOrderAsPaid.mutate()}
  //               disabled={markOrderAsPaid.isPending}
  //               className="bg-teal-700 text-white p-2 rounded-md"
  //             >
  //               {markOrderAsPaid.isPending ? "Saving..." : "Received Payment"}
  //             </Button>
  //           )}

  //         {orderId.charAt(0) === "O" && (
  //           <Button
  //             onClick={handleDownloadBill}
  //             disabled={downloadBill.isPending}
  //             className="bg-blue-100 px-4 p-2 rounded-md cursor-pointer"
  //           >
  //             <span>
  //               <RenderIcon iconName="DownloadIcon" size={24} loading={6} />
  //             </span>
  //             {downloadBill.isPending ? "Downloading..." : "Bill"}
  //           </Button>
  //         )}

  //         {orderId.charAt(0) === "O" && orderDetail && (
  //           <PrintBill orderDetail={orderDetail} />
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex flex-col lg:flex-row bg-white mx-5 rounded-lg mt-5 lg:gap-16 p-5">
  //       <div className="w-full lg:w-1/3">
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             Order Status
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.orderStatus}
  //           </p>
  //         </div>
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             Payment Status
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.paymentStatus}
  //           </p>
  //         </div>
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             Payment Mode
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.paymentMode}
  //           </p>
  //         </div>
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             Delivery Mode
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.deliveryMode}
  //           </p>
  //         </div>
  //       </div>

  //       <div className="hidden lg:block h-[7rem] w-[2px] bg-gray-300 rounded-full"></div>

  //       <div className="w-full lg:w-1/3">
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             Delivery option
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.deliveryOption}
  //           </p>
  //         </div>
  //         {orderId?.charAt(0) === "O" ? (
  //           <>
  //             <div className="flex justify-between mb-[10px]">
  //               <label className="text-[14px] text-gray-500 w-3/5">
  //                 Vehicle Type
  //               </label>
  //               <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //                 {orderDetail?.vehicleType}
  //               </p>
  //             </div>
  //             <div className="flex justify-between mb-[10px]">
  //               <label className="text-[14px] text-gray-500 w-3/5">
  //                 Order Time
  //               </label>
  //               <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //                 {orderDetail?.orderTime}
  //               </p>
  //             </div>
  //           </>
  //         ) : (
  //           <>
  //             <div className="flex justify-between mb-[10px]">
  //               <label className="text-[14px] text-gray-500 w-3/5">
  //                 Order From
  //               </label>
  //               <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //                 {orderDetail?.orderTime?.split("||")[0]}
  //               </p>
  //             </div>
  //             <div className="flex justify-between mb-[10px]">
  //               <label className="text-[14px] text-gray-500 w-3/5">
  //                 Order To
  //               </label>
  //               <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //                 {orderDetail?.orderTime?.split("||")[1]}
  //               </p>
  //             </div>
  //           </>
  //         )}
  //         <div className="flex justify-between mb-[10px]">
  //           <label className="text-[14px] text-gray-500 w-3/5">
  //             {orderId?.charAt(0) === "O"
  //               ? "Delivery Time"
  //               : "Next Delivery Time"}
  //           </label>
  //           <p className="text-[14px] text-gray-900 font-[500] text-left w-2/5">
  //             {orderDetail?.deliveryTime}
  //           </p>
  //         </div>
  //       </div>
  //     </div>

  //     <Details data={orderDetail} />

  //     <OrderItems data={orderDetail} />

  //     <OrderBill data={orderDetail} />

  //     {orderId.startsWith("O") && <OrderActivity orderDetail={orderDetail} />}

  //     {orderId.startsWith("O") && role !== "Merchant" && (
  //       <AgentChat orderId={orderId} />
  //     )}

  //     <CancelOrder
  //       isOpen={showCancel}
  //       onClose={() => setShowCancel(false)}
  //       orderId={orderId}
  //     />

  //     <ReassignAgent
  //       isOpen={showReassign}
  //       onClose={() => setShowReassign(false)}
  //       orderId={orderId}
  //       currentAgentId={orderDetail?.deliveryAgentDetail?._id}
  //     />
  //   </div>
  // );
};

export default OrderDetail;

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">
      {value || "-"}
    </span>
  </div>
);