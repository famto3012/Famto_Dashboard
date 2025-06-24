import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import { agentTagOptions, vehicleTypeOptions } from "@/utils/defaultData";

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { fetchAllManagers } from "@/hooks/manager/useManager";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchAllAgentPricing } from "@/hooks/pricing/useAgentPricing";
import { createNewAgent, fetchAgentAppTimings } from "@/hooks/agent/useAgent";
import CropImage from "@/components/others/CropImage";
import { Button } from "@/components/ui/button";

const AddAgent = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    managerId: null,
    geofenceId: "",
    salaryStructureId: "",
    tag: "",
    accountHolderName: "",
    accountNumber: "",
    IFSCCode: "",
    UPIId: "",
    aadharNumber: "",
    model: "",
    type: "",
    licensePlate: "",
    drivingLicenseNumber: "",
    workTimings: [],
  });
  const [croppedFile, setCroppedFile] = useState({
    agent: null,
    rcFront: null,
    rcBack: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
  });
  const [selectedFile, setSelectedFile] = useState({
    agent: null,
    rcFront: null,
    rcBack: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
  });
  const [showCrop, setShowCrop] = useState(false);
  const [type, setType] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allManager,
    isLoading: managerLoading,
    isError: managerError,
  } = useQuery({
    queryKey: ["all-managers"],
    queryFn: () => fetchAllManagers(navigate),
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
    data: allPricing,
    isLoading: pricingLoading,
    isError: pricingError,
  } = useQuery({
    queryKey: ["all-agent-pricing"],
    queryFn: () => fetchAllAgentPricing(navigate),
    enabled: isOpen,
  });

  const {
    data: appTimings,
    isLoading: appTimingsLoading,
    isError: appTimingsError,
  } = useQuery({
    queryKey: ["agent-app-timings"],
    queryFn: () => fetchAgentAppTimings(navigate),
    enabled: isOpen,
  });

  const handleAddAgent = useMutation({
    mutationKey: ["add-agent"],
    mutationFn: (data) => createNewAgent(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agents"]);
      resetForm();
      onClose();
      toaster.create({
        title: "Success",
        description: "New agent added",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in creating new agent",
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

    croppedFile.agent && formDataObject.append("agentImage", croppedFile.agent);
    croppedFile.rcFront &&
      formDataObject.append("rcFrontImage", croppedFile.rcFront);
    croppedFile.rcBack &&
      formDataObject.append("rcBackImage", croppedFile.rcBack);
    croppedFile.aadharFront &&
      formDataObject.append("aadharFrontImage", croppedFile.aadharFront);
    croppedFile.aadharBack &&
      formDataObject.append("aadharBackImage", croppedFile.aadharBack);
    croppedFile.drivingLicenseFront &&
      formDataObject.append(
        "drivingLicenseFrontImage",
        croppedFile.drivingLicenseFront
      );
    croppedFile.drivingLicenseBack &&
      formDataObject.append(
        "drivingLicenseBackImage",
        croppedFile.drivingLicenseBack
      );

    handleAddAgent.mutate(formDataObject);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      managerId: null,
      geofenceId: "",
      salaryStructureId: "",
      tag: "",
      accountHolderName: "",
      accountNumber: "",
      IFSCCode: "",
      UPIId: "",
      aadharNumber: "",
      model: "",
      type: "",
      licensePlate: "",
      drivingLicenseNumber: "",
    });
    setCroppedFile({
      agent: null,
      rcFront: null,
      rcBack: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
    setSelectedFile({
      agent: null,
      rcFront: null,
      rcBack: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const managerOptions = allManager?.map((manager) => ({
    label: manager.name,
    value: manager.managerId,
  }));

  const pricingOptions = allPricing?.map((pricing) => ({
    label: pricing.ruleName,
    value: pricing._id,
  }));

  const timingOptions = appTimings?.map((timing) => ({
    label: `${timing.startTime} - ${timing.endTime}`,
    value: timing.id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectFile = (e, type) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setType(type);
      setSelectedFile({ ...selectedFile, [type]: file });
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
    setSelectedFile((prev) => ({ ...prev, [type]: null }));
    setShowCrop(false);
  };

  const isLoading =
    managerLoading || geofenceLoading || pricingLoading || appTimingsLoading;
  const isError =
    managerError || geofenceError || pricingError || appTimingsError;

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
            Add Agent
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="fullName">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="phoneNumber">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="tel"
                  value={formData.phoneNumber}
                  id="phoneNumber"
                  name="phoneNumber"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="email"
                  value={formData.email}
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                />
              </div>

              <h1 className="font-semibold text-[18px]">Vehicle Details</h1>

              <div className="flex gap-x-2">
                <div className="w-3/4">
                  <div className="flex items-center ">
                    <label
                      className="w-1/3 text-gray-500"
                      htmlFor="licensePlate"
                    >
                      License Plate <span className="text-red-600">*</span>
                    </label>
                    <input
                      className="border-2 border-gray-200 rounded p-2 w-[15rem] ml-14 focus:outline-none"
                      type="text"
                      value={formData.licensePlate}
                      id="licensePlate"
                      name="licensePlate"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex mt-5 items-center">
                    <label className="w-1/3 text-gray-500" htmlFor="model">
                      Vehicle Model <span className="text-red-600">*</span>
                    </label>
                    <input
                      className="border-2 border-gray-200 rounded p-2 w-[15rem] ml-14 focus:outline-none"
                      type="text"
                      value={formData.model}
                      id="model"
                      name="model"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center mt-5 gap-4">
                    <label className="w-1/3 text-gray-500 " htmlFor="type">
                      Vehicle Type <span className="text-red-600">*</span>
                    </label>

                    <Select
                      options={vehicleTypeOptions}
                      value={vehicleTypeOptions?.find(
                        (option) => option.value === formData.type
                      )}
                      onChange={(option) =>
                        setFormData({ ...formData, type: option.value })
                      }
                      className="rounded w-[15rem] ml-10 focus:outline-none"
                      placeholder="Vehicle type"
                      isSearchable={false}
                      isMulti={false}
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

                <div className="flex gap-6">
                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="rcFrontImage"
                      id="rcFrontImage"
                      className="hidden"
                      onChange={(e) => handleSelectFile(e, "rcFront")}
                    />

                    <label htmlFor="rcFrontImage" className="cursor-pointer">
                      {croppedFile?.rcFront ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(croppedFile.rcFront)}
                            alt="RC Front"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={20}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="rcBackImage"
                      id="rcBackImage"
                      className="hidden"
                      onChange={(e) => handleSelectFile(e, "rcBack")}
                    />

                    <label htmlFor="rcBackImage" className="cursor-pointer">
                      {croppedFile?.rcBack ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(croppedFile.rcBack)}
                            alt="RC Back"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={20}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <h1 className="font-semibold text-[18px]">Bank Details</h1>

              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="accountHolderName"
                >
                  Account Holder Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.accountHolderName}
                  id="accountHolderName"
                  name="accountHolderName"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="accountNumber">
                  Account Number <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="number"
                  value={formData.accountNumber}
                  id="accountNumber"
                  name="accountNumber"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="IFSCCode">
                  IFSC Code <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.IFSCCode}
                  id="IFSCCode"
                  name="IFSCCode"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="UPIId">
                  UPI ID <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.UPIId}
                  id="UPIId"
                  name="UPIId"
                  onChange={handleInputChange}
                />
              </div>

              <h1 className="font-semibold text-[18px]">Government ID</h1>

              <div className="flex">
                <div className="flex items-center w-3/4">
                  <label className="w-1/3 text-gray-500" htmlFor="aadharNumber">
                    Aadhar Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded p-2 w-[15rem] ml-14 focus:outline-none"
                    type="text"
                    value={formData.aadharNumber}
                    id="aadharNumber"
                    name="aadharNumber"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="aadharFrontImage"
                      id="aadharFrontImage"
                      className="hidden"
                      onChange={(e) => handleSelectFile(e, "aadharFront")}
                    />
                    <label
                      htmlFor="aadharFrontImage"
                      className="cursor-pointer"
                    >
                      {croppedFile?.aadharFront ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(croppedFile.aadharFront)}
                            alt="aadhar front"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={18}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="aadharBackImage"
                      id="aadharBackImage"
                      className="hidden"
                      onChange={(e) => handleSelectFile(e, "aadharBack")}
                    />
                    <label htmlFor="aadharBackImage" className="cursor-pointer">
                      {croppedFile?.aadharBack ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(croppedFile.aadharBack)}
                            alt="aadhar back"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={18}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex items-center w-3/4">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="drivingLicenseNumber"
                  >
                    Driving License Number
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded p-2 w-[15rem] ml-14 focus:outline-none"
                    type="text"
                    value={formData.drivingLicenseNumber}
                    id="drivingLicenseNumber"
                    name="drivingLicenseNumber"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="drivingLicenseFrontImage"
                      id="drivingLicenseFrontImage"
                      className="hidden"
                      onChange={(e) =>
                        handleSelectFile(e, "drivingLicenseFront")
                      }
                    />
                    <label
                      htmlFor="drivingLicenseFrontImage"
                      className="cursor-pointer"
                    >
                      {croppedFile.drivingLicenseFront ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(
                              croppedFile.drivingLicenseFront
                            )}
                            alt="profile"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={18}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center gap-[30px]">
                    <input
                      type="file"
                      name="drivingLicenseBackImage"
                      id="drivingLicenseBackImage"
                      className="hidden"
                      onChange={(e) =>
                        handleSelectFile(e, "drivingLicenseBack")
                      }
                    />
                    <label
                      htmlFor="drivingLicenseBackImage"
                      className="cursor-pointer"
                    >
                      {croppedFile?.drivingLicenseBack ? (
                        <figure className=" h-16 w-16 rounded relative">
                          <img
                            src={URL.createObjectURL(
                              croppedFile.drivingLicenseBack
                            )}
                            alt="profile"
                            className="w-full rounded absolute h-full object-cover"
                          />
                        </figure>
                      ) : (
                        <div className="bg-teal-800 text-white p-4 rounded">
                          <RenderIcon
                            iconName="CameraIcon"
                            size={18}
                            loading={6}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <h1 className="font-semibold text-[18px]">Work Structure</h1>

              <div className="flex items-center mt-5 gap-4">
                <label className="w-1/2 text-gray-500" htmlFor="managerId">
                  Manager
                </label>

                <Select
                  options={managerOptions}
                  value={managerOptions?.find(
                    (option) => option.value === formData.managerId
                  )}
                  onChange={(option) =>
                    setFormData({ ...formData, managerId: option.value })
                  }
                  className="rounded focus:outline-none w-full"
                  placeholder="Select manager"
                  isSearchable={true}
                  isMulti={false}
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

              <div className="flex items-center mt-5 gap-4">
                <label
                  className="w-1/2 text-gray-500"
                  htmlFor="salaryStructureId"
                >
                  Salary Structure <span className="text-red-600">*</span>
                </label>

                <Select
                  options={pricingOptions}
                  value={pricingOptions?.find(
                    (option) => option.value === formData.salaryStructureId
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      salaryStructureId: option.value,
                    })
                  }
                  className="rounded focus:outline-none w-full"
                  placeholder="Select salary structure"
                  isSearchable={true}
                  isMulti={false}
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

              <div className="flex items-center mt-5 gap-4">
                <label className="w-1/2 text-gray-500" htmlFor="geofenceId">
                  Geofence <span className="text-red-600">*</span>
                </label>

                <Select
                  options={geofenceOptions}
                  value={geofenceOptions?.find(
                    (option) => option.value === formData.geofenceId
                  )}
                  onChange={(option) =>
                    setFormData({ ...formData, geofenceId: option.value })
                  }
                  className="rounded focus:outline-none w-full"
                  placeholder="Select geofence"
                  isSearchable={true}
                  isMulti={false}
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

              <div className="flex items-center mt-5 gap-4">
                <label className="w-1/2 text-gray-500" htmlFor="geofenceId">
                  Timings <span className="text-red-600">*</span>
                </label>

                <Select
                  options={timingOptions}
                  value={timingOptions?.filter((option) =>
                    formData.workTimings?.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const updatedWorkTimings =
                      selectedOptions?.map((option) => option.value) || [];
                    setFormData({
                      ...formData,
                      workTimings: updatedWorkTimings,
                    });
                  }}
                  className="rounded focus:outline-none w-full"
                  placeholder="Select timing"
                  isMulti
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

              <div className="flex items-center mt-5">
                <label className="w-1/2 text-gray-500 me-4" htmlFor="tag">
                  Tags <span className="text-red-600">*</span>
                </label>

                <Select
                  options={agentTagOptions}
                  value={agentTagOptions?.find(
                    (option) => option.value === formData.tag
                  )}
                  onChange={(option) =>
                    setFormData({ ...formData, tag: option.value })
                  }
                  className="rounded focus:outline-none w-full"
                  placeholder="Select tag"
                  isSearchable={true}
                  isMulti={false}
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

              <h1 className="font-semibold text-[18px] mb-5">Add Profile</h1>

              <div className="flex items-center gap-x-[30px]">
                {!croppedFile?.agent ? (
                  <div className="bg-cyan-100 h-16 w-16 rounded-md" />
                ) : (
                  <figure className="h-16 w-16 rounded-md">
                    <img
                      src={URL.createObjectURL(croppedFile.agent)}
                      alt="profile"
                      className="w-full rounded h-full object-cover "
                    />
                  </figure>
                )}

                <input
                  type="file"
                  name="agentImage"
                  id="agentImage"
                  className="hidden"
                  onChange={(e) => handleSelectFile(e, "agent")}
                />

                <label
                  htmlFor="agentImage"
                  className="cursor-pointer bg-teal-800 p-4 text-white rounded"
                >
                  <RenderIcon iconName="CameraIcon" size={28} loading={6} />
                </label>
              </div>

              <div className="flex flex-col gap-y-2 text-gray-500">
                <p>1.PNG</p>
                <p>
                  Photo <span className="text-red-600">*</span>
                </p>
              </div>
            </div>
          )}

          {/* Crop Modal */}
          <CropImage
            isOpen={showCrop && selectedFile[type]}
            onClose={cancelCrop}
            selectedImage={selectedFile[type]}
            onCropComplete={handleCropImage}
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
            {handleAddAgent.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddAgent;
