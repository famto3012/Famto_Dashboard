import {
  TimelineItem,
  TimelineRoot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { formatDate, formatTime } from "@/utils/formatter";
import RenderIcon from "@/icons/RenderIcon";

const TaskDetails = ({ isOpen, onClose, taskId }) => {
  const navigate = useNavigate();

  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-task-details"],
    queryFn: () => getTaskById(taskId, navigate),
    enabled: isOpen,
  });

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
      size={"lg"}
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[18px] font-[600]">
          Task Details
        </DialogHeader>
        <DialogBody>
          <div>
            <div className="flex flex-wrap items-center gap-4 text-[18px] font-normal">
              <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 grid gap-3">
                <DataListRoot orientation="horizontal" size="md">
                  <DataListItem label={"Task Id"} value={task?._id} />
                  <DataListItem
                    label={"Delivery Method"}
                    value={task?.orderId?.orderDetail?.deliveryMode}
                  />
                </DataListRoot>
              </div>

              <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 grid gap-3">
                <DataListRoot orientation="horizontal" size="md">
                  <DataListItem
                    label={"Agent Name"}
                    value={task?.agentId?.fullName}
                  />
                  <DataListItem label={"Agent ID"} value={task?.agentId?._id} />
                </DataListRoot>
              </div>
            </div>
            <div>
              <p className="mt-5 text-[17px] font-semibold">Task status</p>
              <div className="mt-5">
                <TimelineRoot size="xl" colorPalette="teal" variant="solid">
                  <TimelineItem>
                    <TimelineConnector>
                      {task?.pickupDetail?.pickupStatus === "Completed" ? (
                        <RenderIcon
                          iconName="CheckIcon"
                          size={24}
                          loading={24}
                        />
                      ) : (
                        "1"
                      )}
                    </TimelineConnector>
                    <TimelineContent>
                      <TimelineTitle>
                        <p className="text-[17px]">
                          {task?.orderId?.orderDetail?.pickupAddress?.fullName}
                        </p>
                      </TimelineTitle>
                      <TimelineDescription>
                        <div className="flex flex-wrap justify-between">
                          <div>
                            <p className="text-[14px]">
                              By{" "}
                              {task?.orderId?.orderDetailStepper?.accepted
                                ?.by || " Admin"}
                            </p>
                            <p className="text-[14px]">
                              {task?.orderId?.orderDetail?.pickupAddress?.area}
                            </p>
                          </div>
                          <div>
                            <DataListRoot orientation="horizontal" size="md">
                              <DataListItem
                                label={"Expected Time:"}
                                value={(() => {
                                  const pickUpDate =
                                    task?.orderId?.orderDetailStepper?.accepted
                                      ?.date;
                                  if (pickUpDate) {
                                    const dateObj = new Date(pickUpDate);
                                    dateObj.setMinutes(
                                      dateObj.getMinutes() + 30
                                    );
                                    return `${formatDate(dateObj)} | ${formatTime(dateObj)}`;
                                  }
                                  return "Invalid Date";
                                })()}
                              />
                              <DataListItem
                                label={"Pick Up Time:"}
                                value={`${formatDate(
                                  task?.pickupDetail?.completedTime || null
                                )} | ${formatTime(task?.pickupDetail?.completedTime || null)}`}
                              />
                            </DataListRoot>
                          </div>
                        </div>
                      </TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>

                  <div className="relative flex items-center ml-[40px] my-[10px]">
                    <div className="absolute left-0 bg-blue-50 w-[110px] h-[24px] flex items-center justify-center rounded-full text-black font-semibold">
                      <span className="text-sm">In transit</span>
                    </div>

                    <div className="w-[350px] border-t border-dotted border-gray-900 my-[5px] mx-[100px]"></div>

                    <div className="absolute right-0 bg-blue-50 w-[160px] h-[24px] flex items-center justify-center rounded-full text-black">
                      <span className="text-sm font-semibold">
                        <span className="text-gray-400 mr-1">Distance</span>
                        {task?.orderId?.orderDetail?.distance} Kms
                      </span>
                    </div>
                  </div>

                  <TimelineItem className="mt-3">
                    <TimelineConnector>
                      {task?.deliveryDetail?.deliveryStatus === "Completed" ? (
                        <RenderIcon
                          iconName="CheckIcon"
                          size={24}
                          loading={24}
                        />
                      ) : (
                        "2"
                      )}
                    </TimelineConnector>
                    <TimelineContent>
                      <TimelineTitle>
                        <p className="text-[17px]">
                          {
                            task?.orderId?.orderDetail?.deliveryAddress
                              ?.fullName
                          }
                        </p>
                      </TimelineTitle>
                      <TimelineDescription>
                        <div className="flex flex-wrap justify-between">
                          <div>
                            <p className="text-[14px]">
                              By{" "}
                              {task?.orderId?.orderDetailStepper
                                ?.reachedDeliveryLocation?.by || " Agent"}
                            </p>
                            <p className="text-[14px]">
                              <p>
                                {
                                  task?.orderId?.orderDetail?.deliveryAddress
                                    ?.flat
                                }
                                ,
                              </p>
                              <p>
                                {
                                  task?.orderId?.orderDetail?.deliveryAddress
                                    ?.area
                                }
                                ,
                              </p>
                              <p>
                                {
                                  task?.orderId?.orderDetail?.deliveryAddress
                                    ?.landMark
                                }
                              </p>
                            </p>
                          </div>
                          <div>
                            <DataListRoot orientation="horizontal" size="md">
                              <DataListItem
                                label={"Expected Time:"}
                                value={`${formatDate(
                                  task?.orderId?.orderDetail?.deliveryTime ||
                                    null
                                )} | ${formatTime(
                                  task?.orderId?.orderDetail?.deliveryTime ||
                                    null
                                )}`}
                              />
                              <DataListItem
                                label={"Delivered Time:"}
                                value={`${formatDate(
                                  task?.deliveryDetail?.completedTime || null
                                )} | ${formatTime(task?.deliveryDetail?.completedTime || null)}`}
                              />
                            </DataListRoot>
                          </div>
                        </div>
                      </TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                </TimelineRoot>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 w-[100px] text-black outline-none focus:outline-none"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default TaskDetails;
