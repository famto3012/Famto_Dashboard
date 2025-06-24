import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import DatePicker from "react-datepicker";

import { HStack } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import ModalLoader from "@/components/others/ModalLoader";
import CropImage from "@/components/others/CropImage";
import Error from "@/components/others/Error";

import RenderIcon from "@/icons/RenderIcon";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";
import { createNewPromoCode } from "@/hooks/promocode/usePromocode";

import { promoCodeModeOptions } from "@/utils/defaultData";

import "react-datepicker/dist/react-datepicker.css";

const AddPromoCode = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    promoCode: "",
    promoType: "Flat-discount",
    discount: "",
    description: "",
    fromDate: "",
    toDate: "",
    applicationMode: "",
    maxDiscountValue: "",
    minOrderAmount: "",
    maxAllowedUsers: "",
    appliedOn: "Cart-value",
    merchantId: [],
    geofenceId: [],
    deliveryMode: "Take Away",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allMerchants,
    isLoading: merchantLoading,
    isError: merchantError,
  } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: isOpen,
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: !!isOpen,
  });

  const handleAddPromoCode = useMutation({
    mutationKey: ["add-promo-code"],
    mutationFn: (promoData) => createNewPromoCode(promoData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-promo-codes"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "New promo code added",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in creating new promo code",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    function appendFormData(value, key) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(item, `${key}[${index}]`);
        });
      } else if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(formData).forEach(([key, value]) => {
      appendFormData(value, key);
    });
    croppedFile && formDataObject.append("promoImage", croppedFile);

    handleAddPromoCode.mutate(formDataObject);
    console.log("formdata",formData);
    
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputNumberValidation = (e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handleDeliveryModeChange = (value) => {
    setFormData({
      ...formData,
      deliveryMode: value,
      appliedOn:
        value === "Pick and Drop" || value === "Custom Order"
          ? "Delivery-charge"
          : formData.appliedOn,
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

  const merchantOptions = allMerchants?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

  const geofenceOptions = [
    { label: "Select All", value: "selectAll" },
    ...(Array.isArray(allGeofence)
      ? allGeofence?.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];
  const showLoading = merchantLoading || geofenceLoading;
  const showError = merchantError || geofenceError;

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
          <DialogTitle className="font-[600] text-[18px]">
            Add Promo code
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <Error />
          ) : (
            <div className="flex flex-col h-[30rem] overflow-y-auto gap-5">
              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Code<span className="text-red-600 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="promoCode"
                  className="border-2 border-gray-300 rounded p-2 w-2/3 focus:outline-none uppercase"
                  maxLength={20}
                  value={formData.promoCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Promotion Type<span className="text-red-600 ml-2">*</span>
                </label>
                <RadioGroup
                  value={formData.promoType}
                  onValueChange={(e) =>
                    setFormData({ ...formData, promoType: e.value })
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

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Discount<span className="text-red-600 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="discount"
                  className="border-2 border-gray-300 rounded focus:outline-none p-2 w-2/3"
                  value={formData.discount}
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>

              <div className="flex items-start">
                <label className="w-1/2 text-gray-500">
                  Description Max 150 characters.
                </label>
                <textarea
                  maxLength={150}
                  onChange={handleInputChange}
                  name="description"
                  className="border-2 border-gray-300 rounded focus:outline-none p-2 w-2/3"
                  rows={5}
                >
                  {formData.description}
                </textarea>
              </div>

              <div className="flex items-center">
                <label className="w-4/5 text-gray-500">
                  From<span className="text-red-600">*</span>
                </label>

                <div className="flex justify-start w-full">
                  <DatePicker
                    selected={formData.fromDate}
                    onChange={(date) =>
                      setFormData({ ...formData, fromDate: date })
                    }
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-4/5 text-gray-500">
                  To<span className="text-red-600">*</span>
                </label>

                <div className="flex justify-start w-full">
                  <DatePicker
                    selected={formData.toDate}
                    onChange={(date) =>
                      setFormData({ ...formData, toDate: date })
                    }
                    minDate={
                      formData?.fromDate
                        ? new Date(
                            new Date(formData?.fromDate).getTime() +
                              24 * 60 * 60 * 1000
                          )
                        : new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Promo Application Mode
                  <span className="text-red-600 ml-2">*</span>
                </label>

                <Select
                  options={promoCodeModeOptions}
                  value={promoCodeModeOptions?.find(
                    (option) => option.value === formData.applicationMode
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      applicationMode: option.value,
                    })
                  }
                  className="border-gray-100 rounded focus:outline-none w-2/3"
                  placeholder="Select application mode"
                  isSearchable={true}
                  isMulti={false}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Max discount value
                  <span className="text-red-600 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  className="border-2 border-gray-300 rounded focus:outline-none p-2 w-2/3"
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Minimum order amount
                  <span className="text-red-600 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  className="border-2 border-gray-300 rounded focus:outline-none p-2 w-2/3"
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Maximum number of allowed users
                  <span className="text-red-600 ml-2">*</span>
                </label>
                <input
                  type="text"
                  name="maxAllowedUsers"
                  value={formData.maxAllowedUsers}
                  className="border-2 border-gray-300 rounded focus:outline-none p-2 w-2/3"
                  onChange={handleInputChange}
                  onKeyDown={handleInputNumberValidation}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Geofence<span className="text-red-600 ml-2">*</span>
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
                        geofenceId: allGeofence.map((geofence) => geofence._id),
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
                  className="border-gray-100 rounded focus:outline-none w-2/3"
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

              <div className="flex items-center flex-col sm:flex-row">
                <label className="w-full sm:w-1/2 text-gray-500 mb-2 sm:mb-0">
                  Delivery Mode<span className="text-red-600 ml-2">*</span>
                </label>

                <RadioGroup
                  value={formData.deliveryMode}
                  onValueChange={(e) => handleDeliveryModeChange(e.value)}
                  className="w-full sm:w-2/3"
                  size="sm"
                  colorPalette="teal"
                  variant="solid"
                >
                  <HStack gap="3" direction="row">
                    <Radio value="Take Away" className="cursor-pointer">
                      Take Away
                    </Radio>
                    <Radio value="Home Delivery" className="cursor-pointer">
                      Home Delivery
                    </Radio>
                    <Radio value="Pick and Drop" className="cursor-pointer">
                      Pick and Drop
                    </Radio>
                    <Radio value="Custom Order" className="cursor-pointer">
                      Custom Order
                    </Radio>
                  </HStack>
                </RadioGroup>
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">
                  Applied on<span className="text-red-600 ml-2">*</span>
                </label>

                <RadioGroup
                  value={formData.appliedOn}
                  onValueChange={(e) =>
                    setFormData({ ...formData, appliedOn: e.value })
                  }
                  className="w-2/3"
                  size="sm"
                  colorPalette="teal"
                  variant="solid"
                >
                  <HStack gap="8" direction="row">
                    <Radio
                      value="Cart-value"
                      className="cursor-pointer"
                      disabled={
                        formData.deliveryMode === "Pick and Drop" ||
                        formData.deliveryMode === "Custom Order"
                      }
                    >
                      Cart value
                    </Radio>
                    <Radio value="Delivery-charge" className="cursor-pointer">
                      Delivery charge
                    </Radio>
                  </HStack>
                </RadioGroup>
              </div>

              {(formData.deliveryMode === "Take Away" ||
                formData.deliveryMode === "Home Delivery") && (
                <div className="flex items-center">
                  <label className="w-1/2 text-gray-500">
                    Assign Merchant <span className="text-red-600 ml-2">*</span>
                  </label>

                  <Select
                    options={merchantOptions}
                    value={merchantOptions?.filter((option) =>
                      formData.merchantId?.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        merchantId: selectedOptions.map(
                          (option) => option.value
                        ),
                      })
                    }
                    className="border-gray-100 rounded focus:outline-none w-2/3"
                    placeholder="Select merchants"
                    isSearchable
                    isMulti
                    isClearable
                    menuPlacement="top"
                  />
                </div>
              )}

              <div className="flex items-center">
                <label className=" w-1/2 text-gray-500">
                  Image (342px x 160px)
                  <span className="text-red-600">*</span>
                </label>
                <div className=" flex items-center w-2/3 gap-[30px]">
                  {!croppedFile ? (
                    <div className="bg-gray-400 h-16 w-16 rounded-md" />
                  ) : (
                    <figure className="h-16 w-16 rounded-md">
                      <img
                        src={URL.createObjectURL(croppedFile)}
                        alt={formData?.promoCode}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </figure>
                  )}

                  <input
                    type="file"
                    name="promoImage"
                    id="promoImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSelectFile}
                  />

                  <label
                    htmlFor="promoImage"
                    className="cursor-pointer bg-teal-700 text-white h-[66px] w-[66px] flex items-center justify-center rounded-md"
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
            {handleAddPromoCode.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
    // <DialogRoot
    //   open={isOpen}
    //   onInteractOutside={onClose}
    //   placement="center"
    //   motionPreset="slide-in-bottom"
    //   size="lg"
    // >
    //   <DialogContent>
    //     <DialogCloseTrigger onClick={onClose} />
    //     <DialogHeader>
    //       <DialogTitle className="font-[600] text-[18px]">
    //         Add Promo code
    //       </DialogTitle>
    //     </DialogHeader>
    //     <DialogBody>
    //       {showLoading ? (
    //         <ModalLoader />
    //       ) : showError ? (
    //         <Error />
    //       ) : (
    //         <div className="flex flex-col h-[30rem] overflow-y-auto gap-5">
    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Code<span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               name="promoCode"
    //               className="border-2 border-gray-300 rounded p-2 w-full sm:w-2/3 focus:outline-none uppercase"
    //               maxLength={20}
    //               value={formData.promoCode}
    //               onChange={handleInputChange}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Promotion Type<span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <RadioGroup
    //               value={formData.promoType}
    //               onValueChange={(e) =>
    //                 setFormData({ ...formData, promoType: e.value })
    //               }
    //               className="w-full sm:w-2/3"
    //               size="sm"
    //               colorPalette="teal"
    //               variant="solid"
    //             >
    //               <HStack gap="8" direction="row">
    //                 <Radio value="Flat-discount" className="cursor-pointer">
    //                   Flat discount
    //                 </Radio>
    //                 <Radio
    //                   value="Percentage-discount"
    //                   className="cursor-pointer"
    //                 >
    //                   Percentage discount
    //                 </Radio>
    //               </HStack>
    //             </RadioGroup>
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Discount<span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               name="discount"
    //               className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full sm:w-2/3"
    //               value={formData.discount}
    //               onChange={handleInputChange}
    //               onKeyDown={handleInputNumberValidation}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-start gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Description Max 150 characters.
    //             </label>
    //             <textarea
    //               maxLength={150}
    //               onChange={handleInputChange}
    //               name="description"
    //               className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full sm:w-2/3"
    //               rows={5}
    //             >
    //               {formData.description}
    //             </textarea>
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               From<span className="text-red-600">*</span>
    //             </label>

    //             <div className="w-full sm:w-2/3">
    //               <DatePicker
    //                 selected={formData.fromDate}
    //                 onChange={(date) =>
    //                   setFormData({ ...formData, fromDate: date })
    //                 }
    //                 minDate={new Date()}
    //                 dateFormat="yyyy-MM-dd"
    //                 className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
    //               />
    //             </div>
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               To<span className="text-red-600">*</span>
    //             </label>

    //             <div className="w-full sm:w-2/3">
    //               <DatePicker
    //                 selected={formData.toDate}
    //                 onChange={(date) =>
    //                   setFormData({ ...formData, toDate: date })
    //                 }
    //                 minDate={
    //                   formData?.fromDate
    //                     ? new Date(
    //                         new Date(formData?.fromDate).getTime() +
    //                           24 * 60 * 60 * 1000
    //                       )
    //                     : new Date()
    //                 }
    //                 dateFormat="yyyy-MM-dd"
    //                 className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full"
    //               />
    //             </div>
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Promo Application Mode
    //               <span className="text-red-600 ml-2">*</span>
    //             </label>

    //             <Select
    //               options={promoCodeModeOptions}
    //               value={promoCodeModeOptions?.find(
    //                 (option) => option.value === formData.applicationMode
    //               )}
    //               onChange={(option) =>
    //                 setFormData({
    //                   ...formData,
    //                   applicationMode: option.value,
    //                 })
    //               }
    //               className="border-gray-100 rounded focus:outline-none w-full sm:w-2/3"
    //               placeholder="Select application mode"
    //               isSearchable={true}
    //               isMulti={false}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Max discount value
    //               <span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               name="maxDiscountValue"
    //               value={formData.maxDiscountValue}
    //               className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full sm:w-2/3"
    //               onChange={handleInputChange}
    //               onKeyDown={handleInputNumberValidation}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Minimum order amount
    //               <span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               name="minOrderAmount"
    //               value={formData.minOrderAmount}
    //               className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full sm:w-2/3"
    //               onChange={handleInputChange}
    //               onKeyDown={handleInputNumberValidation}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Maximum number of allowed users
    //               <span className="text-red-600 ml-2">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               name="maxAllowedUsers"
    //               value={formData.maxAllowedUsers}
    //               className="border-2 border-gray-300 rounded focus:outline-none p-2 w-full sm:w-2/3"
    //               onChange={handleInputChange}
    //               onKeyDown={handleInputNumberValidation}
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Geofence<span className="text-red-600 ml-2">*</span>
    //             </label>

    //             <Select
    //               options={geofenceOptions}
    //               value={geofenceOptions?.find(
    //                 (option) => option.value === formData.geofenceId
    //               )}
    //               onChange={(option) =>
    //                 setFormData({
    //                   ...formData,
    //                   geofenceId: option.value,
    //                 })
    //               }
    //               className="border-gray-100 rounded focus:outline-none w-full sm:w-2/3"
    //               placeholder="Select geofence"
    //               isSearchable={true}
    //               isMulti={false}
    //               menuPlacement="top"
    //             />
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Delivery Mode<span className="text-red-600 ml-2">*</span>
    //             </label>

    //             <RadioGroup
    //               value={formData.deliveryMode}
    //               onValueChange={(e) => handleDeliveryModeChange(e.value)}
    //               className="w-full sm:w-2/3"
    //               size="sm"
    //               colorPalette="teal"
    //               variant="solid"
    //             >
    //               <HStack gap="3" direction="row">
    //                 <Radio value="Take Away" className="cursor-pointer">
    //                   Take Away
    //                 </Radio>
    //                 <Radio value="Home Delivery" className="cursor-pointer">
    //                   Home Delivery
    //                 </Radio>
    //                 <Radio value="Pick and Drop" className="cursor-pointer">
    //                   Pick and Drop
    //                 </Radio>
    //                 <Radio value="Custom Order" className="cursor-pointer">
    //                   Custom Order
    //                 </Radio>
    //               </HStack>
    //             </RadioGroup>
    //           </div>

    //           <div className="flex flex-col sm:flex-row items-center gap-3">
    //             <label className="w-full sm:w-1/2 text-gray-500">
    //               Applied on<span className="text-red-600 ml-2">*</span>
    //             </label>

    //             <RadioGroup
    //               value={formData.appliedOn}
    //               onValueChange={(e) =>
    //                 setFormData({ ...formData, appliedOn: e.value })
    //               }
    //               className="w-full sm:w-2/3"
    //               size="sm"
    //               colorPalette="teal"
    //               variant="solid"
    //             >
    //               <HStack gap="8" direction="row">
    //                 <Radio
    //                   value="Cart-value"
    //                   className="cursor-pointer"
    //                   disabled={
    //                     formData.deliveryMode === "Pick and Drop" ||
    //                     formData.deliveryMode === "Custom Order"
    //                   }
    //                 >
    //                   Cart value
    //                 </Radio>
    //                 <Radio value="Delivery-charge" className="cursor-pointer">
    //                   Delivery charge
    //                 </Radio>
    //               </HStack>
    //             </RadioGroup>
    //           </div>

    //           {(formData.deliveryMode === "Take Away" ||
    //             formData.deliveryMode === "Home Delivery") && (
    //             <div className="flex flex-col sm:flex-row items-center gap-3">
    //               <label className="w-full sm:w-1/2 text-gray-500">
    //                 Assign Merchant <span className="text-red-600 ml-2">*</span>
    //               </label>

    //               <Select
    //                 options={merchantOptions}
    //                 value={merchantOptions?.find(
    //                   (option) => option.value === formData.merchantId
    //                 )}
    //                 onChange={(option) =>
    //                   setFormData({
    //                     ...formData,
    //                     merchantId: option.value,
    //                   })
    //                 }
    //                 className="border-gray-100 rounded focus:outline-none w-full sm:w-2/3"
    //                 placeholder="Select Merchant"
    //                 isSearchable={true}
    //                 isMulti={false}
    //               />
    //             </div>
    //           )}

    //           <div className="flex items-center">
    //             <label className=" w-1/2 text-gray-500">
    //               Image (342px x 160px)
    //               <span className="text-red-600">*</span>
    //             </label>
    //             <div className=" flex items-center w-2/3 gap-[30px]">
    //               {!croppedFile ? (
    //                 <div className="bg-gray-400 h-16 w-16 rounded-md" />
    //               ) : (
    //                 <figure className="h-16 w-16 rounded-md">
    //                   <img
    //                     src={URL.createObjectURL(croppedFile)}
    //                     alt={formData?.promoCode}
    //                     className="h-full w-full object-cover rounded-md"
    //                   />
    //                 </figure>
    //               )}

    //               <input
    //                 type="file"
    //                 name="promoImage"
    //                 id="promoImage"
    //                 className="hidden"
    //                 accept="image/*"
    //                 onChange={handleSelectFile}
    //               />

    //               <label
    //                 htmlFor="promoImage"
    //                 className="cursor-pointer bg-teal-700 text-white h-[66px] w-[66px] flex items-center justify-center rounded-md"
    //               >
    //                 <RenderIcon iconName="CameraIcon" size={24} loading={6} />
    //               </label>
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       {/* Crop Modal */}
    //       <CropImage
    //         isOpen={showCrop && selectedFile}
    //         onClose={() => {
    //           setSelectedFile(null);
    //           setShowCrop(false);
    //         }}
    //         selectedImage={selectedFile}
    //         onCropComplete={handleCropImage}
    //       />

    //       <div className="mt-5 flex gap-5 justify-end">
    //         <Button
    //           variant="outlined"
    //           className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
    //           onClick={onClose}
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           className="bg-teal-700 p-2 text-white"
    //           onClick={handleSave}
    //           loading={showLoading}
    //           disabled={showLoading}
    //         >
    //           Save Promo
    //         </Button>
    //       </div>
    //     </DialogBody>
    //   </DialogContent>
    // </DialogRoot>
  );
};

export default AddPromoCode;
