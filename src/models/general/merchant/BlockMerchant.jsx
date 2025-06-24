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
import { Button } from "@/components/ui/button";

import { blockMerchant } from "@/hooks/merchant/useMerchant";

const BlockMerchant = ({ isOpen, onClose, merchantId }) => {
  const [reason, setReason] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["block-merchant", merchantId],
    mutationFn: () => blockMerchant(merchantId, reason, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-detail", merchantId]);
      setReason("");
      onClose();
      toaster.create({
        title: "Success",
        description: "Merchant blocked successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while blocking merchant",
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
            Block Merchant
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex items-center">
            <label htmlFor="reason" className="w-1/3 text-gray-500">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
            />
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
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? `Blocking...` : `Block`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default BlockMerchant;
