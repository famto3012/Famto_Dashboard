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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";
import { allowedRoutesOption } from "@/utils/defaultData";
import { editRole, fetchSingleRole } from "@/hooks/manager/useManager";

const EditRole = ({ isOpen, onClose, roleId }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    allowedRoutes: [],
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["role-detail", roleId],
    queryFn: () => fetchSingleRole(roleId, navigate),
    enabled: isOpen,
  });

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  const handleAllowedOptionsChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      allowedRoutes: selectedOptions
        ? selectedOptions.map((option) => ({
            label: option.label,
            route: option.value,
          }))
        : [],
    }));
  };

  const handleEditRole = useMutation({
    mutationKey: ["edit-role"],
    mutationFn: () => editRole(roleId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-role"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Role updated successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in updating role.",
        type: "error",
      });
    },
  });

  if (isLoading) return <ModalLoader />;
  if (isError) return <Error />;

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
            Update Role
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Name</label>

              <input
                type="text"
                className="border w-2/3 p-2 rounded-md outline-none focus:outline-none"
                value={formData.roleName}
                name="roleName"
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Allowed Options</label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={formData.allowedRoutes.map((route) => ({
                  label: route.label,
                  value: route.route,
                }))}
                onChange={handleAllowedOptionsChange}
                options={allowedRoutesOption}
                name="allowedRoutes"
                placeholder="Select roles"
                isClearable
                isSearchable
                isMulti
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
            onClick={() => handleEditRole.mutate()}
            disabled={handleEditRole.isPending}
          >
            {handleEditRole.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditRole;
