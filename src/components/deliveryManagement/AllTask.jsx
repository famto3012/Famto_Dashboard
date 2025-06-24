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
import { PlusIcon } from "@/icons/Icons";

const AllTask = ({ onShowShopLocationOnMap, onDate }) => {
  const [taskFilter, setTaskFilter] = useState({
    filter: "Unassigned",
    orderId: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [taskData, setTaskData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modal, setModal] = useState({ assignAgent: false, viewDetail: false });
  const [selectedTask, setSelectedTask] = useState(null);

  const [isBatchStarted, setIsBatchStarted] = useState(false);
  const [pickupTask, setPickupTask] = useState(null);
  const [batchDropOrders, setBatchDropOrders] = useState([]);

  const navigate = useNavigate();

  const { data: filteredTaskData, isLoading } = useQuery({
    queryKey: ["get-all-task", taskFilter],
    queryFn: () => getTaskAccordingToFilter(taskFilter, navigate),
    enabled: !!taskFilter,
  });

  useEffect(() => {
    if (onDate) {
      setTaskFilter((prev) => ({
        ...prev,
        startDate: new Date(onDate[0]),
        endDate: new Date(onDate[1]),
      }));
    }
    if (filteredTaskData) setTaskData(filteredTaskData);
  }, [filteredTaskData, onDate]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setTaskFilter((prev) => ({ ...prev, orderId: value }));
  };

  const handleSelectChange = (option) => {
    setTaskFilter((prev) => ({ ...prev, filter: option.value }));
  };

  const toggleModal = (type, id) => {
    setSelectedTask(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModal({ assignAgent: false, viewDetail: false });
  };

  const startNewBatch = () => {
    setIsBatchStarted(true);
    setPickupTask(null);
    setBatchDropOrders([]);
  };

  const addToBatchDrop = (task) => {
    if (!isBatchStarted) return;
    if (!pickupTask) {
      setPickupTask(task);
      setBatchDropOrders([task]);
    } else if (!batchDropOrders.find((t) => t._id === task._id)) {
      setBatchDropOrders((prev) => [...prev, task]);
    }
  };

  const renderBatchPreview = () => {
  return (
    <div className="mb-5 p-4 bg-zinc-100 rounded-xl">
      <h2 className="font-bold mb-2 text-teal-800">Batch Preview</h2>

      {pickupTask && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1">Pickup:</p>
          <p className="text-teal-700">
            {pickupTask?.pickupDetail?.pickupAddress?.fullName} -{" "}
            {pickupTask?.pickupDetail?.pickupAddress?.area}
          </p>
        </div>
      )}

      {batchDropOrders.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">Drop Orders:</p>
          <ul className="pl-1 border-l-2 border-teal-700 ml-2">
            {batchDropOrders.map((drop, index) => (
              <li key={drop._id} className="relative mb-4 pl-4">
                {/* Step Indicator */}
                <span className="absolute -left-4 top-0 bg-teal-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  D{index + 1}
                </span>
                {/* Step Content */}
                {drop?.deliveryDetail?.deliveryAddress?.area || "Drop Location"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button
          className="bg-gray-200 text-black text-[12px] p-4 font-semibold"
          onClick={() => {
            if (pickupTask) {
              onShowShopLocationOnMap({
                coordinates: pickupTask?.pickupDetail?.pickupLocation,
                fullName: pickupTask?.pickupDetail?.pickupAddress?.fullName,
                Id: pickupTask?.orderId,
              });
            }
          }}
        >
          View on Map
        </Button>
        <Button
          className="bg-teal-800 p-3 text-white text-sm"
          onClick={() => alert("Batch Order Assigned")}
        >
          Assign to Agent
        </Button>
      </div>
    </div>
  );
};

  const renderTaskCard = (data) => {
    return (
      <Card.Root key={data?._id} className="bg-zinc-100 mt-3 h-[200px]">
        <Card.Header className="h-[50px]">
          <Card.Title className="text-[17px] font-semibold">
            <p>{data?.orderId?._id || "N/A"}</p>
            {`${formatDate(data?.createdAt)} ${formatTime(data?.createdAt)}`}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{data?.pickupDetail?.pickupAddress?.fullName || "N/A"}</p>
          <p>{data?.pickupDetail?.pickupAddress?.area || "N/A"}</p>
        </Card.Body>
        <Card.Footer className="flex justify-between flex-wrap gap-2">
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

          {taskFilter.filter === "Assigned" ||
          taskFilter.filter === "Completed" ? (
            <Button
              className="bg-teal-800 text-white text-[12px] p-4 font-semibold"
              onClick={() => toggleModal("viewDetail", data?._id)}
            >
              View Details
            </Button>
          ) : null}

          {taskFilter.filter === "Unassigned" ? (
            <Button
              className="bg-teal-800 text-white text-[12px] p-4 font-semibold"
              onClick={() => toggleModal("assignAgent", data?._id)}
            >
              Assign Agent
            </Button>
          ) : null}

          {taskFilter.filter === "BatchOrders" && (
            <Button
              className={`bg-teal-800 text-white text-[12px] p-4 px-14 font-semibold ${
                isBatchStarted ? "" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => (isBatchStarted ? addToBatchDrop(data) : null)}
              disabled={!isBatchStarted}
            >
              <PlusIcon />
            </Button>
          )}
        </Card.Footer>
      </Card.Root>
    );
  };

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
            onChange={handleSelectChange}
            className="rounded-lg w-full"
            placeholder="Select Task Status"
            isSearchable={false}
          />

          <input
            type="search"
            className="border-2 border-zinc-200 bg-white rounded-lg mt-5 mb-5 p-2 w-full focus:outline-none"
            placeholder="Search Order ID"
            value={searchInput}
            onChange={handleSearchInputChange}
          />

          {taskFilter.filter === "BatchOrders" && (
            <Button
              className="bg-[#D9D9D9] p-2 w-full mb-5"
              onClick={startNewBatch}
            >
              Create Batch Order
            </Button>
          )}

          {taskFilter.filter === "BatchOrders" &&
            isBatchStarted &&
            renderBatchPreview()}

          <div className="bg-white max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <ShowSpinner />
            ) : taskData?.length === 0 ? (
              <p className="text-center mt-[20px]">No Tasks Found.</p>
            ) : (
              taskData.map((data) => renderTaskCard(data))
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
