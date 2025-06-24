import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";

import {
  fetchLoyaltyPointDetail,
  updateLoyaltyPointDetail,
  updateLoyaltyPointStatus,
} from "@/hooks/loyaltyPoint/loyaltyPoint";

import RenderIcon from "@/icons/RenderIcon";

const LoyaltyPoint = () => {
  const [formData, setFormData] = useState({
    earningCriteriaRupee: "",
    earningCriteriaPoint: "",
    minOrderAmountForEarning: "",
    maxEarningPointPerOrder: "",
    expiryDuration: "",
    redemptionCriteriaPoint: "",
    redemptionCriteriaRupee: "",
    minOrderAmountForRedemption: "",
    minLoyaltyPointForRedemption: "",
    maxRedemptionAmountPercentage: "",
    status: null,
  });
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: loyaltyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loyalty-data"],
    queryFn: () => fetchLoyaltyPointDetail(navigate),
  });

  const toggleUpdateLoyaltyStatus = useMutation({
    mutationKey: ["update-loyalty-point-status"],
    mutationFn: () => updateLoyaltyPointStatus(navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["loyalty-data"]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Updated loyalty point status",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating loyalty point status",
        type: "error",
      });
    },
  });

  const handleUpdateLoyaltyPoint = useMutation({
    mutationKey: ["update-loyalty-point"],
    mutationFn: (formData) => updateLoyaltyPointDetail(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["loyalty-data"]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Updated loyalty point detail",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating loyalty point detail",
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    loyaltyData && setFormData(loyaltyData);
  }, [loyaltyData]);

  useEffect(() => {
    if (loyaltyData) {
      const isModified = Object.keys(formData).some(
        (key) => formData[key] !== loyaltyData[key]
      );
      setShowButton(isModified);
    }
  }, [formData, loyaltyData]);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">Error</div>
    );

  return (
    // <div className="bg-gray-100 h-full">
    //   <GlobalSearch />

    //   <div className="flex items-center justify-between mx-10 mt-5">
    //     <h1 className="text-xl font-semibold">Loyalty Point</h1>
    //     <Switch
    //       colorPalette="teal"
    //       checked={loyaltyData.status}
    //       onChange={() => toggleUpdateLoyaltyStatus.mutate()}
    //     />
    //   </div>

    //   <p className="mt-5 mx-10 text-[17px] text-gray-500">
    //     Loyalty points are a bonus incentive scheme used to keep customers
    //     dedicated to your platform. Here you can define a variety of things like
    //     the earning criteria, the redemption criteria, the expiry time of
    //     points, maximum earning points, minimum order amount above which loyalty
    //     points can be applied and many more.
    //   </p>

    //   <div className="bg-white p-10 rounded-lg mx-11 mt-7">
    //     <div className="flex flex-col gap-6">
    //       <div className="flex items-center relative">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="earningCriteriaRupee"
    //         >
    //           Earning Criteria
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>

    //         {/* <span className=" text-black rounded-md me-[5px]"> */}
    //         <RenderIcon iconName="PricingIcon" size={16} loading={6} />
    //         {/* </span> */}
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3  outline-none focus:outline-none w-[32%] "
    //           type="text"
    //           value={formData?.earningCriteriaRupee}
    //           id="earningCriteriaRupee"
    //           name="earningCriteriaRupee"
    //           onChange={handleInputChange}
    //         />

    //         <span className="mx-2 font-bold">=</span>

    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-[32%]"
    //           type="text"
    //           value={formData?.earningCriteriaPoint}
    //           id="earningCriteriaPoint"
    //           name="earningCriteriaPoint"
    //           onChange={handleInputChange}
    //         />
    //         <span className="ml-3 font-bold">points</span>
    //       </div>
    //       <div className="flex items-center">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="minOrderAmountForEarning"
    //         >
    //           Minimum Order Amount for Earning
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-2/3"
    //           type="text"
    //           value={formData?.minOrderAmountForEarning}
    //           id="minOrderAmountForEarning"
    //           name="minOrderAmountForEarning"
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div className="flex items-center">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="maxEarningPointPerOrder"
    //         >
    //           Maximum Earning Points
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-2/3 "
    //           type="text"
    //           value={formData?.maxEarningPointPerOrder}
    //           id="maxEarningPointPerOrder"
    //           name="maxEarningPointPerOrder"
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div className="flex items-center">
    //         <label className="w-1/3 text-gray-500" htmlFor="expiryDuration">
    //           Expiry Duration Days
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-2/3 "
    //           type="text"
    //           value={formData?.expiryDuration}
    //           id="expiryDuration"
    //           name="expiryDuration"
    //           onChange={handleInputChange}
    //         />
    //       </div>

    //       <div className="flex items-center relative">
    //         <label
    //           className="w-full sm:w-1/2 lg:w-1/3 text-gray-500 lg:mr-[40px] xl:mr-0"
    //           htmlFor="redemptionCriteriaPoint"
    //         >
    //           Redemption Criteria
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-[27%] "
    //           type="text"
    //           value={formData?.redemptionCriteriaPoint}
    //           id="redemptionCriteriaPoint"
    //           name="redemptionCriteriaPoint"
    //           onChange={handleInputChange}
    //         />
    //         <span className="ml-3 font-bold">points</span>
    //         <span className="ml-3 mr-3 font-bold">=</span>
    //         {/* <span className=" text-black rounded-md me-4"> */}
    //         <RenderIcon iconName="PricingIcon" size={16} loading={6} />
    //         {/* </span> */}
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-[27%] "
    //           type="text"
    //           value={formData?.redemptionCriteriaRupee}
    //           id="redemptionCriteriaRupee"
    //           name="redemptionCriteriaRupee"
    //           onChange={handleInputChange}
    //         />
    //       </div>

    //       <div className="flex items-center">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="minOrderAmountForRedemption"
    //         >
    //           Minimum Order Amount for Redemption
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full md:w-2/3"
    //           type="text"
    //           value={formData?.minOrderAmountForRedemption}
    //           id="minOrderAmountForRedemption"
    //           name="minOrderAmountForRedemption"
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div className="flex items-center">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="minLoyaltyPointForRedemption"
    //         >
    //           Minimum Loyalty Point for Redemption
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full md:w-2/3"
    //           type="text"
    //           value={formData?.minLoyaltyPointForRedemption}
    //           id="minLoyaltyPointForRedemption"
    //           name="minLoyaltyPointForRedemption"
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div className="flex items-center">
    //         <label
    //           className="w-1/3 text-gray-500"
    //           htmlFor="maxRedemptionAmountPercentage"
    //         >
    //           Maximum Redemption Amount Percentage
    //           <span className="text-red-600 ml-2">*</span>
    //         </label>
    //         <input
    //           className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full md:w-2/3"
    //           type="text"
    //           value={formData?.maxRedemptionAmountPercentage}
    //           id="maxRedemptionAmountPercentage"
    //           name="maxRedemptionAmountPercentage"
    //           onChange={handleInputChange}
    //         />
    //       </div>

    //       {showButton && (
    //         <div className="flex justify-end gap-4 mt-6">
    //           <button
    //             className="bg-teal-700 text-white py-2 px-10 rounded-md outline-none focus:outline-none"
    //             onClick={() => handleUpdateLoyaltyPoint.mutate(formData)}
    //           >
    //             {handleUpdateLoyaltyPoint.isPending ? `Saving...` : `Save`}
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex items-center justify-between mx-10 mt-5">
        <h1 className="text-xl font-semibold">Loyalty Point</h1>
        <Switch
          colorPalette="teal"
          checked={loyaltyData.status}
          onChange={() => toggleUpdateLoyaltyStatus.mutate()}
        />
      </div>

      <p className="mt-5 mx-10 text-[17px] text-gray-500">
        Loyalty points are a bonus incentive scheme used to keep customers
        dedicated to your platform. Here you can define a variety of things like
        the earning criteria, the redemption criteria, the expiry time of
        points, maximum earning points, minimum order amount above which loyalty
        points can be applied and many more.
      </p>

      <div className="bg-white p-10 rounded-lg mx-11 mt-7">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center relative">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="earningCriteriaRupee"
            >
              Earning Criteria
              <span className="text-red-600 ml-2">*</span>
            </label>

            <div className="flex items-center w-full sm:w-[27%] mt-3 sm:mt-0">
              <RenderIcon iconName="PricingIcon" size={16} loading={6} />
              <input
                className="border-2 border-gray-300 rounded p-2 pl-3 ml-3 outline-none focus:outline-none w-full"
                type="text"
                value={formData?.earningCriteriaRupee}
                id="earningCriteriaRupee"
                name="earningCriteriaRupee"
                onChange={handleInputChange}
              />
            </div>

            <span className="mx-3 font-bold">=</span>

            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-[31%]"
              type="text"
              value={formData?.earningCriteriaPoint}
              id="earningCriteriaPoint"
              name="earningCriteriaPoint"
              onChange={handleInputChange}
            />
            <span className="ml-3 font-bold">points</span>
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="minOrderAmountForEarning"
            >
              Minimum Order Amount for Earning
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.minOrderAmountForEarning}
              id="minOrderAmountForEarning"
              name="minOrderAmountForEarning"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="maxEarningPointPerOrder"
            >
              Maximum Earning Points
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.maxEarningPointPerOrder}
              id="maxEarningPointPerOrder"
              name="maxEarningPointPerOrder"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="expiryDuration"
            >
              Expiry Duration Days
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.expiryDuration}
              id="expiryDuration"
              name="expiryDuration"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-wrap items-center relative">
            <label
              className="w-full sm:w-1/2 lg:w-1/3 text-gray-500"
              htmlFor="redemptionCriteriaPoint"
            >
              Redemption Criteria
              <span className="text-red-600 ml-2">*</span>
            </label>

            <div className="flex items-center w-full sm:w-[29%] mt-3 sm:mt-0">
              <input
                className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full"
                type="text"
                value={formData?.redemptionCriteriaPoint}
                id="redemptionCriteriaPoint"
                name="redemptionCriteriaPoint"
                onChange={handleInputChange}
              />
              <span className="ml-3 font-bold">points</span>
            </div>

            <span className="ml-3 mr-3 font-bold">=</span>

            <div className="flex items-center w-full sm:w-[34%]">
              <RenderIcon iconName="PricingIcon" size={16} loading={6} />
              <input
                className="border-2 border-gray-300 rounded p-2 pl-3 ml-3 outline-none focus:outline-none w-full"
                type="text"
                value={formData?.redemptionCriteriaRupee}
                id="redemptionCriteriaRupee"
                name="redemptionCriteriaRupee"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="minOrderAmountForRedemption"
            >
              Minimum Order Amount for Redemption
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.minOrderAmountForRedemption}
              id="minOrderAmountForRedemption"
              name="minOrderAmountForRedemption"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="minLoyaltyPointForRedemption"
            >
              Minimum Loyalty Point for Redemption
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.minLoyaltyPointForRedemption}
              id="minLoyaltyPointForRedemption"
              name="minLoyaltyPointForRedemption"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <label
              className="w-full sm:w-1/3 text-gray-500"
              htmlFor="maxRedemptionAmountPercentage"
            >
              Maximum Redemption Amount Percentage
              <span className="text-red-600 ml-2">*</span>
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 pl-3 outline-none focus:outline-none w-full sm:w-2/3"
              type="text"
              value={formData?.maxRedemptionAmountPercentage}
              id="maxRedemptionAmountPercentage"
              name="maxRedemptionAmountPercentage"
              onChange={handleInputChange}
            />
          </div>

          {showButton && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-teal-700 text-white py-2 px-10 rounded-md outline-none focus:outline-none"
                onClick={() => handleUpdateLoyaltyPoint.mutate(formData)}
              >
                {handleUpdateLoyaltyPoint.isPending ? `Saving...` : `Save`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoint;
