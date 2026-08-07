import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";
import GlobalSearch from "@/components/others/GlobalSearch";

import {
  fetchMerchantTasks,
  getMerchantOwnDelivery,
  updateMerchantOwnDelivery,
} from "@/hooks/deliveryManagement/useDeliveryManagement";

const MerchantDelivery = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: ownDelivery } = useQuery({
    queryKey: ["merchant-own-delivery"],
    queryFn: () => getMerchantOwnDelivery(navigate),
  });

  const {
    data: tasks,
    isLoading: taskLoading,
    isError: taskError,
  } = useQuery({
    queryKey: ["merchant-tasks"],
    queryFn: () => fetchMerchantTasks(navigate),
  });

  const updateOwnDelivery = useMutation({
    mutationKey: ["update-merchant-own-delivery"],
    mutationFn: (hasOwnDelivery) =>
      updateMerchantOwnDelivery(hasOwnDelivery, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-own-delivery"]);
      toaster.create({
        title: "Success",
        description: "Own delivery updated",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to update own delivery",
        type: "error",
      });
    },
  });

  const isOwnDelivery = ownDelivery?.hasOwnDelivery;

  return (
    <div className="bg-gray-100 min-h-full w-full">
      <GlobalSearch />

      <div className="flex flex-col lg:flex-row justify-between mt-[30px] items-start px-[30px] gap-[20px] lg:gap-0">
        <h1 className="text-[18px] font-semibold">Delivery Management</h1>

        <p className="font-medium flex items-center gap-3">
          Own Delivery
          <Switch
            colorPalette="teal"
            checked={isOwnDelivery}
            disabled={updateOwnDelivery.isPending}
            onCheckedChange={(e) => updateOwnDelivery.mutate(!!e.checked)}
          />
        </p>
      </div>

      <div className=" overflow-x-auto">
        <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {["Task ID", "Order ID", "Pickup", "Delivery", "Status"].map(
                (header) => (
                  <Table.ColumnHeader
                    key={header}
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
            {taskLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : tasks?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  No tasks yet
                </Table.Cell>
              </Table.Row>
            ) : taskError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  Error in fetching tasks.
                </Table.Cell>
              </Table.Row>
            ) : (
              tasks?.map((task) => (
                <Table.Row key={task?._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{task?._id}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {task?.orderId?._id || task?.orderId}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {task?.orderId?.pickups?.[0]?.address?.fullName || "N/A"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {task?.orderId?.drops?.[0]?.address?.fullName || "N/A"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {task?.status || "N/A"}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default MerchantDelivery;