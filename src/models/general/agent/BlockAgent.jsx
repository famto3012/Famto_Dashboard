import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import { blockAgent } from "@/hooks/agent/useAgent";

const BlockAgent = ({ isOpen, onClose, agentId }) => {
  const [reason, setReason] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["block-agent", agentId],
    mutationFn: ({ agentId, reason }) => blockAgent(agentId, reason, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-detail", agentId]);
      setReason("");
      onClose();
      toaster.create({
        title: "Success",
        description: "Agent blocked successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while blocking agent",
        type: "error",
      });
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Block Agent
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <div className="flex items-center">
              <label htmlFor="reason" className="w-1/3 text-gray-500">
                Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-4 mt-5">
              <button
                className="bg-cyan-50 py-2 px-4 rounded-md"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-teal-800 text-white py-2 px-4 rounded-md"
                onClick={() => mutate({ agentId, reason })}
              >
                {isPending ? `Saving...` : `Save`}
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default BlockAgent;
