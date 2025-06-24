import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import RenderIcon from "@/icons/RenderIcon";

import Error from "@/components/others/Error";
import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchAllOrders,
  markOrderAsCompleted,
  markOrderAsReady,
} from "@/hooks/order/useOrder";

import RejectOrder from "@/models/general/order/RejectOrder";
import AcceptOrder from "@/models/general/order/AcceptOrder";

const AllOrdersTable = ({ filter }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [showModal, setShowModal] = useState({
    accept: false,
    reject: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 50;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { socket } = useSocket();

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-orders", filter, page, limit],
    queryFn: () => fetchAllOrders(role, filter, page, limit, navigate),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    orderData?.data && orderData?.data?.length
      ? setAllOrders(orderData.data)
      : setAllOrders([]);
  }, [orderData?.data]);

  useEffect(() => {
    const handleNewOrder = (orderData) => {
      console.log("Order data", orderData);
      setAllOrders((prevOrders) => [orderData, ...prevOrders]);
    };

    const handleChangeAccepterOrderStatus = ({ orderId }) => {
      console.log("Order ID acc", orderId);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: "On-going" }
            : order
        )
      );
    };

    const handleChangeRejectedOrderStatus = ({ orderId }) => {
      console.log("Order ID rej", orderId);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );
    };

    socket?.on("newOrderCreated", handleNewOrder);
    socket?.on("orderAccepted", handleChangeAccepterOrderStatus);
    socket?.on("orderRejected", handleChangeRejectedOrderStatus);

    return () => {
      socket?.off("newOrderCreated", handleNewOrder);
      socket?.off("orderAccepted", handleChangeAccepterOrderStatus);
      socket?.off("orderRejected", handleChangeRejectedOrderStatus);
    };
  }, [socket]);

  const handleMarkAsReady = useMutation({
    mutationKey: ["mark-as-ready"],
    mutationFn: (orderId) => markOrderAsReady(orderId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data || "Something went wrong",
        type: "error",
      });
    },
  });

  const handleMarkAsCompleted = useMutation({
    mutationKey: ["mark-as-completed"],
    mutationFn: (orderId) => markOrderAsCompleted(orderId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Something went wrong",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id) => {
    setSelectedId(id);
    setShowModal({ ...showModal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null);
    setShowModal({
      accept: false,
      reject: false,
    });
  };

  return (
    <div className=" overflow-x-auto">
      <Table.Root className="mt-5 z-10">
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Order ID",
              "Order Status",
              "Merchant Name",
              "Customer Name",
              role === "Merchant" ? "Delivery Option" : "Assigned agent",
              "Delivery Mode",
              "Order Time",
              "Delivery Time",
              "Payment Method",
              "Amount",
            ].map((header, idx) => (
              <Table.ColumnHeader key={idx} color="white" textAlign="center">
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                <ShowSpinner /> Loading...
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                <Error />
              </Table.Cell>
            </Table.Row>
          ) : allOrders?.length === 0 ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                No Orders Available
              </Table.Cell>
            </Table.Row>
          ) : (
            allOrders?.map((order) => (
              <Table.Row
                key={order.orderId}
                className={`h-[70px] ${
                  filter.selectedOption === "order"
                    ? order?.orderStatus?.trim().toLowerCase() === "pending"
                      ? "bg-red-500 text-white"
                      : "text-black"
                    : (order?.isViewed &&
                          order?.deliveryMode === "Home Delivery") ||
                        (order?.isViewed && order.deliveryMode === "Take Away")
                      ? "text-black"
                      : "bg-red-500 text-white"
                }`}
              >
                <Table.Cell textAlign="center">
                  <Link
                    to={`/order/${order.orderId}/${order.deliveryMode}`}
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {order.orderId}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {order.orderStatus === "Pending" &&
                  filter.selectedOption === "order" &&
                  order.orderId.startsWith("O") ? (
                    <HStack
                      gap={3}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <span
                        onClick={() => toggleModal("accept", order.orderId)}
                        className="cursor-pointer"
                      >
                        <RenderIcon
                          iconName="CheckIcon"
                          size={28}
                          loading={6}
                        />
                      </span>

                      <span
                        onClick={() => toggleModal("reject", order.orderId)}
                        className="cursor-pointer"
                      >
                        <RenderIcon
                          iconName="CancelIcon"
                          size={28}
                          loading={6}
                        />
                      </span>
                    </HStack>
                  ) : order.orderStatus === "On-going" &&
                    order.deliveryMode === "Take Away" ? (
                    <>
                      {order.isReady === false ? (
                        <Button
                          className="text-white bg-teal-700 font-[500] text-[14px] p-2 rounded-md outline-none focus:outline-none"
                          onClick={() =>
                            handleMarkAsReady.mutate(order.orderId)
                          }
                        >
                          Mark as Ready
                        </Button>
                      ) : (
                        <Button
                          className="text-white bg-teal-700 font-[500] text-[14px] p-2 rounded-md outline-none focus:outline-none"
                          onClick={() =>
                            handleMarkAsCompleted.mutate(order.orderId)
                          }
                        >
                          Collected by customer
                        </Button>
                      )}
                    </>
                  ) : order?.deliveryMode === "Home Delivery" ? (
                    <>
                      {order?.orderStatus === "On-going" && !order?.isReady ? (
                        <button
                          className="text-white bg-teal-700 font-[500] text-[14px] p-2 rounded-md outline-none focus:outline-none"
                          onClick={() =>
                            handleMarkAsReady.mutate(order.orderId)
                          }
                        >
                          Mark as Ready
                        </button>
                      ) : order?.orderStatus === "On-going" &&
                        order?.isReady ? (
                        <p className="text-orange-500 font-[600] text-[14px]">
                          On-going
                        </p>
                      ) : (
                        <p
                          className={`text-[16px] font-[600] ${
                            order.orderStatus === "Completed"
                              ? "text-green-600"
                              : order.orderStatus === "Cancelled"
                                ? "text-red-600"
                                : order.orderStatus === "On-going"
                                  ? "text-orange-600"
                                  : "text-yellow-500"
                          }`}
                        >
                          {order?.orderStatus}
                        </p>
                      )}
                    </>
                  ) : (
                    <p
                      className={`text-[16px] font-[600] ${
                        order.orderStatus === "Completed"
                          ? "text-green-600"
                          : order.orderStatus === "Cancelled"
                            ? "text-red-600"
                            : order.orderStatus === "On-going"
                              ? "text-orange-600"
                              : "text-yellow-500"
                      }`}
                    >
                      {order.orderStatus}
                    </p>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">{order.merchantName}</Table.Cell>
                <Table.Cell textAlign="center">{order.customerName}</Table.Cell>
                <Table.Cell textAlign="center">
                  {role === "Merchant"
                    ? order?.deliveryOption
                    : order?.assignedAgent}
                </Table.Cell>
                <Table.Cell textAlign="center">{order.deliveryMode}</Table.Cell>
                <Table.Cell textAlign="center">
                  <p>{order.orderDate}</p>
                  <p>{order.orderTime}</p>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <p>{order.deliveryDate}</p>
                  <p>{order.deliveryTime}</p>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {order.paymentMethod}
                </Table.Cell>
                <Table.Cell textAlign="center">{order.amount}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {orderData?.totalCount && (
        <PaginationRoot
          count={orderData.totalCount}
          page={page}
          pageSize={50}
          defaultPage={1}
          onPageChange={(e) => setPage(e.page)}
          variant="solid"
          className="py-[30px] flex justify-center"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}

      <AcceptOrder
        isOpen={showModal.accept}
        onClose={closeModal}
        orderId={selectedId}
      />
      <RejectOrder
        isOpen={showModal.reject}
        onClose={closeModal}
        orderId={selectedId}
      />
    </div>
  );
};

export default AllOrdersTable;
