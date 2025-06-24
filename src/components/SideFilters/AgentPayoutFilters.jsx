import { payoutPaymentStatus } from "@/utils/defaultData";
import Select from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AgentPayoutFilters = ({
  agentOptions,
  geofenceOptions,
  currentValue,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <Select
        options={payoutPaymentStatus}
        value={payoutPaymentStatus?.find(
          (option) => option.value === currentValue.status
        )}
        onChange={(option) => onFilterChange("status", option.value)}
        className="w-full cursor-pointer"
        placeholder="Status"
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

      <Select
        options={agentOptions}
        value={agentOptions?.find(
          (option) => option.value === currentValue.agent
        )}
        onChange={(option) => onFilterChange("agent", option.value)}
        className="w-full cursor-pointer"
        placeholder="Agents"
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

      <Select
        options={geofenceOptions}
        value={geofenceOptions?.find(
          (option) => option.value === currentValue.geofence
        )}
        onChange={(option) => onFilterChange("geofence", option.value)}
        className="w-full cursor-pointer"
        placeholder="Geofence"
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
        isClearable
        className="cursor-pointer border p-2 w-full border-gray-300 rounded-md"
        maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
        placeholderText="Select Date"
      />
    </div>
  );
};

export default AgentPayoutFilters;
