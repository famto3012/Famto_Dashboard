import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import {
  blockMerchantAgent,
  changeMerchantAgentStatus,
  fetchMerchantAgents,
} from "@/hooks/agent/useAgent";

import MerchantAddAgent from "@/models/general/agent/MerchantAddAgent";

const MerchantAgents = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState({
    add: false,
    block: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allAgents,
    isLoading: agentLoading,
    isError: agentError,
  } = useQuery({
    queryKey: ["merchant-agents"],
    queryFn: () => fetchMerchantAgents({}, navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-merchant-agent-status"],
    mutationFn: (id) => changeMerchantAgentStatus(id, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-agents"]);
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

  const handleBlockAgent = useMutation({
    mutationKey: ["block-merchant-agent"],
    mutationFn: (id) => blockMerchantAgent(id, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-agents"]);
      closeModal();
      toaster.create({
        title: "Success",
        description: "Agent blocked",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data.message || "Error in blocking agent",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      block: false,
    });
  };

  return (
    <div className="bg-gray-100 min-h-full w-full">
      <GlobalSearch />

      <div className="flex flex-col lg:flex-row justify-between mt-[30px] items-center px-[30px] gap-[20px] lg:gap-0">
        <h1 className="text-[18px] font-semibold">Delivery Agent</h1>

        <div className="flex gap-x-2 justify-end ">
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

      <div className=" overflow-x-auto">
        <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Full Name",
                "Phone",
                "Email",
                "Online Status",
                "Registration Approval",
                "Actions",
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
            {agentLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : allAgents?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  No agents yet
                </Table.Cell>
              </Table.Row>
            ) : agentError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  Error in fetching agents.
                </Table.Cell>
              </Table.Row>
            ) : (
              allAgents?.map((agent) => (
                <Table.Row key={agent._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{agent.fullName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {agent.phoneNumber}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{agent.email}</Table.Cell>
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
                      <p className="text-yellow-500">Pending</p>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <span
                      onClick={() => toggleModal("block", agent._id)}
                      className="text-red-500"
                    >
                      <RenderIcon
                        iconName="DeleteIcon"
                        size={20}
                        loading={6}
                      />
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <MerchantAddAgent isOpen={modal.add} onClose={closeModal} />

      {modal.block && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-[18px] font-semibold mb-4">Block Agent</h2>
            <p className="text-gray-500 mb-6">
              Do you want to block this agent?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="bg-gray-200 p-2 px-4 rounded text-black outline-none focus:outline-none"
              >
                Cancel
              </button>
              <button
                className="bg-red-500 p-2 px-4 rounded text-white"
                onClick={() => handleBlockAgent.mutate(selectedId)}
                disabled={handleBlockAgent.isPending}
              >
                {handleBlockAgent.isPending ? `Blocking...` : `Block`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantAgents;
