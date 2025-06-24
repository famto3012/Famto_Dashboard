import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { HStack } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Radio, RadioGroup } from "@/components/ui/radio";

import ModalLoader from "@/components/others/ModalLoader";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { getAllBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";
import {
  fetchSingleCustomerPricing,
  updateCustomerPricing,
} from "@/hooks/pricing/useCustomerPricing";
import { fetchMerchantFromBusinessCategory } from "@/hooks/merchant/useMerchant";

import { vehicleTypeOptions } from "@/utils/defaultData";

const EditCustomerPricing = ({ isOpen, onClose, pricingId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    vehicleType: null,
    ruleName: "",
    baseFare: "",
    baseDistance: "",
    fareAfterBaseDistance: "",
    baseWeightUpto: "",
    fareAfterBaseWeight: "",
    waitingTime: "",
    waitingFare: "",
    purchaseFarePerHour: "",
    geofenceId: [],
    deliveryMode: "Home Delivery",
    businessCategoryId: null,
    merchants: [],
  });

  const {
    data: pricingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customer-pricing-detail", pricingId],
    queryFn: ({ queryKey }) => {
      const [_, id] = queryKey;
      return fetchSingleCustomerPricing(id, navigate);
    },
    enabled: !!pricingId,
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: !!pricingId,
  });

  const {
    data: allBusinessCategory,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
    enabled: !!pricingId,
  });

  const { data: allMerchants } = useQuery({
    queryKey: ["merchant-from-businessCategory", formData.businessCategoryId],
    queryFn: () =>
      fetchMerchantFromBusinessCategory(formData.businessCategoryId, navigate),
    enabled: !!formData.businessCategoryId,
  });

  useEffect(() => {
    pricingData && setFormData(pricingData);
  }, [pricingData]);

  const handleEditPricing = useMutation({
    mutationKey: ["edit-customer-pricing"],
    mutationFn: ({ pricingId, formData }) =>
      updateCustomerPricing(pricingId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customer-pricing"]);
      setFormData({
        vehicleType: null,
        ruleName: "",
        baseFare: "",
        baseDistance: "",
        fareAfterBaseDistance: "",
        baseWeightUpto: "",
        fareAfterBaseWeight: "",
        waitingTime: "",
        waitingFare: "",
        purchaseFarePerHour: "",
        geofenceId: [],
        deliveryMode: "Home Delivery",
        businessCategoryId: null,
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Rule updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

      let formattedErrors;

      if (errorData?.merchants) {
        const conflictingMerchantIds = errorData.merchants || [];

        const conflictingMerchantNames = conflictingMerchantIds
          .map(
            (id) =>
              allMerchants?.find((merchant) => merchant._id === id)
                ?.merchantName
          )
          .filter(Boolean);

        if (conflictingMerchantNames.length > 0) {
          formattedErrors = `The following merchants are already assigned to another pricing rule:\n${conflictingMerchantNames
            .map((name) => `• ${name}`)
            .join("\n")}`;
        }
      } else {
        formattedErrors = Object.entries(errorData)
          .map(([_, msg]) => `• ${msg}`)
          .join("\n");
      }

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  const businessOptions = allBusinessCategory?.map((category) => ({
    label: category.title,
    value: category._id,
  }));

  const merchantOptions = [
    { label: "Select All", value: "selectAll" },
    ...(Array.isArray(allMerchants)
      ? allMerchants?.map((merchant) => ({
          label: merchant.merchantName,
          value: merchant.merchantId,
        }))
      : []),
  ];

  const geofenceOptions = [
    { label: "Select All", value: "selectAll" },
    ...(Array.isArray(allGeofence)
      ? allGeofence?.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

  const handleSelectChange = (selected) => {
    if (selected && selected.some((option) => option.value === "selectAll")) {
      setFormData({
        ...formData,
        merchants: allMerchants.map((merchant) => merchant.merchantId),
      });
    } else {
      setFormData({
        ...formData,
        merchants: selected ? selected.map((option) => option.value) : [],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showLoading = isLoading || categoryLoading || geofenceLoading;
  const showError = isError || geofenceError || categoryError;

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
            Edit Rule
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <>
              <p>Error</p>
            </>
          ) : (
            <>
              <div className="flex flex-col  max-h-[30rem] overflow-auto gap-4 ">
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="ruleName">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Rule Name"
                    value={formData.ruleName}
                    id="ruleName"
                    name="ruleName"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseFare">
                    Base Fare <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Fare"
                    value={formData.baseFare}
                    id="baseFare"
                    name="baseFare"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseDistance">
                    Base Distance <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Distance"
                    value={formData.baseDistance}
                    id="baseDistance"
                    name="baseDistance"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="fareAfterBaseDistance"
                  >
                    Fare After Distance <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Fare After Distance"
                    value={formData.fareAfterBaseDistance}
                    id="fareAfterBaseDistance"
                    name="fareAfterBaseDistance"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="baseWeightUpto"
                  >
                    Base Weight upto(in kg)
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Weight"
                    value={formData.baseWeightUpto}
                    id="baseWeightUpto"
                    name="baseWeightUpto"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="fareAfterBaseWeight"
                  >
                    Fare after base weight
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Fare After Weight"
                    value={formData.fareAfterBaseWeight}
                    id="fareAfterBaseWeight"
                    name="fareAfterBaseWeight"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Purchase Fare Hour
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.purchaseFarePerHour}
                    id="purchaseFarePerHour"
                    name="purchaseFarePerHour"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingFare">
                    Waiting Fare
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Fare"
                    value={formData.waitingFare}
                    id="waitingFare"
                    name="waitingFare"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingTime">
                    Waiting Time
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Time"
                    value={formData.waitingTime}
                    id="waitingTime"
                    name="waitingTime"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center mt-1 flex-col sm:flex-row sm:space-x-4">
                  <label className="w-full sm:w-1/3 text-gray-500 text-left">
                    Select Delivery Mode <span className="text-red-500">*</span>
                  </label>

                  <RadioGroup
                    value={formData.deliveryMode}
                    onValueChange={(e) =>
                      setFormData({ ...formData, deliveryMode: e.value })
                    }
                    className="w-full sm:w-2/3"
                    size="sm"
                    colorPalette="teal"
                    variant="solid"
                  >
                    <HStack gap="4" direction="row">
                      <Radio value="Home Delivery">Home Delivery</Radio>
                      <Radio value="Pick and Drop">Pick and Drop</Radio>
                      <Radio value="Custom Order">Custom Order</Radio>
                    </HStack>
                  </RadioGroup>
                </div>

                {formData.deliveryMode === "Home Delivery" && (
                  <div className="flex items-center">
                    <label
                      className="w-1/3 text-gray-500"
                      htmlFor="businessCategoryId"
                    ></label>

                    <Select
                      options={businessOptions}
                      value={businessOptions?.find(
                        (option) =>
                          option.value === formData?.businessCategoryId
                      )}
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          businessCategoryId: option.value,
                        })
                      }
                      className="rounded outline-none focus:outline-none w-2/3"
                      placeholder="Select business category"
                      isSearchable
                      isMulti={false}
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          paddingRight: "",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "10px",
                        }),
                      }}
                    />
                  </div>
                )}

                {formData.deliveryMode === "Pick and Drop" && (
                  <div className="flex items-center">
                    <label
                      className="w-1/3 text-gray-500"
                      htmlFor="vehicleType"
                    ></label>

                    <Select
                      options={vehicleTypeOptions}
                      value={vehicleTypeOptions?.find(
                        (option) => option.value === formData?.vehicleType
                      )}
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          vehicleType: option.value,
                        })
                      }
                      className="rounded outline-none focus:outline-none w-2/3"
                      placeholder="Select vehicle type"
                      isSearchable
                      isMulti={false}
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          paddingRight: "",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "10px",
                        }),
                      }}
                    />
                  </div>
                )}

                {formData.businessCategoryId && (
                  <div className="flex items-center">
                    <label className="w-1/3 text-gray-500">
                      Merchants<span className="text-red-500">*</span>
                    </label>

                    <Select
                      options={merchantOptions}
                      value={merchantOptions?.filter((option) =>
                        formData?.merchants?.includes(option.value)
                      )}
                      onChange={handleSelectChange}
                      className="rounded outline-none focus:outline-none w-2/3"
                      placeholder="Select merchants"
                      isSearchable
                      isMulti
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          paddingRight: "",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "10px",
                        }),
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="geofence">
                    Geofence <span className="text-red-500">*</span>
                  </label>

                  <Select
                    options={geofenceOptions}
                    value={geofenceOptions?.filter((option) =>
                      formData?.geofenceId?.includes(option.value)
                    )}
                    onChange={(selected) => {
                      if (
                        selected &&
                        selected.some((option) => option.value === "selectAll")
                      ) {
                        setFormData({
                          ...formData,
                          geofenceId: allGeofence.map(
                            (geofence) => geofence._id
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          geofenceId: selected
                            ? selected.map((option) => option.value)
                            : [],
                        });
                      }
                    }}
                    className="rounded outline-none focus:outline-none w-2/3"
                    placeholder="Select geofence"
                    isSearchable
                    isMulti
                    menuPlacement="top"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingRight: "",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: "10px",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-cyan-50 py-2 px-4 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleEditPricing.mutate({ pricingId, formData })
                  }
                  className="bg-teal-700 text-white py-2 px-4 rounded-md"
                >
                  {handleEditPricing.isPending ? `Saving...` : `Save`}
                </button>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditCustomerPricing;
