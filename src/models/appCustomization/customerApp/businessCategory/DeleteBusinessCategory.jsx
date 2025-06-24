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

import { deleteBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";

const DeleteBusinessCategory = ({ isOpen, onClose, categoryId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = useMutation({
    mutationKey: ["delete-business-category", categoryId],
    mutationFn: () => deleteBusinessCategory(categoryId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-businessCategory"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Business category deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting business category",
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
            Delete Business category
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this business category?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDelete.mutate()}
          >
            {handleDelete.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteBusinessCategory;
