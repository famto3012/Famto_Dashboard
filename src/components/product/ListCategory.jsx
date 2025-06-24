import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import Error from "@/components/others/Error";
import ShowSpinner from "@/components/others/ShowSpinner";

import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchAllCategoriesOfMerchant,
  updateCategoryOrder,
} from "@/hooks/product/useProduct";
import DataContext from "@/context/DataContext";
import AddCategory from "@/models/general/product/AddCategory";

const ListCategory = ({ merchantId }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const dragCategory = useRef(0);
  const dragOverCategory = useRef(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { selectedCategory, setSelectedCategory } = useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-category", merchantId],
    queryFn: () => fetchAllCategoriesOfMerchant(role, merchantId, navigate),
    enabled: !!merchantId,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedCategory({
        categoryId: data[0]?._id,
        categoryName: data[0]?.categoryName,
        categoryStatus: data[0]?.status,
      });
      setAllCategories(data);
    } else {
      setSelectedCategory({});
      setAllCategories([]);
    }
  }, [data]);

  const handleReorderCategoryMutation = useMutation({
    mutationKey: ["reorder-category"],
    mutationFn: (categories) => updateCategoryOrder(categories, navigate),
  });

  const handleReorderCategory = (dragIndex, dragOverIndex) => {
    const categoryClone = [...allCategories];
    const temp = categoryClone[dragIndex];
    categoryClone[dragIndex] = categoryClone[dragOverIndex];
    categoryClone[dragOverIndex] = temp;

    const categories = categoryClone.map((category, index) => ({
      id: category._id,
      order: index + 1,
    }));

    const promise = new Promise((resolve, reject) => {
      handleReorderCategoryMutation.mutate(categories, {
        onSuccess: () => {
          resolve();
          queryClient.invalidateQueries(["all-category"]);
          setSelectedCategory(selectedCategory);
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            "An unexpected error occurred while re-ordering categories.";
          reject(new Error(errorMessage));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Re-ordering...",
        description: "Processing the re-ordering of categories.",
      },
      success: {
        title: "Re-ordering Successful",
        description: "The categories were re-ordered successfully.",
      },
      error: (error) => ({
        title: "Re-ordering Failed",
        description: error.message,
      }),
    });
  };

  return (
    <>
      <div className="w-full bg-white rounded-md mt-5 mr-0">
        <div className="border-b-2 pb-1">
          <h1 className="font-[600] px-8 pt-8 pb-4 text-[18px]">Categories</h1>
        </div>

        <div className="max-h-[30rem] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center my-3 ">
              <ShowSpinner />
            </div>
          ) : isError ? (
            <div className="flex justify-center my-3 ">
              <Error />
            </div>
          ) : (
            allCategories?.map((category, index) => (
              <h6
                key={category._id}
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
                onClick={() =>
                  setSelectedCategory({
                    categoryId: category?._id,
                    categoryName: category?.categoryName,
                    categoryStatus: category?.status,
                  })
                }
                className={` ${
                  selectedCategory.categoryId === category?._id
                    ? "bg-gray-200"
                    : "bg-transparent"
                } text-start ps-[20px] py-[20px] text-[16px] cursor-pointer hover:bg-gray-100 font-[400] capitalize truncate`}
              >
                {category.categoryName}
              </h6>
            ))
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-2 py-3">
          {!isLoading && (
            <span
              className="rounded-full bg-teal-800 text-[12px] text-white p-2.5 w-fit"
              onClick={() => setShowModal(true)}
            >
              <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            </span>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddCategory
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        merchantId={merchantId}
      />
    </>
  );
};

export default ListCategory;
