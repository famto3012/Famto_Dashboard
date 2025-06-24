import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { fetchAllRoles } from "@/hooks/manager/useManager";
import { addNotificationSettings } from "@/hooks/notification/useNotification";
import { addNotificationSettingsOption } from "@/utils/defaultData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddNotificationSettings = ({ isOpen, onClose }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    event: "",
    title: "",
    description: "",
    admin: false,
    customer: false,
    driver: false,
    merchant: false,
    manager: [],
    whatsapp: false,
    email: false,
    sms: false,
  });
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setNotificationSettings({
      ...notificationSettings,
      event: selectedOption ? selectedOption.value : "",
    });
  };

  const handleManagerChange = (selectedOptions) => {
    setNotificationSettings((prevState) => ({
      ...prevState,
      manager: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleCancel = () => {
    onClose();
  };

  const onChange = (name, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: value.checked,
    });
  };

  const { data: roleList } = useQuery({
    queryKey: ["get-manager-roles"],
    queryFn: () => fetchAllRoles(navigate),
  });

  const handleAddNotificationSettings = useMutation({
    mutationKey: ["add-notification-settings"],
    mutationFn: ({ notificationSettings }) => {
      return addNotificationSettings({ notificationSettings, navigate });
    },
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description:
          data?.message || "Notification settings added successfully.",
        type: "success",
      });
      queryClient.invalidateQueries(["get-all-notification-settings"]);
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Error",
        description: error || "Error in adding notification settings.",
        type: "error",
      });
    },
  });

  useEffect(() => {
    if (roleList && roleList.length > 0) {
      // Map through the roleList data and update roles state
      const updatedRoles = roleList.map((role) => ({
        label: role.roleName, // Assuming `roleName` is the field in the data
        value: role.roleName, // Assuming `value` is the field in the data
      }));

      setRoles(updatedRoles);
    }
  }, [roleList]);

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
          Add Notification
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <label htmlFor="event" className="w-1/3 text-gray-500">
                Event<span className="text-red-500 ms-2">*</span>
              </label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={addNotificationSettingsOption.find(
                  (option) => option?.value === notificationSettings?.event
                )}
                name="event"
                isMulti={false}
                isSearchable={true}
                onChange={handleSelectChange}
                options={addNotificationSettingsOption}
                placeholder="Select event name"
                isClearable={false}
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="event" className="w-1/3 text-gray-500">
                Title<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={notificationSettings?.title}
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
            <div className="flex items-center mt-4">
              <label htmlFor="description" className="text-gray-500 w-1/3">
                Description (This note will be shown in notification)
                <span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={notificationSettings?.description}
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded p-6 px-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="event" className="w-1/3 text-gray-500">
                Manager
              </label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={roles.filter((option) =>
                  notificationSettings.manager.includes(option.value)
                )}
                name="manager"
                isMulti={true}
                isSearchable={true}
                onChange={handleManagerChange}
                options={roles}
                placeholder="Select role name"
                isClearable={true}
                required
              />
            </div>
          </div>
          <section className="flex flex-wrap gap-4 md:gap-16">
            <div className="w-full md:w-auto">
              <div className="flex items-center mt-6">
                <label className="text-gray-500 w-32 md:w-auto">Admin</label>
                <Switch
                  onCheckedChange={(value) => onChange("admin", value)}
                  name="admin"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500 w-32 md:w-auto">
                  Customer App
                </label>
                <Switch
                  onCheckedChange={(value) => onChange("customer", value)}
                  name="customer"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500 w-32 md:w-auto">
                  Driver App
                </label>
                <Switch
                  onCheckedChange={(value) => onChange("driver", value)}
                  name="driver"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500 w-32 md:w-auto">
                  Merchant App
                </label>
                <Switch
                  onCheckedChange={(value) => onChange("merchant", value)}
                  name="merchant"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex items-center mt-6">
                <label className="text-gray-500 w-32 md:w-auto">Whatsapp</label>
                <Switch
                  onCheckedChange={(value) => onChange("whatsapp", value)}
                  name="whatsapp"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500 w-32 md:w-auto">Email</label>
                <Switch
                  onCheckedChange={(value) => onChange("email", value)}
                  name="email"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500 w-32 md:w-auto">SMS</label>
                <Switch
                  onCheckedChange={(value) => onChange("sms", value)}
                  name="sms"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
            </div>
          </section>
        </DialogBody>
        <DialogFooter>
          <Button
            className="bg-cyan-50 py-2 px-4 rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-teal-700 text-white py-2 px-4 rounded-md"
            onClick={() =>
              handleAddNotificationSettings.mutate({ notificationSettings })
            }
          >
            {handleAddNotificationSettings.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddNotificationSettings;
