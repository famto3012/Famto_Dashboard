import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HStack, Table } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import ShowSpinner from "../others/ShowSpinner";

import {
  fetchAllAgentSurge,
  updateAgentSurgeStatus,
} from "@/hooks/pricing/useAgentPricing";

import AddAgentSurge from "@/models/configure/pricing/AddAgentSurge";
import EditAgentSurge from "@/models/configure/pricing/EditAgentSurge";
import DeleteAgentSurge from "@/models/configure/pricing/DeleteAgentSurge";

const AgentSurge = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: allSurge,
    isLoading: isTableLoading,
    isError: isTableError,
  } = useQuery({
    queryKey: ["all-agent-surge"],
    queryFn: () => fetchAllAgentSurge(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggleAgentSurge"],
    mutationFn: (surgeId) => updateAgentSurgeStatus(surgeId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agent-surge"]);
      toaster.create({
        title: "Success",
        description: "Surge status updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating surge status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      edit: false,
      delete: false,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mx-9 mt-8">
        <h1 className="text-md">Surge</h1>
        <div>
          <button
            className="bg-teal-700 text-white rounded-md flex items-center space-x-1 p-2"
            onClick={() => toggleModal("add")}
          >
            <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            <span>Add surge</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Rule Name",
                "Base Fare",
                "Base Distance Fare",
                "Waiting Fare",
                "Waiting Time",
                "Geofence",
                "Status",
              ].map((header, idx) => (
                <Table.ColumnHeader key={idx} color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isTableLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={7} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : allSurge?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={7} textAlign="center">
                  No Surge Available
                </Table.Cell>
              </Table.Row>
            ) : isTableError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={7} textAlign="center">
                  Error in fetching agent surge.
                </Table.Cell>
              </Table.Row>
            ) : (
              allSurge?.map((surge) => (
                <Table.Row key={surge._id} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{surge.ruleName}</Table.Cell>
                  <Table.Cell textAlign="center">{surge.baseFare}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {surge.baseDistance}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {surge.waitingFare}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {surge.waitingTime}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {surge?.geofenceId?.map((geofence, index) => (
                      <span key={index} className="flex flex-col">
                        {geofence.name}
                        {index < surge.geofenceId.length - 1 && ", "}
                      </span>
                    ))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4" justify="center">
                      {toggleStatus.isPending && selectedId === surge._id ? (
                        <ShowSpinner />
                      ) : (
                        <Switch
                          colorPalette="teal"
                          checked={surge?.status}
                          onChange={() => toggleStatus.mutate(surge._id)}
                        />
                      )}

                      <span
                        onClick={() => toggleModal("edit", surge._id)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", surge._id)}
                        className="text-red-500"
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={24}
                          loading={6}
                        />
                      </span>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <AddAgentSurge isOpen={modal.add} onClose={closeModal} />
      <EditAgentSurge
        isOpen={modal.edit}
        onClose={closeModal}
        surgeId={selectedId}
      />
      <DeleteAgentSurge
        isOpen={modal.delete}
        onClose={closeModal}
        surgeId={selectedId}
      />
    </>
  );
};

export default AgentSurge;
