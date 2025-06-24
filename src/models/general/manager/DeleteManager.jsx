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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteManager } from "@/hooks/manager/useManager";
import { useNavigate } from "react-router-dom";

const DeleteManager = ({ isOpen, onClose, managerId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteManager = useMutation({
    mutationKey: ["delete-manager"],
    mutationFn: () => deleteManager(managerId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-managers"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Manager deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting manager",
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
            Delete Manager
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
            onClick={() => handleDeleteManager.mutate()}
            disabled={handleDeleteManager.isPending}
          >
            {handleDeleteManager.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteManager;
