import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import { vehicleTypeOptions } from "@/utils/defaultData";

import CropImage from "@/components/others/CropImage";

import { updateAgentVehicle } from "@/hooks/agent/useAgent";

const EditAgentVehicle = ({ isOpen, onClose, data, agentId }) => {
  const [formData, setFormData] = useState({});
  const [croppedFile, setCroppedFile] = useState({
    rcFront: null,
    rcBack: null,
  });
  const [selectedFile, setSelectedFile] = useState({
    rcFront: null,
    rcBack: null,
  });
  const [showCrop, setShowCrop] = useState(false);
  const [type, setType] = useState(false);

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetForm = () => {
    setCroppedFile({
      rcFront: null,
      rcBack: null,
    });
    setSelectedFile({
      rcFront: null,
      rcBack: null,
    });
  };

  const handleSelectFile = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setType(type);
      setSelectedFile((prevFiles) => ({ ...prevFiles, [type]: file }));
      setShowCrop(true);
    }
  };

  const handleCropImage = (file) => {
    setCroppedFile({
      ...croppedFile,
      [type]: file,
    });
    cancelCrop();
  };

  const cancelCrop = () => {
    setType(null);
    setSelectedFile({
      agent: null,
      rcFront: null,
      rcBack: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
    setShowCrop(false);
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: updateVehicle, isPending: isUpdating } = useMutation({
    mutationFn: ({ agentId, vehicleId, formDataObject }) =>
      updateAgentVehicle(agentId, vehicleId, formDataObject, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agents"]);
      resetForm();
      onClose();
      toaster.create({
        title: "Success",
        description: "Vehicle details updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error.message || "Error updating vehicle details",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        formDataObject.append(key, formData[key]);
      }
    });

    croppedFile.rcFront &&
      formDataObject.append("rcFrontImage", croppedFile.rcFront);
    croppedFile.rcBack &&
      formDataObject.append("rcBackImage", croppedFile.rcBack);

    updateVehicle({
      agentId,
      vehicleId: data.vehicleId,
      formDataObject,
    });
  };

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
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            Edit Agent Vehicle
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="licensePlate" className="block text-gray-500">
                    License Plate <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate || ""}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="model" className="block text-gray-500">
                    Vehicle Model <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model || ""}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-gray-500">
                    Vehicle Type <span className="text-red-600">*</span>
                  </label>
                  <Select
                    options={vehicleTypeOptions}
                    value={vehicleTypeOptions?.find(
                      (option) => option.value === formData?.type
                    )}
                    onChange={(option) =>
                      setFormData((prev) => ({ ...prev, type: option.value }))
                    }
                    className="rounded w-full focus:outline-none"
                    placeholder="Select vehicle type"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="rcFrontImage" className="block text-gray-500">
                    RC Front
                  </label>
                  <input
                    type="file"
                    id="rcFrontImage"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, "rcFront")}
                  />
                  <label htmlFor="rcFrontImage" className="cursor-pointer">
                    <img
                      src={
                        croppedFile.rcFront
                          ? URL.createObjectURL(croppedFile.rcFront)
                          : formData.rcFrontImage
                      }
                      alt="RC Front"
                      className="h-16 w-16 border rounded object-cover"
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor="rcBackImage" className="block text-gray-500">
                    RC Back
                  </label>
                  <input
                    type="file"
                    id="rcBackImage"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, "rcBack")}
                  />
                  <label htmlFor="rcBackImage" className="cursor-pointer">
                    <img
                      src={
                        croppedFile.rcBack
                          ? URL.createObjectURL(croppedFile.rcBack)
                          : formData.rcBackImage
                      }
                      alt="RC Back"
                      className="h-16 w-16 border rounded object-cover"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Crop Modal */}
            <CropImage
              isOpen={showCrop && selectedFile[type]}
              onClose={() => {
                setSelectedFile(null);
                setShowCrop(false);
              }}
              selectedImage={selectedFile[type]}
              onCropComplete={handleCropImage}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditAgentVehicle;
