import Select from "react-select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "@/utils/formatter";
import { getTaskAccordingToFilter } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { taskStatusOptions } from "@/utils/defaultData";
import AssignAgent from "@/models/general/deliveryManagement/AssignAgent";
import { Card } from "@chakra-ui/react";
import ShowSpinner from "@/components/others/ShowSpinner";
import TaskDetails from "@/models/general/deliveryManagement/TaskDetails";

const AllTask = ({ onShowShopLocationOnMap, onDate }) => {
  const [taskFilter, setTaskFilter] = useState({
    filter: "Unassigned",
    orderId: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [taskData, setTaskData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modal, setModal] = useState({
    assignAgent: false,
    viewDetail: false,
  });
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  const { data: filteredTaskData, isLoading: isFilterLoading } = useQuery({
    queryKey: ["get-all-task", taskFilter],
    queryFn: () => getTaskAccordingToFilter(taskFilter, navigate),
    enabled: !!taskFilter,
  });

  useEffect(() => {
    if (onDate) {
      setTaskFilter((prevFilter) => ({
        ...prevFilter,
        startDate: new Date(onDate[0]),
        endDate: new Date(onDate[1]),
      }));
    }

    if (filteredTaskData) {
      setTaskData(filteredTaskData);
    }
  }, [filteredTaskData, onDate]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Update the orderId in taskFilter only when there's input
    setTaskFilter((prevFilter) => ({
      ...prevFilter,
      orderId: value,
    }));
  };

  const selectChange = (option) => {
    setTaskFilter((prevFilter) => ({
      ...prevFilter,
      filter: option.value,
    }));
  };

  const toggleModal = (type, id) => {
    setSelectedTask(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModal({ assignAgent: false, viewDetail: false });
  };

  const isLoading = isFilterLoading;

  return (
    <>
      <div className="w-full rounded-lg bg-white">
        <div className="bg-teal-800 text-white p-5 xl:px-[25px] rounded-lg flex items-center justify-between">
          <p>Tasks</p>
          <p className="bg-white text-teal-800 font-bold rounded-full w-[25px] h-[25px] flex justify-center items-center">
            {taskData.length}
          </p>
        </div>

        <div className="w-full p-2 mt-4">
          <Select
            options={taskStatusOptions}
            value={taskStatusOptions.find(
              (option) => option.value === taskFilter.filter
            )}
            onChange={selectChange}
            className="rounded-lg w-full"
            placeholder="Select Task status"
            isSearchable={false}
          />

          <input
            type="search"
            className="border-2 border-zinc-200 bg-white rounded-lg mt-5 mb-5 p-2 w-full focus:outline-none"
            placeholder="Search order Id"
            value={searchInput}
            onChange={handleSearchInputChange}
          />

          <div className="bg-white max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <ShowSpinner />
            ) : taskData?.length === 0 ? (
              <p className="text-center mt-[20px]">No Tasks Found.</p>
            ) : (
              taskData.map((data) => (
                <Card.Root
                  className="bg-zinc-100 mt-3 h-[200px]"
                  key={data?._id}
                >
                  <Card.Header className="h-[50px]">
                    <Card.Title className="text-[17px] font-semibold">
                      <p>{data?.orderId?._id || "N/A"}</p>
                      {`${formatDate(data?.createdAt)} ${formatTime(data?.createdAt)}`}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      {data?.pickupDetail?.pickupAddress?.fullName || "N/A"}
                    </p>
                    <p>{data?.pickupDetail?.pickupAddress?.area || "N/A"}</p>
                  </Card.Body>
                  <Card.Footer className="flex justify-between">
                    <Button
                      className="bg-gray-200 text-black text-[12px] p-4 font-semibold"
                      onClick={() =>
                        onShowShopLocationOnMap({
                          coordinates: data?.pickupDetail?.pickupLocation,
                          fullName: data?.pickupDetail?.pickupAddress?.fullName,
                          Id: data?.orderId,
                        })
                      }
                    >
                      View on Map
                    </Button>

                    {data?.taskStatus === "Assigned" ||
                    data?.taskStatus === "Completed" ? (
                      <Button
                        className="bg-teal-800 text-white text-[12px] p-4 font-semibold"
                        onClick={() => toggleModal("viewDetail", data?._id)}
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        className="bg-teal-800 text-white text-[12px] p-4 font-semibold"
                        onClick={() => toggleModal("assignAgent", data?._id)}
                      >
                        Assign Agent
                      </Button>
                    )}
                  </Card.Footer>
                </Card.Root>
              ))
            )}
          </div>
        </div>
      </div>

      <AssignAgent
        isOpen={modal.assignAgent}
        onClose={closeModal}
        taskId={selectedTask}
      />
      <TaskDetails
        isOpen={modal.viewDetail}
        onClose={closeModal}
        taskId={selectedTask}
      />
    </>
  );
};

export default AllTask;
