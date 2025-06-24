import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HStack, Table } from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { Switch } from "@/components/ui/switch";

import RenderIcon from "@/icons/RenderIcon";

import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchAllAppBanner,
  updateAppBannerStatus,
} from "@/hooks/adBanner/adBanner";

import AddAppBanner from "@/models/marketing/adBanner/AddAppBanner";
import EditAppBanner from "@/models/marketing/adBanner/EditAppBanner";
import DeleteAppBanner from "@/models/marketing/adBanner/DeleteAppBanner";

const AppAdBanner = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-app-banner"],
    queryFn: () => fetchAllAppBanner(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggle-app-banner"],
    mutationFn: (bannerId) => updateAppBannerStatus(bannerId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-app-banner"]);
      toaster.create({
        title: "Success",
        description: "App banner status updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating app banner status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      edit: false,
      delete: false,
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mx-4 sm:mx-10 mt-5">
        <h1 className="text-base sm:text-lg font-bold outline-none focus:outline-none">
          App Ad Banner
        </h1>
        <div className="mt-3 sm:mt-0">
          <button
            className="bg-teal-800 text-white rounded-md flex items-center px-6 py-2 text-sm sm:px-9 sm:text-base"
            onClick={() => toggleModal("add")}
          >
            <RenderIcon iconName="PlusIcon" size={14} smSize={16} loading={6} />
            <span className="ml-2">Add</span>
          </button>
        </div>
      </div>

      <div className="mt-5 max-h-[30rem] overflow-y-auto overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Image",
                "Name",
                "Merchant ID",
                "Geofence",
                "Status",
                "Actions",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  <ShowSpinner /> Loading...
                </Table.Cell>
              </Table.Row>
            ) : data?.length === 0 ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  No App Banner Available
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={6} textAlign="center">
                  Error in fetching App Banner.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item._id} className={`h-[70px]`}>
                  <Table.Cell
                    textAlign="center"
                    className="flex items-center justify-center flex-1"
                  >
                    <figure className="h-[70px] w-[100px]">
                      <img
                        src={item.imageUrl}
                        className="w-full h-full object-contain"
                      />
                    </figure>
                  </Table.Cell>
                  <Table.Cell textAlign="center">{item.name}</Table.Cell>
                  <Table.Cell textAlign="center">{item.merchantId}</Table.Cell>
                  <Table.Cell textAlign="center">
                     {item?.geofenceId?.map((geofence, index) => (
                      <span key={index} className="flex flex-col">
                        {geofence.name}
                        {index < item.geofenceId.length - 1 && ", "}
                      </span>
                    ))
                    }
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack direction="row" gap="4" justify="center">
                      <Switch
                        colorPalette="teal"
                        checked={item?.status}
                        onChange={() => toggleStatus.mutate(item._id)}
                      />
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack direction="row" gap="4" justify="center">
                      <span
                        onClick={() => toggleModal("edit", item._id)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </span>

                      <span
                        onClick={() => toggleModal("delete", item._id)}
                        className="text-red-500"
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={24}
                          loading={6}
                        />
                      </span>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      <AddAppBanner isOpen={modal.add} onClose={closeModal} />
      <EditAppBanner
        isOpen={modal.edit}
        onClose={closeModal}
        bannerId={selectedId}
      />
      <DeleteAppBanner
        isOpen={modal.delete}
        onClose={closeModal}
        bannerId={selectedId}
      />
    </>
  );
};

export default AppAdBanner;
