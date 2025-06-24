import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
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

import { deleteCategory } from "@/hooks/product/useProduct";

const DeleteCategory = ({ isOpen, onClose, merchantId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { selectedCategory, setSelectedCategory } = useContext(DataContext);

  const handleDeleteCategory = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: () =>
      deleteCategory(role, merchantId, selectedCategory.categoryId, navigate),
    onSuccess: () => {
      setSelectedCategory({});
      queryClient.invalidateQueries(["all-category", merchantId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Category deleted successfully",
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
          Delete Category
        </DialogHeader>
        <DialogBody>Do you want to delete this category?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteCategory.mutate()}
          >
            {handleDeleteCategory.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteCategory;
