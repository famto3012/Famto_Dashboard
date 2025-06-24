import { Table } from "@chakra-ui/react";

const OrderDetails = ({ data }) => {
  return (
    <div>
      <h1 className="text-md font-semibold mx-11 mt-[40px]">Order Details</h1>

      <div className="mt-5 max-h-[30rem] overflow-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Order ID",
                "Order Status",
                "Merchant Name",
                "Delivery Mode",
                "Order Time",
                "Delivery Time",
                "Payment Method",
                "Delivery Option",
                "Amount",
                "Payment Status",
              ].map((header, idx) => (
                <Table.ColumnHeader key={idx} color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={10} textAlign="center">
                  No Past Orders Available
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.orderId} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{item.orderId}</Table.Cell>
                  <Table.Cell textAlign="center">{item.orderStatus}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.merchantName}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.deliveryMode}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.orderTime}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.deliveryTime}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.paymentMethod}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.deliveryOption}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.amount}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.paymentStatus}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default OrderDetails;
