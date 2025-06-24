import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import { updatePaymentStatusOfSubscription } from "@/hooks/commAndSubs/useSubscription";

const ConfirmSubscriptionPayment = ({ isOpen, onClose, logId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["confirm-subscription-payment"],
    mutationFn: () => updatePaymentStatusOfSubscription(logId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchant-sub-logs"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Payment marked as paid",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while marking as paid",
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
            Confirm Subscription Payment
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you confirm this subscription payment?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? `Confirming...` : `Confirm`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmSubscriptionPayment;
