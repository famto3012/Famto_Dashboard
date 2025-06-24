import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";
import CropImage from "@/components/others/CropImage";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchCustomizationData,
  updateCustomizationData,
} from "@/hooks/customerAppCustomization/useCustomization";
import { fetchAllTax } from "@/hooks/tax/useTax";

import "react-datepicker/dist/react-datepicker.css";
import { appUpdateTypeOptions } from "@/utils/defaultData";

const Toggles = () => {
  const [formData, setFormData] = useState({
    splashScreenUrl: "",
    phoneNumber: false,
    emailVerification: false,
    email: false,
    otpVerification: false,
    loginViaOtp: false,
    loginViaGoogle: false,
    loginViaApple: false,
    loginViaFacebook: false,
    customOrderCustomization: {
      startTime: "",
      endTime: "",
      taxId: null,
    },
    pickAndDropOrderCustomization: {
      startTime: "",
      endTime: "",
      taxId: null,
    },
    appUpdateType: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({
    queryKey: ["customer-app-customization"],
    queryFn: () => fetchCustomizationData(navigate),
  });

  const {
    data: allTax,
    isLoading: taxLoading,
    isError: taxError,
  } = useQuery({
    queryKey: ["all-tax"],
    queryFn: () => fetchAllTax(navigate),
  });

  const handleUpdateMutation = useMutation({
    mutationKey: ["update-customer-app-customization"],
    mutationFn: (data) => updateCustomizationData(data, navigate),
    onSuccess: () => {
      setCroppedFile(null);
      queryClient.invalidateQueries(["customer-app-customization"]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Customization updated",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating customization",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "object" && formData[key] !== null) {
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

    croppedFile && formDataObject.append("splashScreenImage", croppedFile);

    handleUpdateMutation.mutate(formDataObject);
  };

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  useEffect(() => {
    if (data || croppedFile) {
      const isModified = Object.keys(formData).some(
        (key) => formData[key] !== data[key]
      );

      const haveCroppedFile = !!croppedFile;

      setShowButton(isModified || haveCroppedFile);
    }
  }, [formData, data, croppedFile]);

  const taxOptions = allTax?.map((tax) => ({
    label: tax.taxName,
    value: tax.taxId,
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

  const toggleChange = (type) => {
    setFormData({ ...formData, [type]: !formData[type] });
  };

  const showLoading = dataLoading || taxLoading;
  const showError = dataError || taxError;

  if (showLoading) return <Loader />;
  if (showError) return <Error />;

  return (
    <>
      <h1 className="mx-5 font-bold text-[20px] mt-5 lg:mt-0">Customer App </h1>

      <div className="flex flex-col lg:flex-row gap-10 mt-10 mx-5 border-b-2 border-gray-200 pb-5">
        <div className="flex flex-col lg:flex-row items-start gap-[20px] lg:gap-0">
          <div className="lg:w-72">Splash Screen (390px x 844px)</div>

          <div className="text-gray-500">
            Note: The purpose is to wish or design the splash page. The format
            can image or gif Note: Design according to aspect ratio
          </div>
        </div>

        <div className="flex w-44 gap-[30px]">
          {!croppedFile && !formData?.splashScreenUrl ? (
            <div className="h-[66px] w-[66px] bg-gray-200 rounded-md"></div>
          ) : (
            <figure className="h-16 w-16 rounded-md">
              <img
                src={
                  croppedFile
                    ? URL.createObjectURL(croppedFile)
                    : formData?.splashScreenUrl
                }
                alt="Splash screen"
                className="w-full rounded h-full object-cover"
              />
            </figure>
          )}

          <input
            type="file"
            name="splashScreen"
            id="splashScreen"
            className="hidden"
            accept="image/*"
            onChange={handleSelectFile}
          />
          <label
            htmlFor="splashScreen"
            className="flex items-center justify-center bg-teal-800 text-[30px] text-white p-4 h-16 w-16 rounded-md cursor-pointer"
          >
            <RenderIcon iconName="CameraIcon" size={24} loading={6} />
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mx-5 mt-10 pb-5 gap-[20px] lg:gap-0">
        <div className="lg:w-1/5">Sign up and Sign in Settings</div>

        <div className="lg:w-4/5 flex flex-col justify-start">
          <p className="text-gray-500 w-full lg:max-w-[90%]">
            Control sign-up of Customer on your platform. Here you are given
            with a variety of options such as whether to have email or phone
            number as mandatory fields on the sign-up form, how do you want to
            verify the Customer: via Email verification or OTP verification and
            which social platform you want to enable through which Customer can
            sign up on your platform.
          </p>

          <div className="flex flex-col lg:flex-row gap-[20px] mt-[30px]">
            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg w-full lg:w-[20%] h-fit">
              <label className="font-semibold text-[16px]">
                Required fields on signup
              </label>

              <div className="flex items-center justify-between">
                Phone No.
                <Switch
                  colorPalette="teal"
                  checked={formData?.phoneNumber}
                  onCheckedChange={() => toggleChange("phoneNumber")}
                />
              </div>

              <div className="flex items-center justify-between">
                Email
                <Switch
                  colorPalette="teal"
                  checked={formData?.email}
                  onCheckedChange={() => toggleChange("email")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg w-full lg:w-[20%] h-fit">
              <label className="font-semibold">Signup Verification</label>

              <div className="flex items-center justify-between">
                Email verification
                <Switch
                  colorPalette="teal"
                  checked={formData?.emailVerification}
                  onCheckedChange={() => toggleChange("emailVerification")}
                />
              </div>
              <div className="flex items-center justify-between">
                OTP verification
                <Switch
                  colorPalette="teal"
                  checked={formData?.otpVerification}
                  onCheckedChange={() => toggleChange("otpVerification")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg w-full lg:w-[20%] h-fit">
              <label className="font-semibold">Login via</label>
              <div className="flex items-center justify-between">
                OTP
                <Switch
                  colorPalette="teal"
                  checked={formData?.loginViaOtp}
                  onCheckedChange={() => toggleChange("loginViaOtp")}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  <RenderIcon iconName="GoogleIcon" size={24} loading={6} />
                </span>
                <Switch
                  colorPalette="teal"
                  checked={formData?.loginViaGoogle}
                  onCheckedChange={() => toggleChange("loginViaGoogle")}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  <RenderIcon iconName="AppleIcon" size={24} loading={6} />
                </span>
                <Switch
                  colorPalette="teal"
                  checked={formData?.loginViaApple}
                  onCheckedChange={() => toggleChange("loginViaApple")}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  <RenderIcon iconName="FaceBookIcon" size={24} loading={6} />
                </span>
                <Switch
                  colorPalette="teal"
                  checked={formData?.loginViaFacebook}
                  onCheckedChange={() => toggleChange("loginViaFacebook")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row mx-5 gap-[10px]">
        <h1 className="lg:w-1/5">Customer App update type</h1>

        <Select
          options={appUpdateTypeOptions}
          value={appUpdateTypeOptions?.find(
            (option) => option.value === formData?.appUpdateType
          )}
          onChange={(option) => {
            setFormData((prev) => ({
              ...prev,
              appUpdateType: option.value,
            }));
          }}
          isMulti={false}
          className="mt-5 lg:mt-0 w-full lg:w-[20%]"
          menuPlacement="auto"
        />
      </div>

      <div className="mt-10 flex flex-col lg:flex-row mx-5 gap-[10px]">
        <h1 className="lg:w-1/5">Manage Custom order timing</h1>

        <div className="lg:w-4/5 flex-col justify-start">
          <p className="text-gray-500 mb-3">
            The purpose of this time is to set the working time for custom
            order.
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-[20px]">
            <DatePicker
              selected={
                formData?.customOrderCustomization?.startTime
                  ? new Date(
                      `1970-01-01T${formData.customOrderCustomization.startTime}`
                    )
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time?.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  setFormData((prev) => ({
                    ...prev,
                    customOrderCustomization: {
                      ...prev.customOrderCustomization,
                      startTime: formattedTime, // Save the formatted time string
                    },
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Start time"
              className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-full"
            />

            <DatePicker
              selected={
                formData?.customOrderCustomization?.endTime
                  ? new Date(
                      `1970-01-01T${formData.customOrderCustomization.endTime}`
                    )
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time?.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  setFormData((prev) => ({
                    ...prev,
                    customOrderCustomization: {
                      ...prev.customOrderCustomization,
                      endTime: formattedTime,
                    },
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="End time"
              className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row mx-5">
        <h1 className="w-full lg:w-1/5">Manage Custom order tax</h1>

        <Select
          options={taxOptions}
          value={taxOptions?.find(
            (option) =>
              option.value === formData?.customOrderCustomization?.taxId
          )}
          onChange={(option) => {
            setFormData((prev) => ({
              ...prev,
              customOrderCustomization: {
                ...prev.customOrderCustomization,
                taxId: option.value,
              },
            }));
          }}
          isSearchable
          isMulti={false}
          className="mt-5 lg:mt-0 w-full lg:w-[20%]"
          menuPlacement="auto"
        />
      </div>

      <div className="mt-10 flex flex-col lg:flex-row mx-5">
        <h1 className="w-full lg:w-1/5">Manage Pick and Drop timing</h1>

        <div className="lg:w-4/5 flex-col">
          <p className="text-gray-500 mb-3">
            The purpose of this time is to set the working time for Pick and
            Drop.
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-[20px]">
            <DatePicker
              selected={
                formData?.pickAndDropOrderCustomization?.startTime
                  ? new Date(
                      `1970-01-01T${formData.pickAndDropOrderCustomization.startTime}`
                    )
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time?.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  setFormData((prev) => ({
                    ...prev,
                    pickAndDropOrderCustomization: {
                      ...prev.pickAndDropOrderCustomization,
                      startTime: formattedTime, // Save the formatted time string
                    },
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Start time"
              className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-full"
            />

            <DatePicker
              selected={
                formData?.pickAndDropOrderCustomization?.endTime
                  ? new Date(
                      `1970-01-01T${formData.pickAndDropOrderCustomization.endTime}`
                    )
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time?.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  setFormData((prev) => ({
                    ...prev,
                    pickAndDropOrderCustomization: {
                      ...prev.pickAndDropOrderCustomization,
                      endTime: formattedTime,
                    },
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="End time"
              className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row mx-5">
        <h1 className="w-full lg:w-1/5">
          Manage Pick and Drop Order <br /> tax
        </h1>

        <Select
          options={taxOptions}
          value={taxOptions.find(
            (option) =>
              option.value === formData?.pickAndDropOrderCustomization?.taxId
          )}
          onChange={(option) => {
            setFormData((prev) => ({
              ...prev,
              pickAndDropOrderCustomization: {
                ...prev.pickAndDropOrderCustomization,
                taxId: option.value,
              },
            }));
          }}
          isSearchable
          isMulti={false}
          className="mt-5 lg:mt-0 w-full lg:w-[20%]"
        />
      </div>

      <div className="flex justify-end p-10 gap-4 border-b-2 border-gray-200">
        <button
          className={`bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end ${!showButton ? "invisible" : ""}`}
          onClick={handleSave}
        >
          {handleUpdateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Crop Modal */}
      <CropImage
        isOpen={showCrop && selectedFile}
        onClose={() => {
          setSelectedFile(null);
          setShowCrop(false);
        }}
        aspectRatio={9 / 16}
        selectedImage={selectedFile}
        onCropComplete={handleCropImage}
      />
    </>
  );
};

export default Toggles;
