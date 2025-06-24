import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { Table } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";

import { agentStatusOptions, agentVehicleOptions } from "@/utils/defaultData";

import {
  downloadAgentCSV,
  fetchAllAgents,
  updateAgentStatus,
} from "@/hooks/agent/useAgent";

import AddAgent from "@/models/general/agent/AddAgent";
import ApproveAgent from "@/models/general/agent/ApproveAgent";
import RejectAgent from "@/models/general/agent/RejectAgent";
import FilterWrapper from "@/components/SideFilters/FilterWrapper";
import AgentFilters from "@/components/SideFilters/AgentFilters";

const AllAgents = () => {
  const [filter, setFilter] = useState({
    status: "",
    geofence: "",
    vehicleType: "",
    name: "",
  });
  const [debouncedName, setDebouncedName] = useState(filter.name);
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState({
    add: false,
    approve: false,
    reject: false,
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const {
    data: allAgents,
    isLoading: agentLoading,
    isError: agentError,
  } = useQuery({
    queryKey: ["all-agents", filter],
    queryFn: () => fetchAllAgents(filter, navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-agent-status-table"],
    mutationFn: (id) => updateAgentStatus(id, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agents", filter]);
      toaster.create({
        title: "Success",
        description: "Agent status updated",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data.message || "Error in updating agent status",
        type: "error",
      });
    },
  });

  const downloadCSV = useMutation({
    mutationKey: ["agent-csv"],
    mutationFn: (filter) => downloadAgentCSV(filter, navigate),
  });

  const handleDownloadCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCSV.mutate(filter, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Agent.csv");
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
    { label: "All", value: "All" },
    ...(Array.isArray(allGeofence)
      ? allGeofence?.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      approve: false,
      reject: false,
    });
  };

  const handleFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  const showTableLoading = geofenceLoading || agentLoading;
  const showTableError = geofenceError || agentError;

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prevFilter) => ({
        ...prevFilter,
        name: debouncedName,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedName]);

  return (
    <div className="bg-gray-100 min-h-full w-full">
      <GlobalSearch />

      <div className="flex flex-col lg:flex-row justify-between mt-[30px] items-center px-[30px] gap-[20px] lg:gap-0">
        <h1 className="text-[18px] font-semibold">Delivery Agent</h1>

        <div className="flex gap-x-2 justify-end ">
          <button
            className="bg-cyan-100 text-black rounded-md px-4 py-2 font-semibold flex items-center gap-2"
            onClick={handleDownloadCSV}
          >
            <RenderIcon iconName="DownloadIcon" size={16} loading={6} />
            <span>CSV</span>
          </button>

          <Link to="/agent/payout">
            <button className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold flex items-center gap-2">
              <RenderIcon iconName="PricingIcon" size={16} loading={6} />
              <span className="hidden lg:block">Agent Payout</span>
              <span className="block lg:hidden">Payout</span>
            </button>
          </Link>

          <div>
            <button
              className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold flex items-center gap-2"
              onClick={() => toggleModal("add")}
            >
              <RenderIcon iconName="PlusIcon" size={16} loading={6} />
              <span className="hidden lg:block">Add Agent</span>
              <span className="block lg:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-[20px] lg:mt-10 px-[10px] bg-white rounded-lg mx-5 p-6">
        <div className="hidden lg:flex items-center justify-evenly gap-3 bg-white rounded-lg ">
          <Select
            options={agentStatusOptions}
            value={agentStatusOptions.find(
              (option) => option.value === filter.status
            )}
            onChange={(option) =>
              setFilter({ ...filter, status: option.value })
            }
            className="min-w-[10rem]"
            placeholder="Status"
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

          <Select
            options={agentVehicleOptions}
            value={agentVehicleOptions.find(
              (option) => option.value === filter.vehicleType
            )}
            onChange={(option) =>
              setFilter({ ...filter, vehicleType: option.value })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Vehicle type"
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

          <Select
            options={geofenceOptions}
            value={geofenceOptions.find(
              (option) => option.value === filter.geofence
            )}
            onChange={(option) =>
              setFilter({ ...filter, geofence: option.value })
            }
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Geofence"
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

        <div className="flex items-center justify-between lg:justify-end gap-[30px] w-full">
          <input
            type="search"
            placeholder="Search agent"
            className="bg-gray-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
            value={debouncedName}
            onChange={(e) => setDebouncedName(e.target.value)}
          />

          <span onClick={() => setFilterOpen(true)} className="text-gray-400">
            <RenderIcon iconName="FilterIcon" size={20} loading={6} />
          </span>

          <FilterWrapper filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
            <AgentFilters
              currentValue={filter}
              geofenceOptions={geofenceOptions}
              onFilterChange={handleFilterChange}
            />
          </FilterWrapper>
        </div>
      </div>

      <div className=" overflow-x-auto">
        <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Agent ID",
                "Full Name",
                "Email",
                "Phone",
                "Manager",
                "Geofence",
                "Online Status",
                "Registration Approval",
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
                <Table.Cell colSpan={8} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : allAgents?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={8} textAlign="center">
                  No Agents Available
                </Table.Cell>
              </Table.Row>
            ) : showTableError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={8} textAlign="center">
                  Error in fetching agents.
                </Table.Cell>
              </Table.Row>
            ) : (
              allAgents?.map((agent) => (
                <Table.Row key={agent._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">
                    <Link
                      to={`/agent/${agent._id}`}
                      className=" underline underline-offset-2"
                    >
                      {agent._id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell textAlign="center">{agent.fullName}</Table.Cell>
                  <Table.Cell textAlign="center">{agent.email}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {agent.phoneNumber}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{agent.manager}</Table.Cell>
                  <Table.Cell textAlign="center">{agent.geofence}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Switch
                      colorPalette="teal"
                      disabled={toggleStatus.isPending}
                      checked={agent.status}
                      onChange={() => toggleStatus.mutate(agent._id)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {agent.isApproved === "Approved" && (
                      <p className="text-green-500">Approved</p>
                    )}

                    {agent.isApproved === "Pending" && (
                      <div className="flex items-center justify-center gap-x-5">
                        <span
                          onClick={() => toggleModal("approve", agent._id)}
                          className="text-green-500"
                        >
                          <RenderIcon
                            iconName="CheckIcon"
                            size={28}
                            loading={6}
                          />
                        </span>
                        <span
                          onClick={() => toggleModal("reject", agent._id)}
                          className="text-red-500"
                        >
                          <RenderIcon
                            iconName="CancelIcon"
                            size={28}
                            loading={6}
                          />
                        </span>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <AddAgent isOpen={modal.add} onClose={closeModal} />
      <ApproveAgent
        isOpen={modal.approve}
        onClose={closeModal}
        agentId={selectedId}
      />
      <RejectAgent
        isOpen={modal.reject}
        onClose={closeModal}
        agentId={selectedId}
      />
    </div>
  );
};

export default AllAgents;
