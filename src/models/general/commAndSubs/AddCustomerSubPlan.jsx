import { useState } from "react";
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
import { createCustomerSubscriptionPlan } from "@/hooks/commAndSubs/useSubscription";

const AddCustomerSubPlan = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "",
    taxId: null,
    renewalReminder: "",
    noOfOrder: "",
    description: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    mutationKey: ["add-customer-sub-plan"],
    mutationFn: () => createCustomerSubscriptionPlan(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customer-subscription-plan"]);
      setFormData({
        name: "",
        amount: "",
        duration: "",
        taxId: null,
        renewalReminder: "",
        noOfOrder: "",
        description: "",
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "New customer subscription added successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while creating new merchant subscription",
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
            Add Customer Subscription
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {taxLoading ? (
            <ModalLoader />
          ) : taxError ? (
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
                  Plan amount <span className="text-red-600">*</span>
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
                  type="number"
                  value={formData.duration}
                  id="duration"
                  name="duration"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="taxId">
                  Tax name
                </label>

                <Select
                  options={taxOptions}
                  value={taxOptions?.find(
                    (option) => option.value === formData.taxId
                  )}
                  onChange={(option) =>
                    setFormData({ ...formData, taxId: option.value })
                  }
                  className="rounded w-2/3 focus:outline-none"
                  placeholder="Select Tax"
                  isSearchable={true}
                  isMulti={false}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      paddingRight: "",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      padding: "10px",
                    }),
                  }}
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
                  type="number"
                  value={formData.renewalReminder}
                  id="renewalReminder"
                  name="renewalReminder"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="noOfOrder">
                  No of Orders <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="number"
                  value={formData.noOfOrder}
                  id="noOfOrder"
                  name="noOfOrder"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/3 text-gray-500" htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </label>
                <input
                  className="border-2 border-gray-100 rounded p-2 w-2/3 focus:outline-none"
                  type="text"
                  value={formData.description}
                  id="description"
                  name="description"
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

export default AddCustomerSubPlan;
