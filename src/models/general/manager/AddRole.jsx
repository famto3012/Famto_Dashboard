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
import Select from "react-select";
import { allowedRoutesOption } from "@/utils/defaultData";
import { useState } from "react";
import { addRole } from "@/hooks/manager/useManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AddRole = ({ isOpen, onClose }) => {
  const [role, setRole] = useState({
    roleName: "",
    allowedRoutes: [],
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    setRole({
      ...role,
      [e.target.name]: e.target.value,
    });
  };

  const handleAllowedOptionsChange = (selectedOptions) => {
    setRole((prevState) => ({
      ...prevState,
      allowedRoutes: selectedOptions
        ? selectedOptions.map((option) => ({
            label: option.label,
            route: option.value,
          }))
        : [],
    }));
  };

  const handleAddRole = useMutation({
    mutationKey: ["add-role"],
    mutationFn: (role) => {
      return addRole(role, navigate);
    },
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description: data?.message || "Role added successfully.",
        type: "success",
      });
      queryClient.invalidateQueries(["get-all-role"]);
      onClose();
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in adding role.",
        type: "error",
      });
    },
  });

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
          <DialogTitle className="font-[600] text-[18px]">Add Role</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Name</label>
              <input
                type="text"
                className="border w-2/3 p-2 rounded-md outline-none focus:outline-none"
                value={role.roleName}
                name="roleName"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Allowed Routes</label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={role.allowedRoutes.map((route) => ({
                  label: route.label,
                  value: route.route,
                }))}
                name="allowedRoutes"
                isMulti
                isSearchable
                onChange={handleAllowedOptionsChange}
                options={allowedRoutesOption}
                placeholder="Select allowed routes"
                isClearable
                required
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
            className="bg-teal-700 p-2 text-white"
            onClick={() => {
              handleAddRole.mutate(role);
            }}
            disabled={false}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddRole;
