import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

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

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { fetchAllTax } from "@/hooks/tax/useTax";
import {
  fetchSingleMerchantSubscriptionPlan,
  updateMerchantSubscriptionPlan,
} from "@/hooks/commAndSubs/useSubscription";

const EditMerchantSubPlan = ({ isOpen, onClose, planId }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "",
    taxId: null,
    renewalReminder: "",
    description: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: planData,
    isLoading: planLoading,
    isError: planError,
  } = useQuery({
    queryKey: ["single-merchant-sub-plan", planId],
    queryFn: () => fetchSingleMerchantSubscriptionPlan(planId, navigate),
    enabled: isOpen,
  });

  useEffect(() => {
    planData && setFormData(planData);
  }, [planData]);

  const {
    data: allTax,
    isLoading: taxLoading,
    isError: taxError,
  } = useQuery({
    queryKey: ["all-tax"],
    queryFn: () => fetchAllTax(navigate),
    enabled: isOpen,
  });

  const taxOptions = allTax?.map((tax) => ({
    label: tax.taxName,
    value: tax.taxId,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-merchant-sub-plan"],
    mutationFn: () =>
      updateMerchantSubscriptionPlan(planId, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchant-subscription-plan"]);
      setFormData({
        name: "",
        amount: "",
        duration: "",
        taxId: null,
        renewalReminder: "",
        description: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "Merchant subscription plan updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating merchant subscription plan",
        type: "error",
      });
    },
  });

  const isLoading = planLoading || taxLoading;
  const isError = planError || taxError;

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
            Edit Merchant Subscription
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <div className="max-h-[30rem] overflow-y-auto flex flex-col gap-4">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="Name">
                  Plan name <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.name}
                  id="name"
                  name="name"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="amount">
                  Amount <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="number"
                  value={formData.amount}
                  id="amount"
                  name="amount"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="duration">
                  Duration (In Days) <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.duration}
                  id="duration"
                  name="duration"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="taxId">
                  Tax Id <span className="text-red-600">*</span>
                </label>

                <Select
                  className="rounded w-2/3 focus:outline-none"
                  value={
                    taxOptions?.find(
                      (option) => option.value === formData.taxId
                    ) || null
                  }
                  isSearchable={true}
                  onChange={(option) =>
                    setFormData({ ...formData, taxId: option.value })
                  }
                  options={taxOptions}
                  placeholder="Select Tax"
                  menuPlacement="auto"
                />
              </div>

              <div className="flex items-center">
                <label
                  className="w-1/3 text-gray-500"
                  htmlFor="renewalReminder"
                >
                  Renewal Reminder (In days){" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.renewalReminder}
                  id="renewalReminder"
                  name="renewalReminder"
                  onChange={handleInputChange}
                />
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
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditMerchantSubPlan;
