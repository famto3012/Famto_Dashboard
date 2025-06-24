import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DataContext from "@/context/DataContext";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@chakra-ui/react";

import { deleteVariantType } from "@/hooks/product/useProduct";

const DeleteVariant = ({ isOpen, onClose, variantId, typeId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedProduct } = useContext(DataContext);

  const handleDeleteVariant = useMutation({
    mutationKey: ["update-variant"],
    mutationFn: () =>
      deleteVariantType(selectedProduct.productId, variantId, typeId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "product-detail",
        selectedProduct.productId,
      ]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Variant updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || {
        message: "An unexpected error occurred",
      };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
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
        <DialogHeader className="text-[16px] font-[600]">
          Delete Variant
        </DialogHeader>

        <DialogBody>Do you want to delete this variant type?</DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteVariant.mutate()}
          >
            {handleDeleteVariant.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteVariant;
