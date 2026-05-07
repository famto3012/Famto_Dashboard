import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button, Input } from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";

import { getAllAgents } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { reassignAgent } from "@/hooks/order/useOrder";

const ReassignAgent = ({ isOpen, onClose, orderId, currentAgentId }) => {
  const [search, setSearch] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["agents-for-reassign", search],
    queryFn: () =>
      getAllAgents({ fullName: search, filter: "" }, navigate),
    enabled: isOpen,
  });

  const reassignMutation = useMutation({
    mutationFn: () => reassignAgent(orderId, selectedAgentId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toaster.create({
        title: "Success",
        description: "Agent reassigned successfully",
        type: "success",
      });
      handleClose();
    },
    onError: (message) => {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      });
    },
  });

  const handleClose = () => {
    setSearch("");
    setSelectedAgentId(null);
    onClose();
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={handleClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="text-[16px] font-[600]">
          Reassign Delivery Agent
        </DialogHeader>

        <DialogBody>
          <Input
            placeholder="Search agent by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedAgentId(null);
            }}
            className="mb-3 border border-gray-300 rounded-md p-2 w-full text-sm"
          />

          <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center p-4 gap-2 text-sm text-gray-500">
                <ShowSpinner /> Loading agents...
              </div>
            ) : agents.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">
                No agents found
              </p>
            ) : (
              agents.map((agent) => {
                const isCurrentAgent =
                  agent._id?.toString() === currentAgentId?.toString();
                const isSelected = selectedAgentId === agent._id;

                return (
                  <div
                    key={agent._id}
                    onClick={() => !isCurrentAgent && setSelectedAgentId(agent._id)}
                    className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors
                      ${isCurrentAgent
                        ? "bg-gray-50 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-teal-50 cursor-pointer"
                        : "hover:bg-gray-50 cursor-pointer"
                      }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {agent.fullName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {agent.phoneNumber || "No phone"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          agent.status === "Free"
                            ? "bg-green-100 text-green-600"
                            : agent.status === "Busy"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {agent.status || "Inactive"}
                      </span>

                      {isCurrentAgent && (
                        <span className="text-xs text-gray-400 italic">
                          Current
                        </span>
                      )}

                      {isSelected && (
                        <span className="text-teal-600 font-bold text-sm">✓</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={handleClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={() => reassignMutation.mutate()}
            disabled={!selectedAgentId || reassignMutation.isPending}
          >
            {reassignMutation.isPending ? "Reassigning..." : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ReassignAgent;
