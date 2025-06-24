import { useState } from "react";

import { toaster } from "@/components/ui/toaster";

const NewCustomerForm = ({ toggleNewCustomerForm, onAddCustomer }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [showButtons, setShowButtons] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCustomer = () => {
    const missingFields = Object.keys(formData).filter(
      (field) => !formData[field]
    );

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

    onAddCustomer(formData);
    setShowButtons(false);
  };

  return (
    <div className="flex">
      <label className="hidden md:block md:w-1/3"></label>
      <div className="mt-6 p-6 bg-gray-200 rounded-lg shadow-lg w-full md:w-1/2">
        <div>
          <div className="mb-4 text-gray-500">
            <p>
              <span className="text-black font-[600]">NB:</span> Customers will
              be added only after creating invoice.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center">
              <label className="w-1/3 text-md font-medium mt-2">Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Name"
                className="w-2/3 px-3 py-2 bg-white rounded focus:outline-none outline-none"
                value={formData.fullName}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !/^[a-zA-Z\s]$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Delete"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-md font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-2/3 px-3 py-2 bg-white rounded focus:outline-none outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-md font-medium">Phone</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone number"
                className="w-2/3 px-3 py-2 bg-white rounded focus:outline-none outline-none"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !/^[0-9]$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          {showButtons && (
            <div className="flex justify-between mt-5 gap-3">
              <button
                className="bg-cyan-100 px-4 py-2 w-1/2"
                onClick={toggleNewCustomerForm}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-teal-700 text-white px-4 py-2 rounded w-1/2"
              >
                <span className="hidden md:block">Add Customer</span>
                <span className="md:hidden">Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCustomerForm;
