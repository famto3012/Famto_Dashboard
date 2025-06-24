import { useState } from "react";
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

import { confirmCommissionPayment } from "@/hooks/commAndSubs/useCommission";
import { Button } from "@/components/ui/button";

const ConfirmCommissionPayment = ({ isOpen, onClose, logId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["confirm-commission-payment", logId],
    mutationFn: () => confirmCommissionPayment(logId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["commission-logs"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Commission payment updated",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating commission payment",
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
            Confirm Commission Payment
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you confirm this commission payment?</DialogBody>
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

export default ConfirmCommissionPayment;
