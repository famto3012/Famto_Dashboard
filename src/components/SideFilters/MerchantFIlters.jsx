import { serviceableOptions, subscriptionOptions } from "@/utils/defaultData";
import Select from "react-select";

const MerchantFIlters = ({
  geofenceOptions,
  categoryOptions,
  onFilterChange,
  currentValue,
}) => {
  return (
    <div className="bg-white flex flex-col gap-[30px] mt-[20px]">
      <Select
        options={serviceableOptions}
        value={serviceableOptions?.find(
          (option) => option.value === currentValue.status
        )}
        onChange={(option) => onFilterChange("status", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
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
        options={geofenceOptions}
        value={geofenceOptions?.find(
          (option) => option.value === currentValue.geofence
        )}
        onChange={(option) => onFilterChange("geofence", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
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

      <Select
        options={categoryOptions}
        value={categoryOptions.find(
          (option) => option.value === currentValue.businessCategory
        )}
        onChange={(option) => onFilterChange("businessCategory", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Business category"
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
        options={subscriptionOptions}
        value={subscriptionOptions.find(
          (option) => option.value === currentValue.subscriptionStatus
        )}
        onChange={(option) =>
          onFilterChange("subscriptionStatus", option.value)
        }
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Subscription"
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

export default MerchantFIlters;
