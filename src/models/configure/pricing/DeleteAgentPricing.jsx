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

import { deleteAgentPricing } from "@/hooks/pricing/useAgentPricing";

const DeleteAgentPricing = ({ isOpen, onClose, pricingId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeletePricing = useMutation({
    mutationKey: ["delete-agent-pricing", pricingId],
    mutationFn: (pricingId) => deleteAgentPricing(pricingId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agent-pricing"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Pricing deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting pricing",
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
            Delete Rule
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this pricing?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeletePricing.mutate(pricingId)}
          >
            {handleDeletePricing.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteAgentPricing;
