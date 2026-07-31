import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";
import RenderIcon from "@/icons/RenderIcon";

import {
  fetchOfferPopup,
  updateOfferPopup,
} from "@/hooks/customerAppCustomization/useCustomization";

const OfferPopup = () => {
  const [formData, setFormData] = useState({ status: false, imageUrl: "" });
  const [imageFile, setImageFile] = useState(null);
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["offer-popup"],
    queryFn: () => fetchOfferPopup(navigate),
  });

  const handleUpdateMutation = useMutation({
    mutationKey: ["update-offer-popup"],
    mutationFn: (data) => updateOfferPopup(data, navigate),
    onSuccess: () => {
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["offer-popup"] });
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Offer popup updated",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err?.message || "Error while updating offer popup",
        type: "error",
      });
    },
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  useEffect(() => {
    if (data) {
      const isModified =
        formData.status !== data.status || formData.imageUrl !== data.imageUrl;
      setShowButton(isModified || !!imageFile);
    }
  }, [formData, data, imageFile]);

  const handleSave = () => {
    const fd = new FormData();
    fd.append("status", formData.status);
    if (imageFile) fd.append("offerPopupImage", imageFile);
    handleUpdateMutation.mutate(fd);
  };

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setShowButton(true);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="flex flex-col lg:flex-row gap-10 mt-10 mx-5 border-b-2 border-gray-200 pb-5">
      <div className="flex flex-col lg:flex-row items-start gap-[20px] lg:gap-0">
        <div className="lg:w-72">Offer Popup</div>
        <div className="text-gray-500">
          Note: This image will be shown as a popup offer to users when they
          open the app
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span>Status</span>
        <Switch
          colorPalette="teal"
          checked={formData.status}
          onCheckedChange={() =>
            setFormData((prev) => ({ ...prev, status: !prev.status }))
          }
        />
      </div>

      <div className="flex w-44 gap-[30px]">
        {!imageFile && !formData.imageUrl ? (
          <div className="h-[66px] w-[66px] bg-gray-200 rounded-md" />
        ) : (
          <figure className="h-16 w-16 rounded-md">
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
              alt="Offer popup"
              className="w-full rounded h-full object-cover"
            />
          </figure>
        )}

        <input
          type="file"
          name="offerPopupImage"
          id="offerPopupImage"
          className="hidden"
          accept="image/*"
          onChange={handleSelectFile}
        />
        <label
          htmlFor="offerPopupImage"
          className="flex items-center justify-center bg-teal-800 text-[30px] text-white p-4 h-16 w-16 rounded-md cursor-pointer"
        >
          <RenderIcon iconName="CameraIcon" size={24} loading={6} />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          className={`bg-teal-800 rounded-lg px-6 py-2 text-white font-semibold ${
            !showButton ? "invisible" : ""
          }`}
          onClick={handleSave}
          disabled={handleUpdateMutation.isPending}
        >
          {handleUpdateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default OfferPopup;
