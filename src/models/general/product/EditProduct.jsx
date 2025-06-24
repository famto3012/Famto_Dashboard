import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

// import { fetchAllProductDiscount } from "@/hooks/discount/useDiscount";
import {
  fetchSingleProductDetail,
  updateProductDetail,
} from "@/hooks/product/useProduct";
import CropImage from "@/components/others/CropImage";

const EditProduct = ({ isOpen, onClose, merchantId }) => {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    minQuantityToOrder: "",
    maxQuantityPerOrder: "",
    costPrice: "",
    sku: "",
    discountId: null,
    oftenBoughtTogetherId: [],
    preparationTime: "",
    searchTags: [],
    description: "",
    longDescription: "",
    type: "",
    availableQuantity: "",
    alert: "",
    productImageURL: "",
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tagValue, setTagValue] = useState("");

  const [showCrop, setShowCrop] = useState(false);

  const inputRef = useRef(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { selectedProduct } = useContext(DataContext);

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["product-detail", selectedProduct.productId],
    queryFn: () =>
      fetchSingleProductDetail(selectedProduct.productId, navigate),
    enabled: isOpen,
  });

  // const {
  //   data: discountData,
  //   isLoading: discountLoading,
  //   isError: discountError,
  // } = useQuery({
  //   queryKey: ["all-product-discount", merchantId],
  //   queryFn: () => fetchAllProductDiscount(role, merchantId, navigate),
  //   enabled: isOpen,
  // });

  useEffect(() => {
    productData && setFormData(productData);
  }, [productData]);

  // const discountOptions = discountData?.map((discount) => ({
  //   label: discount.discountName,
  //   value: discount._id,
  // }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputNumberValidation = (e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = tagValue.trim();
      const currentTags = Array.isArray(formData.searchTags)
        ? formData.searchTags
        : [];

      if (trimmedValue && !currentTags.includes(trimmedValue)) {
        setFormData({
          ...formData,
          searchTags: [...currentTags, trimmedValue],
        });
        setTagValue("");
        inputRef.current.focus();
      }
    } else if (e.key === "Backspace" && !tagValue) {
      const currentTags = Array.isArray(formData.searchTags)
        ? formData.searchTags
        : [];

      setFormData({
        ...formData,
        searchTags: currentTags.slice(0, -1),
      });
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      searchTags: formData.searchTags.filter((_, i) => i !== index),
    });
  };

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowCrop(true);
    }
  };

  const handleCropImage = (file) => {
    setCroppedFile(file);
    cancelCrop();
  };

  const cancelCrop = () => {
    setSelectedFile(null);
    setShowCrop(false);
  };

  const handleEditProduct = useMutation({
    mutationKey: ["edit-product"],
    mutationFn: (data) =>
      updateProductDetail(selectedProduct.productId, data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-product"]);
      setFormData({});
      setCroppedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "Product detail updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const priceNum = Number(formData.price);
    const costPriceNum = Number(formData.costPrice);

    if (
      (formData.price && (isNaN(priceNum) || priceNum <= 0)) ||
      (formData.costPrice && (isNaN(costPriceNum) || costPriceNum <= 0))
    ) {
      toaster.create({
        title: "Error",
        description:
          role === "Merchant" ? "Invalid price" : "Invalid price / cost price",
        type: "error",
      });

      return;
    }

    const formDataObject = new FormData();

    function appendFormData(value, key) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(item, `${key}[${index}]`);
        });
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          appendFormData(nestedValue, key ? `${key}[${nestedKey}]` : nestedKey);
        });
      } else if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    croppedFile && formDataObject.append("productImage", croppedFile);

    Object.entries(formData).forEach(([key, value]) => {
      appendFormData(value, key);
    });
    handleEditProduct.mutate(formDataObject);
  };

  const isLoading = productLoading;
  const isError = productError;

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
      size="lg"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[16px] font-[600]">
          Edit Product
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="productName">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="productName"
                  placeholder="Product name"
                  value={formData.productName}
                  onChange={handleInputChange}
                />
              </div>
              {role !== "Merchant" && (
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="price">
                    Price <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onKeyDown={handleInputNumberValidation}
                  />
                </div>
              )}
              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="availableQuantity"
                >
                  Available Quantity
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="availableQuantity"
                  placeholder="Available quantity"
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="alert">
                  Alert Quantity
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="alert"
                  placeholder="Alert quantity"
                  value={formData.alert}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500 "
                  htmlFor="minQuantityToOrder"
                >
                  Minimum Quantity to Order
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="minQuantityToOrder"
                  placeholder="Minimum quantity to order"
                  value={formData.minQuantityToOrder}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="maxQuantityPerOrder"
                >
                  Maximum Quantity to Order
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="maxQuantityPerOrder"
                  placeholder="Maximum quantity to order"
                  value={formData.maxQuantityPerOrder}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="costPrice">
                  {role !== "Merchant" ? "Cost Price" : "Price"}
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="costPrice"
                  placeholder={role !== "Merchant" ? "Cost Price" : "Price"}
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="sku">
                  SKU
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="discountId">
                  Discount
                </label>

                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={discountOptions?.find(
                    (option) => option.value === formData.discountId
                  )}
                  isMulti={false}
                  isSearchable={true}
                  onChange={(option) =>
                    setFormData({ ...formData, discountId: option.value })
                  }
                  options={discountOptions}
                  placeholder="Select discount"
                />
              </div> */}
              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="preparationTime"
                >
                  Preparation Time
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="preparationTime"
                  placeholder="Preparation time (in minutes)"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="searchTag">
                  Search Tag
                </label>
                <div className="w-2/3">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {formData?.searchTags?.map((tag, index) => (
                      <div
                        className="flex items-center bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                        key={index}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    name="searchTags"
                    placeholder="Search tags"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border-2 border-gray-100 rounded p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="description">
                  Description
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex items-start">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="longDescription"
                >
                  Long description
                </label>
                <textarea
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none resize-y"
                  type="text"
                  name="longDescription"
                  placeholder="Long description"
                  value={formData.longDescription}
                  rows={5}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
                {/* Label */}
                <label className="w-full sm:w-1/3 text-gray-500" htmlFor="type">
                  Type <span className="text-red-600">*</span>
                </label>

                {/* Radio Group */}
                <RadioGroup
                  value={formData.type}
                  onValueChange={(e) =>
                    setFormData({ ...formData, type: e.value })
                  }
                  className="w-full sm:w-2/3"
                  size="sm"
                  colorPalette="teal"
                  variant="solid"
                >
                  <HStack gap="8" direction="row" className="flex-wrap">
                    <Radio value="Veg" className="cursor-pointer">
                      Veg
                    </Radio>
                    <Radio value="Non-veg" className="cursor-pointer">
                      Non-veg
                    </Radio>
                    <Radio value="Other" className="cursor-pointer">
                      Other
                    </Radio>
                  </HStack>
                </RadioGroup>
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="photos">
                  Photos
                </label>

                <div className=" flex items-center gap-[30px]">
                  {!croppedFile && !formData?.productImageURL ? (
                    <div className="h-[66px] w-[66px] bg-gray-300 rounded-md "></div>
                  ) : (
                    <figure className="h-[66px] w-[66px] rounded-md">
                      <img
                        src={
                          croppedFile
                            ? URL?.createObjectURL(croppedFile)
                            : formData?.productImageURL
                        }
                        alt={formData.productName}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  )}
                  <input
                    type="file"
                    name="productImage"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSelectFile}
                  />
                  <label
                    htmlFor="productImage"
                    className="cursor-pointer flex items-center justify-center bg-teal-800 text-white p-2 h-16 w-16 rounded-md"
                  >
                    <RenderIcon iconName="CameraIcon" size={24} loading={6} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Crop Modal */}
          <CropImage
            isOpen={showCrop && selectedFile}
            onClose={() => {
              setSelectedFile(null);
              setShowCrop(false);
            }}
            selectedImage={selectedFile}
            onCropComplete={handleCropImage}
            aspectRatio={1 / 1}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button className="bg-teal-700 p-2 text-white" onClick={handleSave}>
            {handleEditProduct.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditProduct;
