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
} from "@/hooks/agentAppCustomization/useCustomization";

import CropImage from "@/components/others/CropImage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
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
    workingTime: [],
    appUpdateType: "",
  });
  const [time, setTime] = useState({
    startTime: "",
    endTime: "",
  });
  const [imgSrc, setImgSrc] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const previewCanvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [modal, setModal] = useState({
    cropImage: false,
  });
  const [activeTimeSlot, setActiveTimeSlot] = useState(null);

  const navigate = useNavigate();

  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({
    queryKey: ["agent-app-customization"],
    queryFn: () => fetchCustomizationData(navigate),
  });

  const handleUpdateMutation = useMutation({
    mutationKey: ["update-agent-app-customization"],
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
      if (Array.isArray(formData[key])) {
        // Ensure empty arrays are sent as JSON strings
        if (formData[key].length === 0) {
          formDataObject.append(key, JSON.stringify([]));
        } else {
          formData[key].forEach((item, index) => {
            Object.keys(item).forEach((nestedKey) => {
              formDataObject.append(
                `${key}[${index}][${nestedKey}]`,
                item[nestedKey]
              );
            });
          });
        }
      } else {
        formDataObject.append(key, formData[key]);
      }
    });

    if (croppedFile) {
      formDataObject.append("splashScreenImage", croppedFile);
    }

    // Log for debugging
    for (let [key, value] of formDataObject.entries()) {
      console.log(key, value);
    }

    handleUpdateMutation.mutate(formDataObject);

    setActiveTimeSlot(null);
  };

  const handleAddTime = () => {
    if (!time.startTime || !time.endTime) {
      toaster.create({
        title: "Error",
        description: "Please select both start and end times.",
        type: "error",
      });
      return;
    }

    const startTime = time.startTime;
    const endTime = time.endTime;

    // Validation: Start time and end time should not be the same
    if (startTime === endTime) {
      toaster.create({
        title: "Error",
        description: "Start time and end time cannot be the same.",
        type: "error",
      });
      return;
    }

    if (startTime > endTime) {
      toaster.create({
        title: "Error",
        description: "Start time cannot be greater than end time.",
        type: "error",
      });
      return;
    }

    // Add the new time slot
    const newTimeSlot = {
      startTime: time.startTime,
      endTime: time.endTime,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      workingTime: [...prevFormData.workingTime, newTimeSlot],
    }));

    // Reset state
    setTime({
      startTime: "",
      endTime: "",
    });
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

  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(`1970-01-01T${time}`);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Add leading zero if needed
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleRemoveTimeSlot = (id) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      workingTime: prevFormData.workingTime.filter(
        (timeSlot) => timeSlot._id !== id
      ),
    }));
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
      <h1 className="mx-5 font-bold text-[20px] mt-[30px] lg:mt-0">
        Agent App
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 mt-10 mx-5  border-b-2 border-gray-200 pb-5">
        <div className="w-72">Splash Screen (390px x 844px)</div>

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

      <div className="flex flex-col md:flex-row mx-5 mt-5">
        <div className="w-full lg:w-1/5 mb-5 lg:mb-0">
          Sign up and Sign in Settings
        </div>

        <div className="lg:w-4/5 flex flex-col justify-start">
          <p className="text-gray-500 lg:max-w-[90%]">
            Control sign-up of Agent on your platform. Here you are given with a
            variety of options such as whether to have email or phone number as
            mandatory fields on the sign-up form, how do you want to verify the
            Agent: via Email verification or OTP verification and which social
            platform you want to enable through which Agent can sign up on your
            platform.
          </p>

          <div className="flex flex-col lg:flex-row gap-[20px] mt-[30px]">
            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg lg:w-[20%] h-fit">
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

            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg lg:w-[20%] h-fit">
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

            <div className="flex flex-col gap-[20px] bg-white p-3 rounded-lg lg:w-[20%] h-fit">
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
        <h1 className="w-full lg:w-1/5">Agent App update type</h1>

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

      <div className="mt-10 flex flex-col lg:flex-row mx-5">
        <h1 className="w-full lg:w-1/5">Manage agent login & logout timing</h1>

        <div className="w-full lg:w-4/5 flex-col justify-start mt-5 lg:mt-0">
          <p className="text-gray-500 mb-3">
            The purpose of this time is to set the working time for agent.
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-[20px]">
            <DatePicker
              selected={
                time?.startTime
                  ? new Date(`1970-01-01T${time.startTime}`)
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  setTime((prev) => ({
                    ...prev,
                    startTime: formattedTime,
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start Time"
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              className="border-2 p-2 rounded-lg"
            />

            <DatePicker
              selected={
                time?.endTime ? new Date(`1970-01-01T${time.endTime}`) : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                  setTime((prev) => ({
                    ...prev,
                    endTime: formattedTime,
                  }));
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="h:mm aa"
              placeholderText="End Time"
              className="border-2 p-2 rounded-lg "
            />
          </div>
        </div>

        <Button
          className={`bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold lg:justify-end mt-5 lg:mt-0`}
          onClick={handleAddTime}
        >
          Add
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start mt-5 mx-[20px] md:mx-0 gap-[20px] md:gap-0">
        <h4 className="text-[17px] text-gray-700 lg:w-1/5 md:ms-[20px]">
          Time slots
        </h4>

        <div className="flex flex-wrap gap-x-2 md:ms-[-20px] lg:w-4/5 ">
          {formData?.workingTime?.map((timeSlot) => (
            <Tag
              key={timeSlot?._id}
              size="xl"
              startElement={
                <span onClick={() => setActiveTimeSlot(timeSlot)}>
                  <RenderIcon iconName="ActivityIcon" size={24} loading={6} />
                </span>
              }
              className="bg-white p-3"
              closable
              onClose={() => handleRemoveTimeSlot(timeSlot?._id)}
            >
              {`${formatTime(timeSlot?.startTime) || "N/A"} - ${formatTime(timeSlot?.endTime) || "N/A"}`}
            </Tag>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row mx-[20px] md:mx-0">
        <div className="w-1/5" />
        {activeTimeSlot && (
          <div className="flex mt-5">
            <DatePicker
              selected={
                activeTimeSlot?.startTime
                  ? new Date(`1970-01-01T${activeTimeSlot.startTime}`)
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  // Update the startTime of the active time slot in formData
                  setFormData((prev) => {
                    const updatedWorkingTime = prev.workingTime.map((slot) =>
                      slot._id === activeTimeSlot._id
                        ? { ...slot, startTime: formattedTime }
                        : slot
                    );

                    // Ensure activeTimeSlot is updated as well
                    setActiveTimeSlot((prevSlot) =>
                      prevSlot?._id === activeTimeSlot._id
                        ? { ...prevSlot, startTime: formattedTime }
                        : prevSlot
                    );

                    return { ...prev, workingTime: updatedWorkingTime };
                  });
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start Time"
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              className="border-2 p-2 rounded-lg"
            />

            <DatePicker
              selected={
                activeTimeSlot?.endTime
                  ? new Date(`1970-01-01T${activeTimeSlot.endTime}`) // Ensure it handles endTime correctly
                  : null
              }
              onChange={(time) => {
                if (time) {
                  const formattedTime = time.toLocaleTimeString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  // Update the endTime of the active time slot in formData and also update activeTimeSlot
                  setFormData((prev) => {
                    const updatedWorkingTime = prev.workingTime.map((slot) =>
                      slot._id === activeTimeSlot._id
                        ? { ...slot, endTime: formattedTime }
                        : slot
                    );

                    // Ensure activeTimeSlot is updated as well
                    setActiveTimeSlot((prevSlot) =>
                      prevSlot?._id === activeTimeSlot._id
                        ? { ...prevSlot, endTime: formattedTime }
                        : prevSlot
                    );

                    return { ...prev, workingTime: updatedWorkingTime };
                  });
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="h:mm aa"
              placeholderText="End Time"
              className="border-2 p-2 rounded-lg ml-5"
            />
            <Button
              className="bg-red-500 rounded-lg text-white font-semibold ml-5"
              onClick={() => setActiveTimeSlot(null)}
            >
              <RenderIcon iconName="CancelIcon" size={24} loading={6} />
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end p-10 gap-4 border-b-2 border-gray-200">
        <Button
          className={`bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end ${!showButton ? "invisible" : ""}`}
          onClick={handleSave}
        >
          {handleUpdateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
};

export default Toggles;
