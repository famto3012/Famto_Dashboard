import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CommissionLogFilters = ({
  role,
  currentValue,
  merchantOptions,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-[20px]">
      {role !== "Merchant" && (
        <Select
          className="py-2 rounded-lg outline-none focus:outline-none"
          value={merchantOptions?.find(
            (option) => option.value === currentValue.merchantId
          )}
          isMulti={false}
          isSearchable={true}
          onChange={(option) => onFilterChange("merchantId", option.value)}
          options={merchantOptions}
          placeholder="Select Merchant"
        />
      )}

      <DatePicker
        selected={currentValue.date}
        onChange={(date) => onFilterChange("date", date)}
        dateFormat="yyyy/MM/dd"
        className="cursor-pointer border p-2"
        maxDate={new Date()}
        isClearable
        placeholderText="Select date"
      />
    </div>
  );
};

export default CommissionLogFilters;
