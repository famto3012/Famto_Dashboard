import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import { Table } from "@chakra-ui/react";

import RenderIcon from "@/icons/RenderIcon";

import { fetchMerchantPayoutDetail } from "@/hooks/merchant/useMerchant";

const MerchantPayoutDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const merchantId = searchParams.get("merchantId");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-payout-detail"],
    queryFn: () => fetchMerchantPayoutDetail(date, merchantId, navigate),
  });

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex items-center justify-start gap-2 px-[30px] mt-[20px]">
        <span onClick={() => navigate("/merchant/payout")}>
          <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
        </span>
        <h3 className="font-[600] text-[18px]">Merchant Payout Detail</h3>
      </div>

      <div className="mt-[20px] w-full overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Product Name",
                "Variant Name",
                "Price",
                "Cost Price",
                "No. of orders",
                "Total Payable",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell
                  colSpan={6}
                  textAlign="center"
                  className="flex items-center gap-2 justify-center"
                >
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  <Error />
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item, index) => (
                <Table.Row key={index + 1} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{item.productName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.variantName || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.price}</Table.Cell>
                  <Table.Cell textAlign="center">{item.costPrice}</Table.Cell>
                  <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                  <Table.Cell textAlign="center">{item.totalCost}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default MerchantPayoutDetail;
