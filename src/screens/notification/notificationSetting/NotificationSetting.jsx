import AddNotificationSettings from "@/models/notification/notificationSetting/AddNotificationSettings";
import GlobalSearch from "@/components/others/GlobalSearch";
import { useEffect, useState } from "react";
import RenderIcon from "@/icons/RenderIcon";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllNotificationSettings,
  updateNotificationSettingsStatus,
} from "@/hooks/notification/useNotification";
import { useNavigate } from "react-router-dom";
import { Table } from "@chakra-ui/react";
import ShowSpinner from "@/components/others/ShowSpinner";
import { toaster } from "@/components/ui/toaster";
import Error from "@/components/others/Error";
import EditNotificationSettings from "@/models/notification/notificationSetting/EditNotificationSettings";
import DeleteNotificationSetting from "@/models/notification/notificationSetting/DeleteNotificationSetting";

const NotificationSetting = () => {
  const [modal, setModal] = useState({
    addSettings: false,
    editSettings: false,
    deleteSettings: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: notificationSettingsData,
    isLoading: notificationSettingsLoading,
    isError,
  } = useQuery({
    queryKey: ["get-all-notification-settings"],
    queryFn: () => getAllNotificationSettings(navigate),
  });

  const handleUpdateNotificationSettingsStatus = useMutation({
    mutationKey: ["update-notification-settings-status"],
    mutationFn: ({ notificationId }) => {
      return updateNotificationSettingsStatus({ notificationId, navigate });
    },
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description:
          data?.message || "Notification settings status updated successfully.",
        type: "success",
      });
      queryClient.invalidateQueries(["get-all-notification-settings"]);
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Error",
        description: error || "Error in updating notification settings status.",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  useEffect(() => {
    if (notificationSettingsData) {
      setNotificationSettings(notificationSettingsData);
    }
  }, [notificationSettingsData]);

  if (isError) return <Error />;

  return (
    <>
      <div className="w-full h-screen bg-gray-100">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <div className="flex flex-wrap items-center justify-between mx-4 md:mx-[30px] mt-[20px] gap-4">
          <h1 className="text-lg md:text-xl font-bold">
            Notification Settings
          </h1>
          <div className="flex items-center">
            <button
              className="bg-teal-700 text-white rounded-md flex items-center space-x-1 p-3 md:p-4"
              onClick={() => toggleModal("addSettings")}
            >
              <span className="mr-2">
                <RenderIcon iconName="PlusIcon" size={16} loading={6} />
              </span>
              <span className="text-sm md:text-base">
                <span className="block md:hidden">Add</span>
                <span className="hidden md:block">Add Notification</span>
              </span>
            </button>
            <AddNotificationSettings
              isOpen={modal?.addSettings}
              onClose={() => setModal({ ...modal, addSettings: false })}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <Table.Root striped interactive className="w-full mt-[20px]">
            <Table.Header>
              <Table.Row>
                {[
                  "Events",
                  "Description",
                  "Admin",
                  "Customer App",
                  "Driver App",
                  "Merchant App",
                  "Whatsapp",
                  "Email",
                  "SMS",
                  "Status",
                ].map((header) => (
                  <Table.ColumnHeader
                    key={header}
                    color="white"
                    textAlign="center"
                    className="bg-teal-700 text-white py-[20px] border-r-2"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {notificationSettingsLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={18} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : notificationSettings?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={6} textAlign="center">
                    No Account logs available
                  </Table.Cell>
                </Table.Row>
              ) : (
                notificationSettings?.map((notification) => (
                  <Table.Row
                    className="bg-white w-full"
                    key={notification?._id}
                  >
                    <Table.Cell textAlign="center">
                      {notification?.title}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {notification?.description}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.admin}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.customer}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.driver}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.merchant}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.whatsapp}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.email}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={notification?.sms}
                        colorPalette="teal"
                        variant="solid"
                        readOnly={true}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <div className="flex justify-center items-center gap-3">
                        <div>
                          <Switch
                            checked={notification?.status}
                            colorPalette="teal"
                            variant="solid"
                            onCheckedChange={() =>
                              handleUpdateNotificationSettingsStatus.mutate({
                                notificationId: notification?._id,
                              })
                            }
                          />
                        </div>
                        <Button
                          onClick={() =>
                            toggleModal("editSettings", notification?._id)
                          }
                          className="bg-gray-200 rounded-lg p-2 text-[35px]"
                        >
                          <RenderIcon
                            iconName="EditIcon"
                            size={16}
                            loading={6}
                          />
                        </Button>

                        <Button
                          onClick={() =>
                            toggleModal("deleteSettings", notification?._id)
                          }
                          className="text-red-900 rounded-lg bg-red-100 p-2 text-[35px]"
                        >
                          <RenderIcon
                            iconName="DeleteIcon"
                            size={16}
                            loading={6}
                          />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <EditNotificationSettings
          isOpen={modal.editSettings}
          onClose={() => setModal({ ...modal, editSettings: false })}
          selectedId={selectedId}
        />
        <DeleteNotificationSetting
          isOpen={modal.deleteSettings}
          onClose={() => setModal({ ...modal, deleteSettings: false })}
          notificationSettingsId={selectedId}
        />
      </div>
    </>
  );
};

export default NotificationSetting;
