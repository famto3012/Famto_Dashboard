import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { fetchBusinessCategoryOfMerchant } from "@/hooks/customerAppCustomization/useBusinessCategory";
import { createNewCategory } from "@/hooks/product/useProduct";

const AddCategory = ({ isOpen, onClose, merchantId }) => {
  const [formData, setFormData] = useState({
    businessCategoryId: "",
    categoryName: "",
    type: "",
    merchantId: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["available-business-category-of-merchant", merchantId],
    queryFn: () => fetchBusinessCategoryOfMerchant(merchantId, navigate),
    enabled: isOpen,
  });

  useEffect(() => {
    setFormData({ ...formData, merchantId });
  }, [merchantId]);

  const categoryOptions = data?.map((category) => ({
    label: category.title,
    value: category._id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = useMutation({
    mutationKey: ["add-category"],
    mutationFn: () => createNewCategory(role, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-category", merchantId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "New category added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

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
          Add Category
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <label
                  className="w-1/2 text-gray-500"
                  htmlFor="businessCategory"
                >
                  Business Category <span className="text-red-600">*</span>
                </label>

                <Select
                  options={categoryOptions}
                  value={categoryOptions?.find(
                    (option) => option.value === formData.businessCategoryId
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      businessCategoryId: option.value,
                    })
                  }
                  className="border-gray-100 rounded focus:outline-none w-full"
                  placeholder="Business category"
                  isSearchable
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="categoryName">
                  Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-200 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.categoryName}
                  id="categoryName"
                  name="categoryName"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500">
                  Type <span className="text-red-600">*</span>
                </label>

                <RadioGroup
                  value={formData.type}
                  onValueChange={(e) =>
                    setFormData({ ...formData, type: e.value })
                  }
                  className="w-2/3"
                  size="sm"
                  colorPalette="teal"
                  variant="solid"
                >
                  <HStack gap="4" direction="row" defaultValue="Veg">
                    <Radio value="Veg" className="cursor-pointer">
                      Veg
                    </Radio>
                    <Radio value="Non-veg" className="cursor-pointer">
                      Non-veg
                    </Radio>
                    <Radio value="Both" className="cursor-pointer">
                      Both
                    </Radio>
                  </HStack>
                </RadioGroup>
              </div>
            </div>
          )}
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
            onClick={() => handleAddCategory.mutate()}
          >
            {handleAddCategory.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddCategory;
