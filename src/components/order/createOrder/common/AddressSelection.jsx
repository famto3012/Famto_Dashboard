import { useContext, useEffect, useState } from "react";

import DataContext from "@/context/DataContext";

import { toaster } from "@/components/ui/toaster";

const AddressSelection = ({
  address,
  onAddressSelect,
  clearSignal,
  setClearSignal,
  label,
  choose,
}) => {
  const [selectedAddress, setSelectedAddress] = useState({
    type: null,
    otherAddressId: null,
  });

  const {
    pickAddressType,
    setPickAddressType,
    pickAddressId,
    setPickAddressId,
    deliveryAddressType,
    setDeliveryAddressType,
    deliveryAddressId,
    setDeliveryAddressId,
  } = useContext(DataContext);

  useEffect(() => {
    onAddressSelect(selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (clearSignal) {
      setSelectedAddress({ type: null, otherAddressId: null });
      onAddressSelect({ type: null, otherAddressId: null });
      setClearSignal(false);
    }
  }, [clearSignal]);

  const handleSelectAddressType = (type) => {
    if (choose === "Pick" && type !== "other" && deliveryAddressType === type) {
      toaster.create({
        title: "Error",
        description: "Pick-up Address and Delivery Address cannot be the same",
        type: "error",
      });
      return;
    } else if (
      choose === "Delivery" &&
      type !== "other" &&
      pickAddressType === type
    ) {
      toaster.create({
        title: "Error",
        description: "Pick-up Address and Delivery Address cannot be the same",
        type: "error",
      });
      return;
    }

    choose === "Pick" ? setPickAddressType(type) : setDeliveryAddressType(type);
    setSelectedAddress({ type, otherAddressId: null });
  };

  const handleSelectOtherAddress = (id) => {
    if (
      selectedAddress.type === "other" &&
      deliveryAddressId === id &&
      choose === "Pick"
    ) {
      toaster.create({
        title: "Error",
        description: "Pick-up Address and Delivery Address cannot be the same",
        type: "error",
      });
      return;
    } else if (
      selectedAddress.type === "other" &&
      pickAddressId === id &&
      choose === "Delivery"
    ) {
      toaster.create({
        title: "Error",
        description: "Pick-up Address and Delivery Address cannot be the same",
        type: "error",
      });
      return;
    }

    choose === "Pick" ? setPickAddressId(id) : setDeliveryAddressId(id);
    setSelectedAddress((prev) => ({ ...prev, otherAddressId: id }));
  };

  return (
    <>
      {address?.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-start mb-3 gap-[20px] md:gap-0 w-full">
          <label className="md:w-1/3 md:px-6" htmlFor="address">
            {label}
          </label>

          <div className="md:w-2/3 overflow-x-auto">
            {address?.map((address, index) => {
              const isDisabled =
                address.type === "other"
                  ? address.otherAddress?.length === 0
                  : !address[`${address.type}Address`]?.area;

              return (
                <input
                  key={index}
                  type="button"
                  className={`py-2 px-4 me-2 rounded border capitalize ${
                    selectedAddress.type === address.type
                      ? "bg-gray-300"
                      : "bg-white"
                  } ${isDisabled ? "text-gray-400 cursor-not-allowed" : "text-black cursor-pointer"}`}
                  value={address.type}
                  disabled={isDisabled}
                  onClick={() => handleSelectAddressType(address.type)}
                />
              );
            })}

            {selectedAddress.type === "other" && (
              <div className="mt-5">
                <span>Select other address</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 ">
                  {address
                    ?.find((addr) => addr.type === "other")
                    ?.otherAddress?.map((otherAddr) => (
                      <div
                        key={otherAddr.id}
                        className={`cursor-pointer p-4 border rounded-md ${
                          selectedAddress.otherAddressId === otherAddr.id
                            ? "bg-teal-500 text-white"
                            : "bg-gray-100 text-black"
                        }`}
                        onClick={() => handleSelectOtherAddress(otherAddr.id)}
                      >
                        <div className="flex flex-col gap-y-1">
                          <span>{otherAddr.flat}</span>
                          <span>{otherAddr.area}</span>
                          <span>{otherAddr.landmark}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAddress.type === "home" && (
        <div className="px-6 py-2 border-2 rounded-md md:ms-[33%] bg-gray-100 w-fit">
          {address.find((addr) => addr.type === "home")?.homeAddress && (
            <div className="flex flex-col gap-1">
              <span>
                {address.find((addr) => addr.type === "home").homeAddress.flat}
              </span>
              <span>
                {address.find((addr) => addr.type === "home").homeAddress.area}
              </span>
              <span>
                {
                  address.find((addr) => addr.type === "home").homeAddress
                    .landmark
                }
              </span>
            </div>
          )}
        </div>
      )}

      {selectedAddress.type === "work" && (
        <div className="px-6 py-2 border-2 rounded-md md:ms-[33%] bg-gray-100 w-fit">
          {address?.find((addr) => addr.type === "work")?.workAddress && (
            <div className="flex flex-col gap-1">
              <span>
                {address.find((addr) => addr.type === "work").workAddress.flat}
              </span>
              <span>
                {address.find((addr) => addr.type === "work").workAddress.area}
              </span>
              <span>
                {
                  address.find((addr) => addr.type === "work").workAddress
                    .landmark
                }
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AddressSelection;
