import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/AuthContext";
import { fetchCommissionOfMerchant } from "@/hooks/commAndSubs/useCommission";

const MerchantCommission = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-comm-detail", userId],
    queryFn: () => fetchCommissionOfMerchant(navigate),
  });

  return (
    <div className="w-[30%] ms-[30px] mt-[50px]">
      {data?.commissionType && data?.commissionValue ? (
        <div className="shadow-md bg-white h-fit p-4 w-full flex justify-between gap-5 rounded">
          <p className="w-[150px]">Commission value</p>
          <p className="w-[150px] text-end">
            {data?.commissionType === "Percentage"
              ? `${data?.commissionValue} %`
              : `₹${data?.commissionValue}`}
          </p>
        </div>
      ) : (
        <div className="flex">
          <p className="text-[16px] font-[600] mx-auto mt-[50px]">
            No Commission Available
          </p>
        </div>
      )}
    </div>
  );
};

export default MerchantCommission;
