import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import {
  fetchSinglePickAndDropBanner,
  updatePickAndDropBannerDetail,
} from "@/hooks/customerAppCustomization/usePickAndDropBanner";

const EditBanner = ({ isOpen, onClose, bannerId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pick-and-drop-order-banner", bannerId],
    queryFn: () => fetchSinglePickAndDropBanner(bannerId, navigate),
    enabled: isOpen,
  });

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  const handleEditBanner = useMutation({
    mutationKey: ["edit-pick-and-drop-order-banner", bannerId],
    mutationFn: (data) =>
      updatePickAndDropBannerDetail(bannerId, data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-pick-and-drop-order-banner"]);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
      });
      setPreviewURL(null);
      setSelectedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "Banner updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating banner",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataObject.append(key, formData[key]);
    });

    selectedFile && formDataObject.append("bannerImage", selectedFile);

    handleEditBanner.mutate(formDataObject);
  };

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
            Edit Pick and Drop Order Banner
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <ModalLoader />
          ) : isError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">Description</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 focus:outline-none w-2/3"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">
                  Image (342px x 160px)
                </label>
                <div className="flex items-center justify-start w-2/3 gap-[30px]">
                  <figure className="h-16 w-16 rounded-md">
                    <img
                      src={previewURL || formData.imageUrl}
                      alt={`${formData.title} banner`}
                      className="w-full rounded h-full object-cover "
                    />
                  </figure>

                  <input
                    type="file"
                    name="bannerImage"
                    id="bannerImage"
                    className="hidden"
                    onChange={handleSelectFile}
                  />
                  <label
                    htmlFor="bannerImage"
                    className="cursor-pointer bg-teal-800 text-white flex items-center justify-center h-16 w-16 rounded-md"
                  >
                    <RenderIcon iconName="CameraIcon" size={24} loading={6} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-10 gap-4">
                <button
                  onClick={onClose}
                  className="bg-gray-300 rounded-lg px-6 py-2 font-semibold justify-end"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold justify-end"
                >
                  {handleEditBanner.isPending ? `Saving...` : `Save`}
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

export default EditBanner;
