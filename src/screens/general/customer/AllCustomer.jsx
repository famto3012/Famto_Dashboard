import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { HStack, Table } from "@chakra-ui/react";

import { Rating } from "@/components/ui/rating";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchCustomer } from "@/hooks/customer/useCustomer";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";
import CSVOperation from "@/models/general/customer/CSVOperation";

const AllCustomer = () => {
  const [filter, setFilter] = useState({
    geofence: null,
    name: "",
  });
  const [debounce, setDebounce] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter({ ...filter, name: debounce });
    }, 500);

    return () => clearTimeout(handler);
  }, [debounce]);

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-customer", filter, page, limit],
    queryFn: () => fetchCustomer(role, filter, page, limit, navigate),
    placeholderData: keepPreviousData,
  });

  const geofenceOptions = [
    { label: "All", value: "all" },
    ...(allGeofence ?? []).map((geofence) => ({
      label: geofence.name,
      value: geofence._id,
    })),
  ];

  const showTableLoading = geofenceLoading || isLoading;
  const showError = geofenceError || isError;

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />
      <>
        <div className="flex items-center justify-between mx-8 mt-5">
          <h1 className="text-lg font-bold">Customers</h1>
          {role !== "Merchant" && (
            <button
              className="bg-cyan-100 text-black rounded-md px-4 py-2 font-semibold flex items-center space-x-2"
              onClick={() => setShowModal(true)}
            >
              <RenderIcon iconName="DownloadIcon" size={18} loading={6} />
              <span>CSV</span>
            </button>
          )}
        </div>

        <div className="mx-8 rounded-lg mt-5 flex flex-col lg:flex-row p-6 gap-[20px] lg:gap-0 bg-white justify-between">
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
            isSearchable
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

          <div className=" mx-auto lg:ms-auto">
            <div>
              <input
                type="search"
                value={debounce}
                onChange={(e) => setDebounce(e.target.value)}
                className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px]"
                placeholder="Search customer"
              />
            </div>
          </div>
        </div>

        <div className=" overflow-x-auto">
          <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {[
                  "ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Last Platform Used",
                  "Registration Date",
                  "Rating",
                ].map((header) => (
                  <Table.ColumnHeader
                    key={header}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {showTableLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={7} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : data?.data?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={7} textAlign="center">
                    No Customers Available
                  </Table.Cell>
                </Table.Row>
              ) : showError ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={7} textAlign="center">
                    Error in fetching customers.
                  </Table.Cell>
                </Table.Row>
              ) : (
                data?.data?.map((customer) => (
                  <Table.Row key={customer.customerId} className={`h-[70px]`}>
                    <Table.Cell textAlign="center">
                      {role === "Merchant" ? (
                        customer.customerId
                      ) : (
                        <Link
                          to={`/customer/${customer.customerId}`}
                          className=" underline underline-offset-2"
                        >
                          {customer.customerId}
                        </Link>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {customer.fullName}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{customer.email}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {customer.phoneNumber}
                    </Table.Cell>
                    <Table.Cell textAlign="center" textTransform="capitalize">
                      {customer.lastPlatformUsed}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {customer.registrationDate}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Rating
                        readOnly
                        allowHalf
                        defaultValue={customer.rating}
                        size="sm"
                        colorPalette="yellow"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        {data?.total && (
          <PaginationRoot
            count={data.total}
            page={page}
            pageSize={limit}
            defaultPage={1}
            onPageChange={(e) => setPage(e.page)}
            variant="solid"
            className="py-[50px] flex justify-center"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        )}
      </>

      <CSVOperation isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AllCustomer;
