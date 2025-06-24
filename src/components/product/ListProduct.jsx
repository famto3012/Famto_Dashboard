import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DataContext from "@/context/DataContext";

import RenderIcon from "@/icons/RenderIcon";

import { toaster } from "@/components/ui/toaster";

import Error from "@/components/others/Error";
import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchAllProductsOfCategory,
  updateProductOrder,
} from "@/hooks/product/useProduct";
import AddProduct from "@/models/general/product/AddProduct";

const ListProduct = ({ merchantId }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const dragProduct = useRef(0);
  const dragOverProduct = useRef(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedCategory, selectedProduct, setSelectedProduct } =
    useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-products", selectedCategory.categoryId],
    queryFn: () =>
      fetchAllProductsOfCategory(selectedCategory.categoryId, navigate),
    enabled: !!selectedCategory.categoryId,
  });

  useEffect(() => {
    if (data && data?.length > 0) {
      setSelectedProduct({
        productId: data[0]?._id,
      });
      setAllProducts(data);
    } else {
      setSelectedProduct({});
      setAllProducts([]);
    }
  }, [data]);

  const handleReorderProductMutation = useMutation({
    mutationKey: ["reorder-product"],
    mutationFn: (products) => updateProductOrder(products, navigate),
  });

  const handleReorderCategory = (dragIndex, dragOverIndex) => {
    const productClone = [...allProducts];
    const temp = productClone[dragIndex];
    productClone[dragIndex] = productClone[dragOverIndex];
    productClone[dragOverIndex] = temp;

    const products = productClone.map((category, index) => ({
      id: category._id,
      order: index + 1,
    }));

    const promise = new Promise((resolve, reject) => {
      handleReorderProductMutation.mutate(products, {
        onSuccess: () => {
          resolve();
          queryClient.invalidateQueries(["all-products"]);
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            "An unexpected error occurred while re-ordering products.";
          reject(new Error(errorMessage));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Re-ordering...",
        description: "Processing the re-ordering of products.",
      },
      success: {
        title: "Re-ordering Successful",
        description: "The product were re-ordered successfully.",
      },
      error: (error) => ({
        title: "Re-ordering Failed",
        description: error.message,
      }),
    });
  };

  return (
    <div className="w-full">
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
          allProducts?.map((product, index) => (
            <h6
              key={product?._id}
              draggable
              onDragStart={() => (dragProduct.current = index)}
              onDragEnter={() => (dragOverProduct.current = index)}
              onDragEnd={() =>
                handleReorderCategory(
                  dragProduct.current,
                  dragOverProduct.current
                )
              }
              onDragOver={(e) => e.preventDefault()}
              onClick={() =>
                setSelectedProduct({
                  productId: product?._id,
                  productName: product?.productName,
                })
              }
              className={`${
                selectedProduct?.productId === product?._id
                  ? "bg-gray-200"
                  : "bg-transparent"
              } text-start ps-[20px] py-[20px] text-[16px] cursor-pointer hover:bg-gray-100 font-[400] truncate`}
            >
              {product?.productName}
            </h6>
          ))
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-2 py-3 mt-3">
        {!isLoading && (
          <>
            <span
              className="rounded-full bg-teal-800 text-[12px] text-white p-2.5 w-fit"
              onClick={() => setShowModal(true)}
            >
              <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            </span>
          </>
        )}
      </div>

      <AddProduct
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        merchantId={merchantId}
      />
    </div>
  );
};

export default ListProduct;
