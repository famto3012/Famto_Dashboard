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
  fetchAllProductDiscount,
  updateProductDiscountStatus,
} from "@/hooks/discount/useDiscount";

import RenderIcon from "@/icons/RenderIcon";

import AddProductDiscount from "@/models/marketing/discount/AddProductDiscount";
import EditProductDiscount from "@/models/marketing/discount/EditProductDiscount";
import DeleteProductDiscount from "@/models/marketing/discount/DeleteProductDiscount";

const ProductDiscount = ({ selectedMerchant }) => {
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
    queryKey: ["all-product-discount", selectedMerchant],
    queryFn: ({ queryKey }) => {
      const [_, merchant] = queryKey;
      return fetchAllProductDiscount(role, merchant?.merchantId, navigate);
    },
    enabled: selectedMerchant.merchantId ? true : false,
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-product-discount", selectedMerchant],
    mutationFn: ({ role, discountId }) =>
      updateProductDiscountStatus(role, discountId, navigate),
    onSuccess: () => {
      setSelectedId(null);
      queryClient.invalidateQueries(["all-product-discount", selectedMerchant]);
      toaster.create({
        title: "Success",
        description: "Updated product discount status",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating product discount status",
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
          Product Discount
        </h1>
        <button
          onClick={() => toggleModal("add")}
          className="flex items-center gap-1.5 bg-teal-800 text-white px-3 py-1.5 rounded-md text-xs sm:gap-2 sm:px-5 sm:py-3 sm:rounded-lg sm:text-sm"
        >
          <RenderIcon iconName="PlusIcon" size={14} loading={6} />
          Add Product-wise Discount
        </button>
      </div>

      <div className="mt-5 max-h-[30rem] overflow-y-auto">
        <Table.Root striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Name",
                "Value",
                "Product Name",
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
                <Table.Cell colSpan={7} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={7} textAlign="center">
                  No Product discounts Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={7} textAlign="center">
                  Error in fetching product discounts.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.discountId} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">
                    {item.discountName}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.value}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item?.products?.slice(0, 3).map((product, index) => (
                      <span key={index}>
                        {product}
                        {index < Math.min(item.products.length, 3) - 1 && ", "}
                        <br />
                      </span>
                    ))}
                    {item?.products?.length > 3 && <span>...</span>}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.validFrom}</Table.Cell>
                  <Table.Cell textAlign="center">{item.validTo}</Table.Cell>
                  <Table.Cell textAlign="center">{item?.geofence}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4" justify="center">
                      <Switch
                        disabled={toggleStatus.isPending}
                        colorPalette="teal"
                        checked={item?.status}
                        onChange={() => {
                          setSelectedId(item.discountId);
                          toggleStatus.mutate({
                            role,
                            discountId: item.discountId,
                          });
                        }}
                      />

                      <span
                        onClick={() => toggleModal("edit", item.discountId)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", item.discountId)}
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

      <AddProductDiscount
        isOpen={modal.add}
        onClose={closeModal}
        selectedMerchant={selectedMerchant}
      />

      <EditProductDiscount
        isOpen={modal.edit}
        onClose={closeModal}
        discountId={selectedId}
      />

      <DeleteProductDiscount
        isOpen={modal.delete}
        onClose={closeModal}
        discountId={selectedId}
      />
    </>
  );
};

export default ProductDiscount;
