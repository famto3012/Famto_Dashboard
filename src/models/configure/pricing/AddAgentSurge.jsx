import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewAgentSurge } from "@/hooks/pricing/useAgentPricing";

import ModalLoader from "@/components/others/ModalLoader";

const AddAgentSurge = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    ruleName: "",
    baseFare: "",
    baseDistance: "",
    waitingFare: "",
    waitingTime: "",
    geofenceId: [],
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: !!isOpen,
  });

  const handelAddSurge = useMutation({
    mutationKey: ["add-agent-surge"],
    mutationFn: (formData) => createNewAgentSurge(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agent-surge"]);
      setFormData({
        ruleName: "",
        baseFare: "",
        baseDistance: "",
        waitingFare: "",
        waitingTime: "",
        geofenceId: [],
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "New surge created successfully",
        type: "success",
      });
    },
    onError: (data) => {
      console.log(data);
      toaster.create({
        title: "Error",
        description: "Error while creating new surge",
        type: "error",
      });
    },
  });

  const geofenceOptions = [
    { label: "Select All", value: "selectAll" },
    ...(Array.isArray(allGeofence)
      ? allGeofence?.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

  const handleSelectChange = (selected) => {
    if (selected && selected.some((option) => option.value === "selectAll")) {
      setFormData({
        ...formData,
        geofenceId: allGeofence.map((geofence) => geofence._id),
      });
    } else {
      setFormData({
        ...formData,
        geofenceId: selected ? selected.map((option) => option.value) : [],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showLoading = geofenceLoading;
  const showError = geofenceError;

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Add Surge
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <>
              <p>Error</p>
            </>
          ) : (
            <>
              <div className="flex flex-col  max-h-[30rem] overflow-auto gap-4">
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="ruleName">
                    Rule Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Rule Name"
                    value={formData.ruleName}
                    id="ruleName"
                    name="ruleName"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseFare">
                    Base Fare <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Fare"
                    value={formData.baseFare}
                    id="baseFare"
                    name="baseFare"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseDistance">
                    Base Distance <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Distance"
                    value={formData.baseDistance}
                    id="baseDistance"
                    name="baseDistance"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingFare">
                    Waiting Fare
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Fare"
                    value={formData.waitingFare}
                    id="waitingFare"
                    name="waitingFare"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingTime">
                    Waiting Time (minutes)
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Time"
                    value={formData.waitingTime}
                    id="waitingTime"
                    name="waitingTime"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="geofenceId">
                    Geofence <span className="text-red-600">*</span>
                  </label>

                  <Select
                    className="w-2/3 outline-none focus:outline-none"
                    value={geofenceOptions?.filter((option) =>
                      formData?.geofenceId?.includes(option.value)
                    )}
                    isMulti
                    isSearchable
                    onChange={handleSelectChange}
                    options={geofenceOptions}
                    placeholder="Select geofence"
                    menuPlacement="top"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-cyan-50 py-2 px-4 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handelAddSurge.mutate(formData)}
                  className="bg-teal-700 text-white py-2 px-4 rounded-md"
                >
                  {handelAddSurge.isPending ? `Saving...` : `Save`}
                </button>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddAgentSurge;
