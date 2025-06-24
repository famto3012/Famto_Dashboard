import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";

import TakeAway from "@/components/order/createOrder/TakeAway";
import PickAndDrop from "@/components/order/createOrder/PickAndDrop";
import CustomOrder from "@/components/order/createOrder/CustomOrder";
import HomeDelivery from "@/components/order/createOrder/HomeDelivery";
import NewCustomerForm from "@/components/order/createOrder/NewCustomerForm";

import CustomerSelection from "@/components/order/createOrder/common/CustomerSelection";
import DeliveryModeAndOption from "@/components/order/createOrder/common/DeliveryModeAndOption";

const CreateOrder = () => {
  const [topData, setTopData] = useState({
    customerId: null,
    customerAddress: null,
    newCustomer: null,
  });
  const [address, setAddress] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const handleSelectCustomer = (customer) => {
    setTopData({
      ...topData,
      customerId: customer?.customerId || customer?._id,
    });
    setAddress(customer.address);
  };

  const handleDeliveryModeAndOption = (data) => {
    setTopData({ ...topData, ...data });
  };

  const toggleNewCustomerForm = () => {
    setIsFormVisible(!isFormVisible);
    setTopData((prev) => ({
      ...prev,
      customerId: null,
      newCustomer: {},
    }));
  };

  const handleAddNewCustomer = (newCustomer) => {
    setIsFormVisible(true);
    setTopData((prev) => ({
      ...prev,
      newCustomer,
    }));
  };

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex items-center justify-start mt-[10px] ms-[20px]">
        <span onClick={() => navigate("/order")} className="cursor-pointer">
          <RenderIcon iconName="LeftArrowIcon" size={20} loading={6} />
        </span>
        <span className="text-lg font-semibold ml-3">Create Order</span>
      </div>

      <div className="bg-white mx-[20px] mt-5 mb-[35px] p-5 rounded-md">
        <div className="flex flex-col gap-6">
          <CustomerSelection onCustomerSelect={handleSelectCustomer} />

          <div>
            <div className="flex">
              <label className="md:w-1/3"></label>
              <button
                type="button"
                className="w-full md:w-1/2 bg-gray-200 font-semibold py-2 rounded flex justify-between items-center px-4 border border-gray-300"
                onClick={toggleNewCustomerForm}
              >
                <span>Add Customer</span>
                <RenderIcon iconName="PlusIcon" size={20} loading={6} />
              </button>
            </div>

            {isFormVisible && (
              <NewCustomerForm
                toggleNewCustomerForm={toggleNewCustomerForm}
                onAddCustomer={handleAddNewCustomer}
              />
            )}
          </div>

          <DeliveryModeAndOption onDataChange={handleDeliveryModeAndOption} />

          {topData?.deliveryMode === "Take Away" && <TakeAway data={topData} />}

          {topData?.deliveryMode === "Home Delivery" && (
            <HomeDelivery data={topData} address={address} />
          )}

          {topData?.deliveryMode === "Pick and Drop" && (
            <PickAndDrop data={topData} address={address} />
          )}

          {role !== "Merchant" && (
            <>
              {topData?.deliveryMode === "Custom Order" && (
                <CustomOrder data={topData} address={address} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
