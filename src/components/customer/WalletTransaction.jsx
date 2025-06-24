import { useState } from "react";
import { Table } from "@chakra-ui/react";

import RenderIcon from "@/icons/RenderIcon";

import AddMoney from "@/models/general/customer/AddMoney";
import DeductMoney from "@/models/general/customer/DeductMoney";

const WalletTransaction = ({ data, customerId }) => {
  const [modal, setModal] = useState({
    add: false,
    deduct: false,
  });

  const toggleModal = (type) => {
    console.log(type);
    setModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const closeModal = () => {
    setModal({
      add: false,
      deduct: false,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between ms-11 me-7 mt-10 pt-[30px]">
        <h1 className="text-md font-semibold">Wallet</h1>

        <div className="flex gap-[30px] justify-end ">
          <button
            className="bg-red-100 text-red-500 rounded-md px-4 py-2 font-semibold flex items-center gap-2"
            onClick={() => toggleModal("deduct")}
          >
            <RenderIcon iconName="MinusIcon" size={18} loading={6} />
            <span className="hidden md:block">Money to Wallet</span>
          </button>

          <div>
            <button
              className="bg-teal-800 text-white rounded-md px-4 py-2 font-semibold  flex items-center gap-2 "
              onClick={() => toggleModal("add")}
            >
              <RenderIcon iconName="PlusIcon" size={18} loading={6} />
              <span className="hidden md:block">Money to Wallet</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 max-h-[20rem] overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Closing Balance",
                "Transaction Amount",
                "Transaction ID",
                "Order ID",
                "Date and Time",
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
                <Table.Cell colSpan={5} textAlign="center">
                  No Wallet Transactions Available
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item, index) => (
                <Table.Row key={index + 1} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">
                    {item.closingBalance}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.transactionAmount}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.transactionId}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.orderId}</Table.Cell>
                  <Table.Cell textAlign="center">{item.date}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <AddMoney
        isOpen={modal.add}
        onClose={closeModal}
        customerId={customerId}
      />
      <DeductMoney
        isOpen={modal.deduct}
        onClose={closeModal}
        customerId={customerId}
      />
    </>
  );
};

export default WalletTransaction;
