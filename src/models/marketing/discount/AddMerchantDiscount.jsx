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

import Error from "@/components/others/Error";
import ModalLoader from "@/components/others/ModalLoader";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createMerchantDiscount } from "@/hooks/discount/useDiscount";

import "react-datepicker/dist/react-datepicker.css";

const AddMerchantDiscount = ({ isOpen, onClose, selectedMerchant }) => {
  const { role, userId } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    merchantId: null,
    discountName: "",
    maxCheckoutValue: "",
    maxDiscountValue: "",
    discountType: "",
    discountValue: "",
    description: "",
    validFrom: null,
    validTo: null,
    geofenceId: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      merchantId: selectedMerchant?.merchantId || userId,
    });
  }, [isOpen]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: isOpen,
  });

  const handleAddDiscount = useMutation({
    mutationKey: ["add-merchant-discount", selectedMerchant],
    mutationFn: ({ role, formData }) =>
      createMerchantDiscount(role, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "all-merchant-discount",
        selectedMerchant,
      ]);
      setFormData({
        merchantId: null,
        discountName: "",
        maxCheckoutValue: "",
        maxDiscountValue: "",
        discountType: "",
        discountValue: "",
        description: "",
        validFrom: null,
        validTo: null,
        geofenceId: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Added Merchant discount successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while creating new merchant discount",
        type: "error",
      });
    },
  });

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            Add Merchant Discount
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {geofenceLoading ? (
            <ModalLoader />
          ) : geofenceError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4 max-h-[25rem] overflow-auto justify-between">
              {role !== "Merchant" && (
                <div className="flex gap-4 ">
                  <label className="w-1/2 text-gray-500">
                    Assign Merchant <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="text"
                    value={selectedMerchant.merchantName}
                    readOnly
                    className="rounded p-2 w-2/3 outline-none focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">
                  Discount Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="discountName"
                  value={formData.discountName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">
                  Maximum checkout value (₹){" "}
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="maxCheckoutValue"
                  value={formData.maxCheckoutValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">
                  Max Amount <span className="text-red-600">*</span>
                </label>

                <input
                  type="number"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4">
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

              <div className=" flex gap-4">
                <label className="w-1/2 text-gray-500 invisible">
                  Discount value
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4 mt-1">
                <label className="w-1/2 text-gray-500">
                  From <span className="text-red-600">*</span>
                </label>

                <div className="w-2/3">
                  <DatePicker
                    selected={formData.validFrom}
                    onChange={(date) =>
                      setFormData({ ...formData, validFrom: date })
                    }
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="border-2 border-gray-300 rounded focus:outline-none p-2 w-[100%]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-1">
                <label className="w-1/2 text-gray-500">
                  To <span className="text-red-600">*</span>
                </label>

                <div className="w-2/3">
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
                    className="border-2 border-gray-300 rounded focus:outline-none p-2 w-[100%]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
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

              <div className="flex justify-end  gap-4">
                <button
                  className="bg-gray-300 rounded-lg px-6 py-2 font-semibold justify-end"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end"
                  onClick={() => handleAddDiscount.mutate({ role, formData })}
                >
                  {handleAddDiscount.isPending ? `Saving...` : `Save`}
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddMerchantDiscount;
