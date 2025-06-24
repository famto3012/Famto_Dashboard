import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import Select from "react-select";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import { payoutPaymentStatus } from "@/utils/defaultData";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import {
  downloadMerchantPayoutCSV,
  fetchMerchantsForDropDown,
} from "@/hooks/merchant/useMerchant";

import "react-datepicker/dist/react-datepicker.css";
import AllMerchantPayoutTable from "@/components/merchant/AllMerchantPayoutTable";
import { toaster } from "@/components/ui/toaster";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import MerchantPayoutFilters from "@/components/SideFilters/MerchantPayoutFilters";

const MerchantPayout = () => {
  const [filter, setFilter] = useState({
    merchantId: null,
    status: null,
    geofenceId: null,
    date: [null, null],
    name: "",
  });
  const [debounceName, setDebounceName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const {
    data: allMerchants,
    isLoading: merchantLoading,
    isError: merchantError,
  } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
  });

  const downloadCSV = useMutation({
    mutationKey: ["download-merchant-payout-csv"],
    mutationFn: (filter) => downloadMerchantPayoutCSV(filter, navigate),
  });

  const handleDownloadCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCSV.mutate(filter, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Merchant_Payout.csv");
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

  const geofenceOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allGeofence)
      ? allGeofence.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

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
        name: debounceName,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debounceName]);

  const handleFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  if (geofenceLoading || merchantLoading) return <Loader />;
  if (geofenceError || merchantError) return <Error />;

  return (
    <div className="bg-gray-100 min-h-full">
      <GlobalSearch />

      <div className="flex items-center justify-between px-[30px] mt-[20px]">
        <div className="flex items-center gap-2">
          <span onClick={() => navigate("/merchant")}>
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>
          <h3 className="font-[600] text-[18px]">Merchant Payout</h3>
        </div>

        <button
          className="flex items-center gap-2 bg-teal-600 text-white rounded-md px-4 py-2"
          onClick={handleDownloadCSV}
        >
          <RenderIcon iconName="DownloadIcon" size={16} loading={6} />
          <span>CSV</span>
        </button>
      </div>

      <div className="bg-white flex items-center justify-between mx-3 md:mx-[30px] mt-3 p-3 md:p-5 rounded-md">
        <div className="hidden md:flex items-center gap-[20px]">
          <Select
            options={merchantOptions}
            value={merchantOptions?.find(
              (option) => option.value === filter.merchantId
            )}
            onChange={(option) =>
              setFilter({ ...filter, merchantId: option?.value || null })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Merchant"
            isSearchable={true}
          />

          <Select
            options={payoutPaymentStatus}
            value={payoutPaymentStatus?.find(
              (option) => option.value === filter.status
            )}
            onChange={(option) =>
              setFilter({ ...filter, status: option?.value || null })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Payment status"
          />

          <Select
            options={geofenceOptions}
            value={geofenceOptions?.find(
              (option) => option.value === filter.geofenceId
            )}
            onChange={(option) =>
              setFilter({ ...filter, geofenceId: option?.value || null })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Geofence"
            isSearchable={true}
          />
        </div>

        <div className="flex items-center md:gap-5">
          <DatePicker
            selectsRange
            startDate={filter.date[0]}
            endDate={filter.date[1]}
            onChange={(date) => setFilter({ ...filter, date })}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            className="cursor-pointer hidden md:block"
            placeholderText="Select Date range"
            customInput={
              <span className="text-gray-400">
                <RenderIcon iconName="CalendarIcon" size={16} loading={6} />
              </span>
            }
          />

          <input
            type="search"
            value={debounceName}
            onChange={(e) => setDebounceName(e.target.value)}
            className="bg-gray-100 p-3 rounded-3xl focus:outline-none text-[14px] md:ps-[20px]"
            placeholder="Search merchant"
          />
        </div>

        <span
          onClick={() => setFilterOpen(true)}
          className="md:hidden text-gray-400"
        >
          <RenderIcon iconName="FilterIcon" size={20} loading={6} />
        </span>

        <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <MerchantPayoutFilters
            currentValue={filter}
            geofenceOptions={geofenceOptions}
            merchantOptions={merchantOptions}
            onFilterChange={handleFilterChange}
          />
        </FilterWrapper>
      </div>

      <AllMerchantPayoutTable filter={filter} />
    </div>
  );
};

export default MerchantPayout;
