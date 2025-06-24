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
import { useEffect, useState } from "react";
import {
  editManager,
  fetchAllRoles,
  fetchSingleManager,
} from "@/hooks/manager/useManager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ModalLoader from "@/components/others/ModalLoader";

const EditManager = ({ isOpen, onClose, managerId, geofenceOptions }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    geofenceId: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelect = (selectedOption, type) => {
    setFormData({ ...formData, [type]: selectedOption.value });
  };

  const {
    data: managerData,
    isLoading: managerLoading,
    isError: managerError,
  } = useQuery({
    queryKey: ["manager-detail", managerId],
    queryFn: () => fetchSingleManager(managerId, navigate),
    enabled: isOpen,
  });

  useEffect(() => {
    managerData && setFormData(managerData);
  }, [managerData]);

  const {
    data: allRoles,
    isLoading: roleLoading,
    isError: roleError,
  } = useQuery({
    queryKey: ["all-roles"],
    queryFn: () => fetchAllRoles(navigate),
    enabled: isOpen,
  });

  const roleOptions = allRoles?.map((role) => ({
    label: role.roleName,
    value: role.roleId,
  }));

  const handleEditManager = useMutation({
    mutationKey: ["edit-manager"],
    mutationFn: () => editManager(managerId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-managers"]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: null,
        geofence: null,
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Manager updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating manager",
        type: "error",
      });
    },
  });

  if (roleLoading || managerLoading) return <ModalLoader />;
  if (roleError || roleLoading) return <Error />;

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
            Edit Manager
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Name
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Name"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Email
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Phone
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Phone number"
                value={formData.phoneNumber}
                name="phoneNumber"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Password
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Password"
                value={formData.password}
                name="password"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500">Assign Role</label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={roleOptions?.find(
                  (option) => option.value === formData.role
                )}
                isClearable
                isSearchable
                onChange={(option) => handleSelect(option, "role")}
                options={roleOptions}
                placeholder="Select Role"
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Geofence
              </label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={geofenceOptions?.find(
                  (option) => option.value === formData.geofenceId
                )}
                isClearable
                isSearchable
                onChange={(option) => handleSelect(option, "geofenceId")}
                options={geofenceOptions}
                placeholder="Select Geofence"
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
            onClick={() => handleEditManager.mutate()}
            disabled={handleEditManager.isPending}
          >
            {handleEditManager.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditManager;
