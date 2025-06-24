import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import { HStack, Table } from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { Switch } from "@/components/ui/switch";

import ShowSpinner from "@/components/others/ShowSpinner";

import { formatDate, formatTime } from "@/utils/formatter";
import {
  fetchAllMerchantDiscount,
  updateMerchantDiscountStatus,
} from "@/hooks/discount/useDiscount";

import AddMerchantDiscount from "@/models/marketing/discount/AddMerchantDiscount";

import RenderIcon from "@/icons/RenderIcon";
import EditMerchantDiscount from "@/models/marketing/discount/EditMerchantDiscount";
import DeleteMerchantDiscount from "@/models/marketing/discount/DeleteMerchantDiscount";

const MerchantDiscount = ({ selectedMerchant }) => {
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-merchant-discount", selectedMerchant],
    queryFn: ({ queryKey }) => {
      const [_, merchant] = queryKey;
      return fetchAllMerchantDiscount(role, merchant?.merchantId, navigate);
    },
    enabled: selectedMerchant.merchantId ? true : false,
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-merchant-discount", selectedMerchant],
    mutationFn: ({ role, discountId }) =>
      updateMerchantDiscountStatus(role, discountId, navigate),
    onSuccess: () => {
      setSelectedId(null);
      queryClient.invalidateQueries([
        "all-merchant-discount",
        selectedMerchant,
      ]);
      toaster.create({
        title: "Success",
        description: "Updated Merchant discount status",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating merchant discount status",
        type: "Error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal({ ...modal, [type]: true });
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
      <div className="flex items-center justify-between mt-[30px] mx-5">
        <h1 className="font-bold text-[16px] sm:text-[20px]">
          Merchant Discount
        </h1>
        <button
          onClick={() => toggleModal("add")}
          className="flex items-center gap-1.5 bg-teal-800 text-white px-3 py-1.5 rounded-md text-xs sm:gap-2 sm:px-5 sm:py-3 sm:rounded-lg sm:text-sm"
        >
          <RenderIcon iconName="PlusIcon" size={14} loading={6} />
          <span>Add Discount</span>
        </button>
      </div>

      <div className="mt-5 max-h-[30rem] overflow-y-auto">
        <Table.Root striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Name",
                "Value",
                "Valid From",
                "Valid To",
                "Geofence",
                "Status",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  No Merchant discounts Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  Error in fetching merchant discounts.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">
                    {item.discountName}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.maxDiscountValue}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {formatDate(item.validFrom)}
                    <br />
                    {formatTime(item.validFrom)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {" "}
                    {formatDate(item.validTo)}
                    <br />
                    {formatTime(item.validTo)}
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    {item?.geofenceId?.name}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4" justify="center">
                      <Switch
                        disabled={toggleStatus.isPending}
                        colorPalette="teal"
                        checked={item?.status}
                        onChange={() => {
                          setSelectedId(item._id);
                          toggleStatus.mutate({ role, discountId: item._id });
                        }}
                      />

                      <span
                        onClick={() => toggleModal("edit", item._id)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", item._id)}
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

        <AddMerchantDiscount
          isOpen={modal.add}
          onClose={closeModal}
          selectedMerchant={selectedMerchant}
        />

        <EditMerchantDiscount
          isOpen={modal.edit}
          onClose={closeModal}
          discountId={selectedId}
          selectedMerchant={selectedMerchant}
        />

        <DeleteMerchantDiscount
          isOpen={modal.delete}
          onClose={closeModal}
          discountId={selectedId}
          selectedMerchant={selectedMerchant}
        />
      </div>
    </>
  );
};

export default MerchantDiscount;
