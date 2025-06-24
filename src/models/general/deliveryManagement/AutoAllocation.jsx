import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import {
  addAutoAllocation,
  getAutoAllocation,
} from "@/hooks/deliveryManagement/useDeliveryManagement";

const AutoAllocation = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    autoAllocationType: "",
    expireTime: "",
    maxRadius: "",
  });

  const navigate = useNavigate();

  const {
    data: autoAllocation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auto-allocation"],
    queryFn: () => getAutoAllocation(navigate),
    enabled: isOpen,
  });

  const handleAddAutoAllocation = useMutation({
    mutationKey: ["add-auto-allocation"],
    mutationFn: (formData) => addAutoAllocation(formData, navigate),
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description: data || "New auto allocation created successfully",
        type: "success",
      });
      onClose();
      navigate("/delivery-management");
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in creating new auto allocation",
        type: "error",
      });
    },
  });

  useEffect(() => {
    if (autoAllocation) {
      setFormData({
        autoAllocationType: autoAllocation.autoAllocationType || "",
        expireTime: autoAllocation.expireTime || "",
        maxRadius: autoAllocation.maxRadius || "",
      });
    }
  }, [autoAllocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { value } = e;
    setFormData((prev) => ({ ...prev, autoAllocationType: value }));
  };

  // const handleRadioPriorityTypeChange = (e) => {
  //   const { value } = e;
  //   setFormData((prev) => ({ ...prev, priorityType: value }));
  // };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[18px] font-[600]">
          Auto Allocation
        </DialogHeader>
        <DialogBody>
          <div className="flex mt-2">
            <label className="text-[16px] mr-5 mt-1 font-semibold">
              Request expires
            </label>
            <input
              type="text"
              name="expireTime"
              className="w-2/4 border border-gray-200 rounded-lg pl-2 outline-none focus:outline-none h-9"
              value={formData.expireTime}
              onChange={handleChange}
            />
            <div className="mt-1">
              <p className="font-semibold text-[16px] ml-5">sec</p>
            </div>
          </div>
          <div className="my-4">
            <label className="text-[18px] mb-5 font-semibold">
              Set auto allocation
            </label>
            <RadioGroup
              value={formData.autoAllocationType}
              variant={"solid"}
              size="sm"
              name="autoAllocationType"
              onValueChange={handleRadioChange}
              colorPalette="teal"
              className="flex flex-col gap-[10px] mt-2"
            >
              <Radio
                value="All"
                className="text-black text-[16px] cursor-pointer"
              >
                Send to all
              </Radio>
              <Radio
                value="Nearest"
                className="text-black text-[16px] cursor-pointer"
              >
                Nearest Available
              </Radio>
            </RadioGroup>
          </div>
          {formData.autoAllocationType === "All" && (
            <div>
              <p className="text-gray-600 mt-5 text-[14px]">
                Force assigns the task to Agent based on availability and
                distance
              </p>
              <div className="flex mt-5">
                <label className="text-[16px] font-semibold mr-5 mt-1">
                  Maximum Radius
                </label>
                <input
                  type="text"
                  name="maxRadius"
                  value={formData.maxRadius}
                  className="w-2/4 border border-gray-200 rounded-lg pl-2 outline-none focus:outline-none h-9"
                  onChange={handleChange}
                />
                <div>
                  <p className="font-semibold text-[16px] ml-5 mt-1">Km</p>
                </div>
              </div>
            </div>
          )}
          {formData.autoAllocationType === "Nearest" && (
            <p className="text-gray-600 mt-5 text-[14px]">
              {`Sends the task request notification to the Agent
                          (maximum limit: 500 Agent) available in
                          the task time-slot. task gets assigned to the "Agent who
                          accepts the task request first. If no Agent accepts
                          the task, it remains unassigned.`}
            </p>
          )}
          {/* <RadioGroup
            value={formData.priorityType}
            variant={"solid"}
            size="sm"
            name="priorityType"
            onValueChange={handleRadioPriorityTypeChange}
            colorPalette="teal"
            className="flex flex-col gap-[10px] mt-4"
          >
            <Radio
              value="Default"
              className="text-black text-[16px] cursor-pointer"
            >
              Default
            </Radio>
            <Radio
              value="Monthly-salaried"
              className="text-black text-[16px] cursor-pointer"
            >
              Monthly-salaried
            </Radio>
          </RadioGroup> */}
        </DialogBody>
        <DialogFooter>
          <button
            onClick={onClose}
            className="bg-blue-50 p-3 rounded-lg w-1/2 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAddAutoAllocation.mutate(formData)}
            className="bg-teal-800 text-white p-3 w-1/2 rounded-lg"
          >
            {handleAddAutoAllocation.isPending
              ? "Applying..."
              : "Apply Auto Allocation"}
          </button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AutoAllocation;
