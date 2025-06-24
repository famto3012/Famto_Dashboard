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
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "@/hooks/manager/useManager";

const DeleteRole = ({ isOpen, onClose, roleId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteRole = useMutation({
    mutationKey: ["delete-manager"],
    mutationFn: () => deleteRole(roleId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["get-all-role"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Role deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting role",
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
          <DialogTitle className="font-[600] text-[18px]">
            Delete Role
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Are you sure that delete?</DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteRole.mutate()}
            disabled={handleDeleteRole.isPending}
          >
            {handleDeleteRole.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteRole;
