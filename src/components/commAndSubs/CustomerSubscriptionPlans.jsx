import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import RenderIcon from "@/icons/RenderIcon";

import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import {
  fetchAllSubscriptionPlansOfCustomer,
  initiateSubscriptionPaymentForCustomer,
  verifyRazorpayPaymentForSubscription,
} from "@/hooks/commAndSubs/useSubscription";

import AddCustomerSubPlan from "@/models/general/commAndSubs/AddCustomerSubPlan";
import DeleteCustomerSubPlan from "@/models/general/commAndSubs/DeleteCustomerSubPlan";
import EditCustomerSubPlan from "@/models/general/commAndSubs/EditCustomerSubPlan";

const CustomerSubscriptionPlans = () => {
  const [formData, setFormData] = useState({
    planId: null,
    userId: "",
    paymentMode: "Online",
  });
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-customer-subscription-plan"],
    queryFn: () => fetchAllSubscriptionPlansOfCustomer(navigate),
  });

  const handlePayment = useMutation({
    mutationKey: ["customer-sub-payment"],
    mutationFn: () =>
      initiateSubscriptionPaymentForCustomer(formData, navigate),
    onSuccess: (data) => {
      const { orderId, amount, currentPlan, paymentMode, userId } = data;

      if (paymentMode === "Cash") {
        toaster.create({
          title: "Success",
          description: "Subscription payment will be validated by the admin.",
          type: "success",
        });
        return;
      }

      handleVerifyPaymentMutation.mutate({
        orderId,
        amount,
        currentPlan,
        paymentMode,
        userId,
      });
    },
  });

  const handleVerifyPaymentMutation = useMutation({
    mutationKey: ["verify-customer-sub-payment"],
    mutationFn: ({ orderId, amount, currentPlan, paymentMode, userId }) =>
      verifyRazorpayPaymentForSubscription(
        orderId,
        amount,
        currentPlan,
        paymentMode,
        userId,
        navigate
      ),
    onSuccess: () => {
      setFormData({
        planId: null,
        userId: "",
        paymentMode: "Online",
      });
      toaster.create({
        title: "Success",
        description: "Subscription payment is successfully verified.",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in verifying payment",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      edit: false,
      delete: false,
    });
  };

  return (
    <>
      <h1 className="px-5 pt-5 pb-5 mt-[30px] bg-white font-semibold text-[18px]">
        Customers
      </h1>

      <div className="flex item-center p-5 rounded-lg bg-white my-4 mx-5">
        <label className="hidden lg:block w-1/3">
          Customer Subscription Setup
        </label>

        <button
          className="flex items-center gap-2 bg-zinc-200 p-2 rounded-lg w-full lg:w-fit justify-center lg:justify-start"
          onClick={() => toggleModal("add")}
        >
          <RenderIcon iconName="PlusIcon" size={16} loading={6} />
          Add New Customer Subscription Plan
        </button>
      </div>

      <div className="bg-white mx-5 p-5 pb-10 rounded-lg">
        <h1 className="text-[16px] font-[600]">Apply Subscription</h1>

        <div className="flex flex-col lg:flex-row mt-10">
          <label className="w-full lg:w-1/3 mb-[20px] lg:mb-0">
            Available Subscription Plans
          </label>
          <div className="w-full lg:w-fit grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 cursor-pointer">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <ShowSpinner /> <p> Loading...</p>
              </div>
            ) : isError ? (
              <div>
                <Error />
              </div>
            ) : data?.length === 0 ? (
              <p className="text-[18px] font-[500]">
                No Subscription plans available
              </p>
            ) : (
              data?.map((plan) => (
                <div
                  key={plan.planId}
                  onClick={() =>
                    setFormData({ ...formData, planId: plan.planId })
                  }
                  className={`bg-zinc-50 rounded-lg flex p-3 ${formData.planId === plan.planId ? `border-teal-700 border-2` : `border-gray-200 border-2`}`}
                >
                  <div className="flex flex-col gap-5 w-[300px]">
                    <div className="flex flex-col flex-1 gap-5">
                      <p>
                        Plan name:
                        <span className="font-[700] ms-2">{plan.name}</span>
                      </p>
                      <p>
                        Amount:
                        <span className="font-[700] ml-1">{plan.amount}</span>
                      </p>

                      <p>
                        Duration:{" "}
                        <span className="font-[700]">{plan.duration}</span>
                      </p>
                      <p>
                        Remainder:{" "}
                        <span className="font-[700]">
                          {plan.renewalReminder}
                        </span>
                      </p>

                      <p>
                        Tax name:{" "}
                        <span className="font-[700]">
                          {plan?.taxName || "-"}
                        </span>
                      </p>

                      <p>
                        No of Orders:{" "}
                        <span className="font-[700]">{plan.noOfOrder}</span>
                      </p>

                      <p>{plan.description}</p>
                    </div>

                    <div className="flex my-4 items-center gap-[20px]">
                      <button
                        className="bg-blue-50 flex flex-1 items-center justify-center rounded-3xl p-3"
                        onClick={() => toggleModal("edit", plan.planId)}
                      >
                        <RenderIcon iconName="EditIcon" size={16} loading={6} />
                        <span>Edit</span>
                      </button>

                      <button
                        className="bg-teal-800 flex flex-1 items-center justify-center rounded-3xl p-3 text-white"
                        onClick={() => toggleModal("delete", plan.planId)}
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={16}
                          loading={6}
                        />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {formData.planId === plan.planId && (
                    <div className="border-teal-700 border-4 h-6 w-6 rounded-full "></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-[20px] md:gap-0 mt-5 items-center">
          <label className="w-1/3 text-gray-800">Customer Id</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            placeholder="Enter customer ID"
            className="border-2 border-gray-200 rounded p-2 w-full md:w-1/3 focus:outline-none"
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
        </div>

        <div className="flex mt-5">
          <div className="w-1/3">
            <label className="flex items-center">Payment Mode</label>
          </div>

          <RadioGroup
            value={formData.paymentMode}
            onValueChange={(e) =>
              setFormData({ ...formData, paymentMode: e.value })
            }
            className="w-2/3"
            size="sm"
            colorPalette="teal"
            variant="solid"
          >
            <HStack gap="8" direction="row">
              <Radio value="Online" className="cursor-pointer">
                Online
              </Radio>
            </HStack>
          </RadioGroup>
        </div>

        <button
          disabled={handlePayment.isPending}
          className="bg-teal-800 w-full lg:w-1/3 p-2 text-white rounded-lg mt-5 lg:ml-[33%]"
          onClick={() => handlePayment.mutate()}
        >
          {handlePayment.isPending ? `Applying...` : `Apply`}
        </button>
      </div>

      {/* Models */}
      <AddCustomerSubPlan isOpen={modal.add} onClose={closeModal} />
      <EditCustomerSubPlan
        isOpen={modal.edit}
        onClose={closeModal}
        planId={selectedId}
      />
      <DeleteCustomerSubPlan
        isOpen={modal.delete}
        onClose={closeModal}
        planId={selectedId}
      />
    </>
  );
};

export default CustomerSubscriptionPlans;
