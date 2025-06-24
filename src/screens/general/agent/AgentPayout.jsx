import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import { payoutPaymentStatus } from "@/utils/defaultData";

import {
  downloadPayoutCSV,
  fetchAgentPayout,
  fetchAllAgents,
} from "@/hooks/agent/useAgent";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";

import ApproveAgentPayout from "@/models/general/agent/ApproveAgentPayout";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import AgentPayoutFilters from "@/components/SideFilters/AgentPayoutFilters";

const AgentPayout = () => {
  const [filter, setFilter] = useState({
    status: null,
    geofence: null,
    agent: null,
    date: null,
    name: "",
  });
  const [debounce, setDebounce] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({
    agentId: null,
    detailId: null,
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const limit = 50;

  const navigate = useNavigate();

  const {
    data: allAgents,
    isLoading: agentLoading,
    isError: agentError,
  } = useQuery({
    queryKey: ["all-agents"],
    queryFn: () => fetchAllAgents(undefined, navigate),
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const {
    data: payoutData,
    isLoading: payoutLoading,
    isError: payoutError,
  } = useQuery({
    queryKey: ["agent-payout", filter, page, limit],
    queryFn: () => fetchAgentPayout(filter, page, limit, navigate),
  });

  const downloadCSV = useMutation({
    mutationKey: ["agent-payout-csv"],
    mutationFn: (filter) => downloadPayoutCSV(filter, navigate),
  });

  const handleDownloadCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCSV.mutate(filter, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "text/csv" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Agent_Payout.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          window.URL.revokeObjectURL(url);
          resolve();
        },
        onError: (error) => {
          console.error("Download Error:", error);
          reject(
            new Error(error?.message || "Failed to download the CSV file.")
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

  const agentOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allAgents)
      ? allAgents.map((agent) => ({
          label: agent.fullName,
          value: agent._id,
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
        name: debounce,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debounce]);

  const toggleModal = (agentId, detailId) => {
    setSelected({
      agentId,
      detailId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelected({
      agentId: null,
      detailId: null,
    });
    setShowModal(false);
  };

  const handleFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  const isLoading = agentLoading || geofenceLoading || payoutLoading;
  const isError = agentError || geofenceError || payoutError;

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex items-center justify-between mx-8 mt-5">
        <div className="flex items-center gap-2">
          <span onClick={() => navigate("/agent")}>
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>

          <h1 className="text-[16px] font-[500]">Delivery Agents Payout</h1>
        </div>

        <Button
          onClick={handleDownloadCSV}
          className="bg-cyan-100 text-black rounded-md px-4 py-2 font-semibold flex items-center gap-2"
        >
          <RenderIcon iconName="DownloadIcon" size={16} loading={6} />
          <span>CSV</span>
        </Button>
      </div>

      <div className="flex items-center bg-white p-5 mx-5 rounded-lg justify-between mt-[20px] md:px-[30px]">
        <div className="hidden md:flex items-center gap-[20px]">
          <Select
            options={payoutPaymentStatus}
            value={payoutPaymentStatus?.find(
              (option) => option.value === filter.status
            )}
            onChange={(option) =>
              setFilter({ ...filter, status: option.value })
            }
            className="min-w-[10rem]"
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
            options={agentOptions}
            value={agentOptions?.find(
              (option) => option.value === filter.agent
            )}
            onChange={(option) => setFilter({ ...filter, agent: option.value })}
            className="min-w-[10rem]"
            placeholder="Agents"
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
            className="min-w-[10rem]"
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
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            {filter.date && (
              <span
                onClick={() => setFilter({ ...filter, date: null })}
                className="text-red-500"
              >
                <RenderIcon iconName="CancelIcon" size={20} loading={6} />
              </span>
            )}

            <DatePicker
              selected={filter.date}
              onChange={(date) => setFilter({ ...filter, date })}
              dateFormat="yyyy/MM/dd"
              withPortal
              className="cursor-pointer"
              customInput={
                <span className="text-gray-400 text-xl">
                  <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                </span>
              }
              maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </div>

          <div className="w-full">
            <input
              type="search"
              className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px]"
              placeholder="Search agent"
              value={debounce}
              onChange={(e) => setDebounce(e.target.value)}
            />
          </div>
        </div>

        <span onClick={() => setFilterOpen(true)} className=" text-gray-400">
          <RenderIcon iconName="FilterIcon" size={20} loading={6} />
        </span>

        <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          <AgentPayoutFilters
            currentValue={filter}
            agentOptions={agentOptions}
            geofenceOptions={geofenceOptions}
            onFilterChange={handleFilterChange}
          />
        </FilterWrapper>
      </div>

      <div className=" overflow-x-auto">
        <Table.Root className="mt-5 z-10">
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Agent ID",
                "Name",
                "Phone",
                "Worked Date",
                "Orders",
                "Cancelled orders",
                "Total distance",
                "Total distance from Start to Pick",
                "Login Hours",
                "CIH",
                "Total Earnings",
                "Total Deductions",
                "Total Surge",
                "Calculated Earning",
                "Status Approval",
              ].map((header, idx) => (
                <Table.ColumnHeader key={idx} color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={12} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={12} textAlign="center">
                  <Error />
                </Table.Cell>
              </Table.Row>
            ) : payoutData?.data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={12} textAlign="center">
                  No Data Available
                </Table.Cell>
              </Table.Row>
            ) : (
              payoutData?.data?.map((data) => (
                <Table.Row key={data.detailId} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{data.agentId}</Table.Cell>
                  <Table.Cell textAlign="center">{data.agentName}</Table.Cell>
                  <Table.Cell textAlign="center">{data.phoneNumber}</Table.Cell>
                  <Table.Cell textAlign="center">{data.workDate}</Table.Cell>
                  <Table.Cell textAlign="center">{data.orders}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.cancelledOrders}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.totalDistance} KM
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.totalDistanceFromPickToDrop} KM
                  </Table.Cell>
                  <Table.Cell textAlign="center">{data.loginHours}</Table.Cell>
                  <Table.Cell textAlign="center">{data.cashInHand}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.totalEarning}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{data.deduction}</Table.Cell>
                  <Table.Cell textAlign="center">{data.totalSurge}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.calculatedEarning}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {data.paymentSettled ? (
                      <p className="text-green-500 font-[500]">Approved</p>
                    ) : (
                      <Button
                        onClick={() => toggleModal(data.agentId, data.detailId)}
                        className="bg-teal-700 text-white p-3"
                      >
                        Approve
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      {payoutData?.totalDocuments > 0 && (
        <PaginationRoot
          count={payoutData.totalDocuments}
          page={page}
          pageSize={50}
          defaultPage={1}
          onPageChange={(e) => setPage(e.page)}
          variant="solid"
          className="py-[30px] flex justify-center"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}

      <ApproveAgentPayout
        isOpen={showModal}
        onClose={closeModal}
        agentId={selected.agentId}
        detailId={selected.detailId}
      />
    </div>
  );
};

export default AgentPayout;
