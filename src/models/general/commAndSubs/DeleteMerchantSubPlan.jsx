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

import { deleteMerchantSubscriptionPlan } from "@/hooks/commAndSubs/useSubscription";

const DeleteMerchantSubPlan = ({ isOpen, onClose, planId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-merchant-sub-plan"],
    mutationFn: () => deleteMerchantSubscriptionPlan(planId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchant-subscription-plan"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Merchant subscription deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting merchant subscription",
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
            Delete Merchant Subscription
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          Do you want to delete this merchant subscription?
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteMerchantSubPlan;
