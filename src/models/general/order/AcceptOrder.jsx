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

import { acceptOrder } from "@/hooks/order/useOrder";

const AcceptOrder = ({ isOpen, onClose, orderId }) => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAcceptOrder = useMutation({
    mutationKey: ["accept-order"],
    mutationFn: () => acceptOrder(orderId, role, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Order accepted",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: "Failed to accept order" + data,
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
          Accept Order
        </DialogHeader>
        <DialogBody>Do you want to accept this order?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={() => handleAcceptOrder.mutate(orderId)}
          >
            {handleAcceptOrder.isPending ? `Accepting...` : `Accept`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AcceptOrder;
