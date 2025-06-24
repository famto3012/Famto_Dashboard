import { useState } from "react";
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

import { fetchCustomerSubscriptionLogs } from "@/hooks/commAndSubs/useSubscription";

const CustomerSubLog = ({ selected, filter }) => {
  const [page, setPage] = useState(1);
  const limit = 50;

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-customer-sub-logs", filter, page, limit],
    queryFn: () => fetchCustomerSubscriptionLogs(page, limit, filter, navigate),
    enabled: selected === "Customer",
    placeholderData: keepPreviousData,
  });

  return (
    <div className="overflow-x-auto">
      <Table.Root striped interactive stickyHeader>
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Customer Name",
              "Customer Id",
              "Subscription Plans",
              "Total Amount",
              "Payment Mode",
              "Start date",
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
                No customer subscription logs available
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={6} textAlign="center">
                Error in fetching customer subscription logs.
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.data?.map((item) => (
              <Table.Row key={item.logId} className={`h-[70px]`}>
                <Table.Cell textAlign="center">{item.customerName}</Table.Cell>
                <Table.Cell textAlign="center">{item.customerId}</Table.Cell>
                <Table.Cell textAlign="center">{item.plan}</Table.Cell>
                <Table.Cell textAlign="center">{item.amount}</Table.Cell>
                <Table.Cell textAlign="center">{item.paymentMode}</Table.Cell>
                <Table.Cell textAlign="center">{item.startDate}</Table.Cell>
                <Table.Cell textAlign="center">{item.status}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {data?.total && (
        <PaginationRoot
          count={data.total}
          page={page}
          pageSize={30}
          defaultPage={1}
          onPageChange={(e) => setPage(e.page)}
          variant="solid"
          className="py-[30px] flex justify-center bg-white"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}
    </div>
  );
};

export default CustomerSubLog;
