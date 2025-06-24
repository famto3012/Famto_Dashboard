import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@chakra-ui/react";

import { deleteNotificationSettings } from "@/hooks/notification/useNotification";

const DeleteNotificationSetting = ({ isOpen, onClose, notificationSettingsId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDeleteNotificationSettings = useMutation({
    mutationKey: ["delete-notification-settings"],
    mutationFn: ({ notificationSettingsId }) =>
      deleteNotificationSettings({ notificationSettingsId, navigate }),
    onSuccess: () => {
      queryClient.invalidateQueries(["get-all-notification-settings"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Notification settings deleted successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Failed to delete notification settings.",
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
        <DialogHeader className="text-[16px] font-[600]">
          Delete settings?
        </DialogHeader>
        <DialogBody>Do you want to delete this settings?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() =>
              handleDeleteNotificationSettings.mutate({
                notificationSettingsId,
              })
            }
          >
            {handleDeleteNotificationSettings.isPending
              ? `Deleting...`
              : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteNotificationSetting;
