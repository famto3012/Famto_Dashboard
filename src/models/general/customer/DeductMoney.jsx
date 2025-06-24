import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import { deductMoney } from "@/hooks/customer/useCustomer";

const DeductMoney = ({ isOpen, onClose, customerId }) => {
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["deduct-monet-from-wallet", customerId],
    mutationFn: ({ customerId, amount }) =>
      deductMoney(customerId, amount, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["customer-detail", customerId]);
      setAmount("");
      onClose();
      toaster.create({
        title: "Success",
        description: "Amount deducted from wallet",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deducting amount from wallet",
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
            Deduct Money from Wallet
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <div className="flex items-center">
              <label htmlFor="reason" className="w-1/3 text-gray-500">
                Amount(₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-4 mt-5">
              <button
                className="bg-cyan-50 py-2 px-4 rounded-md"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-teal-800 text-white py-2 px-4 rounded-md"
                onClick={() => mutate({ customerId, amount })}
              >
                {isPending ? `Saving...` : `Save`}
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeductMoney;
