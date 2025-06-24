import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  assignAgentToTask,
  getAgentsAccordingToGeofence,
} from "@/hooks/deliveryManagement/useDeliveryManagement";
import { FaSpinner } from "react-icons/fa";

const AssignAgent = ({ isOpen, onClose, taskId }) => {
  const [formData, setFormData] = useState({
    taskId: "",
    geofenceStatus: false,
    name: "",
  });
  const [selectedAgent, setSelectedAgent] = useState({
    agentId: "",
    agentName: "",
  });
  const [debounceQuery, setDebounceQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchFocus = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ ...formData, taskId });
  }, [taskId]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFormData({ ...formData, name: debounceQuery });
    }, 500);

    return () => clearTimeout(timeOut);
  }, [debounceQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["agents-according-to-geofence", formData],
    queryFn: () => getAgentsAccordingToGeofence(formData, navigate),
    enabled: !!formData.taskId && isInputFocused,
  });

  const onModalClose = () => {
    setSelectedAgent({
      agentId: "",
      agentName: "",
    });
    setDebounceQuery("");
    setFormData({
      taskId: "",
      geofenceStatus: false,
      name: "",
    });
    onClose();
  };

  const handleAssignAgentToTask = useMutation({
    mutationKey: ["assign-agent-to-task"],
    mutationFn: ({ agentId, taskId }) => {
      return assignAgentToTask(agentId, taskId, navigate);
    },
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Agent successfully assigned to the task",
        type: "success",
      });
      onModalClose();
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in assigning agent",
        type: "error",
      });
    },
  });

  const handleAssignAgent = () => {
    if (!selectedAgent.agentId) {
      toaster.create({
        title: "Error",
        description: "Please select an agent before assigning",
        type: "error",
      });
      return;
    }

    handleAssignAgentToTask.mutate({ agentId: selectedAgent.agentId, taskId });
  };

  return (
    <DialogRoot open={isOpen} placement="center" motionPreset="slide-in-bottom">
      <DialogContent>
        <DialogCloseTrigger onClick={onModalClose} />
        <DialogHeader className="text-[18px] font-[600]">
          Assign Agent
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[1rem] w-full">
            <div className="flex flex-row items-center">
              <label htmlFor="" className="text-[14px] w-[30%]">
                Task ID
              </label>

              <label htmlFor="" className="uppercase text-[14px] font-medium">
                {taskId}
              </label>
            </div>

            <div className="flex flex-row items-center">
              <label htmlFor="" className="text-[14px] w-[30%]">
                Geofence
              </label>

              <Switch
                colorPalette="teal"
                checked={formData?.geofenceStatus}
                onCheckedChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    geofenceStatus: !prev.geofenceStatus,
                  }))
                }
              />
            </div>

            <div className="flex flex-row items-start w-full relative">
              <label htmlFor="" className="text-[14px] w-[30%] pt-3">
                Agent
              </label>

              <div className="relative w-[55%]">
                <input
                  placeholder="Search Agents"
                  ref={searchFocus}
                  value={debounceQuery || selectedAgent.agentName}
                  onChange={(e) => {
                    setSelectedAgent({ agentName: "", agentId: "" });
                    setDebounceQuery(e.target.value);
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                  className="border h-[3rem] px-2 rounded-md w-full border-gray-400 outline-none focus:outline-none"
                />

                {isInputFocused && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md mt-1 z-10 max-h-[10rem] overflow-auto">
                    {isLoading ? (
                      <div className="h-[3rem] flex items-center justify-center">
                        <FaSpinner className="animate-spin text-gray-500" />
                      </div>
                    ) : Array.isArray(data) && data.length > 0 ? (
                      data.map((agent) => (
                        <div
                          onMouseDown={() => {
                            setSelectedAgent({
                              agentId: agent._id,
                              agentName: agent.name,
                            });
                            setDebounceQuery("");
                            setIsInputFocused(false);
                          }}
                          key={agent._id}
                          className="p-2 hover:bg-gray-300 cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{agent.name}</p>
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    agent.workStructure === "Normal"
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                  }`}
                                />
                              </div>
                              <p className="text-sm text-gray-600">
                                ID: {agent._id}
                              </p>
                            </div>

                            <div className="flex flex-col items-center">
                              <p
                                className={`text-[14px] text-gray-800 font-medium`}
                              >
                                {agent.distance} KM
                              </p>

                              <p
                                className={`text-[14px] ${agent.status === "Free" ? "text-green-600" : agent.status === "Busy" ? "text-red-600" : "text-gray-600"}`}
                              >
                                {agent.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        No agents found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={onModalClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={handleAssignAgent}
          >
            {handleAssignAgentToTask.isPending
              ? `Assigning...`
              : `Assign agent`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AssignAgent;
