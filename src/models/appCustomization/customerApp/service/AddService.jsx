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

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewService } from "@/hooks/customerAppCustomization/useService";

const AddService = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    geofenceId: "",
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: isOpen,
  });

  const handleAddService = useMutation({
    mutationKey: ["add-service"],
    mutationFn: (data) => createNewService(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-service"]);
      setFormData({
        title: "",
        geofenceId: "",
      });
      setPreviewURL(null);
      setSelectedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "New service created successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while creating new service",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataObject.append(key, formData[key]);
    });

    selectedFile && formDataObject.append("serviceImage", selectedFile);

    handleAddService.mutate(formDataObject);
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const handleSelectFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

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
            Add Service
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {geofenceLoading ? (
            <ModalLoader />
          ) : geofenceError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">Service title</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 focus:outline-none w-2/3"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center">
                <label className="w-1/2 text-gray-500">Geofence</label>

                <Select
                  options={geofenceOptions}
                  value={geofenceOptions?.find(
                    (option) => option.value === formData.geofenceId
                  )}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      geofenceId: option.value,
                    })
                  }
                  className="rounded focus:outline-none w-2/3"
                  placeholder="Select geofence"
                  isSearchable
                  isMulti={false}
                  menuPlacement="bottom"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      paddingRight: "",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      padding: "10px",
                    }),
                  }}
                />
              </div>

              <div className="flex items-start">
                <label className="w-1/2 text-gray-500">
                  Image <br /> (342px x 160px)
                </label>
                <div className="flex items-center justify-start gap-[30px] w-2/3">
                  {!previewURL && (
                    <div className="bg-gray-400 h-16 w-16 rounded-md" />
                  )}

                  {previewURL && (
                    <figure className="h-16 w-16 rounded-md">
                      <img
                        src={previewURL}
                        alt={formData.title}
                        className="w-full rounded h-full object-cover "
                      />
                    </figure>
                  )}

                  <input
                    type="file"
                    name="serviceImage"
                    id="serviceImage"
                    className="hidden"
                    onChange={handleSelectFile}
                  />
                  <label htmlFor="serviceImage" className="cursor-pointer ">
                    <div className=" bg-teal-800  text-[40px] text-white p-6 h-16 w-16 rounded">
                      <RenderIcon iconName="CameraIcon" size={20} loading={6} />
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-[30px]">
                <button
                  className="bg-gray-300 rounded-lg px-6 py-2 font-semibold justify-end"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  disabled={handleAddService.isPending}
                  onClick={handleSave}
                  className="bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end"
                >
                  {handleAddService.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
  s;
};

export default AddService;
