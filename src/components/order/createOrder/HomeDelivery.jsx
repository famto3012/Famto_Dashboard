import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import { toaster } from "@/components/ui/toaster";

import ShowBill from "./common/ShowBill";

import SelectMerchant from "@/components/order/createOrder/common/SelectMerchant";
import SelectProduct from "@/components/order/createOrder/common/SelectProduct";
import AddressSelection from "@/components/order/createOrder/common/AddressSelection";
import AddAddress from "@/components/order/createOrder/common/AddAddress";

import {
  createInvoice,
  fetchAvailableBusinessCategoriesOfMerchant,
} from "@/hooks/order/useOrder";
import { validateCreateInvoice } from "@/utils/validationHelper";

const HomeDelivery = ({ data, address }) => {
  const [homeDeliveryData, setHomeDeliveryData] = useState({
    selectedBusinessCategory: null,
    merchantId: null,
    items: [],
    customerAddressType: null,
    customerAddressOtherAddressId: null,
    instructionToMerchant: "",
    instructionToDeliveryAgent: "",
    addedTip: "",
    flatDiscount: "",
  });
  const [businessCategories, setBusinessCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartData, setCartData] = useState({});
  const [showBill, setShowBill] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);
  const { setDeliveryAddressType, setDeliveryAddressId } =
    useContext(DataContext);

  const { data: availableBusinessCategory } = useQuery({
    queryKey: ["available-business-category"],
    queryFn: () => fetchAvailableBusinessCategoriesOfMerchant(navigate),
    enabled: role === "Merchant",
  });

  useEffect(() => {
    setHomeDeliveryData((prev) => ({
      ...prev,
      ...data,
    }));
  }, [data]);

  useEffect(() => {
    if (role === "Merchant") {
      setHomeDeliveryData((prev) => ({
        ...prev,
        merchantId: userId,
      }));
    }
  }, []);

  useEffect(() => {
    availableBusinessCategory?.length &&
      setBusinessCategories(availableBusinessCategory);
  }, [availableBusinessCategory]);

  const handleMerchantSelect = (data) => {
    setHomeDeliveryData({ ...homeDeliveryData, merchantId: data._id });
    setBusinessCategories(data.businessCategory);
  };

  const handleSelectProduct = (data) => {
    setHomeDeliveryData({ ...homeDeliveryData, items: data });
  };

  const handleSelectAddress = (data) => {
    setHomeDeliveryData({
      ...homeDeliveryData,
      customerAddressType: data.type,
      customerAddressOtherAddressId: data.otherAddressId,
    });
  };

  const handleToggleNewAddress = () => {
    setHomeDeliveryData({
      ...homeDeliveryData,
      customerAddressType: null,
      customerAddressOtherAddressId: null,
    });
    setDeliveryAddressType(null);
    setDeliveryAddressId(null);
    setClearSignal(true);
  };

  const handleNewCustomerAddress = (data) => {
    setHomeDeliveryData({
      ...homeDeliveryData,
      newCustomerAddress: data,
      customerAddressType: null,
      customerAddressOtherAddressId: null,
    });
  };

  const handleCreateInvoice = useMutation({
    mutationKey: ["home-delivery-invoice"],
    mutationFn: () => createInvoice(role, homeDeliveryData, navigate),
    onSuccess: (data) => {
      setCartData(data);
      setShowBill(true);
      toaster.create({
        title: "Success",
        description: "Invoice created successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while creating invoice",
        type: "error",
      });
    },
  });

  const handleVerifyDetails = () => {
    const validationErrors = validateCreateInvoice(homeDeliveryData, role);

    if (validationErrors.length > 0) {
      toaster.create({
        title: "Error",
        description: validationErrors.map((err) => `• ${err} \n`),
        type: "error",
      });
      return;
    }

    handleCreateInvoice.mutate();
  };

  return (
    <div className="bg-white  mt-5 rounded">
      <div className="flex flex-col gap-6">
        {role !== "Merchant" && (
          <SelectMerchant onMerchantSelect={handleMerchantSelect} />
        )}

        <div className="flex md:items-center relative">
          <label className="hidden md:block md:w-1/3 md:px-6 invisible"></label>
          <div className="md:w-1/2 flex md:items-center gap-5 overflow-x-auto">
            {businessCategories?.map((category) => (
              <button
                key={category._id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category._id);
                  setHomeDeliveryData({
                    ...homeDeliveryData,
                    selectedBusinessCategory: category._id,
                  });
                }}
                className={`${
                  selectedCategory === category._id
                    ? `bg-gray-400`
                    : `bg-gray-100`
                }  border  p-2 rounded-sm`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <SelectProduct
          merchantId={homeDeliveryData.merchantId}
          categoryId={selectedCategory}
          onProductSelect={handleSelectProduct}
        />

        {role !== "Merchant" && (
          <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
            <label
              className="md:w-1/3 md:px-6 text-gray-700"
              htmlFor="instructionToMerchant"
            >
              Instruction to Merchant
            </label>
            <textarea
              name="instructionToMerchant"
              rows={3}
              placeholder="Instruction to Merchant"
              className="text-[16px] ps-3 pt-2 border-2 md:w-1/2 outline-none focus:outline-none resize-y overflow-y-auto rounded-md"
              value={homeDeliveryData.instructionToMerchant}
              onChange={(e) =>
                setHomeDeliveryData({
                  ...homeDeliveryData,
                  instructionToMerchant: e.target.value,
                })
              }
            ></textarea>
          </div>
        )}

        <AddressSelection
          address={address}
          onAddressSelect={handleSelectAddress}
          clearSignal={clearSignal}
          setClearSignal={setClearSignal}
          label="Select Delivery Address"
          choose="Delivery"
        />

        <AddAddress
          onNewAddress={handleNewCustomerAddress}
          onToggleAddAddress={handleToggleNewAddress}
        />

        <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
          <label
            className="md:w-1/3 md:px-6 text-gray-700"
            htmlFor="instructionToDeliveryAgent"
          >
            Instructions to Delivery Agent
          </label>
          <textarea
            name="instructionToDeliveryAgent"
            rows={3}
            placeholder="Instruction to agent"
            className="text-[16px] ps-3 pt-2 border-2 md:w-1/2 outline-none focus:outline-none resize-y rounded-md"
            value={homeDeliveryData.instructionToDeliveryAgent}
            onChange={(e) =>
              setHomeDeliveryData({
                ...homeDeliveryData,
                instructionToDeliveryAgent: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
          <label className="md:w-1/3 md:px-6" htmlFor="addedTip">
            Tips
          </label>
          <input
            className="h-10 px-5 text-sm border-2 md:w-1/2  outline-none focus:outline-none rounded-md"
            type="text"
            placeholder="Add Tip"
            name="addedTip"
            title="Please enter a valid number"
            value={homeDeliveryData.addedTip}
            onChange={(e) =>
              setHomeDeliveryData({
                ...homeDeliveryData,
                addedTip: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (
                !/^[0-9]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
          <label className="md:w-1/3 md:px-6" htmlFor="discount">
            Flat Discount
          </label>

          <input
            type="text"
            name="flatDiscount"
            placeholder="Flat discount"
            className="h-10 ps-3 text-sm border-2 md:w-1/2 outline-none focus:outline-none rounded-md"
            value={homeDeliveryData.flatDiscount}
            onChange={(e) =>
              setHomeDeliveryData({
                ...homeDeliveryData,
                flatDiscount: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (
                !/^[0-9]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <button
          onClick={handleVerifyDetails}
          className="ms-auto me-[6rem] xl:me-[12rem] my-[30px] bg-teal-700 text-white py-2 px-4 rounded-md capitalize"
        >
          {handleCreateInvoice.isPending ? `Creating...` : `Create Invoice`}
        </button>
      </div>

      {showBill && <ShowBill data={cartData} />}
    </div>
  );
};

export default HomeDelivery;
