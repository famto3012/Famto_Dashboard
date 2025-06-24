import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import ListCategory from "@/components/product/ListCategory";
import ListProduct from "@/components/product/ListProduct";
import ProductDetail from "@/components/product/ProductDetail";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";
import { updateCategoryStatus } from "@/hooks/product/useProduct";
import EditCategory from "@/models/general/product/EditCategory";
import DeleteCategory from "@/models/general/product/DeleteCategory";
import CSVOperation from "@/models/general/product/CSVOperation";

const Product = () => {
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [modal, setModal] = useState({
    edit: false,
    delete: false,
    csv: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, userId } = useContext(AuthContext);
  const { selectedCategory, setSelectedCategory } = useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: role && role !== "Merchant",
  });

  useEffect(() => {
    if (role !== "Merchant" && data && data.length > 0) {
      setSelectedMerchant(data[0]._id);
    }

    if (role === "Merchant") {
      setSelectedMerchant(userId);
    }
  }, [data]);

  const merchantOptions = data?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

  const toggleModal = (type) => {
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setModal({
      edit: false,
      delete: false,
      csv: false,
    });
  };

  const handleUpdateCategoryStatus = useMutation({
    mutationKey: ["toggle-category-status"],
    mutationFn: () =>
      updateCategoryStatus(
        role,
        selectedCategory?.categoryId,
        selectedMerchant,
        navigate
      ),
    onSuccess: () => {
      setSelectedCategory({
        ...selectedCategory,
        categoryStatus: !selectedCategory.categoryStatus,
      });
      queryClient.invalidateQueries(["all-category", selectedMerchant]);
      toaster.create({
        title: "Success",
        description: "Status updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating status",
        type: "error",
      });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <>
      <div className="bg-gray-100 min-h-full">
        <GlobalSearch />

        <div className="flex justify-between bg-white p-5 mx-[20px] mt-5 rounded-md">
          {role !== "Merchant" && (
            <Select
              className="w-[200px] outline-none focus:outline-none"
              value={merchantOptions?.find(
                (option) => option.value === selectedMerchant
              )}
              isSearchable
              onChange={(option) =>
                setSelectedMerchant(option ? option.value : null)
              }
              options={merchantOptions}
            />
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => toggleModal("csv")}
              className="bg-cyan-100 text-black rounded-md py-2 px-4 font-semibold flex gap-[5px] items-center"
            >
              CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Categories */}
          <div className="w-full md:w-1/5">
            <ListCategory merchantId={selectedMerchant} />
          </div>

          {/* Product and Product Details */}
          <div className="w-full md:w-4/5 bg-white rounded-md m-5 ml-2">
            <div className="border-b-2 p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Category Name */}
                <h1 className="font-semibold ml-3 text-[18px] capitalize">
                  {selectedCategory?.categoryName}
                </h1>

                {/* Action Buttons and Switch */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center">
                  <div className="flex items-center gap-2">
                    <span>Disabled</span>
                    <Switch
                      disabled={
                        handleUpdateCategoryStatus.isPending ||
                        !selectedCategory.categoryId
                      }
                      colorPalette="teal"
                      checked={selectedCategory?.categoryStatus}
                      onCheckedChange={() =>
                        handleUpdateCategoryStatus.mutate()
                      }
                    />
                    <span>Enable</span>
                  </div>

                  {/* Edit Button */}
                  <Button
                    disabled={!selectedCategory.categoryId}
                    className="bg-blue-50 p-2 flex items-center gap-x-2 px-5 rounded-md"
                    onClick={() => toggleModal("edit")}
                  >
                    <RenderIcon iconName="EditIcon" size={16} loading={6} />
                    <span>Edit</span>
                  </Button>

                  {/* Delete Button */}
                  <Button
                    disabled={!selectedCategory.categoryId}
                    className="bg-red-100 p-2 flex items-center gap-x-2 rounded-md px-3"
                    onClick={() => toggleModal("delete")}
                  >
                    <span className="text-red-500">
                      <RenderIcon iconName="DeleteIcon" size={18} loading={6} />
                    </span>
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Product and Product Details Block Layout */}
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-full md:w-1/3">
                <ListProduct merchantId={selectedMerchant} />
              </div>

              <div className="w-full md:w-2/3">
                <ProductDetail merchantId={selectedMerchant} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EditCategory
        isOpen={modal.edit}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />

      <DeleteCategory
        isOpen={modal.delete}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />

      <CSVOperation
        isOpen={modal.csv}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />
    </>
  );
};

export default Product;
