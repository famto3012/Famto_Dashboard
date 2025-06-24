import { useContext } from "react";
import Select from "react-select";
import AuthContext from "@/context/AuthContext";
import { subscriptionOptions } from "@/utils/defaultData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MerchantSubscriptionLogFilters = ({
  merchantOptions,
  onFilterChange,
  currentValue,
}) => {
  const { role } = useContext(AuthContext);

  return (
    <div className="bg-white flex flex-col gap-[30px] mt-[20px]">
      <Select
        className="w-[200px]  "
        value={subscriptionOptions?.find(
          (option) => option.value === currentValue.status
        )}
        options={subscriptionOptions}
        placeholder="Select status"
        onChange={(option) => onFilterChange("status", option.value)}
      />

      <Select
        className="w-[200px]"
        value={merchantOptions?.find(
          (option) => option.value === currentValue.merchantId
        )}
        isSearchable={true}
        options={merchantOptions}
        placeholder="Select Merchant"
        onChange={(option) => onFilterChange("merchantId", option.value)}
      />

      <DatePicker
        selected={currentValue.date}
        onChange={(date) => onFilterChange("date", date)}
        dateFormat="yyyy/MM/dd"
        className="cursor-pointer border-2 p-2 focus:outline-none"
        isClearable
        placeholderText="Select date"
      />
    </div>
  );
};

export default MerchantSubscriptionLogFilters;
