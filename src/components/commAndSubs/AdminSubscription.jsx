import CustomerSubscriptionPlans from "@/components/commAndSubs/CustomerSubscriptionPlans";
import MerchantSubscriptionPlans from "@/components/commAndSubs/MerchantSubscriptionPlans";

const AdminSubscription = () => {
  return (
    <>
      <h1 className="my-5 p-5 bg-white font-semibold text-[18px]">Merchant</h1>

      <MerchantSubscriptionPlans />

      <CustomerSubscriptionPlans />
    </>
  );
};

export default AdminSubscription;
