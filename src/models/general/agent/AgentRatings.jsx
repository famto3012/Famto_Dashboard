import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Table } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Rating } from "@/components/ui/rating";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { fetchRatingsOfAgent } from "@/hooks/agent/useAgent";

const AgentRatings = ({ isOpen, onClose, agentId }) => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["agent-ratings", agentId],
    queryFn: () => fetchRatingsOfAgent(agentId, navigate),
    enabled: isOpen,
  });

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
      size="lg"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Agent Ratings & Reviews
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <Table.Root striped interactive stickyHeader>
              <Table.Header>
                <Table.Row className="bg-teal-700 h-14">
                  {["Customer ID", "Customer name", "Ratings & Reviews"].map(
                    (header, index) => (
                      <Table.ColumnHeader
                        key={index}
                        color="white"
                        textAlign="center"
                      >
                        {header}
                      </Table.ColumnHeader>
                    )
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data?.length === 0 && (
                  <Table.Row className={`h-[70px]`}>
                    <Table.Cell colSpan={3} textAlign="center">
                      No Ratings & Reviews Available
                    </Table.Cell>
                  </Table.Row>
                )}

                {data?.map((item) => (
                  <Table.Row key={item.id} className={`h-[70px]`}>
                    <Table.Cell textAlign="center">
                      {item.customerId.id}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {item.customerId.fullName}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Rating
                        readOnly
                        allowHalf
                        defaultValue={item.rating}
                        size="sm"
                        colorPalette="yellow"
                      />
                      <p>{item.review}</p>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AgentRatings;
