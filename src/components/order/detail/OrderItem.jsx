import { Table } from "@chakra-ui/react";

const OrderItems = ({ data }) => {
  const { deliveryMode, items } = data;

  return (
    <>
      <h1 className="text-[18px] font-semibold m-5">Order Details</h1>

      <div className="max-w-[96%] mx-auto overflow-x-auto">
        {/* Pick and Drop */}
        {deliveryMode === "Pick and Drop" && (
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {["Items Type", "Dimensions", "Weight Range"].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {items?.map((item, index) => (
                <Table.Row key={index + 1} className="h-[70px]">
                  <Table.Cell textAlign="center">{item.itemName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item?.length && item?.width && item?.height ? (
                      <>
                        {item?.length} x {item?.width} x {item?.height}{" "}
                        {item.unit}
                      </>
                    ) : (
                      <small>-</small>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item?.weight || "-"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {/* Custom Order */}
        {deliveryMode === "Custom Order" && (
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {["Items", "Quantity", "Unit", "Image"].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {items?.map((item, index) => (
                <Table.Row key={index + 1} className="h-[70px]">
                  <Table.Cell textAlign="center">{item.itemName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.quantity} {item.unit}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.numOfUnits}</Table.Cell>
                  <Table.Cell
                    textAlign="center"
                    className="flex items-center justify-center"
                  >
                    {!item?.itemImageURL ? (
                      <span>-</span>
                    ) : (
                      <img
                        src={item?.itemImageURL}
                        alt={item?.itemName}
                        className="h-[100px] w-[100px] object-contain"
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {/* Home Delivery and Take Away */}
        {(deliveryMode === "Take Away" || deliveryMode === "Home Delivery") && (
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {["Items", "Quantity", "Amount"].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {items?.map((item, index) => (
                <Table.Row key={index + 1} className="h-[70px]">
                  <Table.Cell textAlign="center">
                    {item.itemName}{" "}
                    {item?.variantTypeName ? (
                      <>{item?.variantTypeName}</>
                    ) : (
                      <>{""}</>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                  <Table.Cell textAlign="center">{item.price}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>
    </>
  );
};

export default OrderItems;
