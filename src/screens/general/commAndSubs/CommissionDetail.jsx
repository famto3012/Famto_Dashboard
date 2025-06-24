import { useContext } from "react";

import AuthContext from "@/context/AuthContext";

import AdminCommission from "@/components/commAndSubs/AdminCommission";
import MerchantCommission from "@/components/commAndSubs/MerchantCommission";

const CommissionDetail = () => {
  const { role } = useContext(AuthContext);

  if (role !== "Merchant") {
    return <AdminCommission />;
  } else {
    return <MerchantCommission />;
  }
};

export default CommissionDetail;
