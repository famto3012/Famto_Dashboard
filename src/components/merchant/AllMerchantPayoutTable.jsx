import { useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

import RenderIcon from "@/icons/RenderIcon";

import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import {
  downloadMerchantPayoutCSV,
  fetchMerchantPayout,
} from "@/hooks/merchant/useMerchant";
import ApprovePayout from "@/models/general/merchant/ApprovePayout";
import { formatDate } from "@/utils/formatter";

const AllMerchantPayoutTable = ({ filter }) => {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState({
    payoutId: null,
    merchantId: null,
  });
  const [showModal, setShowModal] = useState(false);

  const limit = 20;

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-merchant-payout", filter, page, limit],
    queryFn: () => fetchMerchantPayout(filter, page, limit, navigate),
    placeholderData: keepPreviousData,
  });

  const openModal = (payoutId, merchantId) => {
    setSelectedId({
      payoutId,
      merchantId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedId({
      payoutId: null,
      merchantId: null,
    });
    setShowModal(false);
  };

  return (
    <div className="mt-[20px] w-full overflow-x-auto">
      <Table.Root striped interactive>
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Merchant ID",
              "Merchant name",
              "Phone",
              "Date",
              "Completed Orders",
              "Total earnings",
              "Payout Approval",
              "Action",
            ].map((header, idx) => (
              <Table.ColumnHeader key={idx} color="white" textAlign="center">
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row className="h-[70px]">
              <Table.Cell
                colSpan={8}
                textAlign="center"
                className="flex items-center gap-2 justify-center"
              >
                <ShowSpinner /> Loading...
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={8} textAlign="center">
                <Error />
              </Table.Cell>
            </Table.Row>
          ) : data?.data?.length === 0 ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={8} textAlign="center">
                No Merchants Available
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.data?.map((item) => (
              <Table.Row key={item.payoutId} className={`h-[70px]`}>
                <Table.Cell textAlign="center">{item.merchantId}</Table.Cell>
                <Table.Cell textAlign="center">{item.merchantName}</Table.Cell>
                <Table.Cell textAlign="center">{item.phoneNumber}</Table.Cell>
                <Table.Cell textAlign="center">
                  {formatDate(item.date)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {item.completedOrders}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {item.totalCostPrice}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {!item.isSettled ? (
                    <Button
                      onClick={() => openModal(item.payoutId, item.merchantId)}
                      className="bg-teal-700 text-white p-2"
                    >
                      Approve
                    </Button>
                  ) : (
                    <p className="text-green-500 font-[500]">Approved</p>
                  )}
                </Table.Cell>
                <Table.Cell display="flex" justifyContent="center">
                  <Link
                    to={`/merchant/payout-detail?date=${item.date}&merchantId=${item.merchantId}`}
                    className="text-gray-900 bg-slate-400 p-3 rounded-full cursor-pointer"
                  >
                    <RenderIcon
                      iconName="ChevronRightIcon"
                      size={18}
                      loading={6}
                    />
                  </Link>
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
          pageSize={20}
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

      {/* Modal */}
      <ApprovePayout
        isOpen={showModal}
        onClose={closeModal}
        payoutId={selectedId.payoutId}
        merchantId={selectedId.merchantId}
      />
    </div>
  );
};

export default AllMerchantPayoutTable;
