import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import { Button, HStack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import {
  changeProductCategory,
  fetchAllCategoriesOfMerchant,
} from "@/hooks/product/useProduct";
import { Radio, RadioGroup } from "@/components/ui/radio";

const ChangeCategory = ({ isOpen, onClose, merchantId }) => {
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { selectedCategory, selectedProduct } = useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-category", merchantId],
    queryFn: () => fetchAllCategoriesOfMerchant(role, merchantId, navigate),
    enabled: !!merchantId,
  });

  useEffect(() => {
    selectedCategory && setSelected(selectedCategory.categoryId);
  }, [data, selectedCategory]);

  const handleChangeCategory = useMutation({
    mutationKey: ["update-product-category"],
    mutationFn: () =>
      changeProductCategory(selectedProduct.productId, selected, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "all-products",
        selectedCategory.categoryId,
      ]);
      setSelected(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "Product category updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating product category",
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
          Change Category
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            {data?.map((category) => (
              <RadioGroup
                value={selected}
                onValueChange={(e) => setSelected(e.value)}
                size="sm"
                colorPalette="teal"
                variant="solid"
                key={category._id}
              >
                <HStack gap="5" direction="column" defaultValue={selected}>
                  <Radio value={category._id} className="cursor-pointer">
                    {category.categoryName}
                  </Radio>
                </HStack>
              </RadioGroup>
            ))}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={() => handleChangeCategory.mutate()}
          >
            {handleChangeCategory.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangeCategory;
