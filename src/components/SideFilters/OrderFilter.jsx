import AuthContext from "@/context/AuthContext";
import { orderStatusOption, paymentModeOption } from "@/utils/defaultData";
import { useContext } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderFilter = ({
  currentValue,
  onFilterChange,
  filteredOptions,
  merchantOptions,
}) => {
  const { role } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-[20px]">
      <Select
        options={orderStatusOption}
        value={orderStatusOption.find(
          (option) => option.value === currentValue.status
        )}
        onChange={(option) => onFilterChange("status", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Order status"
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
        options={paymentModeOption}
        value={paymentModeOption.find(
          (option) => option.value === currentValue.paymentMode
        )}
        onChange={(option) => onFilterChange("paymentMode", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Payment mode"
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
        options={filteredOptions}
        value={filteredOptions.find(
          (option) => option.value === currentValue.deliveryMode
        )}
        onChange={(option) => onFilterChange("deliveryMode", option.value)}
        className=" bg-cyan-50 min-w-[10rem]"
        placeholder="Delivery mode"
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

      {role !== "Merchant" && (
        <Select
          options={merchantOptions}
          value={merchantOptions.find(
            (option) => option.value === currentValue.selectedMerchant
          )}
          onChange={(option) =>
            onFilterChange("selectedMerchant", option.value)
          }
          className=" bg-cyan-50 w-[10rem]"
          placeholder="Merchant"
          isSearchable={true}
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
      )}

      <DatePicker
        selectsRange={true}
        startDate={currentValue.date[0]}
        endDate={currentValue.date[1]}
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

export default OrderFilter;
