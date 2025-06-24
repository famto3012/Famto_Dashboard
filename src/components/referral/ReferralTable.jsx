import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Table } from "@chakra-ui/react";

import { fetchReferralTableData } from "@/hooks/referral/useReferral";
import ShowSpinner from "@/components/others/ShowSpinner";

const ReferralTable = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-referrals"],
    queryFn: () => fetchReferralTableData(navigate),
  });

  return (
    <>
      <p className="mx-5 mb-5 font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]">
        Referral Statics
      </p>

      <div className="mt-5 max-h-[30rem] overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]">
              {[
                "Customers Id",
                "Name",
                "Customers Email",
                "Referral Code",
                "Successful Refers",
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
                <Table.Cell colSpan={5} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  No Referral Data Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  Error in fetching referral data.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.customerId} className={`h-[70px]`}>
                  <Table.Cell textAlign="center">{item.customerId}</Table.Cell>
                  <Table.Cell textAlign="center">{item.name}</Table.Cell>
                  <Table.Cell textAlign="center">{item.email}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.referralCode}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.numOfReferrals}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </>
  );
};

export default ReferralTable;
