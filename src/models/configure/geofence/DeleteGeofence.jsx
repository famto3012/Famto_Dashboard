import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { deleteGeofence } from "@/hooks/geofence/useGeofence";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DeleteGeofence = ({ isOpen, onClose, geofenceId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteGeofenceMutation = useMutation({
    mutationKey: ["delete-geofence"],
    mutationFn: ({ geofenceId }) => deleteGeofence({ geofenceId, navigate }),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["all-geofence"]);
      toaster.create({
        title: "Success",
        description: "Geofence deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to delete geofence",
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
        <DialogHeader className="text-[16px] font-[600]">
          Delete geofence
        </DialogHeader>
        <DialogBody>Are you sure you want to delete?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => deleteGeofenceMutation.mutate({ geofenceId })}
          >
            {deleteGeofenceMutation.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteGeofence;
