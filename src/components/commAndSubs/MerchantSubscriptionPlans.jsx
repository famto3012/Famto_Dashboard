import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import { HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import {
  fetchAllSubscriptionPlansOfMerchant,
  fetchCurrentSubscriptionPlan,
  initiateSubscriptionPaymentForMerchant,
  verifyRazorpayPaymentForSubscription,
} from "@/hooks/commAndSubs/useSubscription";
import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";

import AddMerchantSubPlan from "@/models/general/commAndSubs/AddMerchantSubPlan";
import EditMerchantSubPlan from "@/models/general/commAndSubs/EditMerchantSubPlan";
import DeleteMerchantSubPlan from "@/models/general/commAndSubs/DeleteMerchantSubPlan";

const MerchantSubscriptionPlans = () => {
  const [formData, setFormData] = useState({
    planId: null,
    userId: null,
    paymentMode: "Online",
  });
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-merchant-subscription-plan"],
    queryFn: () => fetchAllSubscriptionPlansOfMerchant(navigate),
  });

  const {
    data: allMerchants,
    isLoading: merchantLoading,
    isError: merchantError,
  } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: role !== "Merchant",
  });

  const {
    data: currentPlan,
    isLoading: currentPlanLoading,
    isError: currentPlanError,
  } = useQuery({
    queryKey: ["current-merchant-sub-plan"],
    queryFn: () => fetchCurrentSubscriptionPlan(navigate),
    enabled: role === "Merchant",
  });

  const handlePayment = useMutation({
    mutationKey: ["merchant-sub-payment"],
    mutationFn: () =>
      initiateSubscriptionPaymentForMerchant(role, formData, navigate),
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
    mutationKey: ["verify-merchant-sub-payment"],
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
        userId: null,
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

  const merchantOptions = allMerchants?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

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
      {role !== "Merchant" && (
        <div className="bg-white mx-5 p-5 rounded-lg my-5">
          <div className="flex flex-col lg:flex-row items-center">
            <label className="hidden lg:block w-1/3">
              Merchant Subscription Setup
            </label>

            <button
              className="flex items-center gap-2 bg-zinc-200 p-2 rounded-lg w-full lg:w-fit justify-center lg:justify-start"
              onClick={() => toggleModal("add")}
            >
              <RenderIcon iconName="PlusIcon" size={16} loading={6} />
              Add New Merchant Subscription Plan
            </button>
          </div>
        </div>
      )}

      <div className="bg-white mx-5 p-5 pb-10 rounded-lg mt-5">
        <div className="flex justify-between items-center">
          <h1 className="text-[16px] font-[600]">Apply Subscription</h1>
          <Link
            className="bg-teal-800 p-3 rounded-xl text-white w-[175px] text-center"
            to="http://famto.in/subscriptions"
          >
            Website preview
          </Link>
        </div>

        {role === "Merchant" && (
          <div className="mt-[20px] flex flex-col lg:flex-row items-center">
            <label className="w-1/3">Current Subscription Plan</label>

            <div className="border w-fit p-3 pe-[20px] rounded-md flex items-center gap-x-5">
              <RenderIcon iconName="InfoIcon" size={20} loading={6} />

              {currentPlan?.planName && currentPlan?.daysLeft ? (
                <div className="flex items-center">
                  <div className="flex flex-col border-r-2 border-r-zinc-950 pe-[20px]">
                    <span>Plan Name</span>
                    <span className="text-black font-[500] text-[18px]">
                      {currentPlan?.planName}
                    </span>
                  </div>

                  <div className="flex flex-col ps-[20px]">
                    <span>Days Left</span>
                    <span className="text-black font-[500] text-[18px]">
                      {currentPlan?.daysLeft}
                    </span>
                  </div>
                </div>
              ) : (
                <p>No active subscription plan</p>
              )}
            </div>
          </div>
        )}

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
                        <span className="font-[700] ms-2 max-w-[20ch] truncate whitespace-nowrap overflow-hidden">
                          {plan.name}
                        </span>
                      </p>
                      <p>
                        Amount:
                        <span className="font-[700] ml-1">{plan.amount}</span>
                      </p>

                      <p>
                        Duration:{" "}
                        <span className="font-[700]">{plan.duration}</span>
                      </p>

                      {role !== "Merchant" && (
                        <>
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

                          <p className="">{plan.description}</p>
                        </>
                      )}
                    </div>

                    {role !== "Merchant" && (
                      <div className="flex my-4 items-center gap-[20px]">
                        <button
                          className="bg-blue-50 flex flex-1 items-center justify-center rounded-3xl p-3"
                          onClick={() => toggleModal("edit", plan.planId)}
                        >
                          <RenderIcon
                            iconName="EditIcon"
                            size={16}
                            loading={6}
                          />
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
                    )}
                  </div>

                  {formData.planId === plan.planId && (
                    <div className="border-teal-700 border-4 h-6 w-6 rounded-full "></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {role !== "Merchant" && (
          <div className="flex gap-[20px] md:gap-0 mt-5 items-center">
            <label className="w-1/3 text-gray-800">Merchant Id</label>

            <Select
              options={merchantOptions}
              value={merchantOptions?.find(
                (option) => option.value === formData.userId
              )}
              onChange={(option) =>
                setFormData({ ...formData, userId: option.value })
              }
              className="rounded w-full md:w-1/3 focus:outline-none"
              placeholder="Select merchant"
              menuPlacement="top"
              isSearchable={true}
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
        )}

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
              <Radio value="Cash" className="cursor-pointer">
                Cash
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
      <AddMerchantSubPlan isOpen={modal.add} onClose={closeModal} />
      <EditMerchantSubPlan
        isOpen={modal.edit}
        onClose={closeModal}
        planId={selectedId}
      />
      <DeleteMerchantSubPlan
        isOpen={modal.delete}
        onClose={closeModal}
        planId={selectedId}
      />
    </>
  );
};

export default MerchantSubscriptionPlans;
