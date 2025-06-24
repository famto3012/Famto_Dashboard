import { Radio, RadioGroup } from "@/components/ui/radio";
import GlobalSearch from "@/components/others/GlobalSearch";
import CropImage from "@/components/others/CropImage";
import RenderIcon from "@/icons/RenderIcon";
import Select from "react-select";
import { userTypeOptions } from "@/utils/defaultData";
import DeleteNotification from "@/models/notification/alertNotification/DeleteNotification";
import SendNotification from "@/models/notification/alertNotification/SendNotification";
import { HStack, Table } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ShowSpinner from "@/components/others/ShowSpinner";
import { filterAlertNotification } from "@/hooks/notification/useNotification";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

const AlertNotification = () => {
  const [alertNotification, setAlertNotification] = useState({
    userType: "customer",
    id: "",
    title: "",
    description: "",
  });
  const [modal, setModal] = useState({
    sendAlertNotification: false,
    deleteAlertNotification: false,
    cropImage: false,
  });
  const [pagination, setPagination] = useState({});
  const [alertNotificationData, setAlertNotificationData] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const previewCanvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    userType: null,
    title: null,
    page: 1,
    limit: 10,
  });
  const navigate = useNavigate();

  const { data: alertNotificationLog, isLoading: alertNotificationLoading } =
    useQuery({
      queryKey: ["filter-alert-notification", selectedFilter],
      queryFn: () => filterAlertNotification(navigate, selectedFilter),
    });

  const handleInputChange = (e) => {
    setAlertNotification({
      ...alertNotification,
      [e.target.name]: e.target.value,
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

  useEffect(() => {
    if (alertNotificationLog) {
      setPagination(alertNotificationLog);
      setAlertNotificationData(alertNotificationLog.data);
    }
  }, [alertNotificationLog]);

  return (
    <>
      <div className="w-full bg-gray-100">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <div className="flex flex-col mx-[30px] mt-[20px] gap-2">
          <h1 className="font-bold">Alert Notification</h1>
          <h1>
            This tool serves to notify and remind a certain customer, agent, or
            merchant.
          </h1>
        </div>
        {/* <div className="bg-white p-12 rounded-lg mt-[40px]">
          <form>
            <div className="flex flex-col gap-6 ">
              <div className="flex items-center">
                <label className="block text-gray-700">
                  Type of user<span className="text-red-500 ms-2">*</span>
                </label>
                <div className="flex space-x-24 ml-[128px]">
                  <RadioGroup
                    value={alertNotification?.userType}
                    colorPalette="teal"
                    variant="solid"
                    size="sm"
                    onValueChange={(e) =>
                      setAlertNotification({
                        ...alertNotification,
                        userType: e.value,
                      })
                    }
                    className="flex gap-[15px]"
                  >
                    <Radio
                      value="customer"
                      className="text-black text-[16px] cursor-pointer"
                    >
                      Customer
                    </Radio>
                    <Radio
                      value="agent"
                      className="text-black text-[16px] cursor-pointer"
                    >
                      Agent
                    </Radio>
                    <Radio
                      value="merchant"
                      className="text-black text-[16px] cursor-pointer"
                    >
                      Merchant
                    </Radio>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex items-center">
                <label htmlFor="id" className="text-gray-500">
                  ID<span className="text-red-500 ms-2">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={alertNotification?.id}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded p-2 w-[45%] ml-[200px] outline-none focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <label className="text-gray-500">
                  Title<span className="text-red-500 ms-2">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={alertNotification?.title}
                  className="border-2 border-gray-300 rounded p-2 w-[45%] ml-[185px] outline-none focus:outline-none"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="w-[215px] text-gray-500">
                  Description (This note will be shown in notification.{" "}
                  <span className="text-red-500">
                    [Visibility 30 characters]
                  </span>
                  )<span className="text-red-500 ms-2">*</span>
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={alertNotification?.description}
                  className="border-2 border-gray-300 rounded p-2 w-[45%] ml-[18px] outline-none focus:outline-none"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <label className="text-gray-500">
                  Image (342px x 160px)
                  <span className="text-red-500 ms-2">*</span>
                </label>
                <div className=" flex items-center gap-[30px]">
                  {!croppedFile && (
                    <div className="bg-gray-400 ml-[55px] mt-0.5 h-20 w-20 rounded-md" />
                  )}
                  {!!croppedFile && (
                    <figure className="mt-0.5 ml-[55px] h-20 w-20 rounded-md relative">
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
                    name="notificationImage"
                    id="notificationImage"
                    className="hidden"
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                  <label
                    htmlFor="notificationImage"
                    className="bg-teal-800 text-[40px] flex justify-center items-center text-white p-6 h-20 w-20 mt-0.5 rounded-md cursor-pointer"
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

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  className="bg-teal-800 text-white py-2 px-10 rounded-md"
                  onClick={() => toggleModal("sendAlertNotification")}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div> */}
        <div className="bg-white p-6 lg:p-12 rounded-lg mt-10">
          <form>
            <div className="flex flex-col gap-6">
              {/* User Type Selection */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center">
                <label className="block text-gray-700 w-[200px] me-5">
                  Type of user<span className="text-red-500 ms-2">*</span>
                </label>
                <RadioGroup
                  value={alertNotification?.userType}
                  colorPalette="teal"
                  variant="solid"
                  size="sm"
                  onValueChange={(e) =>
                    setAlertNotification({
                      ...alertNotification,
                      userType: e.value,
                    })
                  }
                  className="flex gap-4 lg:gap-8"
                >
                  <Radio
                    value="customer"
                    className="text-black text-[16px] cursor-pointer"
                  >
                    Customer
                  </Radio>
                  <Radio
                    value="agent"
                    className="text-black text-[16px] cursor-pointer"
                  >
                    Agent
                  </Radio>
                  <Radio
                    value="merchant"
                    className="text-black text-[16px] cursor-pointer"
                  >
                    Merchant
                  </Radio>
                </RadioGroup>
              </div>

              {/* ID Input */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <label htmlFor="id" className="text-gray-500 w-[200px]">
                  ID<span className="text-red-500 ms-2">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={alertNotification?.id}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded p-2 w-full lg:w-[45%] outline-none focus:outline-none"
                />
              </div>

              {/* Title Input */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <label className="text-gray-500 w-[200px]">
                  Title<span className="text-red-500 ms-2">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={alertNotification?.title}
                  className="border-2 border-gray-300 rounded p-2 w-full lg:w-[45%] outline-none focus:outline-none"
                  onChange={handleInputChange}
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <label className="w-[200px] text-gray-500">
                  Description (This note will be shown in notification.{" "}
                  <span className="text-red-500">
                    [Visibility 30 characters]
                  </span>
                  )<span className="text-red-500 ms-2">*</span>
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={alertNotification?.description}
                  className="border-2 border-gray-300 rounded p-2 w-full lg:w-[45%] outline-none focus:outline-none"
                  onChange={handleInputChange}
                />
              </div>

              {/* Image Upload */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <label className="text-gray-500 w-[200px]">
                  Image (342px x 160px)
                  <span className="text-red-500 ms-2">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {!croppedFile && (
                    <div className="bg-gray-400 h-20 w-20 rounded-md" />
                  )}
                  {!!croppedFile && (
                    <figure className="h-20 w-20 rounded-md relative">
                      <img
                        ref={previewCanvasRef}
                        src={URL.createObjectURL(croppedFile)}
                        alt="profile"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </figure>
                  )}
                  <input
                    type="file"
                    name="notificationImage"
                    id="notificationImage"
                    className="hidden"
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                  <label
                    htmlFor="notificationImage"
                    className="bg-teal-800 text-white text-[20px] flex justify-center items-center p-6 h-20 w-20 rounded-md cursor-pointer"
                    onClick={() => toggleModal("cropImage")}
                  >
                    <RenderIcon iconName="CameraIcon" size={28} loading={6} />
                  </label>
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
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <Button
                  className="bg-teal-800 text-white py-2 px-10 rounded-md"
                  onClick={() => toggleModal("sendAlertNotification")}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <p className="font-bold mt-5 mx-[30px]">Alert Notification log</p>
          {/* <div className="bg-white rounded-lg mt-5 flex p-8 justify-between">
            <Select
              options={userTypeOptions}
              value={userTypeOptions.find(
                (option) => option.value === selectedFilter.userType
              )}
              onChange={(option) => onFilterChange("userType", option.value)}
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
                placeholder="Search alert notification name"
                className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px] ml-5 w-72"
                value={selectedFilter.title}
                onChange={(e) => onFilterChange("title", e.target.value)}
              />
            </div>
          </div> */}
          <div className="bg-white rounded-lg mt-5 p-8 flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-0">
            {/* Search Input */}
            <div className="w-full lg:w-auto">
              <input
                type="search"
                name="search"
                placeholder="Search alert notification name"
                className="bg-gray-100 p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px] w-full lg:w-72"
                value={selectedFilter.title}
                onChange={(e) => onFilterChange("title", e.target.value)}
              />
            </div>

            {/* User Type Select */}
            <div className="w-full lg:w-auto">
              <Select
                options={userTypeOptions}
                value={userTypeOptions.find(
                  (option) => option.value === selectedFilter.userType
                )}
                onChange={(option) => onFilterChange("userType", option.value)}
                className="bg-cyan-50 min-w-[10rem] w-full lg:w-auto"
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
                  {["Title", "ID", "Description", "Image", "Action"].map(
                    (header) => (
                      <Table.ColumnHeader
                        key={header}
                        color="white"
                        textAlign="center"
                      >
                        {header}
                      </Table.ColumnHeader>
                    )
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {alertNotificationLoading && (
                  <Table.Row className="h-[70px]">
                    <Table.Cell colSpan={6} textAlign="center">
                      <ShowSpinner /> Loading...
                    </Table.Cell>
                  </Table.Row>
                )}

                {!alertNotificationLoading &&
                  alertNotificationData?.length === 0 && (
                    <Table.Row className="h-[70px]">
                      <Table.Cell colSpan={6} textAlign="center">
                        No data available
                      </Table.Cell>
                    </Table.Row>
                  )}

                {!alertNotificationLoading &&
                  alertNotificationData?.map((data) => (
                    <Table.Row
                      key={data?._id}
                      className="text-center h-20 even:bg-gray-200"
                    >
                      <Table.Cell textAlign="center">{data?.title}</Table.Cell>
                      <Table.Cell textAlign="center" className="uppercase">
                        {" "}
                        {data?._id}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {" "}
                        {data?.description?.length > 30
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
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            onClick={() =>
                              toggleModal("deleteAlertNotification", data?._id)
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
          {/* <div className="flex justify-center bg-white mt-3 mb-4">
            <PaginationRoot
              count={pagination.totalDocuments || 0}
              page={selectedFilter.page}
              pageSize={30}
              defaultPage={1}
              onPageChange={(e) =>
                setSelectedFilter({ ...selectedFilter, page: e.page })
              }
              variant="solid"
              className="py-[50px] flex justify-center"
            >
              <HStack>
                <PaginationPrevTrigger className="bg-gray-200 hover:bg-white" />
                <PaginationItems className="bg-gray-200 hover:bg-white" />
                <PaginationNextTrigger className="bg-gray-200 hover:bg-white" />
              </HStack>
            </PaginationRoot>
          </div> */}
          <div className="flex justify-center bg-white mt-3 mb-4 px-4">
            <PaginationRoot
              count={pagination.totalDocuments || 0}
              page={selectedFilter.page}
              pageSize={30}
              defaultPage={1}
              onPageChange={(e) =>
                setSelectedFilter({ ...selectedFilter, page: e.page })
              }
              variant="solid"
              className="py-4 flex flex-wrap justify-center gap-2"
            >
              <HStack className="flex flex-wrap gap-2">
                <PaginationPrevTrigger className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
                <PaginationItems className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
                <PaginationNextTrigger className="bg-gray-200 hover:bg-white px-3 py-2 rounded-md text-sm md:text-base" />
              </HStack>
            </PaginationRoot>
          </div>

          <SendNotification
            isOpen={modal.sendAlertNotification}
            onClose={() => {
              setModal({ ...modal, sendAlertNotification: false });
              setAlertNotification({
                userType: "",
                id: "",
                title: "",
                description: "",
              });
              setCroppedFile(null);
            }}
            alertNotification={alertNotification}
            croppedFile={croppedFile}
          />
          <DeleteNotification
            isOpen={modal.deleteAlertNotification}
            onClose={() =>
              setModal({ ...modal, deleteAlertNotification: false })
            }
            selectedId={selectedId}
          />
        </div>
      </div>
    </>
  );
};

export default AlertNotification;
