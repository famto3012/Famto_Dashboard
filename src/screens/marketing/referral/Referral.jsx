import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HStack } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";
import ShowSpinner from "@/components/others/ShowSpinner";
import ReferralTable from "@/components/referral/ReferralTable";

import {
  fetchReferralData,
  updateReferralData,
  updateReferralStatus,
} from "@/hooks/referral/useReferral";

const Referral = () => {
  const [formData, setFormData] = useState({
    referralType: "Flat-discount",
    referrerDiscount: "",
    referrerMaxDiscountValue: "",
    referrerAppHeadingAndDescription: "",
    refereeDiscount: "",
    refereeMaxDiscountValue: "",
    minOrderAmount: "",
    refereeDescription: "",
    status: null,
    referralCodeOnCustomerSignUp: null,
  });
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["referral-data", formData.referralType],
    queryFn: ({ queryKey }) => {
      const [_, key] = queryKey;
      return fetchReferralData(key, navigate);
    },
    placeholderData: keepPreviousData,
  });

  const updateReferralDetail = useMutation({
    mutationKey: ["update-referral"],
    mutationFn: (data) => updateReferralData(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["referral-data", formData.referralType]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Updated referral data",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating referral data",
        type: "error",
      });
    },
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-referral-status"],
    mutationFn: (data) => updateReferralStatus(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["referral-data"]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Updated referral status",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating referral status",
        type: "error",
      });
    },
  });

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  useEffect(() => {
    if (data) {
      const isModified = Object.keys(formData).some(
        (key) => formData[key] !== data[key]
      );
      setShowButton(isModified);
    }
  }, [formData, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="bg-gray-100 h-[100%]">
      <GlobalSearch />

      <h1 className="font-bold text-[18px] sm:text-[20px] md:text-[24px] ms-5 mt-[30px] text-left">
        Referral
      </h1>

      <p className="mx-5 text-gray-500 mt-5 text-center sm:text-left text-sm sm:text-base md:text-lg">
        Define referral code that customers can use to refer new customers
        coming on your platform. Referral code defined here is applied on
        checkout while placing the order. <br /> Note: Referrer - who shares;
        Referee - who receives
      </p>

      <div className="bg-white my-5 p-5 rounded-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label>
              Referral Type<span className="text-red-600 ml-2">*</span>
            </label>
          </div>

          <RadioGroup
            value={formData.referralType}
            onValueChange={(e) =>
              setFormData({ ...formData, referralType: e.value })
            }
            className="w-full sm:w-2/3"
            size="sm"
            colorPalette="teal"
            variant="solid"
          >
            <HStack gap="8" direction="row">
              <Radio value="Flat-discount" className="cursor-pointer">
                Flat discount
              </Radio>
              <Radio value="Percentage-discount" className="cursor-pointer">
                Percentage discount
              </Radio>
            </HStack>
          </RadioGroup>
        </div>

        <div className="flex flex-col sm:flex-row mt-5">
          <label className="w-full sm:w-1/2">
            Referrer Discount<span className="text-red-600 ml-2">*</span>
          </label>

          <input
            type="text"
            name="referrerDiscount"
            value={formData.referrerDiscount}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
          />
        </div>

        {formData.referralType === "Percentage-discount" && (
          <div className="flex flex-col sm:flex-row mt-5">
            <label className="w-full sm:w-1/2">
              Referrer maximum discount value
              <span className="text-red-600 ml-2">*</span>
            </label>

            <input
              type="text"
              name="referrerMaxDiscountValue"
              value={formData.referrerMaxDiscountValue}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row mt-5">
          <label className="w-full sm:w-1/2">
            Referrer App Heading Description
            <span className="text-red-600 ml-2">*</span>
          </label>

          <input
            type="text"
            name="referrerAppHeadingAndDescription"
            value={formData.referrerAppHeadingAndDescription}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row mt-5">
          <label className="w-full sm:w-1/2">
            Referee discount<span className="text-red-600 ml-2">*</span>
          </label>

          <input
            type="text"
            name="refereeDiscount"
            value={formData.refereeDiscount}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
          />
        </div>

        {formData.referralType === "Percentage-discount" && (
          <div className="flex flex-col sm:flex-row mt-5">
            <label className="w-full sm:w-1/2">
              Referee maximum discount value
              <span className="text-red-600 ml-2">*</span>
            </label>

            <input
              type="text"
              name="refereeMaxDiscountValue"
              value={formData.refereeMaxDiscountValue}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row mt-5">
          <label className="w-full sm:w-1/2">
            Minimum order amount
            <span className="text-red-600 ml-2">*</span>
          </label>

          <input
            type="text"
            name="minOrderAmount"
            value={formData.minOrderAmount}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row mt-5">
          <label className="w-full sm:w-1/2">
            Referee description
            <span className="text-red-600 ml-2">*</span>
          </label>

          <input
            type="text"
            name="refereeDescription"
            value={formData.refereeDescription}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded w-full sm:w-2/3 mt-2 sm:mt-0 p-2 outline-none focus:outline-none"
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row">
          <label className="w-full sm:w-1/2">
            Status<span className="text-red-600 ml-2">*</span>
          </label>

          <div className="w-full sm:w-2/3">
            {toggleStatus.isPending ? (
              <div className="flex justify-start">
                <ShowSpinner />
              </div>
            ) : (
              <Switch
                colorPalette="teal"
                checked={formData.status}
                onChange={() => toggleStatus.mutate(formData.referralType)}
              />
            )}
          </div>
        </div>

        {showButton && (
          <div className="flex justify-end mt-10 mb-2 gap-[15px]">
            <button
              onClick={() => updateReferralDetail.mutate(formData)}
              className="bg-teal-800 rounded-lg px-8 py-2 right-5 mb-5 text-white font-semibold justify-end"
            >
              {updateReferralDetail.isPending ? `Saving...` : `Save`}
            </button>
          </div>
        )}
      </div>

      <ReferralTable />
    </div>
  );
};

export default Referral;
