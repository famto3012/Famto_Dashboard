import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import {
  fetchAllMerchants,
  updateStatusMutation,
} from "@/hooks/merchant/useMerchant";

import ApproveMerchant from "@/models/general/merchant/ApproveMerchant";
import RejectMerchant from "@/models/general/merchant/RejectMerchant";

const AllMerchantsTable = ({ filter }) => {
  const [modal, setModal] = useState({
    approve: false,
    reject: false,
    add: false,
  });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-merchants", filter, page],
    queryFn: () => fetchAllMerchants(filter, page, navigate),
    placeholderData: keepPreviousData,
  });

  const handleUpdateStatusMutation = useMutation({
    mutationKey: ["update-merchant-status"],
    mutationFn: (merchantId) => updateStatusMutation(merchantId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-merchants"]);
      toaster.create({
        title: "Success",
        description: `Merchant status updated successfully`,
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data.message || `Error in updating merchant status, `,
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      approve: false,
      reject: false,
    });
  };

  return (
    <div className="mt-[20px] w-full overflow-y-auto">
      <Table.Root striped interactive>
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Merchant ID",
              "Merchant Name",
              "Phone",
              "Rating",
              "Subscription Status",
              "Serviceable",
              "Geofence",
              "Status",
              "Registration Approval",
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
              <Table.Cell colSpan={9} textAlign="center">
                <ShowSpinner /> <span>Loading...</span>
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={9} textAlign="center">
                <Error />
              </Table.Cell>
            </Table.Row>
          ) : data?.data?.length === 0 ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={9} textAlign="center">
                No Merchants Available
              </Table.Cell>
            </Table.Row>
          ) : (
            data?.data?.map((item) => (
              <Table.Row key={item.merchantId} className={`h-[70px]`}>
                <Table.Cell textAlign="center">
                  <Link
                    to={`/merchant/${item.merchantId}`}
                    className="underline underline-offset-3"
                  >
                    {item.merchantId}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="center">{item.merchantName}</Table.Cell>
                <Table.Cell textAlign="center">{item.phoneNumber}</Table.Cell>
                <Table.Cell textAlign="center">{item.averageRating}</Table.Cell>
                <Table.Cell textAlign="center">
                  {item.subscriptionStatus}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {item.isServiceableToday}
                </Table.Cell>
                <Table.Cell textAlign="center">{item.geofence}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Switch
                    colorPalette="teal"
                    checked={item.status}
                    onCheckedChange={() =>
                      handleUpdateStatusMutation.mutate(item.merchantId)
                    }
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {item.isApproved === "Pending" ? (
                    <HStack justifyContent="center" direction="row">
                      <span
                        onClick={() => toggleModal("approve", item.merchantId)}
                        className="text-green-500"
                      >
                        <RenderIcon
                          iconName="CheckIcon"
                          size={28}
                          loading={6}
                        />
                      </span>
                      <span
                        onClick={() => toggleModal("reject", item.merchantId)}
                        className="text-red-500"
                      >
                        <RenderIcon
                          iconName="CancelIcon"
                          size={28}
                          loading={6}
                        />
                      </span>
                    </HStack>
                  ) : (
                    <p className="text-green-500 font-[500] text-center">
                      {item.isApproved}
                    </p>
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

      {/* Models */}
      <ApproveMerchant
        isOpen={modal.approve}
        onClose={closeModal}
        merchantId={selectedId}
      />
      <RejectMerchant
        isOpen={modal.reject}
        onClose={closeModal}
        merchantId={selectedId}
      />
    </div>
  );
};

export default AllMerchantsTable;
