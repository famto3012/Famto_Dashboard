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

import { approveAgent } from "@/hooks/agent/useAgent";

const ApproveAgent = ({ isOpen, onClose, agentId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["approve-agent", agentId],
    mutationFn: (agentId) => approveAgent(agentId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-detail", agentId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Agent approved successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorMessage = error?.message || "An unexpected error occurred";

      // If it's a comma-separated string, split and format it as bullet points
      const formattedErrors = errorMessage.includes(",")
        ? errorMessage
            .split(",")
            .map((err) => `• ${err.trim()}`)
            .join("\n")
        : errorMessage;

      toaster.create({
        title: "Error",
        description: formattedErrors,
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
            Approve Agent
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <p className="text-[18px] p-2">Are you sure want to Approve ?</p>

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
                onClick={() => mutate(agentId)}
              >
                {isPending ? `Approving...` : `Approve`}
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ApproveAgent;
