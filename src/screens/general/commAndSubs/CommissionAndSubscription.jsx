import { useState } from "react";
import { Link } from "react-router-dom";

import GlobalSearch from "@/components/others/GlobalSearch";

import CommissionDetail from "@/screens/general/commAndSubs/CommissionDetail";
import SubscriptionDetail from "@/screens/general/commAndSubs/SubscriptionDetail";

const CommissionAndSubscription = () => {
  const [selected, setSelected] = useState("Commission");

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between mt-[30px] mx-[30px] gap-[20px] lg:gap-0">
        <label className="inline-flex items-center p-1 outline outline-gray-500 rounded-3xl border-gray-700 bg-gray-100  cursor-pointer w-full lg:w-fit">
          <span
            onClick={() => setSelected("Commission")}
            className={`flex-1 text-center px-4 py-2 rounded-3xl transition-all ${selected === "Commission" ? `bg-teal-700 text-white` : `text-black`}`}
          >
            Commission
          </span>
          <span
            onClick={() => setSelected("Subscription")}
            className={`flex-1 text-center px-4 py-2 rounded-3xl transition-all ${selected === "Subscription" ? `bg-teal-700 text-white` : `text-black`}`}
          >
            Subscription
          </span>
        </label>

        {selected === "Commission" ? (
          <button className="bg-teal-800 p-3 rounded-xl text-white w-full lg:w-fit">
            <Link to="/comm-and-subs/commission-log"> View Commission log</Link>
          </button>
        ) : (
          <button className="bg-teal-800 p-3 rounded-xl text-white w-full lg:w-fit">
            <Link to="/comm-and-subs/subscription-log">
              View Subscription log
            </Link>
          </button>
        )}
      </div>

      {selected === "Commission" ? (
        <CommissionDetail />
      ) : (
        <SubscriptionDetail />
      )}
    </div>
  );
};

export default CommissionAndSubscription;
