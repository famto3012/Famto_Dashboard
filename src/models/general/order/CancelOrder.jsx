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

import { markOrderAsCancelledForAdmin } from "@/hooks/order/useOrder";

const CancelOrder = ({ isOpen, onClose, orderId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const markOrderAsCancelled = useMutation({
    mutationKey: ["mark-as-cancelled"],
    mutationFn: () => markOrderAsCancelledForAdmin(orderId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Order marked as cancelled",
        type: "success",
      });
    },
    onError: (message) => {
      toaster.create({
        title: "Error",
        description: message,
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
        <DialogHeader className="text-[16px] font-[600]">Cancel?</DialogHeader>
        <DialogBody>Do you want to cancel this order?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => markOrderAsCancelled.mutate()}
            disabled={markOrderAsCancelled.isPending}
          >
            {markOrderAsCancelled.isPending ? `Cancelling...` : `Cancel`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CancelOrder;
