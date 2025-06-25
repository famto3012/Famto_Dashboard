import Select from "react-select";
import GlobalSearch from "@/components/others/GlobalSearch";
import { Switch } from "@/components/ui/switch";
import CropImage from "@/components/others/CropImage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { useNavigate } from "react-router-dom";
import RenderIcon from "@/icons/RenderIcon";
import { userTypeForPushNotificationOptions } from "@/utils/defaultData";
import { useRef, useState } from "react";
import { Table } from "@chakra-ui/react";
import ShowSpinner from "@/components/others/ShowSpinner";
import SendNotification from "@/models/notification/pushNotification/SendNotification";
import DeleteNotification from "@/models/notification/pushNotification/DeleteNotification";
import {
  addPushNotifications,
  filterPushNotification,
} from "@/hooks/notification/useNotification";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const PushNotification = () => {
  const [pushNotification, setPushNotification] = useState({
    title: "",
    description: "",
    geofenceId: [],
    customer: false,
    merchant: false,
    driver: false,
  });
  const [modal, setModal] = useState({
    sendPushNotification: false,
    deletePushNotification: false,
    cropImage: false,
  });
  const [imgSrc, setImgSrc] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const previewCanvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    type: "",
    query: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allGeofence } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const { data: pushNotificationData, isLoading: pushNotificationLoading } =
    useQuery({
      queryKey: ["filter-push-notification", selectedFilter],
      queryFn: () => filterPushNotification(navigate, selectedFilter),
    });

  const handleAddPushNotification = useMutation({
    mutationKey: ["add-push-notification"],
    mutationFn: ({ pushNotification }) =>
      addPushNotifications({ addPushNotification: pushNotification, navigate }),
    onSuccess: () => {
      queryClient.invalidateQueries(["filter-push-notification"]);
      setPushNotification({
        title: "",
        description: "",
        geofenceId: [],
        customer: false,
        merchant: false,
        driver: false,
      });
      setCroppedFile(null);
      toaster.create({
        title: "Success",
        description: "Push notification added successfully.",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error adding push notification.",
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

  const handleInputChange = (e) => {
    setPushNotification({
      ...pushNotification,
      [e.target.name]: e.target.value,
    });
  };

  const onChange = (name, checked) => {
    setPushNotification({
      ...pushNotification,
      [name]: checked.checked ? true : false,
    });
  };

  const onFilterChange = (name, value) => {
    setSelectedFilter({
      ...selectedFilter,
      [name]: value,
    });
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setImg(e.target.files[0]);
    }
  }

  const handleCropComplete = (croppedFile) => {
    setCroppedFile(croppedFile);
    setModal({ ...modal, cropImage: false });
    setImg(null);
  };

  const toggleModal = (type, id) => {
    setSelectedId(id);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleSave = () => {
    const formDataObject = new FormData();

     function appendFormData(value, key) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(item, `${key}[${index}]`);
        });
      } else if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(pushNotification).forEach(([key, value]) => {
      appendFormData(value, key);
    });
  
    croppedFile && formDataObject.append("pushNotificationImage", croppedFile);

    handleAddPushNotification.mutate({ pushNotification: formDataObject });
  };

  return (
    <>
      <div className="bg-gray-100">
        <div className="p-5">
          <GlobalSearch />
        </div>
        <header className="font-bold ml-5">Push Notifications</header>

        {/* <div className="bg-white text-[16px] mx-5 rounded-lg mt-5 text-gray-700">
          <form>
            <div className="flex">
              <label className="mt-10 ml-10">
                Title<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={pushNotification?.title}
                className="border-2 border-gray-300 rounded ml-60 mt-10  w-96 p-2 outline-none focus:outline-none"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex">
              <label className="mt-10 ml-10 w-48">
                Description (This note will be shown in notification.{" "}
                <span className="text-red-500">[Visibility 30 characters]</span>
                )<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={pushNotification?.description}
                className="border-2 border-gray-300 rounded  mt-10 ml-[94px]  w-96 outline-none focus:outline-none p-2"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex">
              <label className="mt-10 ml-10">
                Geofence<span className="text-red-500 ms-2">*</span>
              </label>

              <Select
                options={geofenceOptions}
                value={geofenceOptions?.find(
                  (option) => option.value === pushNotification?.geofenceId
                )}
                onChange={(option) =>
                  setPushNotification({
                    ...pushNotification,
                    geofenceId: option.value,
                  })
                }
                className="rounded ml-52 mt-10 w-96 focus:outline-none"
                placeholder="Select geofence"
                isSearchable={true}
                isMulti={false}
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
            <div className="flex">
              <label className="mt-16 ml-10">
                Image (342px x 160px)
                <span className="text-red-500 ms-2">*</span>
              </label>
              <div className=" flex items-center gap-[30px]">
                {!croppedFile && (
                  <div className="bg-gray-400 ml-[115px] mt-10 h-20 w-20 rounded-md" />
                )}
                {!!croppedFile && (
                  <figure className="ml-[115px] mt-10 h-20 w-20 rounded-md relative">
                    <img
                      ref={previewCanvasRef}
                      src={URL.createObjectURL(croppedFile)}
                      alt="profile"
                      className="w-full rounded h-full object-cover "
                    />
                  </figure>
                )}
                <input
                  type="file"
                  name="pushNotificationImage"
                  id="pushNotificationImage"
                  className="hidden"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <label
                  htmlFor="pushNotificationImage"
                  className=" bg-teal-800 text-white flex justify-center items-center h-20 w-20 mt-10 rounded cursor-pointer"
                  onClick={() => toggleModal("cropImage")}
                >
                  <RenderIcon iconName="CameraIcon" size={28} loading={6} />
                </label>
                {imgSrc && (
                  <CropImage
                    selectedImage={img}
                    aspectRatio={16 / 9} // Optional, set aspect ratio (1:1 here)
                    onCropComplete={handleCropComplete}
                    isOpen={modal.cropImage}
                    onClose={() => {
                      setModal({ ...modal, cropImage: false });
                      setImg(null);
                    }} // Pass the handler to close the modal and reset the state
                  />
                )}
              </div>
            </div>
            <div className="flex">
              <label className="mt-10 ml-10">Customer App</label>
              <Switch
                onCheckedChange={(checked) => onChange("customer", checked)}
                colorPalette="teal"
                variant="solid"
                checked={pushNotification?.customer}
                className="mt-11 ml-[185px]"
              />
            </div>
            <div className="flex">
              <label className="mt-10 ml-10">Merchant App</label>
              <Switch
                className="mt-11 ml-[185px]"
                onCheckedChange={(checked) => onChange("merchant", checked)}
                name="merchant"
                checked={pushNotification?.merchant}
                colorPalette="teal"
                variant="solid"
              />
            </div>
            <div className="flex">
              <label className="mt-10 ml-10">Driver App</label>
              <Switch
                className="mt-11 ml-[210px]"
                onCheckedChange={(checked) => onChange("driver", checked)}
                name="driver"
                checked={pushNotification?.driver}
                colorPalette="teal"
                variant="solid"
              />
            </div>
            <div className="flex justify-end  mb-10 gap-4">
              <Button className="bg-gray-200 rounded-lg px-8 py-2 right-10 mb-5 mr-5 font-semibold justify-end">
                Cancel
              </Button>
              <Button
                className="bg-teal-800 rounded-lg px-8 py-2 right-5 mb-5 mr-10 text-white font-semibold justify-end"
                onClick={handleSave}
              >
                {handleAddPushNotification.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </div> */}

        <div className="bg-white text-[16px] px-5 mx-5 rounded-lg mt-5 text-gray-700">
          <form>
            <div className="flex flex-wrap lg:flex-nowrap">
              <label className="mt-5 lg:mt-10 ml-5 lg:ml-10 w-full lg:w-auto">
                Title<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={pushNotification?.title}
                className="border-2 border-gray-300 rounded mt-5 lg:mt-10 ml-5 lg:ml-60 w-full lg:w-96 p-2 outline-none focus:outline-none"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap">
              <label className="mt-5 lg:mt-10 ml-5 lg:ml-10 lg:w-[190px] sm:w-full">
                Description (This note will be shown in notification.{" "}
                <span className="text-red-500">[Visibility 30 characters]</span>
                )<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={pushNotification?.description}
                className="border-2 border-gray-300 rounded mt-5 lg:mt-10 ml-5 lg:ml-[94px] w-full lg:w-96 outline-none focus:outline-none p-2"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap">
              <label className="mt-5 lg:mt-10 ml-5 lg:ml-10 w-full lg:w-auto">
                Geofence<span className="text-red-500 ms-2">*</span>
              </label>
              <Select
                options={geofenceOptions}
                 value={geofenceOptions?.filter((option) =>
                    pushNotification?.geofenceId?.includes(option.value)
                  )}
                  onChange={(selected) => {
                    if (
                      selected &&
                      selected.some((option) => option.value === "selectAll")
                    ) {
                      setPushNotification({
                        ...pushNotification,
                        geofenceId: allGeofence.map((geofence) => geofence._id),
                      });
                    } else {
                      setPushNotification({
                        ...pushNotification,
                        geofenceId: selected
                          ? selected.map((option) => option.value)
                          : [],
                      });
                    }
                  }}
                className="rounded mt-5 lg:mt-10 ml-5 lg:ml-52 w-full lg:w-96 focus:outline-none"
                placeholder="Select geofence"
                isSearchable
                isMulti
                menuPlacement="top"
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

            <div className="flex flex-wrap lg:flex-nowrap">
              <label className="mt-5 lg:mt-16 ml-5 lg:ml-10 w-full lg:w-auto">
                Image (342px x 160px)
                <span className="text-red-500 ms-2">*</span>
              </label>
              <div className="flex items-center gap-4 mt-5 lg:mt-10 ml-5 lg:ml-[115px]">
                {!croppedFile && (
                  <div className="bg-gray-400 h-20 w-20 rounded-md" />
                )}
                {!!croppedFile && (
                  <figure className="h-20 w-20 rounded-md relative">
                    <img
                      ref={previewCanvasRef}
                      src={URL.createObjectURL(croppedFile)}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                )}
                <input
                  type="file"
                  name="pushNotificationImage"
                  id="pushNotificationImage"
                  className="hidden"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <label
                  htmlFor="pushNotificationImage"
                  className="bg-teal-800 text-white flex justify-center items-center h-20 w-20 rounded cursor-pointer"
                  onClick={() => toggleModal("cropImage")}
                >
                  <RenderIcon iconName="CameraIcon" size={28} loading={6} />
                </label>
              </div>
            </div>
            {imgSrc && (
              <CropImage
                selectedImage={img}
                aspectRatio={16 / 9}
                onCropComplete={handleCropComplete}
                isOpen={modal.cropImage}
                onClose={() => {
                  setModal({ ...modal, cropImage: false });
                  setImg(null);
                }}
              />
            )}

            <div className="flex flex-wrap lg:flex-nowrap mt-5">
              <label className="ml-5 lg:ml-10 w-full lg:w-auto">
                Customer App
              </label>
              <Switch
                onCheckedChange={(checked) => onChange("customer", checked)}
                colorPalette="teal"
                variant="solid"
                checked={pushNotification?.customer}
                className="ml-5 lg:ml-[185px] mt-3 lg:mt-11"
              />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap mt-5">
              <label className="ml-5 lg:ml-10 w-full lg:w-auto">
                Merchant App
              </label>
              <Switch
                className="ml-5 lg:ml-[185px] mt-3 lg:mt-11"
                onCheckedChange={(checked) => onChange("merchant", checked)}
                name="merchant"
                checked={pushNotification?.merchant}
                colorPalette="teal"
                variant="solid"
              />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap mt-5">
              <label className="ml-5 lg:ml-10 w-full lg:w-auto">
                Driver App
              </label>
              <Switch
                className="ml-5 lg:ml-[210px] mt-3 lg:mt-11"
                onCheckedChange={(checked) => onChange("driver", checked)}
                name="driver"
                checked={pushNotification?.driver}
                colorPalette="teal"
                variant="solid"
              />
            </div>

            <div className="flex flex-wrap justify-end mb-10 pb-4 gap-4">
              <Button className="bg-gray-200 rounded-lg px-8 py-2 font-semibold">
                Cancel
              </Button>
              <Button
                className="bg-teal-800 rounded-lg px-8 py-2 text-white font-semibold"
                onClick={handleSave}
              >
                {handleAddPushNotification.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </div>

        <p className="font-bold ml-5">Push Notification log</p>

        {/* <div className="bg-white mx-5 rounded-lg mt-5 flex p-8 justify-between">
          <Select
            options={userTypeForPushNotificationOptions}
            value={userTypeForPushNotificationOptions.find(
              (option) => option.value === selectedFilter.type
            )}
            onChange={(option) => onFilterChange("type", option.value)}
            className=" bg-cyan-50 min-w-[10rem]"
            placeholder="Type of user"
            isSearchable={false}
            isMulti={false}
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
          <div>
            <input
              type="search"
              name="search"
              placeholder="Search push notification name"
              className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px] ml-5 w-72"
              value={selectedFilter.query}
              onChange={(e) => onFilterChange("query", e.target.value)}
            />
          </div>
        </div> */}
        <div className="bg-white mx-5 rounded-lg mt-5 p-8 lg:flex lg:justify-between space-y-4 lg:space-y-0">
          <div className="w-full lg:w-auto">
            <input
              type="search"
              name="search"
              placeholder="Search push notification name"
              className="bg-gray-100 p-3 rounded-3xl focus:outline-none text-[14px] w-full lg:w-72"
              value={selectedFilter.query}
              onChange={(e) => onFilterChange("query", e.target.value)}
            />
          </div>
          <div className="w-full lg:w-auto">
            <Select
              options={userTypeForPushNotificationOptions}
              value={userTypeForPushNotificationOptions.find(
                (option) => option.value === selectedFilter.type
              )}
              onChange={(option) => onFilterChange("type", option.value)}
              className="bg-cyan-50 w-full lg:min-w-[10rem]"
              placeholder="Type of user"
              isSearchable={false}
              isMulti={false}
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
        </div>

        <div className="overflow-x-auto">
          <Table.Root striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]">
                {[
                  "Type of User",
                  "Description",
                  "Image",
                  "Customer App",
                  "Driver App",
                  "Merchant App",
                  "Action",
                ].map((header) => (
                  <Table.ColumnHeader
                    key={header}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pushNotificationLoading && (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={6} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              )}

              {!pushNotificationLoading &&
                pushNotificationData?.length === 0 && (
                  <Table.Row className="h-[70px]">
                    <Table.Cell colSpan={6} textAlign="center">
                      No data available
                    </Table.Cell>
                  </Table.Row>
                )}

              {!pushNotificationLoading &&
                pushNotificationData?.map((data) => (
                  <Table.Row
                    key={data?._id}
                    className="text-center h-20 even:bg-gray-200"
                  >
                    <Table.Cell textAlign="center">
                      {data?.customer && data?.driver && data?.merchant
                        ? "All"
                        : selectedFilter?.type}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {" "}
                      {data?.description.length > 30
                        ? `${data?.description?.substring(0, 30)}...`
                        : data?.description}
                    </Table.Cell>
                    <Table.Cell
                      textAlign="center"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <figure className="h-[70px] w-[100px]">
                        <img
                          src={data?.imageUrl}
                          className="w-full h-full object-contain"
                        />
                      </figure>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={data?.customer}
                        colorPalette="teal"
                        variant="solid"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={data?.driver}
                        colorPalette="teal"
                        variant="solid"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Switch
                        checked={data?.merchant}
                        colorPalette="teal"
                        variant="solid"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          onClick={() =>
                            toggleModal("sendPushNotification", data?._id)
                          }
                          className="bg-green-100 text-green-500 text-[35px] p-2  rounded-lg"
                        >
                          <RenderIcon
                            iconName="UploadIcon"
                            size={16}
                            loading={6}
                          />
                        </Button>
                        <Button
                          onClick={() =>
                            toggleModal("deletePushNotification", data?._id)
                          }
                          className="outline-none focus:outline-none text-red-900 rounded-lg bg-red-100 p-2 text-[35px]"
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
                ))}
            </Table.Body>
          </Table.Root>
        </div>
        <SendNotification
          isOpen={modal.sendPushNotification}
          onClose={() => setModal({ ...modal, sendPushNotification: false })}
          selectedId={selectedId}
        />
        <DeleteNotification
          isOpen={modal.deletePushNotification}
          onClose={() => setModal({ ...modal, deletePushNotification: false })}
          selectedId={selectedId}
        />
      </div>
    </>
  );
};

export default PushNotification;
