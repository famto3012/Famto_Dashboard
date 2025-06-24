import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Tag } from "@/components/ui/tag";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import Error from "@/components/others/Error";
import Loader from "@/components/others/Loader";
import GlobalSearch from "@/components/others/GlobalSearch";
import WalletTransaction from "@/components/customer/WalletTransaction";
import OrderDetails from "@/components/customer/OrderDetails";

import {
  fetchCustomerDetails,
  updateCustomerDetails,
} from "@/hooks/customer/useCustomer";
import { useDraggable } from "@/hooks/useDraggable";

import BlockOperation from "@/models/general/customer/BlockOperation";
import ShowRating from "@/models/general/customer/ShowRating";
import EditAddress from "@/models/general/customer/EditAddress";
import EnlargeImage from "@/models/common/EnlargeImage";
import Map from "@/models/common/Map";
import DeleteAddress from "@/models/general/customer/DeleteAddress";

const CustomerDetail = () => {
  const [customer, setCustomer] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState({
    block: false,
    rating: false,
    enlarge: false,
    editAddress: false,
    map: false,
    deleteAddress: false,
  });
  const [imageLink, setImageLink] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({
    type: null,
    addressId: null,
    data: null,
  });

  const { customerId } = useParams();
  const navigate = useNavigate();
  const {
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    isDragging,
  } = useDraggable();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-detail", customerId],
    queryFn: () => fetchCustomerDetails(customerId, navigate),
  });

  const handleEditCustomer = useMutation({
    mutationKey: ["edit-customer", customerId],
    mutationFn: ({ customerId, customer }) =>
      updateCustomerDetails(customerId, customer, navigate),
    onSuccess: () => {
      setEditMode(false);
      queryClient.invalidateQueries(["customer-detail", customerId]);
      toaster.create({
        title: "Success",
        description: "Customer details updated",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating customer details",
        type: "error",
      });
    },
  });

  useEffect(() => {
    data && setCustomer(data);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const toggleModal = (type, link = null) => {
    setImageLink(link);
    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = () => {
    setModal({
      block: false,
      rating: false,
      enlarge: false,
      editAddress: false,
      deleteAddress: false,
      map: false,
    });
    setImageLink(null);
    setSelectedAddress({
      type: null,
      addressId: null,
      data: null,
    });
  };

  const handleSelectAddress = (type, addressType, addressId = null) => {
    let data;
    if (addressType === "home") {
      data = customer.homeAddress;
    } else if (addressType === "work") {
      data = customer.workAddress;
    } else if (addressType === "other") {
      const addressFound = customer.otherAddress.find(
        (address) => address.id === addressId
      );
      data = addressFound;
    }

    setSelectedAddress({
      type: addressType,
      addressId,
      data,
    });

    setModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleUpdateAddress = (data) => {
    if (data.type === "home") {
      setCustomer((prevData) => ({
        ...prevData,
        homeAddress: {
          ...data.formData,
        },
      }));
    } else if (data.type === "work") {
      setCustomer((prevData) => ({
        ...prevData,
        workAddress: {
          ...data.formData,
        },
      }));
    } else if (data.type === "other") {
      setCustomer((prevData) => ({
        ...prevData,
        otherAddress: prevData.otherAddress.map((address) =>
          address.id === selectedAddress.addressId
            ? { ...address, ...data.formData }
            : address
        ),
      }));
    }
  };

  const handleDeleteAddress = () => {
    if (selectedAddress.type === "home") {
      customer.homeAddress = null;
    } else if (selectedAddress.type === "work") {
      customer.workAddress = null;
    } else if (selectedAddress.type === "other") {
      customer.otherAddress = customer.otherAddress.filter(
        (address) => address.id !== selectedAddress.addressId
      );
    }

    closeModal();
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <>
      <div className="bg-gray-100 min-h-full">
        <GlobalSearch />

        <div className="flex items-center justify-between mx-11 mt-5">
          <h1 className=" text-[16px] lg:text-lg font-bold">
            Customer ID <span className="text-red-600">#{customer._id}</span>
          </h1>
          {!customer?.isBlocked && (
            <button
              className="bg-yellow-100 text-black rounded-md  px-3 py-1 gap-2 font-semibold flex items-center"
              onClick={() => toggleModal("block")}
            >
              <span className="text-red-500">
                <RenderIcon iconName="BlockIcon" size={18} loading={6} />
              </span>
              <span className="text-[16px]">Block</span>
            </button>
          )}
        </div>

        <div className="bg-white mx-7 py-2 mt-5">
          <div className="grid grid-cols-2 xl:grid-cols-6 mt-4">
            <div className=" col-span-2 lg:col-span-4 rounded-lg mx-6 ">
              <form>
                <div className="flex flex-col md:flex-row lg:gap-6">
                  <div className="p-3 flex flex-col w-full gap-3">
                    <div className="flex items-center ">
                      <label htmlFor="fullName" className="w-1/3 text-sm">
                        Full name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={customer.fullName}
                        onChange={handleInputChange}
                        className={`${
                          editMode && `border-2`
                        } h-8 px-2 rounded-sm text-sm focus:outline-none w-2/3`}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="flex items-center">
                      <label htmlFor="email" className="w-1/3 text-sm">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleInputChange}
                        className={`${
                          editMode && `border-2`
                        } h-8 px-2 rounded-sm text-sm focus:outline-none w-2/3`}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="flex items-center">
                      <label htmlFor="phone" className="w-1/3 text-sm">
                        Phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={customer.phoneNumber}
                        onChange={handleInputChange}
                        className={`${
                          editMode && `border-2`
                        } h-8 px-2 rounded-sm text-sm focus:outline-none w-2/3`}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="p-3 flex flex-col w-full gap-3">
                    <div className="flex items-center">
                      <label
                        htmlFor="registrationDate"
                        className="w-2/5 text-sm"
                      >
                        Registration Date
                      </label>
                      <input
                        name="registrationDate"
                        value={customer.registrationDate}
                        onChange={handleInputChange}
                        className="h-8 px-2 rounded-sm text-sm focus:outline-none w-3/5"
                        disabled
                      />
                    </div>

                    <div className="flex items-center">
                      <label
                        htmlFor="lastPlatformUsed"
                        className="w-2/5 text-sm"
                      >
                        Platform Used
                      </label>
                      <input
                        type="text"
                        name="lastPlatformUsed"
                        value={customer.lastPlatformUsed}
                        onChange={handleInputChange}
                        className="h-8 px-2 rounded-sm text-sm focus:outline-none w-3/5 capitalize"
                        disabled
                      />
                    </div>

                    <div className="flex items-center">
                      <label htmlFor="referralCode" className="w-2/5 text-sm">
                        Referral Code
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        value={customer?.referralCode || "-"}
                        onChange={handleInputChange}
                        className="h-8 px-2 rounded-sm text-sm focus:outline-none w-3/5"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <figure className="h-16 w-16 ms-[20px] lg:ms-[10rem] xl:ms-0 mt-[30px] xl:mt-0 cursor-pointer">
              {customer?.customerImageURL ? (
                <img
                  onClick={() =>
                    toggleModal("enlarge", customer?.customerImageURL)
                  }
                  src={customer?.customerImageURL}
                  alt={customer?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-400 h-16 w-16 "></div>
              )}
            </figure>

            <div className="mt-[30px] xl:mt-0">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  disabled={editMode}
                  className="bg-teal-100 flex items-center gap-3 p-2 rounded-lg mr-3 cursor-pointer"
                >
                  <RenderIcon iconName="EditIcon" size={16} loading={6} />
                  <span>Edit Customer</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleEditCustomer.mutate({ customerId, customer });
                  }}
                  className="bg-teal-600 text-white py-2 px-3 rounded-md"
                >
                  {handleEditCustomer.isPending ? `Saving...` : `Save`}
                </button>
              )}
            </div>
          </div>

          <div className="lg:w-[600px] flex flex-col md:flex-row md:items-center justify-start lg:justify-between gap-[30px] mt-10 mx-[20px]">
            <label className="text-gray-700 md:mx-11 font-bold">Ratings</label>

            <button
              type="button"
              onClick={() => toggleModal("rating")}
              className="bg-teal-700 text-white p-2 rounded-md md:w-[20rem]"
            >
              Show ratings and reviews
            </button>
          </div>

          <div className="lg:w-[600px] flex flex-col md:flex-row md:items-center justify-start lg:justify-between gap-[30px] mt-10 mx-[20px]">
            <label className="text-gray-700 md:mx-11 font-bold">Location</label>

            <button
              type="button"
              onClick={() => toggleModal("map")}
              className="bg-teal-700 text-white p-2 rounded-md md:w-[20rem]"
            >
              View Location
            </button>
          </div>

          <div className="mt-10">
            <h4 className="text-gray-700 mx-[20px] lg:mx-11 font-bold">
              Address
            </h4>

            <div
              className={`flex flex-wrap gap-[30px] ms-11 my-5 w-[90%] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {customer?.homeAddress?.fullName && (
                <div className="min-w-[250px] px-2 group relative bg-gray-100 p-2 rounded-md">
                  <div className="flex items-center justify-between">
                    <Tag variant="solid" className="p-2">
                      Home
                    </Tag>
                    <div className="flex flex-row gap-3 absolute top-2 right-2">
                      <span
                        onClick={() =>
                          handleSelectAddress("editAddress", "home")
                        }
                        className={`${editMode ? "block" : "hidden"} cursor-pointer bg-gray-200 p-2 rounded-full`}
                      >
                        <RenderIcon iconName="EditIcon" size={16} loading={6} />
                      </span>

                      <span
                        onClick={() =>
                          handleSelectAddress("deleteAddress", "home")
                        }
                        className={`${editMode ? "block" : "hidden"}  cursor-pointer bg-red-200 text-red-500 p-2 rounded-full`}
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={16}
                          loading={6}
                        />
                      </span>
                    </div>
                  </div>

                  <span className="flex justify-start mt-3">
                    {customer?.homeAddress?.fullName}
                  </span>
                  <span className="flex justify-start">
                    {customer?.homeAddress?.phoneNumber}
                  </span>
                  <span className="flex justify-start">
                    {customer?.homeAddress?.flat}
                  </span>
                  <span className="flex justify-start">
                    {customer?.homeAddress?.area}
                  </span>
                  <span className="flex justify-start">
                    {customer?.homeAddress?.landmark}
                  </span>
                </div>
              )}

              {customer?.workAddress?.fullName && (
                <div className="min-w-[250px] px-2 group relative bg-gray-100 p-2 rounded-md">
                  <div className="flex items-center justify-between">
                    <Tag variant="solid" className="p-2">
                      Work
                    </Tag>
                    <div className="flex flex-row gap-3 absolute top-2 right-2">
                      <span
                        onClick={() =>
                          handleSelectAddress("editAddress", "work")
                        }
                        className={`${editMode ? "block" : "hidden"} cursor-pointer bg-gray-200 p-2 rounded-full`}
                      >
                        <RenderIcon iconName="EditIcon" size={16} loading={6} />
                      </span>

                      <span
                        onClick={() =>
                          handleSelectAddress("deleteAddress", "work")
                        }
                        className={`${editMode ? "block" : "hidden"}  cursor-pointer bg-red-200 text-red-500 p-2 rounded-full`}
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={16}
                          loading={6}
                        />
                      </span>
                    </div>
                  </div>

                  <span className="flex justify-start mt-3">
                    {customer?.workAddress?.fullName}
                  </span>
                  <span className="flex justify-start">
                    {customer?.workAddress?.phoneNumber}
                  </span>
                  <span className="flex justify-start">
                    {customer?.workAddress?.flat}
                  </span>
                  <span className="flex justify-start">
                    {customer?.workAddress?.area}
                  </span>
                  <span className="flex justify-start">
                    {customer?.workAddress?.landmark}
                  </span>
                </div>
              )}

              {customer?.otherAddress?.map((address, index) => (
                <div
                  key={index}
                  className="min-w-[250px] px-2 group relative  bg-gray-100 p-2 rounded-md"
                >
                  <div className="flex justify-between">
                    <Tag variant="solid" className="p-2">
                      Other ({index + 1})
                    </Tag>

                    <div className="flex flex-row gap-3 absolute top-2 right-2">
                      <span
                        onClick={() =>
                          handleSelectAddress(
                            "editAddress",
                            "other",
                            address.id
                          )
                        }
                        className={`${editMode ? "block" : "hidden"} cursor-pointer bg-gray-200 p-2 rounded-full`}
                      >
                        <RenderIcon iconName="EditIcon" size={16} loading={6} />
                      </span>

                      <span
                        onClick={() =>
                          handleSelectAddress(
                            "deleteAddress",
                            "other",
                            address.id
                          )
                        }
                        className={`${editMode ? "block" : "hidden"}  cursor-pointer bg-red-200 text-red-500 p-2 rounded-full`}
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={16}
                          loading={6}
                        />
                      </span>
                    </div>
                  </div>

                  <span className="flex justify-start mt-3">
                    {address?.fullName}
                  </span>
                  <span className="flex justify-start">
                    {address?.phoneNumber}
                  </span>
                  <span className="flex justify-start">{address?.flat}</span>
                  <span className="flex justify-start">{address?.area}</span>
                  <span className="flex justify-start">
                    {address?.landmark}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <WalletTransaction
          data={customer?.walletDetails}
          customerId={customer?._id}
        />

        <OrderDetails data={customer?.orderDetails} />
      </div>

      <BlockOperation
        isOpen={modal.block}
        onClose={closeModal}
        customerId={customerId}
      />

      <ShowRating
        isOpen={modal.rating}
        onClose={closeModal}
        customerId={customerId}
      />

      <EnlargeImage
        isOpen={modal.enlarge}
        onClose={closeModal}
        source={imageLink}
      />

      <EditAddress
        isOpen={modal.editAddress}
        onClose={closeModal}
        type={selectedAddress.type}
        address={selectedAddress.data}
        onNewAddress={handleUpdateAddress}
      />

      <Map
        isOpen={modal.map}
        onClose={closeModal}
        oldLocation={customer.location}
      />

      <DeleteAddress
        isOpen={modal.deleteAddress}
        onClose={closeModal}
        onConfirmDelete={handleDeleteAddress}
      />
    </>
  );
};

export default CustomerDetail;
