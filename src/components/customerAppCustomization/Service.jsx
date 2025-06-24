import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RenderIcon from "@/icons/RenderIcon";

import { toaster } from "@/components/ui/toaster";

import Error from "@/components/others/Error";
import Loader from "@/components/others/Loader";

import {
  fetchAllService,
  reOrderService,
} from "@/hooks/customerAppCustomization/useService";

import AddService from "@/models/appCustomization/customerApp/service/AddService";
import DeleteService from "@/models/appCustomization/customerApp/service/DeleteService";
import EditService from "@/models/appCustomization/customerApp/service/EditService";

const Service = () => {
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const dragCategory = useRef(0);
  const dragOverCategory = useRef(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-service"],
    queryFn: () => fetchAllService(navigate),
  });

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

  const handleReorderServiceMutation = useMutation({
    mutationKey: ["reorder-service"],
    mutationFn: (categories) => reOrderService(categories, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-service"]);
      toaster.create({
        title: "Success",
        description: "Service re-ordered successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while re-ordering service",
        type: "error",
      });
    },
  });

  const handleReorderServiceCategory = (dragIndex, dragOverIndex) => {
    const categoryClone = [...data];
    const temp = categoryClone[dragIndex];
    categoryClone[dragIndex] = categoryClone[dragOverIndex];
    categoryClone[dragOverIndex] = temp;

    const categories = categoryClone.map((category, index) => ({
      id: category.serviceId,
      order: index + 1,
    }));

    handleReorderServiceMutation.mutate(categories);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="border-b-2 border-gray-200 pb-5 h-fit">
      <div className="flex flex-col lg:flex-row gap-[15px] lg:gap-0 justify-between mx-5 mt-10">
        <h1 className="text-[18px] font-[600]">Services</h1>

        <p className="text-gray-500">
          This enables to add, edit, change thumbnail of the listed services
        </p>

        <button
          onClick={() => toggleModal("add")}
          className="flex items-center gap-2 bg-teal-800 text-white px-5 rounded-lg p-2 w-fit"
        >
          <RenderIcon iconName="PlusIcon" size={16} loading={6} />
          <span className="hidden lg:block">Add Services</span>
        </button>
      </div>

      {data?.length === 0 && (
        <div className="flex justify-center my-10 lg:mt-5">
          <p className="text-[20px] font-[500]">No Services listed</p>
        </div>
      )}

      {data.map((item, index) => (
        <div
          key={item.serviceId}
          draggable
          onDragStart={() => (dragCategory.current = index)}
          onDragEnter={() => (dragOverCategory.current = index)}
          onDragEnd={() =>
            handleReorderServiceCategory(
              dragCategory.current,
              dragOverCategory.current
            )
          }
          onDragOver={(e) => e.preventDefault()}
          className="flex justify-center mt-5 mx-4 lg:mx-0"
        >
          <div className="w-96 h-fit">
            <div className="bg-gray-300 flex flex-col gap-3 rounded-lg w-full">
              <div className="flex items-center relative">
                <span className="p-3">
                  <RenderIcon iconName="ReOrderIcon" size={20} loading={6} />
                </span>

                <figure className="h-32 w-full relative group">
                  <img
                    className="rounded w-full h-full object-cover"
                    src={item.bannerImage}
                    alt={`${item.title} banner`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#333] via-transparent to-transparent rounded z-10"></div>
                  <div className="flex items-center gap-2 absolute top-2.5 right-2.5">
                    <span
                      onClick={() => toggleModal("edit", item.serviceId)}
                      className="bg-gray-200 p-1.5 rounded-full cursor-pointer z-20"
                    >
                      <RenderIcon iconName="EditIcon" size={16} loading={6} />
                    </span>

                    <span
                      onClick={() => toggleModal("delete", item.serviceId)}
                      className="bg-gray-200 p-1.5 rounded-full cursor-pointer z-20"
                    >
                      <RenderIcon iconName="DeleteIcon" size={16} loading={6} />
                    </span>
                  </div>
                  <p className="text-white absolute bottom-1 right-1 z-20">
                    {item.title}
                  </p>
                </figure>
              </div>
            </div>
          </div>
        </div>
      ))}

      <AddService isOpen={modal.add} onClose={closeModal} />
      <DeleteService
        isOpen={modal.delete}
        onClose={closeModal}
        serviceId={selectedId}
      />
      <EditService
        isOpen={modal.edit}
        onClose={closeModal}
        serviceId={selectedId}
      />
    </div>
  );
};

export default Service;
