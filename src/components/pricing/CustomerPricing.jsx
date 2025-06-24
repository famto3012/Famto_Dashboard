import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HStack, Table } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RenderIcon from "@/icons/RenderIcon";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "../others/ShowSpinner";

import {
  fetchAllCustomerPricing,
  updateCustomerPricingStatus,
} from "@/hooks/pricing/useCustomerPricing";

import AddCustomerPricing from "@/models/configure/pricing/AddCustomerPricing";
import EditCustomerPricing from "@/models/configure/pricing/EditCustomerPricing";
import DeleteCustomerPricing from "@/models/configure/pricing/DeleteCustomerPricing";

const CustomerPricing = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: allPricing,
    isLoading: isTableLoading,
    isError,
  } = useQuery({
    queryKey: ["all-customer-pricing"],
    queryFn: () => fetchAllCustomerPricing(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggleCustomerPricing"],
    mutationFn: (pricingId) => updateCustomerPricingStatus(pricingId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customer-pricing"]);
      toaster.create({
        title: "Success",
        description: "Pricing status updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating pricing status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      edit: false,
      delete: false,
    });
  };

  return (
    <>
      <h1 className="px-9 mt-5 font-bold p-3 bg-gray-300 text-center sm:text-left sm:px-9 sm:py-3 sm:text-xl">
        Customer
      </h1>

      <div className="flex items-center justify-between mx-9 mt-5 mb-[20px]">
        <h1 className="text-md">Pricing</h1>
        <div>
          <button
            className="bg-teal-700 text-white rounded-md flex items-center space-x-1 p-2"
            onClick={() => toggleModal("add")}
          >
            <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            <span>Add rule</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Rule Name",
                "Base Fare",
                "Base Distance",
                "Fare After Base Distance",
                "Base Weight Upto",
                "Fare After Base Weight",
                "Purchase Fare per hour",
                "Waiting Fare",
                "Waiting Time",
                "Geofence",
                "Status",
              ].map((header, idx) => (
                <Table.ColumnHeader key={idx} color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isTableLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={10} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : allPricing?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={10} textAlign="center">
                  No Pricing Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={10} textAlign="center">
                  Error in fetching agent pricings.
                </Table.Cell>
              </Table.Row>
            ) : (
              allPricing?.map((price) => (
                <Table.Row key={price._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{price.ruleName}</Table.Cell>
                  <Table.Cell textAlign="center">{price.baseFare}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.baseDistance}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.fareAfterBaseDistance}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.baseWeightUpto}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.fareAfterBaseWeight}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.purchaseFarePerHour}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.waitingFare}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price.waitingTime}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {price?.geofenceId?.map((geofence, index) => (
                      <span key={index} className="flex flex-col">
                        {geofence.name}
                        {index < price.geofenceId.length - 1 && ", "}
                      </span>
                    ))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4">
                      {toggleStatus.isPending && selectedId === price._id ? (
                        <ShowSpinner />
                      ) : (
                        <Switch
                          colorPalette="teal"
                          checked={price?.status}
                          onChange={() => toggleStatus.mutate(price._id)}
                        />
                      )}

                      <span
                        onClick={() => toggleModal("edit", price._id)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", price._id)}
                        className="text-red-500"
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={24}
                          loading={6}
                        />
                      </span>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <AddCustomerPricing isOpen={modal.add} onClose={closeModal} />
      <EditCustomerPricing
        isOpen={modal.edit}
        onClose={closeModal}
        pricingId={selectedId}
      />
      <DeleteCustomerPricing
        isOpen={modal.delete}
        onClose={closeModal}
        pricingId={selectedId}
      />
    </>
  );
};

export default CustomerPricing;
