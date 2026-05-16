import { Table } from "@chakra-ui/react";

const OrderItems = ({ data }) => {
  const { deliveryMode, items, customerDetail } = data;
  const pickupAddresses = customerDetail?.pickAddress || [];
  const dropAddresses = Array.isArray(customerDetail?.dropAddress)
  ? customerDetail.dropAddress
  : customerDetail?.dropAddress
  ? [customerDetail.dropAddress]
  : [];

  return (
    <>
      <h1 className="text-[18px] font-semibold m-5">Order Details</h1>

      <div className="max-w-[96%] mx-auto overflow-x-auto">
        {/* Pick and Drop */}
        {deliveryMode === "Pick and Drop" && (
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {[
                  "Pickup Address",
                  "Drop Address",
                  "Item Name",
                  "Dimensions",
                  "Weight",
                ].map((header, idx) => (
                  <Table.ColumnHeader
                    key={idx}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {pickupAddresses?.map((pickup, pIndex) =>
                pickup.items?.map((item, iIndex) => (
                  <Table.Row key={`${pIndex}-${iIndex}`} className="h-[70px]">
                    {/* Pickup Address */}
                    <Table.Cell textAlign="center">
                      {pickup.fullName}, {pickup.flat}, {pickup.area},{" "}
                      {pickup.landmark || "-"}
                    </Table.Cell>

                    {/* Drop Address (first one for all) */}
                    <Table.Cell textAlign="center">
                      {dropAddresses[0]
                        ? `${dropAddresses[0].fullName}, ${dropAddresses[0].flat}, ${dropAddresses[0].area}, ${dropAddresses[0].landmark || "-"}`
                        : "-"}
                    </Table.Cell>

                    {/* Item Name */}
                    <Table.Cell textAlign="center">{item.itemName}</Table.Cell>

                    {/* Dimensions */}
                    <Table.Cell textAlign="center">
                      {item.length && item.width && item.height ? (
                        <>
                          {item.length} x {item.width} x {item.height}{" "}
                          {item.unit}
                        </>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>

                    {/* Weight */}
                    <Table.Cell textAlign="center">
                      {item.weight || "-"}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        )}

        {/* Custom Order */}
        {deliveryMode === "Custom Order" && (
          <>
            {/* Purchased items from merchant catalog */}
            {items?.length > 0 && (
              <>
                <h2 className="text-[15px] font-semibold mx-1 mt-4 mb-2">
                  Purchased Items
                </h2>
                <Table.Root size="lg">
                  <Table.Header>
                    <Table.Row
                      className="bg-teal-700 h-[70px]"
                      textAlign="center"
                    >
                      {["Product Name", "Quantity", "Price", "Image"].map(
                        (header, idx) => (
                          <Table.ColumnHeader
                            key={idx}
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
                    {items.map((item, index) => (
                      <Table.Row key={`purchased-${index}`} className="h-[70px]">
                        <Table.Cell textAlign="center">
                          {item.productName || "-"}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.quantity ?? "-"}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.price ?? "-"}
                        </Table.Cell>
                        <Table.Cell
                          textAlign="center"
                          className="flex items-center justify-center"
                        >
                          {item?.itemImageURL ? (
                            <img
                              src={item.itemImageURL}
                              alt={item.productName}
                              className="h-[100px] w-[100px] object-contain"
                            />
                          ) : (
                            <span>-</span>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </>
            )}

            {/* Custom items from pickup locations */}
            {pickupAddresses?.some((p) => p.items?.length > 0) && (
              <>
                <h2 className="text-[15px] font-semibold mx-1 mt-6 mb-2">
                  Custom Items
                </h2>
                <Table.Root size="lg">
                  <Table.Header>
                    <Table.Row
                      className="bg-teal-700 h-[70px]"
                      textAlign="center"
                    >
                      {["Item Name", "Quantity", "Unit", "Num of Units", "Image"].map(
                        (header, idx) => (
                          <Table.ColumnHeader
                            key={idx}
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
                    {pickupAddresses.map((pickup, pIndex) =>
                      pickup.items?.map((item, iIndex) => (
                        <Table.Row
                          key={`pickup-${pIndex}-${iIndex}`}
                          className="h-[70px]"
                        >
                          <Table.Cell textAlign="center">
                            {item.itemName}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {item.quantity}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {item.unit || "-"}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {item.numOfUnits || "-"}
                          </Table.Cell>
                          <Table.Cell
                            textAlign="center"
                            className="flex items-center justify-center"
                          >
                            {!item?.itemImageURL ? (
                              <span>-</span>
                            ) : (
                              <img
                                src={item.itemImageURL}
                                alt={item.itemName}
                                className="h-[100px] w-[100px] object-contain"
                              />
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </>
            )}
          </>
        )}

        {/* Home Delivery and Take Away */}
        {(deliveryMode === "Take Away" || deliveryMode === "Home Delivery") && (
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {["Items","Variant", "Quantity"].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {dropAddresses?.map((drop, pIndex) =>
                drop.items?.map((item, iIndex) => (
                  <Table.Row
                    key={`drop-${pIndex}-${iIndex}`}
                    className="h-[70px]"
                  >
                    <Table.Cell textAlign="center">{item.itemName}</Table.Cell>
                    <Table.Cell textAlign="center">{item.variantTypeName}</Table.Cell>
                    <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                
                    {/* <Table.Cell textAlign="center">{item.costPrice}</Table.Cell> */}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        )}
      </div>
    </>
  );
};

export default OrderItems;
