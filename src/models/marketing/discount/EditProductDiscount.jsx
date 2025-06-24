import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";

import AuthContext from "@/context/AuthContext";

import { HStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";
import { Switch } from "@/components/ui/switch";

import Error from "@/components/others/Error";
import ModalLoader from "@/components/others/ModalLoader";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchAllProductsOfMerchant } from "@/hooks/product/useProduct";
import {
  fetchSingleProductDiscount,
  updateProductDiscount,
} from "@/hooks/discount/useDiscount";

import "react-datepicker/dist/react-datepicker.css";

const EditProductDiscount = ({ isOpen, onClose, discountId }) => {
  const [formData, setFormData] = useState({
    discountName: "",
    discountType: "",
    discountValue: "",
    maxAmount: "",
    productId: [],
    validFrom: "",
    validTo: "",
    description: "",
    geofenceId: "",
    onAddOn: false,
    merchantId: false,
  });
  const [haveMerchantId, setHaveMerchantId] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: discountData,
    isLoading: discountLoading,
    isError: discountError,
  } = useQuery({
    queryKey: ["product-discount", discountId],
    queryFn: () => fetchSingleProductDiscount(discountId, navigate),
    enabled: isOpen,
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: isOpen,
  });

  const {
    data: allProducts,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["all-products-of-merchant", formData.merchantId],
    queryFn: () => fetchAllProductsOfMerchant(formData.merchantId, navigate),
    enabled: haveMerchantId && !!formData.merchantId,
  });

  const handelEditDiscount = useMutation({
    mutationKey: ["edit-product-discount", discountId],
    mutationFn: ({ role, discountId, formData }) =>
      updateProductDiscount(role, discountId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-product-discount"]);
      setFormData({
        discountName: "",
        discountType: "",
        discountValue: "",
        maxAmount: "",
        productId: [],
        validFrom: "",
        validTo: "",
        description: "",
        geofenceId: "",
        onAddOn: false,
        merchantId: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "New product discount updated",
        type: "success",
      });
    },
    onError: (data) => {
      const { message, conflictingProducts } = data.data;

      // Construct error message
      const errorMessage = conflictingProducts?.length
        ? `${message}: ${conflictingProducts.join(", ")}`
        : message;

      toaster.create({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    },
  });

  useEffect(() => {
    discountData && setFormData(discountData);
    discountData?.merchantId && setHaveMerchantId(true);
  }, [discountData]);

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  useEffect(() => {
    const productValues = [
      { label: "Select All", value: "selectAll" },
      ...(Array.isArray(allProducts)
        ? allProducts.map((product) => ({
            label: product.productName,
            value: product._id,
          }))
        : []),
    ];
    setProductOptions(productValues);
  }, [allProducts]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selected) => {
    if (selected && selected.some((option) => option.value === "selectAll")) {
      setFormData({
        ...formData,
        productId: allProducts.map((product) => product._id),
      });
    } else {
      setFormData({
        ...formData,
        productId: selected ? selected.map((option) => option.value) : [],
      });
    }
  };

  const isLoading = discountLoading || geofenceLoading || productLoading;
  const isError = discountError || geofenceError || productError;

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Edit Product Discount
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <>
              <div className="flex flex-col max-h-[30rem] overflow-auto gap-5 justify-between">
                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Discount Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-2 border-gray-300 rounded p-2 w-2/3 focus:outline-none"
                    name="discountName"
                    value={formData.discountName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Discount <span className="text-red-600">*</span>
                  </label>

                  <RadioGroup
                    value={formData.discountType}
                    onValueChange={(e) =>
                      setFormData({ ...formData, discountType: e.value })
                    }
                    className="w-2/3"
                    size="sm"
                    colorPalette="teal"
                    variant="solid"
                  >
                    <HStack gap="8" direction="row">
                      <Radio value="Flat-discount" className="cursor-pointer">
                        Flat discount
                      </Radio>
                      <Radio
                        value="Percentage-discount"
                        className="cursor-pointer"
                      >
                        Percentage discount
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500 invisible">
                    Discount value <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-2 border-gray-300 rounded p-2 w-2/3 focus:outline-none"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Select Product <span className="text-red-600">*</span>
                  </label>

                  <Select
                    className="rounded w-2/3 outline-none focus:outline-none"
                    value={productOptions?.filter((option) =>
                      formData.productId?.includes(option.value)
                    )}
                    isSearchable={true}
                    onChange={handleSelectChange}
                    options={productOptions}
                    placeholder="Select product"
                    isClearable={true}
                    isMulti={true}
                    styles={{
                      valueContainer: (provided) => ({
                        ...provided,
                        maxHeight: "10rem",
                        overflowY: "auto",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Max Amount <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="text"
                    className="border-2 border-gray-300 rounded p-2 w-2/3 focus:outline-none"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Valid From <span className="text-red-600">*</span>
                  </label>

                  <div className="flex justify-start w-2/3">
                    <DatePicker
                      selected={formData.validFrom}
                      onChange={(date) =>
                        setFormData({ ...formData, validFrom: date })
                      }
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Valid To <span className="text-red-600">*</span>
                  </label>

                  <div className="justify-start w-2/3">
                    <DatePicker
                      selected={formData.validTo}
                      onChange={(date) =>
                        setFormData({ ...formData, validTo: date })
                      }
                      minDate={
                        formData?.validFrom
                          ? new Date(
                              new Date(formData?.validFrom).getTime() +
                                24 * 60 * 60 * 1000
                            )
                          : new Date()
                      }
                      dateFormat="yyyy-MM-dd"
                      className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Geofence <span className="text-red-600">*</span>
                  </label>

                  <Select
                    options={geofenceOptions}
                    value={geofenceOptions?.find(
                      (option) => option.value === formData.geofenceId
                    )}
                    onChange={(option) =>
                      setFormData({
                        ...formData,
                        geofenceId: option.value,
                      })
                    }
                    className="rounded w-2/3 outline-none focus:outline-none"
                    placeholder="Select geofence"
                    isSearchable={true}
                    isMulti={false}
                    menuPlacement="top"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-1/2 text-gray-500">
                    Discount on add-on
                  </label>

                  <div className="w-2/3 flex justify-start">
                    <Switch
                      colorPalette="teal"
                      checked={formData?.onAddOn}
                      onChange={() => {
                        setFormData({
                          ...formData,
                          onAddOn: !formData.onAddOn,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-300 rounded-lg px-6 py-2 font-semibold justify-end"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end"
                    onClick={() =>
                      handelEditDiscount.mutate({ role, discountId, formData })
                    }
                  >
                    {handelEditDiscount.isPending ? `Saving...` : `Save`}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditProductDiscount;
