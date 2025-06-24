import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";

import MerchantRating from "@/models/general/merchant/MerchantRating";
import Map from "@/models/common/Map";
import EnlargeImage from "@/models/common/EnlargeImage";

const MerchantData = ({ detail, onDataChange }) => {
  const [modal, setModal] = useState({
    rating: false,
    map: false,
    enlarge: false,
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLink, setImageLink] = useState(null);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: allGeofence } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({
      ...detail,
      [name]: value,
      merchantDetail: {
        ...detail.merchantDetail,
        [name]: value,
      },
    });
  };

  const handleSelectChange = (option) => {
    onDataChange({
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        geofenceId: option.value,
      },
    });
  };

  const handleSelectFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      onDataChange({ merchantImage: file });
    }
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const toggleModal = (type, link = null) => {
    setImageLink(link);
    setModal({
      ...modal,
      [type]: true,
    });
  };

  const closeModal = () => {
    setModal({
      rating: false,
      map: false,
      enlarge: false,
    });
    setImageLink(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 2xl:grid-cols-6 gap-4">
        {/* Merchant Image Section */}
        <div className="flex flex-col col-span-2 2xl:col-span-2 items-center order-1 2xl:order-2">
          {!previewURL && !detail?.merchantDetail?.merchantImage ? (
            <div className="bg-gray-400 w-[90%] h-[12rem] rounded-md relative">
              <label
                htmlFor="merchantImage"
                className="cursor-pointer absolute bottom-0 right-0 bg-teal-500 text-white p-3 rounded-br-md"
              >
                <RenderIcon iconName="CameraIcon" size={16} loading={6} />
              </label>
            </div>
          ) : previewURL ? (
            <figure className="w-[90%] h-[12rem] rounded-md relative">
              <img
                onClick={() => toggleModal("enlarge", previewURL)}
                src={previewURL}
                alt="profile"
                className="w-full h-full rounded-md object-cover cursor-pointer"
              />
              <label
                htmlFor="merchantImage"
                className="cursor-pointer absolute bottom-0 right-0 bg-teal-500 text-white p-3 rounded-br-md"
              >
                <RenderIcon iconName="CameraIcon" size={16} loading={6} />
              </label>
            </figure>
          ) : (
            detail?.merchantDetail?.merchantImage && (
              <figure className="w-[90%] h-[12rem] rounded-md relative  z-10">
                <img
                  onClick={() =>
                    toggleModal(
                      "enlarge",
                      detail?.merchantDetail?.merchantImage
                    )
                  }
                  src={detail?.merchantDetail?.merchantImage}
                  alt="profile"
                  className="w-full h-full rounded-md object-cover cursor-pointer"
                />
                <label
                  htmlFor="merchantImage"
                  className="cursor-pointer absolute bottom-0 right-0 bg-teal-500 text-white p-3 rounded-br-md"
                >
                  <RenderIcon iconName="CameraIcon" size={16} loading={6} />
                </label>
              </figure>
            )
          )}

          <input
            type="file"
            name="merchantImage"
            id="merchantImage"
            className="hidden"
            accept="image/*"
            onChange={handleSelectFile}
          />
        </div>

        {/* Merchant Details and Contact Details Section Side by Side */}
        <div className="col-span-2 2xl:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4 order-2 2xl:order-1">
          {/* Merchant Details Section */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="text-red-500 font-[600] w-1/3">ID</label>
              <input
                type="text"
                className="outline-none focus:outline-none p-[10px] bg-transparent rounded text-red-600 placeholder:text-red-600"
                disabled
                value={detail._id}
              />
            </div>

            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3">
                Merchant name<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="merchantName"
                className="merchantDetail-input"
                placeholder="Merchant name"
                spellCheck={false}
                value={detail?.merchantDetail?.merchantName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3">
                Display address<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="displayAddress"
                className="merchantDetail-input"
                placeholder="Merchant Address"
                spellCheck={false}
                value={detail?.merchantDetail?.displayAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3">
                Name of owner<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="merchantDetail-input"
                placeholder="Full name of Owner"
                spellCheck={false}
                value={detail.fullName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3">
                Email<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="email"
                className="merchantDetail-input"
                placeholder="Merchant name"
                value={detail.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3">
                Phone<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                className="merchantDetail-input"
                placeholder="Phone number"
                maxLength={11}
                value={detail.phoneNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !/^[0-9]$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="mb-4 flex items-center gap-[10px] w-full">
              <label className="block text-gray-700 w-1/3 ">
                Registration status
              </label>
              <input
                type="text"
                className={`${
                  detail?.isApproved === "Approved"
                    ? "text-green-600"
                    : detail?.isApproved === "Pending"
                      ? " text-orange-600"
                      : ""
                } outline-none focus:outline-none p-[10px] bg-transparent rounded w-2/3`}
                disabled
                value={detail.isApproved}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" md:w-[830px] mt-14 mb-[50px]">
        <div className="mb-[20px] flex flex-col md:flex-row md:items-center md:justify-between gap-[30px]">
          <label className="text-gray-700 text-[16px] md:w-1/3">
            Short Description (Max 10 characters)
            <span className="text-red-500 font-bold">*</span>
          </label>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={detail?.merchantDetail?.description}
            className=" border rounded-md p-2 outline-none focus:outline-none w-full md:w-2/3  md:me-[95px] "
            onChange={handleInputChange}
          />
        </div>

        {role !== "Merchant" && (
          <div className="mb-[20px] flex items-center justify-between gap-[30px]">
            <label className="text-gray-700 text-[16px] md:w-1/3">
              Geofence<span className="text-red-500 font-bold">*</span>
            </label>

            <Select
              options={geofenceOptions}
              value={geofenceOptions?.find(
                (option) => option.value === detail?.merchantDetail?.geofenceId
              )}
              onChange={handleSelectChange}
              className="mt-2 w-2/3 border rounded-md outline-none focus:outline-none md:me-[95px] "
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
        )}

        <div className="mb-[20px] flex items-center justify-between gap-[30px]">
          <label className="text-gray-700 text-[16px] md:w-1/3">
            Pricing<span className="text-red-500 font-bold">*</span>
          </label>

          {detail?.merchantDetail?.pricing?.modelType ? (
            <p className="w-2/3 bg-transparent rounded-md py-2 md:p-2 text-left md:me-[95px]">
              {detail?.merchantDetail?.pricing?.modelType} |{" "}
              {detail?.merchantDetail?.pricing?.detail?.type === "Percentage"
                ? `${detail?.merchantDetail?.pricing?.detail?.value} %`
                : `${detail?.merchantDetail?.pricing?.detail?.value}`}
            </p>
          ) : (
            <p className="w-2/3 text-red-600 font-[500] rounded-md text-left me-[95px]">
              Inactive
            </p>
          )}
        </div>

        <div className="mb-[20px] flex items-start justify-start">
          <label className="text-gray-700 md:w-1/3">
            Location<span className="text-red-500 font-bold">*</span>
          </label>

          <div className="flex flex-col gap-5 ms-auto md:ms-0 ">
            <div className="flex flex-col gap-3 md:w-2/3">
              <input
                type="text"
                className="h-10 ps-3 py-2 text-sm border-2 outline-none focus:outline-none rounded-md flex-1"
                placeholder="Latitude"
                name="latitude"
                value={detail?.merchantDetail?.location?.[0] || ""}
                onChange={(e) =>
                  onDataChange({
                    ...detail,
                    merchantDetail: {
                      ...detail.merchantDetail,
                      location: [
                        e.target.value, // Update latitude (index 0)
                        detail?.merchantDetail?.location?.[1] || "", // Keep longitude (index 1) unchanged
                      ],
                    },
                  })
                }
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ];
                  const isNumberKey = e.key >= "0" && e.key <= "9";
                  const isDot = e.key === ".";
                  const isPaste =
                    (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

                  if (
                    !isNumberKey &&
                    !allowedKeys.includes(e.key) &&
                    !isDot &&
                    !isPaste
                  ) {
                    e.preventDefault();
                  }
                }}
              />

              <input
                type="text"
                className="h-10 ps-3 py-2 text-sm border-2 outline-none focus:outline-none rounded-md flex-1"
                placeholder="Longitude"
                name="longitude"
                value={detail?.merchantDetail?.location?.[1] || ""}
                onChange={(e) =>
                  onDataChange({
                    ...detail,
                    merchantDetail: {
                      ...detail.merchantDetail,
                      location: [
                        detail?.merchantDetail?.location?.[0] || "", // Keep latitude (index 0) unchanged
                        e.target.value, // Update longitude (index 1)
                      ],
                    },
                  })
                }
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ];
                  const isNumberKey = e.key >= "0" && e.key <= "9";
                  const isDot = e.key === ".";
                  const isPaste =
                    (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

                  if (
                    !isNumberKey &&
                    !allowedKeys.includes(e.key) &&
                    !isDot &&
                    !isPaste
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-start gap-[30px]">
              <button
                type="button"
                onClick={() => toggleModal("map")}
                className={`font-medium text-start rounded-md py-2 w-2/3 flex items-center justify-center gap-2 me-1 border-2 border-teal-700 ${
                  detail?.merchantDetail?.location?.every(
                    (item) => !isNaN(item)
                  ) && detail?.merchantDetail?.location?.length === 2
                    ? "bg-teal-700 text-white"
                    : "text-teal-700"
                }`}
              >
                <span>
                  {detail?.merchantDetail?.location?.every(
                    (item) => !isNaN(item)
                  ) && detail?.merchantDetail?.location?.length === 2
                    ? "Location Marked"
                    : "Mark Location"}
                </span>
                <RenderIcon iconName="LocationIcon" size={16} loading={6} />
              </button>

              {detail?.merchantDetail?.locationImage && (
                <img
                  onClick={() =>
                    toggleModal(
                      "enlarge",
                      detail?.merchantDetail?.locationImage
                    )
                  }
                  src={detail?.merchantDetail?.locationImage}
                  className="w-[70px] h-[66px] rounded-md cursor-pointer"
                  alt="location map"
                />
              )}

              {!detail?.merchantDetail?.locationImage && (
                <div className="w-[70px] h-[66px] rounded-md bg-gray-300"></div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-[20px] flex items-center justify-start gap-[30px] md:me-[95px]">
          <label className="text-gray-700 w-1/3">Ratings</label>

          <button
            onClick={() => toggleModal("rating")}
            className="bg-teal-700 text-white py-2 md:p-2 rounded-md w-2/3"
          >
            Show ratings and reviews
          </button>
        </div>
      </div>

      {/* Modal */}
      <MerchantRating
        isOpen={modal.rating}
        onClose={closeModal}
        data={detail?.merchantDetail?.ratingByCustomers}
      />

      <Map
        isOpen={modal.map}
        onClose={closeModal}
        onLocationSelect={(data) => {
          onDataChange({
            ...detail,
            merchantDetail: {
              ...detail.merchantDetail,
              location: data,
            },
          });
        }}
        oldLocation={detail?.merchantDetail?.location}
      />

      <EnlargeImage
        isOpen={modal.enlarge}
        onClose={closeModal}
        source={imageLink}
      />
    </>
  );
};

export default MerchantData;
