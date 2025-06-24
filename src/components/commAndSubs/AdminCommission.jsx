import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";
import { applyCommissionToMerchant } from "@/hooks/commAndSubs/useCommission";

const AdminCommission = () => {
  const [formData, setFormData] = useState({
    commissionType: "Percentage",
    merchantId: null,
    commissionValue: "",
  });

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
  });

  const handleApplyCommission = useMutation({
    mutationKey: ["apply-commission"],
    mutationFn: () => applyCommissionToMerchant(formData, navigate),
    onSuccess: () => {
      setFormData({
        commissionType: "Percentage",
        merchantId: null,
        commissionValue: "",
      });
      toaster.create({
        title: "Success",
        description: "Commission applied to merchant successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while applying commission to merchant",
        type: "Error",
      });
    },
  });

  const merchantOptions = data?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="bg-white rounded  lg:w-[40%] p-5 mx-[20px] lg:ms-[30px] mt-[50px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row items-center gap-[20px] lg:gap-0">
          <label className="w-full lg:w-1/3 text-gray-600">
            Commission setup
          </label>

          <RadioGroup
            value={formData.commissionType}
            onValueChange={(e) =>
              setFormData({ ...formData, commissionType: e.value })
            }
            className="w-full lg:w-2/3"
            size="sm"
            colorPalette="teal"
            variant="solid"
          >
            <HStack gap="8" direction="row">
              <Radio value="Fixed" className="cursor-pointer">
                Fixed
              </Radio>
              <Radio value="Percentage" className="cursor-pointer">
                Percentage
              </Radio>
            </HStack>
          </RadioGroup>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-[20px] lg:gap-0">
          <label className="w-full lg:w-1/3 text-gray-600">Merchant ID</label>

          <Select
            className="w-full lg:w-2/3 outline-none focus:outline-none"
            value={
              formData.merchantId
                ? merchantOptions?.find(
                    (option) => option.value === formData.merchantId
                  )
                : null
            }
            isSearchable
            onChange={(option) =>
              setFormData({
                ...formData,
                merchantId: option ? option.value : null,
              })
            }
            options={merchantOptions}
            placeholder="Select Merchant"
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-[20px] lg:gap-0">
          <label className="w-full lg:w-1/3 text-gray-600">
            Commission Value
          </label>
          <input
            type="number"
            id="commissionValue"
            name="commissionValue"
            value={formData.commissionValue}
            onChange={(e) =>
              setFormData({ ...formData, commissionValue: e.target.value })
            }
            className="w-full lg:w-2/3 p-2 border border-gray-300 rounded outline-none focus:outline-none"
            placeholder="Enter value"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleApplyCommission.mutate()}
            disabled={handleApplyCommission.isPending}
            className="w-full lg:w-2/3 bg-teal-700 text-white py-2 rounded outline-none focus:outline-none"
          >
            {handleApplyCommission.isPending ? `Applying...` : `Apply`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCommission;
