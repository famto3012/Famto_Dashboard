import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";
import AllMerchantsTable from "@/components/merchant/AllMerchantsTable";

import { serviceableOptions, subscriptionOptions } from "@/utils/defaultData";

import AddMerchant from "@/models/general/merchant/AddMerchant";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { getAllBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";
import CSVOperation from "@/models/general/merchant/CSVOperation";
import MerchantFIlters from "@/components/SideFilters/MerchantFIlters";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";

const AllMerchant = () => {
  const [filter, setFilter] = useState({
    status: null,
    businessCategory: null,
    geofence: null,
    name: "",
    subscriptionStatus: null,
  });
  const [debounceName, setDebounceName] = useState("");
  const [modal, setModal] = useState({
    add: null,
    csv: null,
  });
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
    data: allBusinessCategory,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
  });

  const categoryOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allBusinessCategory)
      ? allBusinessCategory.map((category) => ({
          label: category.title,
          value: category._id,
        }))
      : []),
  ];

  const geofenceOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allGeofence)
      ? allGeofence.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
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

  const toggleModal = (type) => {
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setModal({
      add: null,
      csv: null,
    });
  };

  const showLoading = geofenceLoading || categoryLoading;
  const showError = geofenceError || categoryError;

  const setFilerFromDrawer = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex justify-between items-center px-[30px] mt-5">
        <h1 className="text-[16px] lg:text-[18px] font-semibold">Merchants</h1>
        <div className="flex space-x-3 justify-end ">
          <button
            className="bg-cyan-100 text-black rounded-md px-4 py-2 font-semibold flex items-center gap-2"
            onClick={() => toggleModal("csv")}
          >
            <RenderIcon iconName="DownloadIcon" size={16} loading={6} />
            <span className="text-[14px] lg:text-[16px]">CSV</span>
          </button>

          <Link
            to={"/merchant/payout"}
            className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold flex items-center text-[14px] lg:text-[16px]"
          >
            <p className="hidden lg:block">Merchant payout</p>
            <p className="block md:hidden">₹</p>
            <p className="hidden md:block lg:hidden">Payout</p>
          </Link>

          <button
            className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold flex items-center text-[14px] lg:text-[16px] gap-2"
            onClick={() => toggleModal("add")}
          >
            <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            <span className="hidden lg:block">Add Merchant</span>
          </button>
        </div>
      </div>

      <div className="flex items-center bg-white p-5 mx-5 rounded-lg justify-between mt-[20px] px-[30px]">
        <div className="hidden lg:flex items-center gap-[20px]">
          <Select
            options={serviceableOptions}
            value={serviceableOptions?.find(
              (option) => option.value === filter.status
            )}
            onChange={(option) =>
              setFilter({ ...filter, status: option.value })
            }
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
              (option) => option.value === filter.geofence
            )}
            onChange={(option) =>
              setFilter({ ...filter, geofence: option.value })
            }
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
              (option) => option.value === filter.businessCategory
            )}
            onChange={(option) =>
              setFilter({ ...filter, businessCategory: option.value })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Category"
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
              (option) => option.value === filter.subscriptionStatus
            )}
            onChange={(option) =>
              setFilter({ ...filter, subscriptionStatus: option.value })
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

        <div className="flex items-center justify-between lg:justify-end w-full relative">
          <input
            type="search"
            value={debounceName}
            className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px]"
            placeholder="Search merchant"
            onChange={(e) => setDebounceName(e.target.value)}
          />

          <span
            onClick={() => setFilterOpen(true)}
            className="block lg:hidden text-gray-400 cursor-pointer"
          >
            <RenderIcon iconName="FilterIcon" size={16} loading={6} />
          </span>

          <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
            <MerchantFIlters
              geofenceOptions={geofenceOptions}
              categoryOptions={categoryOptions}
              onFilterChange={setFilerFromDrawer}
              currentValue={filter}
              onClose={() => setFilterOpen(false)}
            />
          </FilterWrapper>
        </div>
      </div>

      <AllMerchantsTable
        filter={filter}
        showLoading={showLoading}
        showError={showError}
      />

      {/* Modal */}
      <AddMerchant isOpen={modal.add} onClose={closeModal} />
      <CSVOperation isOpen={modal.csv} onClose={closeModal} filter={filter} />
    </div>
  );
};

export default AllMerchant;
