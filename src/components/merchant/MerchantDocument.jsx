import { useState } from "react";

import RenderIcon from "@/icons/RenderIcon";
import EnlargeImage from "@/models/common/EnlargeImage";

const MerchantDocument = ({ detail, onDataChange }) => {
  const [selectedFile, setSelectedFile] = useState({
    pancardImage: null,
    gstinImage: null,
    fssaiImage: null,
    aadharImage: null,
  });
  const [previewURL, setPreviewURL] = useState({
    pancardImage: null,
    gstinImage: null,
    fssaiImage: null,
    aadharImage: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [imageLink, setImageLink] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        [name]: value,
        bankDetail: {
          ...detail.merchantDetail.bankDetail,
          [name]: value,
        },
      },
    });
  };

  const handleSelectFile = (e, type) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setSelectedFile({ ...file, [type]: file });
      setPreviewURL({ ...previewURL, [type]: URL.createObjectURL(file) });
      onDataChange({ [type]: file });
    }
  };

  const toggleModal = (link) => {
    setImageLink(link);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImageLink(null);
  };

  return (
    <>
      <div className="mb-[50px] w-full">
        <h3 className="text-gray-700 font-bold mb-2">Documents provided</h3>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-[20px] md:max-w-[900px] gap-y-[20px] md:gap-0">
          <div className="flex items-center flex-1">
            <label className=" text-gray-700 text-[16px] md:w-1/4">
              Pan card
            </label>

            <input
              type="text"
              name="pancardNumber"
              value={detail?.merchantDetail?.pancardNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded-md w-[20rem] mx-[40px] outline-none focus:outline-none flex-grow uppercase"
            />
          </div>

          <div className="flex items-center gap-[30px]">
            {!previewURL?.pancardImage &&
            !detail?.merchantDetail?.pancardImage ? (
              <div className="bg-gray-400 w-[65px] h-[65px] rounded-md" />
            ) : (
              <figure
                onClick={() =>
                  toggleModal(
                    previewURL?.pancardImage ||
                      detail?.merchantDetail?.pancardImage
                  )
                }
                className="w-[65px] h-[65px] rounded relative cursor-pointer"
              >
                <img
                  src={
                    previewURL?.pancardImage ||
                    detail?.merchantDetail?.pancardImage
                  }
                  alt="Pancard"
                  className="w-full rounded h-full object-cover"
                />
              </figure>
            )}

            <input
              type="file"
              name="pancardImage"
              id="pancardImage"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleSelectFile(e, "pancardImage")}
            />

            <label
              htmlFor="pancardImage"
              className="flex items-center justify-center cursor-pointer bg-teal-500 text-[40px] text-white p-2 h-[40px] w-[40px] rounded"
            >
              <RenderIcon iconName="CameraIcon" size={18} loading={6} />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-[20px] md:max-w-[900px] gap-y-[20px] md:gap-0">
          <div className="flex items-center flex-1">
            <label className="text-gray-700 text-[16px] md:w-1/4">GSTIN</label>

            <input
              type="text"
              name="GSTINNumber"
              value={detail?.merchantDetail?.GSTINNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded-md w-[20rem] mx-[40px] outline-none focus:outline-none flex-grow uppercase"
            />
          </div>

          <div className="flex items-center gap-[30px]">
            {!previewURL?.gstinImage && !detail?.merchantDetail?.gstinImage ? (
              <div className="bg-gray-400 w-[65px] h-[65px] rounded-md" />
            ) : (
              <figure
                onClick={() =>
                  toggleModal(
                    previewURL?.gstinImage || detail?.merchantDetail?.gstinImage
                  )
                }
                className="w-[65px] h-[65px] rounded relative"
              >
                <img
                  src={
                    previewURL?.gstinImage || detail?.merchantDetail?.gstinImage
                  }
                  alt="GSTIN"
                  className="w-full rounded h-full object-cover"
                />
              </figure>
            )}

            <input
              type="file"
              name="gstinImage"
              id="gstinImage"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleSelectFile(e, "gstinImage")}
            />

            <label
              htmlFor="gstinImage"
              className="flex items-center justify-center cursor-pointer bg-teal-500 text-[40px] text-white p-2 h-[40px] w-[40px] rounded"
            >
              <RenderIcon iconName="CameraIcon" size={18} loading={6} />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-[20px] md:max-w-[900px] gap-y-[20px] md:gap-0">
          <div className="flex items-center flex-1">
            <label className=" text-gray-700 text-[16px] w-1/4">FSSAI</label>
            <input
              type="text"
              name="FSSAINumber"
              value={detail?.merchantDetail?.FSSAINumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded-md w-[20rem] mx-[40px] outline-none focus:outline-none flex-grow uppercase"
            />
          </div>
          <div className=" flex items-center gap-[30px]">
            {!previewURL?.fssaiImage && !detail?.merchantDetail?.fssaiImage ? (
              <div className="bg-gray-400 w-[65px] h-[65px] rounded-md" />
            ) : (
              <figure
                onClick={() =>
                  toggleModal(
                    previewURL?.fssaiImage || detail?.merchantDetail?.fssaiImage
                  )
                }
                className="w-[65px] h-[65px] rounded relative"
              >
                <img
                  src={
                    previewURL?.fssaiImage || detail?.merchantDetail?.fssaiImage
                  }
                  alt="FSSAI"
                  className="w-full rounded h-full object-cover "
                />
              </figure>
            )}

            <input
              type="file"
              name="fssaiImage"
              id="fssaiImage"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleSelectFile(e, "fssaiImage")}
            />

            <label
              htmlFor="fssaiImage"
              className="flex items-center justify-center cursor-pointer bg-teal-500 text-[40px] text-white p-2 h-[40px] w-[40px] rounded"
            >
              <RenderIcon iconName="CameraIcon" size={18} loading={6} />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-[20px] md:max-w-[900px] gap-y-[20px] md:gap-0">
          <div className="flex items-center flex-1">
            <label className=" text-gray-700 text-[16px] w-1/4">
              Adhaar Number
            </label>
            <input
              type="text"
              onKeyDown={(e) => {
                if (
                  !/^[0-9]$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              name="aadharNumber"
              value={detail?.merchantDetail?.aadharNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded-md w-[20rem] mx-[40px] outline-none focus:outline-none flex-grow uppercase"
            />
          </div>

          <div className=" flex items-center gap-[30px]">
            {!previewURL?.aadharImage &&
            !detail?.merchantDetail?.aadharImage ? (
              <div className="bg-gray-400 w-[65px] h-[65px] rounded-md" />
            ) : (
              <figure
                onClick={() =>
                  toggleModal(
                    previewURL?.aadharImage ||
                      detail?.merchantDetail?.aadharImage
                  )
                }
                className="w-[65px] h-[65px] rounded relative cursor-pointer"
              >
                <img
                  src={
                    previewURL?.aadharImage ||
                    detail?.merchantDetail?.aadharImage
                  }
                  alt="Aadhar"
                  className="w-full rounded h-full object-cover "
                />
              </figure>
            )}

            <input
              type="file"
              name="aadharImage"
              id="aadharImage"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleSelectFile(e, "aadharImage")}
            />

            <label
              htmlFor="aadharImage"
              className="flex items-center justify-center cursor-pointer bg-teal-500 text-[40px] text-white p-2 h-[40px] w-[40px] rounded"
            >
              <RenderIcon iconName="CameraIcon" size={18} loading={6} />
            </label>
          </div>
        </div>
      </div>

      <div className="mb-[50px] w-full">
        <h3 className="text-gray-700 font-bold mb-2">Bank Details</h3>

        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-[20px] lg:gap-0 my-[20px] lg::max-w-[900px]">
          <label className=" text-gray-700 text-[16px] lg:w-[15%]">
            Account Holder Name
          </label>

          <input
            type="text"
            name="accountHolderName"
            value={detail?.merchantDetail?.bankDetail?.accountHolderName}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (
                !/^[A-z]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            className="p-2 border border-gray-400 rounded-md w-full lg:max-w-[40%] lg:mx-[40px] outline-none focus:outline-none flex-grow uppercase"
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-[20px] lg:gap-0 my-[20px] lg::max-w-[900px]">
          <label className=" text-gray-700 text-[16px] lg:w-[15%]">
            Account number
          </label>

          <input
            type="text"
            name="accountNumber"
            value={detail?.merchantDetail?.bankDetail?.accountNumber}
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
            className="p-2 border border-gray-400 rounded-md w-full lg:max-w-[40%] lg:mx-[40px] outline-none focus:outline-none flex-grow uppercase"
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-[20px] lg:gap-0 my-[20px] lg::max-w-[900px]">
          <label className=" text-gray-700 text-[16px] lg:w-[15%]">
            IFSC Code
          </label>

          <input
            type="text"
            name="ifscCode"
            value={detail?.merchantDetail?.bankDetail?.ifscCode}
            onChange={handleInputChange}
            className="p-2 border border-gray-400 rounded-md w-full lg:max-w-[40%] lg:mx-[40px] outline-none focus:outline-none flex-grow uppercase"
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-[20px] lg:gap-0 my-[20px] lg::max-w-[900px]">
          <label className=" text-gray-700 text-[16px] lg:w-[15%]">
            UPI ID
          </label>

          <input
            type="text"
            name="upiId"
            value={detail?.merchantDetail?.bankDetail?.upiId}
            onChange={handleInputChange}
            className="p-2 border border-gray-400 rounded-md w-full lg:max-w-[40%] lg:mx-[40px] outline-none focus:outline-none flex-grow uppercase"
          />
        </div>
      </div>

      {/* Modal */}
      <EnlargeImage
        isOpen={showModal}
        onClose={closeModal}
        source={imageLink}
      />
    </>
  );
};

export default MerchantDocument;
