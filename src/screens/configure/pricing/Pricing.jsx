import { useState } from "react";
import GlobalSearch from "@/components/others/GlobalSearch";
import AgentPricing from "@/components/pricing/AgentPricing";
import AgentSurge from "@/components/pricing/AgentSurge";
import CustomerPricing from "@/components/pricing/CustomerPricing";
import CustomerSurge from "@/components/pricing/CustomerSurge";

const Pricing = () => {
  const [active, setActive] = useState("agent-pricing");

  const tabs = [
    { id: "agent-pricing", label: "Agent Pricing" },
    { id: "agent-surge", label: "Agent Surge" },
    { id: "customer-pricing", label: "Customer Pricing" },
    { id: "customer-surge", label: "Customer Surge" },
  ];

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex items-center gap-2 mx-9 mt-5 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-teal-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "agent-pricing" && <AgentPricing />}
      {active === "agent-surge" && <AgentSurge />}
      {active === "customer-pricing" && <CustomerPricing />}
      {active === "customer-surge" && <CustomerSurge />}
    </div>
  );
};

export default Pricing;