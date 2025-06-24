import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import GlobalSearch from "@/components/others/GlobalSearch";

import RenderIcon from "@/icons/RenderIcon";

import "react-datepicker/dist/react-datepicker.css";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";

import MerchantSubLog from "@/components/commAndSubs/MerchantSubLog";
import CustomerSubLog from "@/components/commAndSubs/CustomerSubLog";
import { subscriptionOptions } from "@/utils/defaultData";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import MerchantSubscriptionLogFilters from "@/components/SideFilters/MerchantSubscriptionLogFilters";

const SubscriptionLog = () => {
  const [selected, setSelected] = useState("Merchant");
  const [customerFilter, setCustomerFilter] = useState({
    name: "",
    date: null,
  });
  const [merchantFilter, setMerchantFilter] = useState({
    name: "",
    date: null,
    merchantId: null,
    status: null,
  });
  const [customerDebounce, setCustomerDebounce] = useState("");
  const [merchantDebounce, setMerchantDebounce] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);

  const { data: allMerchants } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: selected === "Merchant",
  });

  const merchantOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allMerchants)
      ? allMerchants.map((merchant) => ({
          label: merchant.merchantName,
          value: merchant._id,
        }))
      : []),
  ];

  useEffect(() => {
    if (role === "Merchant") {
      setMerchantFilter({ ...merchantFilter, merchantId: userId });
    }
  }, [role]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCustomerFilter((prevFilter) => ({
        ...prevFilter,
        name: customerDebounce,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [customerDebounce]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setMerchantFilter((prevFilter) => ({
        ...prevFilter,
        name: merchantDebounce,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [merchantDebounce]);

  const setFilerFromDrawer = (type, value) => {
    setMerchantFilter({ ...merchantFilter, [type]: value });
  };
  return (
    <div className="bg-gray-100 h-full min-w-full">
      <GlobalSearch />

      <div className="flex justify-between items-center mx-[20px] lg:mx-[30px]">
        <div className="flex items-center mt-[20px] lg:mt-0">
          <span onClick={() => navigate("/comm-and-subs")}>
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>

          <span className="text-lg font-semibold ml-3">Subscription log</span>
        </div>
      </div>

      <div className="mx-[20px] lg:mx-[30px] my-5">
        <div
          className={`flex flex-col lg:flex-row gap-[20px] lg:gap-0 items-center bg-white p-4 rounded-md ${
            role !== "Merchant" ? "justify-between" : "justify-end pe-4"
          }`}
        >
          {role !== "Merchant" && (
            <label className="flex outline-none cursor-pointer bg-transparent border border-black p-1 rounded-full w-full lg:w-fit">
              <span
                onClick={() => setSelected("Merchant")}
                className={`px-4 py-2 transition-colors duration-300 rounded-full flex-1 text-center ${
                  selected === "Merchant" && "bg-teal-700 text-white"
                }`}
              >
                Merchant
              </span>

              <span
                onClick={() => setSelected("Customer")}
                className={`px-4 py-2 transition-colors duration-300 rounded-full flex-1 text-center ${
                  selected === "Customer" && "bg-teal-700 text-white"
                }`}
              >
                Customer
              </span>
            </label>
          )}

          {selected === "Customer" ? (
            <div className="flex items-center justify-between lg:justify-end lg:gap-[30px] w-full">
              <DatePicker
                selected={customerFilter.date}
                onChange={(date) =>
                  setCustomerFilter({ ...customerFilter, date: date })
                }
                dateFormat="yyyy/MM/dd"
                withPortal
                className="cursor-pointer order-2 lg:order-1"
                customInput={
                  <span className="text-gray-400">
                    <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                  </span>
                }
              />

              <div className="flex justify-end order-1 lg:order-2">
                <input
                  type="search"
                  placeholder="Search customer name"
                  className="bg-white border p-3 rounded-full w-[200px] text-sm focus:outline-none "
                  value={customerDebounce}
                  onChange={(e) => setCustomerDebounce(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-start lg:justify-end gap:[25px] lg:gap-[30px] w-full">
              {role !== "Merchant" && (
                <>
                  <Select
                    className="w-[200px] hidden lg:block"
                    value={subscriptionOptions?.find(
                      (option) => option.value === merchantFilter.status
                    )}
                    options={subscriptionOptions}
                    placeholder="Select status"
                    onChange={(option) =>
                      setMerchantFilter({
                        ...merchantFilter,
                        status: option.value,
                      })
                    }
                  />
                  <Select
                    className="w-[200px] hidden lg:block"
                    value={merchantOptions?.find(
                      (option) => option.value === merchantFilter.merchantId
                    )}
                    isSearchable={true}
                    options={merchantOptions}
                    placeholder="Select Merchant"
                    onChange={(option) =>
                      setMerchantFilter({
                        ...merchantFilter,
                        merchantId: option.value,
                      })
                    }
                  />
                </>
              )}

              <DatePicker
                selected={merchantFilter.date}
                onChange={(date) =>
                  setMerchantFilter({ ...merchantFilter, date: date })
                }
                dateFormat="yyyy/MM/dd"
                withPortal
                className="cursor-pointer order-2 hidden lg:block"
                customInput={
                  <span className="text-gray-400">
                    <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                  </span>
                }
              />

              {role !== "Merchant" && (
                <input
                  type="search"
                  placeholder="Search merchant name"
                  className="bg-white border p-3 rounded-full w-[200px] text-sm focus:outline-none order-1"
                  value={merchantDebounce}
                  onChange={(e) => setMerchantDebounce(e.target.value)}
                />
              )}

              <span
                onClick={() => setFilterOpen(true)}
                className="order-2 text-gray-400 ms-auto lg:hidden"
              >
                <RenderIcon iconName="FilterIcon" size={24} loading={6} />
              </span>

              <FilterWrapper
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              >
                <MerchantSubscriptionLogFilters
                  merchantOptions={merchantOptions}
                  onFilterChange={setFilerFromDrawer}
                  currentValue={merchantFilter}
                  onClose={() => setFilterOpen(false)}
                />
              </FilterWrapper>
            </div>
          )}
        </div>
      </div>

      {selected === "Merchant" ? (
        <MerchantSubLog selected={selected} filter={merchantFilter} />
      ) : (
        <CustomerSubLog selected={selected} filter={customerFilter} />
      )}
    </div>
  );
};

export default SubscriptionLog;
