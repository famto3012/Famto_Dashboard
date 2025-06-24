import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

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

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";
import CropImage from "@/components/others/CropImage";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";
import { imageDisplayTypeOptions } from "@/utils/defaultData";

const AddBusinessCategory = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    geofenceId: [],
    increasedPercentage: 0,
    merchantFilters: ["All"],
    productFilters: ["All"],
    imageDisplayType: "cover",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [merchantTagValue, setMerchantTagValue] = useState("");
  const [productTagValue, setProductTagValue] = useState("");

  const merchantFilterRef = useRef(null);
  const productFilterRef = useRef(null);
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

  const handleAddCategory = useMutation({
    mutationKey: ["add-business-category"],
    mutationFn: (data) => createNewBusinessCategory(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-businessCategory"]);
      setFormData({
        title: "",
        geofenceId: [],
        increasedPercentage: 0,
      });
      setCroppedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "New business category created successfully",
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
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => {
          formDataObject.append(key, item);
        });
      } else {
        formDataObject.append(key, formData[key]);
      }
    });

    croppedFile && formDataObject.append("bannerImage", croppedFile);

    handleAddCategory.mutate(formDataObject);
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

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

  const handleMerchantFilterKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = merchantTagValue.trim();
      const currentTags = Array.isArray(formData.merchantFilters)
        ? formData.merchantFilters
        : [];

      if (trimmedValue && !currentTags.includes(trimmedValue)) {
        setFormData({
          ...formData,
          merchantFilters: [...currentTags, trimmedValue],
        });
        setMerchantTagValue("");
        merchantFilterRef.current.focus();
      }
    } else if (e.key === "Backspace" && !merchantTagValue) {
      const currentTags = Array.isArray(formData.merchantFilters)
        ? formData.merchantFilters
        : [];

      setFormData({
        ...formData,
        merchantFilters: currentTags.slice(0, -1),
      });
    }
  };

  const handleProductFilterKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = productTagValue.trim();
      const currentTags = Array.isArray(formData.productFilters)
        ? formData.productFilters
        : [];

      if (trimmedValue && !currentTags.includes(trimmedValue)) {
        setFormData({
          ...formData,
          productFilters: [...currentTags, trimmedValue],
        });
        setMerchantTagValue("");
        productFilterRef.current.focus();
      }
    } else if (e.key === "Backspace" && !productTagValue) {
      const currentTags = Array.isArray(formData.productFilters)
        ? formData.productFilters
        : [];

      setFormData({
        ...formData,
        productFilters: currentTags.slice(0, -1),
      });
    }
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
            Add Business category
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {geofenceLoading ? (
            <ModalLoader />
          ) : geofenceError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">Service title</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 focus:outline-none w-2/3"
                  name="title"
                  value={formData?.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">
                  Percentage increase
                </label>
                <input
                  type="number"
                  className="border-2 border-gray-300 rounded p-2 focus:outline-none w-2/3"
                  name="increasedPercentage"
                  value={formData?.increasedPercentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      increasedPercentage: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="w-1/2 text-gray-500"
                  htmlFor="merchantFilters"
                >
                  Merchant Filters
                </label>

                <div className="w-2/3">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {formData?.merchantFilters?.map((tag, index) => (
                      <div
                        className="flex items-center bg-gray-200 text-gray-700 text-sm ps-3 rounded-md overflow-hidden"
                        key={index}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              merchantFilters: formData.merchantFilters.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="ml-2 text-gray-800 hover:bg-gray-300 py-1 px-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={merchantFilterRef}
                    type="text"
                    name="merchantFilters"
                    placeholder="Type any filters and hit enter"
                    value={merchantTagValue}
                    onChange={(e) => setMerchantTagValue(e.target.value)}
                    onKeyDown={handleMerchantFilterKeyDown}
                    className="border-2 border-gray-300 rounded p-2 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500" htmlFor="productFilters">
                  Product Filters
                </label>

                <div className="w-2/3">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {formData?.productFilters?.map((tag, index) => (
                      <div
                        className="flex items-center bg-gray-200 text-gray-700 text-sm ps-3 rounded-md overflow-hidden"
                        key={index}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              productFilters: formData.productFilters.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="ml-2 text-gray-800 hover:bg-gray-300 py-1 px-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={productFilterRef}
                    type="text"
                    name="productFilters"
                    placeholder="Type any filters and hit enter"
                    value={productTagValue}
                    onChange={(e) => setProductTagValue(e.target.value)}
                    onKeyDown={handleProductFilterKeyDown}
                    className="border-2 border-gray-300 rounded p-2 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">Geofence</label>

                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={geofenceOptions?.filter((option) =>
                    formData?.geofenceId?.includes(option.value)
                  )}
                  isMulti={true}
                  isSearchable={true}
                  onChange={(selectedOptions) =>
                    setFormData((prev) => ({
                      ...prev,
                      geofenceId:
                        selectedOptions?.map((option) => option.value) || [],
                    }))
                  }
                  options={geofenceOptions}
                  placeholder="Select geofence"
                  isClearable={true}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">
                  Image Display Type
                </label>

                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={imageDisplayTypeOptions?.find(
                    (option) => option.value === formData?.imageDisplayType
                  )}
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageDisplayType: option.value,
                    }))
                  }
                  options={imageDisplayTypeOptions}
                />
              </div>

              <div className="flex items-start">
                <label className="w-1/2 text-gray-500">
                  Image (342px x 160px)
                </label>

                <div className="flex items-center w-2/3 gap-[30px]">
                  {!croppedFile ? (
                    <div className="bg-gray-400 h-16 w-16 rounded-md" />
                  ) : (
                    <figure className="h-16 w-16 rounded-md">
                      <img
                        src={URL.createObjectURL(croppedFile)}
                        alt={formData?.title}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </figure>
                  )}

                  <input
                    type="file"
                    name="businessImage"
                    id="businessImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSelectFile}
                  />
                  <label
                    htmlFor="businessImage"
                    className="cursor-pointer bg-teal-800 text-white flex items-center justify-center h-16 w-16 rounded"
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
            {handleAddCategory.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
  s;
};

export default AddBusinessCategory;
