import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchCustomizationData,
  updateCustomizationData,
} from "@/hooks/merchantAppCustomization/useCustomization";

import CropImage from "@/components/others/CropImage";
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
    appUpdateType: "",
  });
  const [imgSrc, setImgSrc] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const previewCanvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [modal, setModal] = useState({
    cropImage: false,
  });

  const navigate = useNavigate();

  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({
    queryKey: ["merchant-app-customization"],
    queryFn: () => fetchCustomizationData(navigate),
  });

  const handleUpdateMutation = useMutation({
    mutationKey: ["update-merchant-app-customization"],
    mutationFn: (data) => updateCustomizationData(data, navigate),
    onSuccess: () => {
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
      formDataObject.append(key, formData[key]);
    });

    // Correctly append the cropped file
    if (croppedFile) {
      formDataObject.append("splashScreenImage", croppedFile);
    }

    handleUpdateMutation.mutate(formDataObject);
  };

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  useEffect(() => {
    if (data) {
      const isModified =
        Object.keys(formData).some((key) => formData[key] !== data[key]) ||
        !!croppedFile; // Consider croppedFile as a modification
      setShowButton(isModified);
    }
  }, [formData, data, croppedFile]);

  const toggleChange = (type) => {
    setFormData({ ...formData, [type]: !formData[type] });
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setImg(e.target.files[0]);
    }
  };

  const toggleModal = (type) => {
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCropComplete = (croppedFile) => {
    setCroppedFile(croppedFile);
    setModal({ ...modal, cropImage: false });
    setImg(null);
  };

  const showLoading = dataLoading;
  const showError = dataError;

  if (showLoading) return <Loader />;
  if (showError) return <Error />;

  return (
    <>
      <h1 className="mx-5 font-bold text-[20px] mt-5 lg:mt-0">Merchant App </h1>

      <div className="flex flex-col lg:flex-row gap-10 mt-10 mx-5 border-b-2 border-gray-200 pb-5">
        <div className="lg:w-72">Splash Screen (390px x 844px)</div>

        <div className="text-gray-500">
          Note: The purpose is to wish or design the splash page. The format can
          image or gif Note: Design according to aspect ratio
        </div>

        <div className="flex w-44 gap-[30px]">
          {formData?.splashScreenUrl && !croppedFile && (
            <figure className="h-16 w-16 rounded-md  relative">
              <img
                src={formData?.splashScreenUrl}
                alt="profile"
                className="w-full rounded h-full object-cover"
              />
            </figure>
          )}
          {!croppedFile && !formData?.splashScreenUrl && (
            <div className="h-[66px] w-[66px] bg-gray-200 rounded-md"></div>
          )}
          {!!croppedFile && (
            <>
              <div>
                <img
                  ref={previewCanvasRef}
                  src={URL.createObjectURL(croppedFile)}
                  style={{
                    border: "1px solid white",
                    borderRadius: "5px",
                    objectFit: "cover",
                    width: "66px",
                    height: "66px",
                  }}
                />
              </div>
            </>
          )}

          <input
            type="file"
            name="splashScreen"
            id="splashScreen"
            className="hidden"
            accept="image/*"
            onChange={onSelectFile}
          />
          <label
            htmlFor="splashScreen"
            className="flex items-center justify-center bg-teal-800 text-[30px] text-white p-4 h-16 w-16 rounded-md cursor-pointer"
            onClick={() => toggleModal("cropImage")}
          >
            <RenderIcon iconName="CameraIcon" size={24} loading={6} />
          </label>
          {imgSrc && (
            <CropImage
              selectedImage={img}
              aspectRatio={9 / 16} // Optional, set aspect ratio (1:1 here)
              onCropComplete={handleCropComplete}
              isOpen={modal?.cropImage}
              onClose={() => {
                setModal({ ...modal, cropImage: false });
                setImg(null);
              }} // Pass the handler to close the modal and reset the state
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mx-5 mt-5">
        <div className="lg:w-1/5 ">Sign up and Sign in Settings</div>

        <div className="lg:w-4/5 flex flex-col justify-start">
          <p className="text-gray-500 w-full lg:max-w-[90%] mt-5 lg:mt-0">
            Control sign-up of Merchant on your platform. Here you are given
            with a variety of options such as whether to have email or phone
            number as mandatory fields on the sign-up form, how do you want to
            verify the Merchant: via Email verification or OTP verification and
            which social platform you want to enable through which Merchant can
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

      <div className="mt-10 flex flex-col lg:flex-row mx-5">
        <h1 className="w-full lg:w-1/5">Merchant App update type</h1>

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
          className="w-full lg:w-[20%] lg:ms-[-15px] flex-col justify-start mt-5 lg:mt-0"
          menuPlacement="auto"
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
    </>
  );
};

export default Toggles;
