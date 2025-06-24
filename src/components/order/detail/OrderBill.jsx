import { Table } from "@chakra-ui/react";

const OrderBill = ({ data }) => {
  const { _id: orderId, billDetail } = data;

  return (
    <div className={`${orderId.charAt(0) === "O" ? "" : "mb-5"}`}>
      <h1 className="text-[18px] font-semibold m-5">Bill Summary</h1>

      <div className=" max-w-[96%] mx-auto pb-[20px] overflow-x-auto">
        <Table.Root size="lg">
          <Table.Body>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Price</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.itemTotal?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Delivery Charges</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.deliveryCharge?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Added Tip</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.addedTip?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Discount</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.discountedAmount?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Sub Total</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.subTotal?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Taxes & Fees</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.taxAmount?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>

            <Table.Row className="h-[70px]" bg="teal.700">
              <Table.Cell textAlign="left" color="white">
                Net Payable Amount
              </Table.Cell>
              <Table.Cell textAlign="right" color="white">
                {billDetail?.grandTotal?.toFixed(2) || 0}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default OrderBill;
