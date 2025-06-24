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

import { approveAgentPayout } from "@/hooks/agent/useAgent";

const ApproveAgentPayout = ({ isOpen, onClose, agentId, detailId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["approve-agent-payout", agentId, detailId],
    mutationFn: (agentId) => approveAgentPayout(agentId, detailId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-payout"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Agent payout approved successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while approving agent payout",
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
            Approve Payout
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <p className="text-[18px]">Are you sure want to Approve ?</p>

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

export default ApproveAgentPayout;
