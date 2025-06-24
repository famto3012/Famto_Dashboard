import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useMutation, useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";

import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";

import {
  deliveryModeOption,
  orderStatusOption,
  paymentModeOption,
} from "@/utils/defaultData";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";

import "react-datepicker/dist/react-datepicker.css";

import AllOrdersTable from "@/components/order/detail/AllOrdersTable";

import { downloadOrderCSV } from "@/hooks/order/useOrder";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import OrderFilter from "@/components/SideFilters/OrderFilter";

const AllOrders = () => {
  const [filter, setFilter] = useState({
    selectedOption: "order",
    status: null,
    paymentMode: null,
    deliveryMode: null,
    selectedMerchant: null,
    date: [null, null],
    orderId: "",
  });
  const [debounceId, setDebounceId] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const filteredOptions =
    role === "Merchant"
      ? deliveryModeOption.filter(
          (option) =>
            option.value !== "Pick and Drop" && option.value !== "Custom Order"
        )
      : deliveryModeOption;

  const handleDrawerFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  const { data: allMerchants } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: role ? role !== "Merchant" : false,
  });

  const merchantOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allMerchants)
      ? allMerchants.map((merchant) => ({
          label: merchant.merchantName,
          value: merchant._id,
        }))
      : []),
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prevFilter) => ({
        ...prevFilter,
        orderId: debounceId,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debounceId]);

  const downloadCSV = useMutation({
    mutationKey: ["download-order-csv"],
    mutationFn: () => downloadOrderCSV(role, filter, navigate),
  });

  const handleDownloadOrderCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCSV.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Order.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        },
        onError: (error) => {
          reject(
            new Error(error.message || "Failed to download the CSV file.")
          );
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Downloading...",
        description: "Preparing your CSV file.",
      },
      success: {
        title: "Download Successful",
        description: "CSV file has been downloaded successfully.",
      },
      error: {
        title: "Download Failed",
        description: "Something went wrong while downloading the CSV file.",
      },
    });
  };

  return (
    <div className="bg-gray-100 h-full w-full">
      <GlobalSearch />

      <div className="mx-[20px] mt-[20px] flex flex-col lg:flex-row gap-[30px] lg:gap-0 justify-between items-center">
        <div className="w-fit border border-gray-700 rounded-full">
          <div className="flex items-center gap-[1px] p-1 ">
            <p
              onClick={() => setFilter({ ...filter, selectedOption: "order" })}
              className={`${
                filter.selectedOption === "order"
                  ? `bg-teal-700 text-white`
                  : `text-black`
              }  py-2 rounded-full px-3 text-[16px] cursor-pointer`}
            >
              Order
            </p>
            <p
              onClick={() =>
                setFilter({ ...filter, selectedOption: "scheduledOrder" })
              }
              className={`${
                filter.selectedOption === "scheduledOrder"
                  ? `bg-teal-700 text-white`
                  : `text-black`
              }  py-2 rounded-full px-3 text-[16px] cursor-pointer`}
            >
              Scheduled Order
            </p>
          </div>
        </div>

        <div className="flex gap-x-4">
          {filter.selectedOption === "order" && (
            <Button
              onClick={handleDownloadOrderCSV}
              variant="solid"
              className="bg-teal-200 text-black px-3"
            >
              <RenderIcon iconName="DownloadIcon" />
              <span className="text-[16px]">CSV</span>
            </Button>
          )}

          <Link
            to={`/order/create`}
            className="bg-teal-700 text-white px-3 py-2 flex items-center gap-2 rounded-md"
          >
            <RenderIcon iconName="PlusIcon" />
            <span className="text-[16px]">Create Order</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center bg-white p-3 py-[20px] mx-5 rounded-lg justify-between mt-[20px] px-[30px]">
        <div className="hidden lg:flex items-center gap-[20px]">
          <Select
            options={orderStatusOption}
            value={orderStatusOption.find(
              (option) => option.value === filter.status
            )}
            onChange={(option) =>
              setFilter({ ...filter, status: option.value })
            }
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
              (option) => option.value === filter.paymentMode
            )}
            onChange={(option) =>
              setFilter({ ...filter, paymentMode: option.value })
            }
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
              (option) => option.value === filter.deliveryMode
            )}
            onChange={(option) =>
              setFilter({ ...filter, deliveryMode: option.value })
            }
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
                (option) => option.value === filter.selectedMerchant
              )}
              onChange={(option) =>
                setFilter({ ...filter, selectedMerchant: option.value })
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
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-[20px] w-full">
          <div className="hidden lg:flex items-center gap-2">
            {Array.isArray(filter.date) && filter.date.some((data) => data) && (
              <span
                onClick={() => setFilter({ ...filter, date: [null, null] })}
                className="text-red-500"
              >
                <RenderIcon iconName="CancelIcon" size={20} loading={6} />
              </span>
            )}

            <DatePicker
              selectsRange={true}
              startDate={filter.date[0]}
              endDate={filter.date[1]}
              onChange={(date) => setFilter({ ...filter, date })}
              dateFormat="yyyy/MM/dd"
              withPortal
              className="cursor-pointer "
              customInput={
                <span className="text-gray-400 text-xl">
                  <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                </span>
              }
              maxDate={new Date()}
            />
          </div>

          <div className="order-1">
            <input
              value={debounceId}
              type="search"
              className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px]"
              placeholder="Search order ID"
              onChange={(e) => setDebounceId(e.target.value)}
            />
          </div>

          <span
            onClick={() => setFilterOpen(true)}
            className="text-gray-400 order-3 p-3 lg:hidden"
          >
            <RenderIcon iconName="FilterIcon" size={20} loading={6} />
          </span>

          <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
            <OrderFilter
              currentValue={filter}
              onFilterChange={handleDrawerFilterChange}
              filteredOptions={filteredOptions}
              merchantOptions={merchantOptions}
            />
          </FilterWrapper>
        </div>
      </div>

      <AllOrdersTable filter={filter} />
    </div>
  );
};

export default AllOrders;
