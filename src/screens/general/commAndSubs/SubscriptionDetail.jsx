import { useContext } from "react";

import AuthContext from "@/context/AuthContext";

import AdminSubscription from "@/components/commAndSubs/AdminSubscription";
import MerchantSubscription from "@/components/commAndSubs/MerchantSubscription";

const SubscriptionDetail = () => {
  const { role } = useContext(AuthContext);

  if (role !== "Merchant") {
    return <AdminSubscription />;
  } else {
    return <MerchantSubscription />;
  }
};

export default SubscriptionDetail;
