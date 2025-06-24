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

import { deletePromoCodes } from "@/hooks/promocode/usePromocode";

const DeletePromoCode = ({ isOpen, onClose, promoCodeId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeletePromoCode = useMutation({
    mutationKey: ["delete-promo=code", promoCodeId],
    mutationFn: (promoCodeId) => deletePromoCodes(promoCodeId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-promo-codes"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Promo code deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting promo code",
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
            Delete Promo code
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this promo code?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeletePromoCode.mutate(promoCodeId)}
          >
            {handleDeletePromoCode.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeletePromoCode;
