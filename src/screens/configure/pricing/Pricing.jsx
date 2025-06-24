import GlobalSearch from "@/components/others/GlobalSearch";
import AgentPricing from "@/components/pricing/AgentPricing";
import AgentSurge from "@/components/pricing/AgentSurge";
import CustomerPricing from "@/components/pricing/CustomerPricing";
import CustomerSurge from "@/components/pricing/CustomerSurge";

const Pricing = () => {
  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <AgentPricing />
      <AgentSurge />
      <CustomerPricing />
      <CustomerSurge />
    </div>
  );
};

export default Pricing;
