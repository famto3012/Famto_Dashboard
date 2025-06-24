import { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";

import { Table } from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import RenderIcon from "@/icons/RenderIcon";

import { accountLogsOptions } from "@/utils/defaultData";

import {
  downloadAccountLogsCSV,
  filterAllAccountLogs,
  unblockUserAccount,
} from "@/hooks/accountLogs/accountLogs";

import "react-datepicker/dist/react-datepicker.css";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import AccountLogFilter from "@/components/SideFilters/AccountLogFilter";

const CustomDateInput = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-500">
    <RenderIcon iconName="CalendarIcon" size={18} loading={6} />
  </button>
);

const AccountLog = () => {
  const [filter, setFilter] = useState({
    role: "Agent",
    date: null,
    query: "",
  });
  const [searchInput, setSearchInput] = useState(filter.query);
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["filter-account-logs", filter],
    queryFn: ({ queryKey }) => {
      const [, filter] = queryKey;
      const { role, date, query } = filter;
      return filterAllAccountLogs(role, date, query, navigate);
    },
  });

  const handleFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  const toggleStatus = useMutation({
    mutationKey: ["toggle-unblock"],
    mutationFn: (logId) => unblockUserAccount(logId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["filter-account-logs", filter]);
      toaster.create({
        title: "Success",
        description: "Unblocked account successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while unblocking user",
        type: "error",
      });
    },
  });

  const downloadCSV = useMutation({
    mutationKey: ["download-csv"],
    mutationFn: ({ role, date, query }) =>
      downloadAccountLogsCSV(role, date, query, navigate),
  });

  const handleDownloadCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCSV.mutate(
        { role: filter.role, date: filter.date, query: filter.query },
        {
          onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Account_log.csv");
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
        }
      );
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilter((prev) => ({ ...prev, query: searchInput }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex justify-between mt-8 px-5">
        <h1 className="font-bold text-[20px]">Account Logs</h1>
        <button
          onClick={handleDownloadCSV}
          className="bg-teal-800 rounded-md py-2 px-5 text-white flex items-center gap-2"
        >
          <RenderIcon iconName="DownloadIcon" size={20} loading={6} />
          <span>CSV</span>
        </button>
      </div>

      <div className="bg-white p-5 mx-5 mb-5 mt-5 rounded-lg flex items-center justify-between">
        <div className="hidden md:flex gap-10 flex-1">
          <Select
            options={accountLogsOptions}
            value={accountLogsOptions.find(
              (option) => option.value === filter.role
            )}
            onChange={(option) => setFilter({ ...filter, role: option.value })}
            className="bg-cyan-50 min-w-[10rem]"
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

        <div className="hidden md:block mr-4">
          <DatePicker
            selected={filter.date}
            onChange={(date) => setFilter({ ...filter, date })}
            customInput={<CustomDateInput />}
            maxDate={new Date()}
          />
        </div>

        <input
          type="search"
          name="search"
          placeholder="Search user name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-gray-100 h-10 ps-4 rounded-full text-[14px] focus:outline-none"
        />

        <span onClick={() => setFilterOpen(true)} className="text-gray-400">
          <RenderIcon iconName="FilterIcon" size={20} loading={6} />
        </span>

        <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <AccountLogFilter
            currentValue={filter}
            onFilterChange={handleFilterChange}
          />
        </FilterWrapper>
      </div>

      <div className="overflow-x-auto">
        <Table.Root striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]">
              {[
                "ID",
                "Name",
                "Account Type",
                "Description",
                "Date and Time",
                "Action",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  Error in fetching account logs
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  No Account logs available
                </Table.Cell>
              </Table.Row>
            ) : (
              data.map((item) => (
                <Table.Row key={item.logId} className="h-[70px]">
                  <Table.Cell textAlign="center">{item.userId}</Table.Cell>
                  <Table.Cell textAlign="center">{item.fullName}</Table.Cell>
                  <Table.Cell textAlign="center">{item.role}</Table.Cell>
                  <Table.Cell textAlign="center">{item.description}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <span>{item.blockedDate}</span>
                    <br />
                    <span>{item.blockedTime}</span>
                  </Table.Cell>
                  <Table.Cell textAlign="center" flexDirection="column">
                    <Button
                      onClick={() => toggleStatus.mutate(item.logId)}
                      className="bg-teal-700 text-white p-3"
                    >
                      Unblock
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default AccountLog;
