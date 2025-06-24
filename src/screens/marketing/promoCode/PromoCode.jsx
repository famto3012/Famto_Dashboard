import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HStack, Table } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import ShowSpinner from "@/components/others/ShowSpinner";
import GlobalSearch from "@/components/others/GlobalSearch";

import {
  fetchAllPromoCodes,
  updatePromoCodeStatus,
} from "@/hooks/promocode/usePromocode";

import { formatDate } from "@/utils/formatter";
import AddPromoCode from "@/models/marketing/promocode/AddPromoCode";
import EditPromoCode from "@/models/marketing/promocode/EditPromoCode";
import DeletePromoCode from "@/models/marketing/promocode/DeletePromoCode";

const PromoCode = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-promo-codes"],
    queryFn: () => fetchAllPromoCodes(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["update-promo-status", selectedId],
    mutationFn: (selectedId) => updatePromoCodeStatus(selectedId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-promo-codes"]);
      setSelectedId(null);
      toaster.create({
        title: "Success",
        description: "Updated promo code status",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to update promo code status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
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
    <div className="bg-gray-100 h-full">
      <GlobalSearch />
      <div className="mx-5 flex justify-between mt-4">
        <h1 className="font-bold text-[20px]">Promo codes</h1>
      </div>
      <div className="m-5 text-gray-500 flex flex-col sm:flex-row items-center justify-between">
        <p className="max-w-full sm:max-w-[80%] mb-4 sm:mb-0">
          Promo codes are exclusive discount vouchers that can be redeemed by
          the customers during the checkout process <br /> You can create
          customized promotional codes with a detailed description that will be
          visible to customers.
        </p>

        <button
          className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold flex items-center gap-2 outline-none focus:outline-none"
          onClick={() => toggleModal("add")}
        >
          <RenderIcon iconName="PlusIcon" size={16} loading={6} />
          <span>Add Promo codes</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Code",
                "Value",
                "Maximum discount",
                "Minimum order amount",
                "Validity",
                "Geofence",
                "Promo Application mode",
                "Promo Applied on",
                "Current Usage Count / Max Usage Count",
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
                <Table.Cell colSpan={12} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={12} textAlign="center">
                  No Promo codes Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={12} textAlign="center">
                  Error in fetching promo codes.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.promoCodeId} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{item.promoCode}</Table.Cell>
                  <Table.Cell textAlign="center">{item.promoValue}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.maxDiscountValue}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.minOrderAmount}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {formatDate(item.fromDate)} <br /> {formatDate(item.toDate)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                   {item?.geofences?.map((geofence, index) => (
                      <span key={index} className="flex flex-col">
                        {geofence}
                        {index < item.geofences.length - 1 && ", "}
                      </span>
                    ))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.applicationMode}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.appliedOn}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.noOfUserUsed} / {item.maxAllowedUsers}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4" justify="center">
                      {toggleStatus.isPending &&
                      selectedId === item.promoCodeId ? (
                        <ShowSpinner />
                      ) : (
                        <Switch
                          colorPalette="teal"
                          checked={item?.status}
                          onChange={() => toggleStatus.mutate(item.promoCodeId)}
                        />
                      )}

                      <span
                        onClick={() => toggleModal("edit", item.promoCodeId)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", item.promoCodeId)}
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

      <AddPromoCode isOpen={modal.add} onClose={closeModal} />
      <EditPromoCode
        isOpen={modal.edit}
        onClose={closeModal}
        promoCodeId={selectedId}
      />
      <DeletePromoCode
        isOpen={modal.delete}
        onClose={closeModal}
        promoCodeId={selectedId}
      />
    </div>
  );
};

export default PromoCode;
