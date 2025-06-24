import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";

import useApiClient from "@/api/apiClient";
import AuthContext from "@/context/AuthContext";

import { HStack } from "@chakra-ui/react";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";

import { formatDate } from "@/utils/formatter";

import { initiateSponsorshipPayment } from "@/hooks/merchant/useMerchant";

const SponsorshipDetail = ({ detail, merchantId }) => {
  const [haveSponsorship, setHaveSponsorship] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { role, userId } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    detail?.sponsorshipStatus && setHaveSponsorship(detail?.sponsorshipStatus);
    detail?.currentPlan && setSelectedPlan(detail?.currentPlan);
  }, [detail]);

  const id = role === "Merchant" ? userId : merchantId;

  const handlePayment = useMutation({
    mutationKey: ["merchant-sponsor-payment"],
    mutationFn: () =>
      initiateSponsorshipPayment(
        { sponsorshipStatus: true, currentPlan: selectedPlan.value },
        id,
        navigate
      ),
    onSuccess: (data) => {
      const { orderId, amount, currentPlan } = data;

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Famto",
        description: "Sponsorship Payment",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          console.log({ response });

          const api = useApiClient(navigate);
          const res = await api.post(`/merchants/verify-payment/${id}`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            currentPlan,
          });

          if (res.status === 200) {
            queryClient.invalidateQueries(["merchant-detail", id]);
            toaster.create({
              title: "Success",
              description: "Sponsorship payment is successfully verified.",
              type: "success",
            });
          } else {
            toaster.create({
              title: "Error",
              description: "Error in verifying payment",
              type: "error",
            });
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#00CED1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in initiating payment",
        type: "error",
      });
    },
  });

  return (
    <>
      <div className="mb-6 flex w-fit lg:w-[1200px]">
        <div className="flex flex-col lg:flex-row items-start justify-between rounded">
          <h3 className="text-gray-700 mb-2 mt-3 lg:mt-0 md:w-1/3 order-1">
            Sponsorship Status
          </h3>

          <div
            className={`${
              detail?.currentPlan ? `visible` : ` invisible`
            } mb-4 lg:w-[30rem] p-5 justify-center text-center mx-[3.5rem] shadow-lg order-3 lg:order-2`}
          >
            <label className="block text-teal-700 font-[600] mb-[10px] text-[16px]">
              Current Chosen Plan
            </label>
            <div className="flex items-center gap-3 text-teal-700 text-[16px] font-[600]">
              <p className="">{detail?.currentPlan} plan</p> |
              <p>
                {formatDate(detail?.startDate)} - {formatDate(detail?.endDate)}
              </p>
            </div>
          </div>

          <Switch
            colorPalette="teal"
            checked={haveSponsorship}
            onCheckedChange={() => setHaveSponsorship(!haveSponsorship)}
            className="order-2 lg:order-3"
          />
        </div>
      </div>

      {haveSponsorship && (
        <div className="mb-6 flex flex-col md:flex-row md:w-[800px]">
          <h3 className="text-gray-700 mb-2 md:w-1/3">Choose or Renew Plan</h3>

          <div className="md:w-4/5">
            <div className="overflow-auto my-2">
              <RadioCardRoot
                colorPalette="teal"
                defaultValue={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value)}
              >
                <HStack align="stretch">
                  {[
                    { value: "299", label: "Monthly", price: "299" },
                    { value: "799", label: "3 Month", price: "799" },
                    { value: "1399", label: "6 Month", price: "1399" },
                    { value: "2999", label: "1 Year", price: "2999" },
                  ].map((item) => (
                    <RadioCardItem
                      label={item.label}
                      description={item.price}
                      key={item.value}
                      value={item.label || selectedPlan}
                      className="cursor-pointer"
                    />
                  ))}
                </HStack>
              </RadioCardRoot>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="bg-teal-700 text-white p-2 rounded-md w-[20rem] mt-4"
                onClick={() => {
                  console.log({ selectedPlan });
                  handlePayment.mutate();
                }}
              >
                Pay
              </button>

              <p className="md:w-[25rem] text-[14px] text-gray-700">
                Note: Choose the date range for showing your shop on top of the
                sheet and reach your customers more easily.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SponsorshipDetail;
