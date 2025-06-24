import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import RenderIcon from "@/icons/RenderIcon";

import {
  getAllBusinessCategory,
  updateBusinessCategoryOrder,
  updateBusinessCategoryStatus,
} from "@/hooks/customerAppCustomization/useBusinessCategory";

import AddBusinessCategory from "@/models/appCustomization/customerApp/businessCategory/AddBusinessCategory";
import EditBusinessCategory from "@/models/appCustomization/customerApp/businessCategory/EditBusinessCategory";
import DeleteBusinessCategory from "@/models/appCustomization/customerApp/businessCategory/DeleteBusinessCategory";

const BusinessCategory = () => {
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dragCategory = useRef(0);
  const dragOverCategory = useRef(0);

  const {
    data: allBusinessCategory,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
  });

  const handleReorderCategoryMutation = useMutation({
    mutationKey: ["reorder-business-category"],
    mutationFn: (categories) =>
      updateBusinessCategoryOrder(categories, navigate),
  });

  const handleUpdateCategoryStatus = useMutation({
    mutationKey: ["toggle-business-category-status"],
    mutationFn: (id) => updateBusinessCategoryStatus(id, navigate),
  });

  const handleReorderCategory = (dragIndex, dragOverIndex) => {
    const categoryClone = [...allBusinessCategory];
    const temp = categoryClone[dragIndex];
    categoryClone[dragIndex] = categoryClone[dragOverIndex];
    categoryClone[dragOverIndex] = temp;

    const categories = categoryClone.map((category, index) => ({
      id: category._id,
      order: index + 1,
    }));

    const promise = new Promise((resolve, reject) => {
      handleReorderCategoryMutation.mutate(
        { categories },
        {
          onSuccess: () => {
            resolve();
            queryClient.invalidateQueries(["all-businessCategory"]);
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message ||
              "An unexpected error occurred while re-ordering business categories.";
            reject(new Error(errorMessage));
          },
        }
      );
    });

    toaster.promise(promise, {
      loading: {
        title: "Re-ordering...",
        description: "Processing the re-ordering of business categories.",
      },
      success: {
        title: "Re-ordering Successful",
        description: "The business categories were re-ordered successfully.",
      },
      error: (error) => ({
        title: "Re-ordering Failed",
        description: error.message,
      }),
    });
  };

  const handleUpdateStatus = (categoryId) => {
    const promise = new Promise((resolve, reject) => {
      handleUpdateCategoryStatus.mutate(categoryId, {
        onSuccess: () => {
          resolve();
          queryClient.invalidateQueries(["all-businessCategory"]);
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            "An unexpected error occurred while re-ordering business categories.";
          reject(new Error(errorMessage));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Waiting...",
        description: "Processing category status update.",
      },
      success: {
        title: "Success",
        description: "Business categories status updated successfully.",
      },
      error: (error) => ({
        title: "Failed",
        description: error.message,
      }),
    });
  };

  const toggleModal = (type, id = null) => {
    setSelectedId(id), setModal({ ...modal, [type]: true });
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
      <div className="flex flex-col lg:flex-row items-start mx-5 mt-10 gap-[20px]">
        <div className="lg:w-1/5">Business Category</div>

        <p className="text-gray-500 flex-1">
          Business Categories provide your merchants the power to map their
          categories/products to a business category, which in turn will help
          the customers to easy checkout.
        </p>

        <button
          onClick={() => toggleModal("add")}
          className="flex items-center gap-2 bg-teal-800 text-white p-2 rounded-lg"
        >
          <RenderIcon iconName="PlusIcon" size={16} loading={6} />
          <span className="hidden lg:block">Add Business Category</span>
        </button>
      </div>

      {categoryLoading ? (
        <Loader />
      ) : categoryError ? (
        <Error />
      ) : (
        <div className="flex flex-col lg:justify-center lg:items-center mt-10 gap-5 border-b-2 border-gray-200 pb-10">
          {allBusinessCategory?.map((data, index) => (
            <div
              draggable
              onDragStart={() => (dragCategory.current = index)}
              onDragEnter={() => (dragOverCategory.current = index)}
              onDragEnd={() =>
                handleReorderCategory(
                  dragCategory.current,
                  dragOverCategory.current
                )
              }
              onDragOver={(e) => e.preventDefault()}
              className="bg-white lg:bg-gray-400 rounded-lg overflow-x-scroll p-3 px-2 lg:px-5 flex items-center justify-between gap-5 xl:w-[30%] mx-5 lg:mx-0"
              key={data?._id}
            >
              <div className="flex flex-row items-center">
                <span className="p-2 lg:p-3">
                  <RenderIcon iconName="ReOrderIcon" size={20} loading={6} />
                </span>

                <figure className="h-10 w-10">
                  <img
                    src={data?.bannerImageURL}
                    className="object-cover w-full h-full rounded-full"
                  />
                </figure>

                <p className=" ms-3 flex-grow overflow-ellipsis">
                  {data?.title}
                </p>
              </div>

              <div className=" flex flex-row items-center gap-3 lg:gap-[20px] ">
                <Switch
                  colorPalette="teal"
                  checked={data?.status}
                  onCheckedChange={() => handleUpdateStatus(data?._id)}
                />

                <button
                  onClick={() => toggleModal("edit", data?._id)}
                  className="bg-gray-200 text-gray-500 p-3 rounded-lg"
                >
                  <RenderIcon iconName="EditIcon" loading={6} />
                </button>

                <button
                  onClick={() => toggleModal("delete", data?._id)}
                  className="bg-red-100 text-red-500 p-3 rounded-lg"
                >
                  <RenderIcon iconName="DeleteIcon" loading={6} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBusinessCategory isOpen={modal.add} onClose={closeModal} />
      <EditBusinessCategory
        isOpen={modal.edit}
        onClose={closeModal}
        categoryId={selectedId}
      />
      <DeleteBusinessCategory
        isOpen={modal.delete}
        onClose={closeModal}
        categoryId={selectedId}
      />
    </>
  );
};

export default BusinessCategory;
