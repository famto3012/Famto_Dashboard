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

import { rejectAgent } from "@/hooks/agent/useAgent";

const RejectAgent = ({ isOpen, onClose, agentId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["reject-agent", agentId],
    mutationFn: (agentId) => rejectAgent(agentId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-detail", agentId]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Agent rejected successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while rejecting agent",
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
            Reject Agent
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
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={() => mutate(agentId)}
                disabled={isPending}
              >
                {isPending ? `Rejecting...` : `Reject`}
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RejectAgent;
