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

import { deleteMerchant } from "@/hooks/merchant/useMerchant";

const DeleteMerchant = ({ isOpen, onClose, merchantId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-merchant", merchantId],
    mutationFn: () => deleteMerchant(merchantId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchants"]);
      onClose();
      navigate("/merchant");
      toaster.create({
        title: "Success",
        description: "Merchant deleted successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: "Error while deleting merchant",
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
            Delete Merchant
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this merchant?</DialogBody>

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

export default DeleteMerchant;
