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
import { addAlertNotifications } from "@/hooks/notification/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const SendNotification = ({
  isOpen,
  onClose,
  alertNotification,
  croppedFile,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sendNotification = useMutation({
    mutationKey: ["send-alert-notification"],
    mutationFn: ({ alertNotification }) =>
      addAlertNotifications({ alertNotification, navigate }),
    onSuccess: () => {
      queryClient.invalidateQueries(["filter-alert-notification"]);
      toaster.create({
        title: "Success",
        description: "Alert notification send successfully.",
        type: "success",
      });
      onClose();
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error sending alert notification.",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.entries(alertNotification).forEach(([key, value]) => {
      formDataObject.append(key, value);
    });
    croppedFile && formDataObject.append("alertNotificationImage", croppedFile);
    sendNotification.mutate({ alertNotification: formDataObject });
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
        <DialogHeader className="text-[16px] font-[600]">
          Send alert notification
        </DialogHeader>
        <DialogBody>
          <p className="font-semibold text-[18px] mb-5">
            Are you sure you want to Send?
          </p>
        </DialogBody>
        <DialogFooter>
          <div className="flex justify-end">
            <form>
              <Button
                type="button"
                className="bg-cyan-100 px-5 py-1 rounded-md font-semibold"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-teal-800 px-5 py-1 rounded-md ml-3 text-white"
              >
                {sendNotification.isPending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default SendNotification;
