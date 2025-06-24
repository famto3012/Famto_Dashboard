import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { HStack } from "@chakra-ui/react";

import makeAnimated from "react-select/animated";

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

import ModalLoader from "@/components/others/ModalLoader";

import { editTaxDetail, getTaxDetail } from "@/hooks/tax/useTax";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { getAllBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";

const EditTax = ({ isOpen, taxId, onClose }) => {
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    taxName: "",
    tax: "",
    taxType: "",
    geofences: [],
    assignToBusinessCategory: "",
  });

  const {
    data: taxData,
    isLoading: taxLoading,
    isError: taxError,
  } = useQuery({
    queryKey: ["tax-detail", taxId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return getTaxDetail(id, navigate);
    },
    enabled: !!taxId,
  });

  const { data: allGeofence, isLoading: geofenceLoading } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: !!taxId,
  });

  const { data: allBusinessCategory, isLoading: categoryLoading } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
    enabled: !!taxId,
  });

  const handleEditTax = useMutation({
    mutationKey: ["edit-tax", taxId],
    mutationFn: ({ taxId, formData }) =>
      editTaxDetail(taxId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-tax"]);
      setFormData({
        taxName: "",
        tax: "",
        taxType: "",
        geofences: [],
        assignToBusinessCategory: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Tax updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating tax",
        type: "error",
      });
    },
  });

  useEffect(() => {
    taxData && setFormData(taxData);
  }, [taxData]);

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const categoryOptions = allBusinessCategory?.map((category) => ({
    label: category.title,
    value: category._id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectGeofence = (selectedOptions) => {
    setFormData({
      ...formData,
      geofences: selectedOptions.map((option) => option.value),
    });
  };

  const handleSelectCategory = (option) => {
    setFormData((prev) => ({
      ...prev,
      assignToBusinessCategory: option ? option.value : "",
    }));
  };

  const showLoading = taxLoading || geofenceLoading || categoryLoading;
  const showError = taxError;

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
          <DialogTitle className="font-[600] text-[18px]">Edit Tax</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <>
              <p>Error</p>
            </>
          ) : (
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">Tax Name</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="taxName"
                  value={formData?.taxName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">Tax</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                  name="tax"
                  value={formData?.tax}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <label className="w-1/2 text-gray-500">Tax Type</label>

                <RadioGroup
                  value={formData.taxType}
                  onValueChange={(e) =>
                    setFormData({ ...formData, taxType: e.value })
                  }
                  className="w-2/3"
                  size="sm"
                  colorPalette="teal"
                  variant="solid"
                >
                  <HStack gap="8" direction="row">
                    <Radio value="Fixed-amount" disabled>
                      Fixed-amount
                    </Radio>
                    <Radio value="Percentage">Percentage</Radio>
                  </HStack>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-1/2 text-gray-500">Geofence</label>
                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={geofenceOptions?.filter((option) =>
                    formData?.geofences?.includes(option.value)
                  )}
                  isMulti={true}
                  isSearchable={true}
                  onChange={handleSelectGeofence}
                  options={geofenceOptions}
                  placeholder="Select geofence"
                  isClearable={true}
                  components={animatedComponents}
                />
              </div>

              <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                <label className="w-1/2 text-gray-500">
                  Assign to business category
                </label>

                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={categoryOptions?.find(
                    (option) =>
                      option.value === formData.assignToBusinessCategory
                  )}
                  isMulti={false}
                  isClearable={true}
                  isSearchable={true}
                  onChange={handleSelectCategory}
                  options={categoryOptions}
                  placeholder="Select Business category"
                  components={animatedComponents}
                  menuShouldBlockScroll={true}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 rounded-lg px-6 py-2 font-semibold justify-end"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditTax.mutate({ taxId, formData })}
                  className="bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end"
                >
                  {handleEditTax.isPending ? `Saving...` : `Save`}
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditTax;
