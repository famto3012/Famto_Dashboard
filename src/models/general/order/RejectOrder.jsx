import { useContext } from "react";
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

import AuthContext from "@/context/AuthContext";

import { rejectOrder } from "@/hooks/order/useOrder";

const RejectOrder = ({ isOpen, onClose, orderId }) => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const rejectOrderMutation = useMutation({
    mutationKey: ["rejectOrder"],
    mutationFn: () => rejectOrder(orderId, role, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Order rejected",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to reject order",
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
        <DialogHeader className="text-[16px] font-[600]">Reject?</DialogHeader>
        <DialogBody>Do you want to reject this order?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => rejectOrderMutation.mutate()}
          >
            {rejectOrderMutation.isPending ? `Rejecting...` : `Reject`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default RejectOrder;
