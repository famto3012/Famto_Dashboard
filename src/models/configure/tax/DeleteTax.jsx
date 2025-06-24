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

import { deleteTax } from "@/hooks/tax/useTax";

const DeleteTax = ({ isOpen, taxId, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteTax = useMutation({
    mutationKey: ["delete-tax", taxId],
    mutationFn: (taxId) => deleteTax(taxId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-tax"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Tax deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting tax",
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
            Delete Tax
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this tax?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteTax.mutate(taxId)}
          >
            {handleDeleteTax.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteTax;
