import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

const EditAddress = ({ isOpen, onClose, type, address, onNewAddress }) => {
  const [formData, setFormData] = useState({
    type: "",
    fullName: "",
    phoneNumber: "",
    flat: "",
    area: "",
    landmark: "",
    coordinates: [],
  });

  useEffect(() => {
    address && isOpen && setFormData({ ...address, type });
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude") {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value)) return;

      const index = name === "latitude" ? 0 : 1;
      const updatedCoords = [...formData.coordinates];
      updatedCoords[index] = value;
      setFormData({ ...formData, coordinates: updatedCoords });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const saveAddress = () => {
    const requiredFields = ["type", "fullName", "phoneNumber", "flat", "area"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    let errorMessages = missingFields.map((field) => {
      const formattedField = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return `${formattedField} is required`;
    });

    const [latitude, longitude] = formData.coordinates;

    if (
      !Array.isArray(formData.coordinates) ||
      formData.coordinates.length !== 2 ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude))
    ) {
      errorMessages.push("Valid Latitude and Longitude are required");
    }

    if (errorMessages.length > 0) {
      const formattedErrors = errorMessages.map((msg) => `• ${msg}`).join("\n");
      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
      return;
    }

    onNewAddress({ formData, type });
    onClose();
  };

  return (
    <>
      <DialogRoot
        open={isOpen}
        onInteractOutside={saveAddress}
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <DialogContent>
          <DialogCloseTrigger onClick={onClose} />
          <DialogHeader>
            <DialogTitle className="font-[600] text-[18px]">
              Edit <span className="capitalize">{type}</span> Address
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            {[
              { label: "Full Name", name: "fullName" },
              { label: "Phone Number", name: "phoneNumber" },
              { label: "Flat/House no/Floor", name: "flat" },
              { label: "Area/Locality", name: "area" },
              { label: "Nearby Landmark", name: "landmark", required: false },
            ].map(({ label, name, required = true }) => (
              <div className="flex items-center" key={name}>
                <label className="w-1/3 text-md font-medium mb-5">
                  {label}
                  {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={name}
                  placeholder={label}
                  className="w-2/3 px-3 py-2 bg-white rounded focus:outline-none border mb-5"
                  value={formData[name]}
                  spellCheck={false}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div className="flex items-center" key={name}>
              <label className="w-1/3 text-md font-medium mb-5">
                Location
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-[20px] w-2/3">
                <input
                  type="text"
                  name="latitude"
                  placeholder="latitude*"
                  className=" w-full px-3 py-2 bg-white rounded focus:outline-none border mb-5"
                  value={formData?.coordinates[0] || ""}
                  spellCheck={false}
                  onChange={handleInputChange}
                />

                <input
                  type="text"
                  name="longitude"
                  placeholder="longitude*"
                  className="w-full px-3 py-2 bg-white rounded focus:outline-none border mb-5"
                  value={formData?.coordinates[1] || ""}
                  spellCheck={false}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              onClick={onClose}
              className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
            >
              Cancel
            </Button>

            <Button
              onClick={saveAddress}
              className="bg-teal-700 p-2 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default EditAddress;
