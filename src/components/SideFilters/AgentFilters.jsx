import { agentStatusOptions, agentVehicleOptions } from "@/utils/defaultData";
import Select from "react-select";

const AgentFilters = ({ currentValue, onFilterChange, geofenceOptions }) => {
  return (
    <div className="bg-white flex flex-col gap-[30px] mt-[20px]">
      <Select
        options={agentStatusOptions}
        value={agentStatusOptions.find(
          (option) => option.value === currentValue.status
        )}
        onChange={(option) => onFilterChange("status", option.value)}
        className="min-w-[10rem]"
        placeholder="Status"
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

      <Select
        options={agentVehicleOptions}
        value={agentVehicleOptions.find(
          (option) => option.value === currentValue.vehicleType
        )}
        onChange={(option) => onFilterChange("vehicleType", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Vehicle type"
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

      <Select
        options={geofenceOptions}
        value={geofenceOptions.find(
          (option) => option.value === currentValue.geofence
        )}
        onChange={(option) => onFilterChange("geofence", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Geofence"
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
    </div>
  );
};

export default AgentFilters;
