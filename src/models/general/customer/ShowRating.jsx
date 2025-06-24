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

import ShowSpinner from "@/components/others/ShowSpinner";

import { fetchCustomerRatings } from "@/hooks/customer/useCustomer";

const ShowRating = ({ isOpen, onClose, customerId }) => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-ratings", customerId],
    queryFn: () => fetchCustomerRatings(customerId, navigate),
    enabled: isOpen,
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
          <DialogTitle className="font-[600] text-[18px]">Ratings</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="overflow-auto max-h-[30rem]">
            <Table.Root striped interactive stickyHeader>
              <Table.Header>
                <Table.Row className="bg-teal-700 h-14">
                  {["ID", "Name", "Ratings and Reviews"].map((header) => (
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
                {isLoading ? (
                  <Table.Row className="h-[70px]">
                    <Table.Cell colSpan={7} textAlign="center">
                      <ShowSpinner /> Loading...
                    </Table.Cell>
                  </Table.Row>
                ) : data?.length === 0 ? (
                  <Table.Row className="h-[70px]">
                    <Table.Cell colSpan={7} textAlign="center">
                      No Customers Ratings available
                    </Table.Cell>
                  </Table.Row>
                ) : isError ? (
                  <Table.Row className="h-[70px]">
                    <Table.Cell colSpan={7} textAlign="center">
                      Error in fetching customer ratings.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  data?.map((item, index) => (
                    <Table.Row key={index + 1} className={`h-[70px]`}>
                      <Table.Cell textAlign="center">
                        {item.agentId.id}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {item.agentId.fullName}
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
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ShowRating;
