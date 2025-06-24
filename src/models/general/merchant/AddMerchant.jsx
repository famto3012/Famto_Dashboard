import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import { createNewMerchant } from "@/hooks/merchant/useMerchant";

const AddMerchant = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-merchant"],
    mutationFn: () => createNewMerchant(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchants"]);
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Merchant added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Add Merchant
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name of owner", name: "fullName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone Number", name: "phoneNumber", type: "text" },
              { label: "Password", name: "password", type: "password" },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
              },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor={name}>
                  {label} <span className="text-red-600">*</span>
                </label>
                <div className="flex-1">
                  <input
                    className="w-full border-2 border-gray-300 rounded p-2 outline-none focus:outline-none"
                    type={type}
                    value={formData[name]}
                    name={name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ))}
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
            className="bg-teal-700 p-2 text-white"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddMerchant;
