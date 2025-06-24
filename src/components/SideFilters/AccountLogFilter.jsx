import { accountLogsOptions } from "@/utils/defaultData";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AccountLogFilter = ({ currentValue, onFilterChange }) => {
  return (
    <div className="flex flex-col gap-[30px]">
      <Select
        options={accountLogsOptions}
        value={accountLogsOptions.find(
          (option) => option.value === currentValue.role
        )}
        onChange={(option) => onFilterChange("role", option.value)}
        className="bg-cyan-50 min-w-[10rem]"
        isSearchable={false}
        isMulti={false}
        styles={{
          control: (provided) => ({
            ...provided,
            paddingRight: "",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "10px",
          }),
        }}
      />

      <DatePicker
        selected={currentValue.date}
        onChange={(date) => onFilterChange("date", date)}
        dateFormat="yyyy/MM/dd"
        className="cursor-pointer border-2 p-2"
        maxDate={new Date()}
        isClearable
        placeholderText="Select date"
      />
    </div>
  );
};

export default AccountLogFilter;
