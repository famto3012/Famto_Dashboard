import ShowSpinner from "@/components/others/ShowSpinner";
import { searchMerchantForOrder } from "@/hooks/order/useOrder";
import RenderIcon from "@/icons/RenderIcon";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectMerchant = ({ onMerchantSelect }) => {
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");
  const [allMerchants, setAllMerchants] = useState([]);
  const [selectedMerchantName, setSelectedMerchantName] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-merchant-for-order", search],
    queryFn: () => searchMerchantForOrder(search, navigate),
    enabled: search.trim().length > 0,
  });

  useEffect(() => {
    if (data) setAllMerchants(data);
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(debounce);
    }, 500);

    return () => clearTimeout(handler);
  }, [debounce]);

  const selectMerchant = (merchant) => {
    setSearch("");
    setDebounce("");
    setSelectedMerchantName(merchant.merchantName);
    onMerchantSelect(merchant);
    setAllMerchants([]);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center relative gap-[20px] md:gap-0">
      <label
        className="md:w-1/3 md:px-6 text-gray-500 text-[16px]"
        htmlFor="merchant"
      >
        Select Merchant
      </label>

      <div className="relative md:w-1/2">
        <input
          type="text"
          name="merchantName"
          placeholder="Search merchant"
          className="h-10 ps-3 text-sm border-2 w-full outline-none focus:outline-none rounded-md"
          value={selectedMerchantName || debounce}
          onChange={(e) => {
            setDebounce(e.target.value);
            setSelectedMerchantName("");
          }}
        />

        {isLoading ? (
          <ShowSpinner size={15} className="absolute top-[30%] right-[10px]" />
        ) : (
          <span className="text-gray-500 absolute top-[30%] right-[10px]">
            <RenderIcon iconName="SearchIcon" size={20} loading={6} />
          </span>
        )}

        {allMerchants?.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 z-50 max-h-[15rem] overflow-auto">
            {allMerchants?.map((result) => (
              <li
                key={result._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => selectMerchant(result)}
              >
                {result?.merchantName} - {result?.displayAddress} (
                {result?.isServiceableToday})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectMerchant;
