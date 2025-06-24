import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";

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

import { deleteCustomerSurge } from "@/hooks/pricing/useCustomerPricing";

const DeleteCustomerSurge = ({ isOpen, onClose, surgeId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeletePricing = useMutation({
    mutationKey: ["delete-customer-pricing", surgeId],
    mutationFn: (surgeId) => deleteCustomerSurge(surgeId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customer-surge"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Surge deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting surge",
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
            Delete surge
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this surge?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeletePricing.mutate(surgeId)}
          >
            {handleDeletePricing.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteCustomerSurge;
