import { payoutPaymentStatus } from "@/utils/defaultData";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MerchantPayoutFilters = ({
  merchantOptions,
  geofenceOptions,
  currentValue,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <Select
        options={merchantOptions}
        value={merchantOptions?.find(
          (option) => option.value === currentValue.merchantId
        )}
        onChange={(option) =>
          onFilterChange("merchantId", option?.value || null)
        }
        className=" bg-cyan-50 w-full"
        placeholder="Merchant"
        isSearchable={true}
      />

      <Select
        options={payoutPaymentStatus}
        value={payoutPaymentStatus?.find(
          (option) => option.value === currentValue.status
        )}
        onChange={(option) => onFilterChange("status", option?.value || null)}
        className=" bg-cyan-50 w-full"
        placeholder="Payment status"
      />

      <Select
        options={geofenceOptions}
        value={geofenceOptions?.find(
          (option) => option.value === currentValue.geofenceId
        )}
        onChange={(option) =>
          onFilterChange("geofenceId", option?.value || null)
        }
        className=" bg-cyan-50 w-full"
        placeholder="Geofence"
        isSearchable={true}
      />

      <DatePicker
        selectsRange
        startDate={currentValue.date[0]}
        endDate={currentValue.date[1]}
        onChange={(date) => onFilterChange("date", date)}
        dateFormat="yyyy/MM/dd"
        maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
        className="cursor-pointer border p-2 w-full"
        placeholderText="Select Date range"
        isClearable
      />
    </div>
  );
};

export default MerchantPayoutFilters;
