import DatePicker from "react-datepicker";

import { HStack, Table } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";

import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

const MerchantAvailability = ({ detail, onDataChange }) => {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    setAvailability(detail?.merchantDetail?.availability);
  }, [detail]);

  const handleAvailabilityTypeChange = (e) => {
    const value = e.value;
    const updatedDetail = {
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        availability: {
          ...detail.merchantDetail?.availability,
          type: value,
          specificDays:
            value === "Full-time"
              ? {
                  sunday: { openAllDay: true },
                  monday: { openAllDay: true },
                  tuesday: { openAllDay: true },
                  wednesday: { openAllDay: true },
                  thursday: { openAllDay: true },
                  friday: { openAllDay: true },
                  saturday: { openAllDay: true },
                }
              : detail.merchantDetail?.availability?.specificDays,
        },
      },
    };

    onDataChange(updatedDetail);
    setAvailability(updatedDetail?.merchantDetail?.availability);
  };

  const handleSpecificDayChange = (day, field, value) => {
    const newSpecificDays = {
      ...detail.merchantDetail.availability.specificDays,
      [day]: {
        openAllDay: field === "openAllDay" ? value : false,
        closedAllDay: field === "closedAllDay" ? value : false,
        specificTime: field === "specificTime" ? value : false,
        startTime:
          field === "specificTime"
            ? detail?.merchantDetail?.availability?.specificDays?.[day]
                ?.startTime
            : null,
        endTime:
          field === "specificTime"
            ? detail?.merchantDetail?.availability?.specificDays?.[day]?.endTime
            : null,
      },
    };

    onDataChange({
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        availability: {
          ...detail.merchantDetail.availability,
          specificDays: newSpecificDays,
        },
      },
    });
  };

  const handleTimeChange = (day, timeType, value) => {
    onDataChange({
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        availability: {
          ...detail.merchantDetail.availability,
          specificDays: {
            ...detail.merchantDetail.availability.specificDays,
            [day]: {
              ...detail.merchantDetail.availability.specificDays[day],
              [timeType]: value,
            },
          },
        },
      },
    });
  };

  return (
    <>
      <>
        <div className="mb-6 flex flex-col lg:flex-row gap-[20px] lg:gap-0 mt-10 lg:w-[1200px]">
          <h3 className="text-gray-700 font-bold mb-2 w-1/3">
            Time wise availability
            <span className="text-red-500 font-bold">*</span>
          </h3>

          <RadioGroup
            colorPalette="teal"
            value={availability?.type}
            onValueChange={handleAvailabilityTypeChange}
            className="mb-4"
          >
            <HStack gap="8">
              <Radio value="Full-time" className="cursor-pointer">
                Full-time
              </Radio>
              <Radio value="Specific-time" className="cursor-pointer">
                Specific-time
              </Radio>
            </HStack>
          </RadioGroup>
        </div>

        {availability?.type === "Specific-time" && (
          <div className="overflow-x-auto">
            <Table.Root interactive>
              <Table.Header>
                <Table.Row className="h-14">
                  {[
                    "Week day",
                    "Open all day",
                    "Close all day",
                    "Specific Time",
                    "Start Time",
                    "End Time",
                  ].map((header, index) => (
                    <Table.ColumnHeader
                      key={index}
                      color="black"
                      textAlign="center"
                    >
                      {header}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {daysOfWeek?.map((day, index) => (
                  <Table.Row key={index + 1} className={`h-[70px]`}>
                    <Table.Cell textAlign="left" className="capitalize">
                      {day}
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <input
                        type="radio"
                        name={`${day}.availability`}
                        checked={
                          availability?.specificDays?.[day]?.openAllDay || false
                        }
                        onChange={() =>
                          handleSpecificDayChange(day, "openAllDay", true)
                        }
                        className="mr-2 cursor-pointer w-fit"
                      />
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <input
                        type="radio"
                        name={`${day}.availability`}
                        checked={
                          availability?.specificDays?.[day]?.closedAllDay ||
                          false
                        }
                        onChange={() =>
                          handleSpecificDayChange(day, "closedAllDay", true)
                        }
                        className="mr-2 cursor-pointer w-fit"
                      />
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <input
                        type="radio"
                        name={`${day}.availability`}
                        checked={
                          availability?.specificDays?.[day]?.specificTime ||
                          false
                        }
                        onChange={() =>
                          handleSpecificDayChange(day, "specificTime", true)
                        }
                        className="mr-2 cursor-pointer w-fit"
                      />
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <DatePicker
                        selected={
                          availability?.specificDays?.[day]?.startTime &&
                          /^\d{2}:\d{2}$/.test(
                            availability.specificDays[day].startTime
                          )
                            ? new Date(
                                `1970-01-01T${availability.specificDays[day].startTime}:00`
                              )
                            : null
                        }
                        onChange={(time) =>
                          handleTimeChange(
                            day,
                            "startTime",
                            time
                              ? time.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              : ""
                          )
                        }
                        disabled={
                          !availability?.specificDays?.[day]?.specificTime
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Start time"
                        className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-fit"
                      />
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <DatePicker
                        selected={
                          availability?.specificDays?.[day]?.endTime &&
                          /^\d{2}:\d{2}$/.test(
                            availability.specificDays[day].endTime
                          )
                            ? new Date(
                                `1970-01-01T${availability.specificDays[day].endTime}:00`
                              )
                            : null
                        }
                        onChange={(time) =>
                          handleTimeChange(
                            day,
                            "endTime",
                            time
                              ? time.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              : ""
                          )
                        }
                        disabled={
                          !availability?.specificDays?.[day]?.specificTime
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="End time"
                        className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none w-fit"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </>
    </>
  );
};

export default MerchantAvailability;
