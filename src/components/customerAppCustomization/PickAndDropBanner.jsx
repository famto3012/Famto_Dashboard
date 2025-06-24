import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";
import {
  fetchAllPickAndDropBanners,
  updateAllPickAndDropBannerStatus,
} from "@/hooks/customerAppCustomization/usePickAndDropBanner";

import AddBanner from "@/models/appCustomization/customerApp/pickAndDropBanner/AddBanner";
import EditBanner from "@/models/appCustomization/customerApp/pickAndDropBanner/EditBanner";
import DeleteBanner from "@/models/appCustomization/customerApp/pickAndDropBanner/DeleteBanner";

const PickAndDropBanner = () => {
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-pick-and-drop-order-banner"],
    queryFn: () => fetchAllPickAndDropBanners(navigate),
  });

  const handleToggleMutation = useMutation({
    mutationKey: ["toggle-custom-order-banner"],
    mutationFn: () => updateAllPickAndDropBannerStatus(navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-pick-and-drop-order-banner"]);
      toaster.create({
        title: "Success",
        description: "Banner status updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating banner status",
        type: "error",
      });
    },
  });

  const bannerStatus = data?.some((banner) => banner.status === true);

  const toggleModal = (type, id = null) => {
    setSelectedId(id), setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null),
      setModal({
        add: false,
        edit: false,
        delete: false,
      });
  };

  return (
    <>
      <div className="mt-10 justify-between items-start flex flex-col lg:flex-row mx-5">
        <h1>Pick and drop banners (info)</h1>

        <div className="flex justify-between flex-1 lg:ms-[20%] w-full mt-[20px] lg:mt-0">
          <p className="w-[50%] lg:w-[45rem] text-gray-500 text-[14px]">
            The Purpose of this banner is to educate customer.
          </p>

          <Switch
            colorPalette="teal"
            checked={bannerStatus}
            onCheckedChange={() => handleToggleMutation.mutate()}
            className="ms-auto"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end mx-5">
        <button
          onClick={() => toggleModal("add")}
          className="flex items-center gap-2 bg-teal-800 text-white rounded-md p-2"
        >
          <RenderIcon iconName="PlusIcon" size={16} loading={6} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid place-content-center lg:place-self-end xl:grid-cols-2 grid-cols-1 gap-[20px] w-full lg:w-2/3 lg:pe-[20px] px-[20px]">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Error />
        ) : (
          data?.map((banner) => (
            <div
              className="mt-10 bg-white p-3 rounded-md lg:max-w-[400px]"
              key={banner._id}
            >
              <p className="font-semibold text-[18px]">{banner.title}</p>
              <p className="text-[16px] my-3">{banner.description}</p>

              <figure className="h-[150px] w-full">
                <img
                  src={banner.imageUrl}
                  className="h-full w-full object-cover"
                />
              </figure>

              <div className="flex items-center gap-4 mt-[20px]">
                <button
                  className="flex flex-1 items-center justify-center gap-2 bg-cyan-100 p-2 rounded-2xl text-[16px]"
                  onClick={() => toggleModal("edit", banner._id)}
                >
                  <RenderIcon iconName="EditIcon" size={16} loading={6} />
                  <span>Edit</span>
                </button>

                <button
                  className="flex flex-1 items-center justify-center gap-2 bg-teal-700 p-2 rounded-2xl text-[16px] text-white"
                  onClick={() => toggleModal("delete", banner._id)}
                >
                  <RenderIcon iconName="DeleteIcon" size={18} loading={6} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddBanner isOpen={modal.add} onClose={closeModal} />
      <EditBanner
        isOpen={modal.edit}
        onClose={closeModal}
        bannerId={selectedId}
      />
      <DeleteBanner
        isOpen={modal.delete}
        onClose={closeModal}
        bannerId={selectedId}
      />
    </>
  );
};

export default PickAndDropBanner;
