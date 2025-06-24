import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Table } from "@chakra-ui/react";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import { fetchAllActivityLogs } from "@/hooks/activityLog/activityLog";

const ActivityLog = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["activity-log"],
    queryFn: () => fetchAllActivityLogs(navigate),
  });

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="py-4 flex items-center">
        <p className="ps-4 text-[20px] font-[600]">
          Activity Logs
          <span className="text-gray-400 text-[16px] ms-2">
            ( Last 10 days )
          </span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]">
              <Table.ColumnHeader
                colSpan={2}
                color="white"
                textAlign="center"
                style={{ minWidth: "250px" }}
              >
                Date and Time
              </Table.ColumnHeader>
              <Table.ColumnHeader colSpan={6} color="white" textAlign="center">
                Description
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell
                  colSpan={8}
                  textAlign="center"
                  display="flex"
                  gapX={2}
                >
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={8} textAlign="center">
                  No Activity logs available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={8} textAlign="center">
                  <Error />
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item, index) => (
                <Table.Row key={index} className="h-[70px]">
                  <Table.Cell colSpan={2} textAlign="center">
                    {item.date} at {item.time}
                  </Table.Cell>
                  <Table.Cell colSpan={6} textAlign="start">
                    {item.description}
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

export default ActivityLog;
