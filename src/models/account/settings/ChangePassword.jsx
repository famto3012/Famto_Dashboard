import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import { updatePassword } from "@/hooks/settings/useSettings";

const ChangePassword = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const changePassword = useMutation({
    mutationKey: ["update-password"],
    mutationFn: (data) => updatePassword(data, navigate),
    onSuccess: () => {
      setFormData({
        currentPassword: "",
        newPassword: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Password updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating password",
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            Update password
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="password"
                value={formData.currentPassword}
                id="currentPassword"
                name="currentPassword"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="password"
                value={formData.newPassword}
                id="newPassword"
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-cyan-50 py-2 px-4 rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={() => changePassword.mutate(formData)}
                className="bg-teal-700 text-white py-2 px-4 rounded-md"
              >
                {changePassword.isPending ? `Saving...` : `Save`}
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangePassword;
