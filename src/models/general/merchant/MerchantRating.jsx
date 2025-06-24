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

const MerchantRating = ({ isOpen, onClose, data }) => {
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
          <DialogTitle></DialogTitle>
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
                {data?.length === 0 ? (
                  <Table.Row className={`h-[70px]`}>
                    <Table.Cell textAlign="center" colSpan={3}>
                      No Ratings available
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  data?.map((item, index) => (
                    <Table.Row key={index + 1} className={`h-[70px]`}>
                      <Table.Cell textAlign="center">{item.id}</Table.Cell>
                      <Table.Cell textAlign="center">{item.name}</Table.Cell>
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

export default MerchantRating;
