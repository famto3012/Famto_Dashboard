import { useContext, useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { toaster } from "@/components/ui/toaster";

import Map from "@/models/common/Map";
import DataContext from "@/context/DataContext";

const AddAddressForm = ({ onAddCustomerAddress }) => {
  const [formData, setFormData] = useState({
    type: "",
    fullName: "",
    phoneNumber: "",
    flat: "",
    area: "",
    landmark: "",
    saveAddress: false,
    latitude: null,
    longitude: null,
  });
  const [showButton, setShowButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({
    type: null,
    otherAddressId: null,
  });
  const { addressType, setAddressType } = useContext(DataContext);

  useEffect(() => {
    setShowButton(true);
  }, [formData]);

  const handleChangeAddress = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectLocation = (data) => {
    setFormData({ ...formData, latitude: data[0], longitude: data[1] });
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      ".",
    ];
    const isNumberKey = e.key >= "0" && e.key <= "9";
    const isPasteShortcut =
      (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

    if (
      e.target.name === "phoneNumber" ||
      e.target.name === "latitude" ||
      e.target.name === "longitude"
    ) {
      if (!isNumberKey && !allowedKeys.includes(e.key) && !isPasteShortcut) {
        e.preventDefault();
      }
    }
  };

  const handleAddNewAddress = () => {
    const requiredFields = ["type", "fullName", "phoneNumber", "flat", "area"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (!formData.latitude || !formData.longitude) {
      missingFields.push("Location");
    }

    if (missingFields.length > 0) {
      const errorMessages = missingFields.map((field) => {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return `${formattedField} is required`;
      });

      const formattedErrors = errorMessages.map((msg) => `• ${msg}`).join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
      return;
    }
    console.log("FormData", formData);
    onAddCustomerAddress(formData);
    setShowButton(false);
  };

  const handleAddressButtonClick = (type) => {
    if (type === addressType && type !== "other") {
      toaster.create({
        title: "Error",
        description: "Pick-up Address and Delivery Address cannot be the same",
        type: "error",
      });
      return;
    }
    setFormData({ ...formData, type: type });
    setAddressType(type);
    setSelectedAddress({ type, otherAddressId: null });
  };

  return (
    <div className="flex mt-5">
      <label className="hidden md:block w-1/3"></label>
      <div className="mt-6 p-6 bg-gray-200 rounded-lg shadow-lg md:w-1/2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row space-x-2 justify-around">
            {["home", "work", "other"].map((button) => (
              <button
                key={button}
                type="button"
                onClick={() => handleAddressButtonClick(button)}
                className={`px-5 p-2 rounded capitalize flex-1 ${
                  formData.type === button
                    ? "bg-teal-700 text-white"
                    : "bg-transparent border border-teal-700 text-teal-700"
                }`}
              >
                {button}
              </button>
            ))}
          </div>

          {[
            { label: "Full Name", name: "fullName" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Flat/House no/Floor", name: "flat" },
            { label: "Area/Locality", name: "area" },
            { label: "Latitude", name: "latitude" },
            { label: "Longitude", name: "longitude" },
            { label: "Nearby Landmark", name: "landmark", required: false },
          ].map(({ label, name, required = true }) => (
            <div className="flex items-center" key={name}>
              <label className="w-1/3 text-md font-medium">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={name}
                placeholder={label}
                className="w-2/3 px-3 py-2 bg-white rounded focus:outline-none"
                value={formData[name]}
                onChange={handleChangeAddress}
                onKeyDown={handleKeyDown}
              />
            </div>
          ))}

          <div className="flex items-center">
            <label className="w-1/3 text-md font-medium">Location</label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={`${
                formData.latitude && formData.longitude
                  ? "bg-transparent text-teal-700"
                  : "bg-teal-700 text-white"
              } font-medium border border-teal-700 w-2/3 rounded-md mx-auto py-2`}
            >
              {formData.latitude && formData.longitude
                ? `Location Marked`
                : `Mark location`}
            </button>
            <Map
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onLocationSelect={handleSelectLocation}
            />
          </div>

          <div className="flex">
            <Checkbox
              checked={formData.saveAddress}
              onCheckedChange={(e) =>
                setFormData({ ...formData, saveAddress: !!e.checked })
              }
            >
              Save this address to address book
            </Checkbox>
          </div>

          {showButton && (
            <div className="flex justify-end mt-5 gap-3">
              <button
                type="button"
                className="bg-teal-700 text-white px-4 py-2 rounded w-1/2"
                onClick={handleAddNewAddress}
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAddressForm;
