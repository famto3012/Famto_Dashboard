import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

import { agentTagOptions } from "@/utils/defaultData";

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";
import CropImage from "@/components/others/CropImage";

import { fetchAllManagers } from "@/hooks/manager/useManager";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchAllAgentPricing } from "@/hooks/pricing/useAgentPricing";
import {
  fetchAgentAppTimings,
  updateAgentDetail,
} from "@/hooks/agent/useAgent";

const EditAgent = ({ isOpen, onClose, data }) => {
  const [formData, setFormData] = useState({});
  const [croppedFile, setCroppedFile] = useState({
    agent: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
  });
  const [selectedFile, setSelectedFile] = useState({
    agent: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
  });
  const [showCrop, setShowCrop] = useState(false);
  const [type, setType] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    data && isOpen && setFormData(data);
  }, [data, isOpen]);

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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      vehicleDetail: prevData.vehicleDetail.map((vehicle, i) =>
        i === index ? { ...vehicle, [name]: value } : vehicle
      ),
      governmentCertificateDetail: {
        ...prevData.governmentCertificateDetail,
        [name]: value,
      },
      bankDetail: {
        ...prevData.bankDetail,
        [name]: value,
      },
    }));
  };

  const handleEditAgent = useMutation({
    mutationKey: ["edit-agent", data.agentId],
    mutationFn: ({ agentId, formDataObject }) =>
      updateAgentDetail(agentId, formDataObject, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-detail", data.agentId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Agent detail updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in updating agent detail",
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
      } else if (typeof formData[key] === "object" && formData[key] !== null) {
        Object.keys(formData[key]).forEach((nestedKey) => {
          formDataObject.append(
            `${key}[${nestedKey}]`,
            formData[key][nestedKey]
          );
        });
      } else {
        formDataObject.append(key, formData[key]);
      }
    });

    croppedFile.agent && formDataObject.append("agentImage", croppedFile.agent);
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

    handleEditAgent.mutate({ agentId: data.agentId, formDataObject });
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
    setSelectedFile({
      agent: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
    setShowCrop(false);
  };

  const resetImages = () => {
    setCroppedFile({
      agent: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
    setSelectedFile({
      agent: null,
      aadharFront: null,
      aadharBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
    });
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
            Edit Agent
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
                  value={formData?.bankDetail?.accountHolderName}
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
                  value={formData?.bankDetail?.accountNumber}
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
                  value={formData?.bankDetail?.IFSCCode}
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
                  value={formData?.bankDetail?.UPIId}
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
                    value={formData?.governmentCertificateDetail?.aadharNumber}
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
                      <figure className=" h-16 w-16 rounded relative">
                        <img
                          src={
                            croppedFile?.aadharFront
                              ? URL.createObjectURL(croppedFile.aadharFront)
                              : formData?.governmentCertificateDetail
                                  ?.aadharFrontImage
                          }
                          alt="aadhar front"
                          className="w-full rounded absolute h-full object-cover"
                        />
                      </figure>
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
                      <figure className=" h-16 w-16 rounded relative">
                        <img
                          src={
                            croppedFile?.aadharBack
                              ? URL.createObjectURL(croppedFile.aadharBack)
                              : formData?.governmentCertificateDetail
                                  ?.aadharBackImage
                          }
                          alt="aadhar back"
                          className="w-full rounded absolute h-full object-cover"
                        />
                      </figure>
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
                    value={
                      formData?.governmentCertificateDetail
                        ?.drivingLicenseNumber
                    }
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
                      <figure className=" h-16 w-16 rounded relative">
                        <img
                          src={
                            croppedFile?.drivingLicenseFront
                              ? URL.createObjectURL(
                                  croppedFile.drivingLicenseFront
                                )
                              : formData?.governmentCertificateDetail
                                  ?.drivingLicenseFrontImage
                          }
                          alt="profile"
                          className="w-full rounded absolute h-full object-cover"
                        />
                      </figure>
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
                      <figure className=" h-16 w-16 rounded relative">
                        <img
                          src={
                            croppedFile?.drivingLicenseBack
                              ? URL.createObjectURL(
                                  croppedFile.drivingLicenseBack
                                )
                              : formData?.governmentCertificateDetail
                                  ?.drivingLicenseBackImage
                          }
                          alt="profile"
                          className="w-full rounded absolute h-full object-cover"
                        />
                      </figure>
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
                    (option) =>
                      option.value === formData?.workStructure?.managerId
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      workStructure: {
                        ...formData.workStructure,
                        managerId: option.value,
                      },
                    })
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
                    (option) =>
                      option.value ===
                      formData?.workStructure?.salaryStructureId
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      workStructure: {
                        ...formData.workStructure,
                        salaryStructureId: option.value,
                      },
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
                    (option) => option.value === formData?.geofenceId
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
                    formData?.workStructure?.workTimings?.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const updatedWorkTimings =
                      selectedOptions?.map((option) => option.value) || [];

                    console.log("new: ", updatedWorkTimings);

                    setFormData({
                      ...formData,
                      workStructure: {
                        ...formData.workStructure,
                        workTimings: updatedWorkTimings,
                      },
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
                    (option) => option.value === formData?.workStructure?.tag
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      workStructure: {
                        ...formData.workStructure,
                        tag: option.value,
                      },
                    })
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
                <figure className="h-16 w-16 rounded-md">
                  <img
                    src={
                      croppedFile?.agent
                        ? URL.createObjectURL(croppedFile.agent)
                        : formData?.agentImage
                    }
                    alt="profile"
                    className="w-full rounded h-full object-cover "
                  />
                </figure>

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
            isOpen={showCrop && selectedFile?.[type]}
            onClose={() => {
              setSelectedFile(null);
              setShowCrop(false);
            }}
            selectedImage={selectedFile?.[type] ?? null}
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

          <Button
            disabled={handleEditAgent.isPending}
            className="bg-teal-700 p-2 text-white"
            onClick={handleSave}
          >
            {handleEditAgent.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditAgent;
