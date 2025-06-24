import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import ShowSpinner from "@/components/others/ShowSpinner";

import AuthContext from "@/context/AuthContext";

import { fetchMerchantSubscriptionLogs } from "@/hooks/commAndSubs/useSubscription";

import ConfirmSubscriptionPayment from "@/models/general/commAndSubs/ConfirmSubscriptionPayment";

const MerchantSubLog = ({ selected, filter }) => {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 50;

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-merchant-sub-logs", filter, page, limit],
    queryFn: () => fetchMerchantSubscriptionLogs(page, limit, filter, navigate),
    enabled: selected === "Merchant",
    placeholderData: keepPreviousData,
  });

  const toggleModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  return (
    <div className=" overflow-x-auto">
      <Table.Root striped interactive>
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Merchant Name",
              "Subscription Plans",
              "Total Amount",
              "Payment Mode",
              "Start Date",
              "Status",
            ].map((header, index) => (
              <Table.ColumnHeader key={index} color="white" textAlign="center">
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={6} textAlign="center">
                <ShowSpinner /> Loading...
              </Table.Cell>
            </Table.Row>
          ) : data?.length === 0 ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={6} textAlign="center">
                No Merchant subscription logs available
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={6} textAlign="center">
                Error in fetching merchant subscription logs.
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.data?.map((item) => (
              <Table.Row key={item.logId} className={`h-[70px]`}>
                <Table.Cell textAlign="center">{item.merchantName}</Table.Cell>
                <Table.Cell textAlign="center">{item.planName}</Table.Cell>
                <Table.Cell textAlign="center">{item.amount}</Table.Cell>
                <Table.Cell textAlign="center">{item.paymentMode}</Table.Cell>
                <Table.Cell textAlign="center">{item.startDate}</Table.Cell>
                <Table.Cell textAlign="center">
                  {item.status === "Unpaid" && role !== "Merchant" ? (
                    <button
                      onClick={() => toggleModal(item.logId)}
                      className="bg-teal-700 text-white p-3 rounded-md"
                    >
                      Set as paid
                    </button>
                  ) : (
                    <p className="text-green-600">{item.status}</p>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {data?.total && (
        <PaginationRoot
          count={data.total}
          page={page}
          pageSize={50}
          defaultPage={1}
          onPageChange={(e) => setPage(e.page)}
          variant="solid"
          className="py-[30px] flex justify-center"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}

      <ConfirmSubscriptionPayment
        isOpen={showModal}
        onClose={closeModal}
        logId={selectedId}
      />
    </div>
  );
};

export default MerchantSubLog;
