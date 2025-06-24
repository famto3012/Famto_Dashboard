import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

import AuthContext from "@/context/AuthContext";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import MerchantDiscount from "@/components/discount/MerchantDiscount";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";
import ProductDiscount from "@/components/discount/ProductDiscount";

const Discount = () => {
  const [selectedMerchant, setSelectedMerchant] = useState({
    merchantId: "",
    merchantName: "",
  });

  const { role, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: allMerchants,
    isLoading: merchantLoading,
    isError: merchantError,
  } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
  });

  useEffect(() => {
    if (allMerchants?.length > 0) {
      setSelectedMerchant({
        merchantId: allMerchants[0]._id,
        merchantName: allMerchants[0].merchantName,
      });
    }
  }, [allMerchants]);

  const merchantOptions = allMerchants?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

  if (merchantLoading) return <Loader />;
  if (merchantError) return <Error />;

  return (
    <div className="bg-gray-100 h-[100%]">
      <GlobalSearch />

      <div className="flex justify-between mx-5 mt-[30px] focus:outline-none">
        {role !== "Merchant" && (
          <Select
            className="w-[200px] outline-none focus:outline-none"
            value={merchantOptions?.find(
              (option) => option.value === selectedMerchant.merchantId
            )}
            isMulti={false}
            isSearchable={true}
            onChange={(option) => {
              setSelectedMerchant({
                merchantId: option.value,
                merchantName: option.label,
              });
            }}
            options={merchantOptions}
            placeholder="Select Merchant"
            isClearable={false}
          />
        )}
      </div>

      <MerchantDiscount selectedMerchant={selectedMerchant} />

      <ProductDiscount selectedMerchant={selectedMerchant} />
    </div>
  );
};

export default Discount;
