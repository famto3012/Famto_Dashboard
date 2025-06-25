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
import { useState } from "react";
import { addManager, fetchAllRoles } from "@/hooks/manager/useManager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

const AddManager = ({ isOpen, onClose, geofenceOptions, allGeofence }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: null,
    geofenceId: [],
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
    data: allRoles,
    isLoading: roleLoading,
    isError: roleError,
  } = useQuery({
    queryKey: ["all-roles"],
    queryFn: () => fetchAllRoles(navigate),
    enabled: isOpen ? true : false,
  });

  const roleOptions = allRoles?.map((role) => ({
    label: role.roleName,
    value: role.roleId,
  }));

  const handleAddManager = useMutation({
    mutationKey: ["add-manager"],
    mutationFn: () => addManager(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-managers"]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: null,
        geofenceId: [],
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Manager added successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while adding manager",
        type: "error",
      });
    },
  });

  if (roleLoading) return <ModalLoader />;
  if (roleError) return <Error />;

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
            Add Manager
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
                options={geofenceOptions}
                value={geofenceOptions?.filter((option) => 
                  formData?.geofenceId?.includes(option.value)
                )}
                isSearchable
              onChange={(selected) => {
                    if (
                      selected &&
                      selected.some((option) => option.value === "selectAll")
                    ) {
                      setFormData({
                        ...formData,
                        geofenceId: allGeofence.map((geofence) => geofence._id),
                      });
                    } else {
                      setFormData({
                        ...formData,
                        geofenceId: selected
                          ? selected.map((option) => option.value)
                          : [],
                      });
                    }
                  }}
                isMulti
                placeholder="Select Geofence"
                  menuPlacement="top"
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
            onClick={() => handleAddManager.mutate()}
            disabled={handleAddManager.isPending}
          >
            {handleAddManager.isPending ? `Saving` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddManager;
