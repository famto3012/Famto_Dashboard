import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import ShowSpinner from "@/components/others/ShowSpinner";
import RenderIcon from "@/icons/RenderIcon";
import { searchCustomerForOrder } from "@/hooks/order/useOrder";

const CustomerSelection = ({ onCustomerSelect }) => {
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-customer-for-order", search],
    queryFn: () => searchCustomerForOrder(role, search, navigate),
    enabled: search.trim().length > 0,
  });

  useEffect(() => {
    if (data) setAllCustomers(data);
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(debounce);
    }, 500);

    return () => clearTimeout(handler);
  }, [debounce]);

  const selectCustomer = (customer) => {
    setSearch("");
    setDebounce("");
    setSelectedCustomerName(`${customer?.fullName} - ${customer?.phoneNumber}`);
    onCustomerSelect(customer);
    setAllCustomers([]);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center relative gap-[20px] md:gap-0">
      <label
        className="w-full md:w-1/3 md:px-6 text-gray-600 text-[16px]"
        htmlFor="customer"
      >
        Select Customer
      </label>

      <div className="w-full md:w-1/2 relative">
        <div className="relative">
          <input
            type="text"
            name="customer"
            placeholder="Search Customer"
            className="h-10 ps-3 text-[16px] border-2 w-full outline-none focus:outline-none rounded-md"
            value={selectedCustomerName || debounce}
            onChange={(e) => {
              setDebounce(e.target.value);
              setSelectedCustomerName("");
            }}
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            {isLoading ? (
              <ShowSpinner />
            ) : (
              <RenderIcon iconName="SearchIcon" size={20} loading={6} />
            )}
          </span>
        </div>

        {debounce && allCustomers?.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 z-50">
            {allCustomers?.map((customer) => (
              <li
                key={customer?.customerId || customer?._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => selectCustomer(customer)}
              >
                {customer?.fullName} - {customer?.phoneNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerSelection;
