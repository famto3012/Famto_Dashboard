import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import { Radio, RadioGroup } from "@/components/ui/radio";

import "react-datepicker/dist/react-datepicker.css";

const DeliveryModeAndOption = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    deliveryOption: "On-demand",
    deliveryMode: "Take Away",
    ifScheduled: {},
  });

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [time, setTime] = useState(new Date());

  const { role } = useContext(AuthContext);
  const {
    setPickAddressType,
    setPickAddressId,
    setDeliveryAddressType,
    setDeliveryAddressId,
  } = useContext(DataContext);

  const deliveryModes = [
    "Take Away",
    "Home Delivery",
    "Pick and Drop",
    role !== "Merchant" && "Custom Order",
  ].filter(Boolean);

  const isToday =
    startDate && startDate.toDateString() === new Date().toDateString();

  // Calculate the minimum selectable time as 1.5 hours from now
  const minimumSelectableTime = new Date();
  minimumSelectableTime.setMinutes(minimumSelectableTime.getMinutes() + 90);

  useEffect(() => {
    // Format the start and end dates
    const formattedStartDate = startDate
      ? startDate.toLocaleDateString("en-CA")
      : null;
    const formattedEndDate = endDate
      ? endDate.toLocaleDateString("en-CA")
      : null;
    // Format the time
    const formattedTime = time
      ? time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    setFormData((prevState) => ({
      ...prevState,
      ifScheduled: {
        ...prevState.ifScheduled,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        time: formattedTime,
      },
    }));
  }, [startDate, endDate, time]);

  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  const handleDateChange = (update) => {
    setDateRange(update);
    const [newStartDate] = update;

    if (
      newStartDate &&
      newStartDate.toDateString() === new Date().toDateString()
    ) {
      setTime(minimumSelectableTime);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center mt-1 gap-[20px] md:gap-0">
        <label className="md:w-1/3 md:px-6 text-[16px] text-gray-600">
          Select Delivery Option
        </label>

        <RadioGroup
          value={formData?.deliveryOption}
          colorPalette="teal"
          variant="solid"
          size="sm"
          onValueChange={(e) =>
            setFormData({ ...formData, deliveryOption: e.value })
          }
          className="flex gap-[15px]"
        >
          <Radio value="On-demand" className="cursor-pointer text-[16px]">
            On-demand
          </Radio>
          <Radio
            disabled={formData.deliveryMode === "Custom Order" ? true : false}
            value="Scheduled"
            className={`${formData.deliveryMode === "Custom Order" ? `cursor-not-allowed text-gray-600` : `cursor-pointer`} text-[16px]`}
          >
            Scheduled
          </Radio>
        </RadioGroup>
      </div>

      {formData?.deliveryOption === "Scheduled" && (
        <div className="flex md:items-center justify-start">
          <label className="md:w-1/3 px-6 text-gray-700 hidden md:block invisible">
            Select Delivery Date and time
          </label>

          <div className="flex gap-5 justify-start z-50">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              withPortal
              className="border-2 p-2 rounded-lg cursor-pointer mt-2 outline-none focus:outline-none"
              placeholderText="Select Date range"
              minDate={new Date()}
            />

            <DatePicker
              selected={time}
              onChange={(time) => setTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              showTimeCaption={false}
              className="border-2 p-2 rounded-lg cursor-pointer mt-2 outline-none focus:outline-none"
              placeholderText="Select Time"
              minTime={
                isToday
                  ? minimumSelectableTime
                  : new Date(new Date().setHours(0, 0, 0, 0))
              }
              maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center mt-2 gap-[20px] md:gap-0 w-full">
        <label className="md:w-1/3 md:px-6 text-[16px] text-gray-600">
          Select Delivery Mode
        </label>

        <div className="flex items-center space-x-2 md:w-2/3 gap-3 overflow-auto">
          <RadioGroup
            value={formData?.deliveryMode}
            size="sm"
            onChange={(e) => {
              const selectedMode = e.target.value;

              setPickAddressType(null);
              setPickAddressId(null);
              setDeliveryAddressType(null);
              setDeliveryAddressId(null);
              setFormData({
                ...formData,
                deliveryMode: selectedMode,
                ...(selectedMode === "Custom Order" && {
                  deliveryOption: "On-demand",
                  ifScheduled: {},
                }),
              });
            }}
            className="flex flex-row gap-[15px]"
          >
            {deliveryModes.map((mode, index) => (
              <Radio
                key={index}
                value={mode}
                colorPalette="teal"
                className="text-[16px] cursor-pointer"
              >
                {mode}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export default DeliveryModeAndOption;
