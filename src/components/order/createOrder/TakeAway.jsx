import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/AuthContext";

import { toaster } from "@/components/ui/toaster";

import SelectMerchant from "@/components/order/createOrder/common/SelectMerchant";
import SelectProduct from "@/components/order/createOrder/common/SelectProduct";
import ShowTakeAwayBill from "@/components/order/createOrder/common/ShowTakeAwayBill";

import {
  createInvoice,
  fetchAvailableBusinessCategoriesOfMerchant,
} from "@/hooks/order/useOrder";
import { validateCreateInvoice } from "@/utils/validationHelper";

const TakeAway = ({ data }) => {
  const [takeAwayData, setTakeAwayData] = useState({
    ...data,
    merchantId: null,
    items: [],
    instructionToMerchant: "",
  });
  const [businessCategories, setBusinessCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [cartData, setCartData] = useState({});

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);

  const { data: availableBusinessCategory } = useQuery({
    queryKey: ["available-business-category"],
    queryFn: () => fetchAvailableBusinessCategoriesOfMerchant(navigate),
    enabled: role === "Merchant",
  });

  useEffect(() => {
    if (role === "Merchant") {
      setTakeAwayData((prev) => ({
        ...prev,
        merchantId: userId,
      }));
    }
  }, []);

  useEffect(() => {
    setTakeAwayData((prev) => ({
      ...prev,
      ...data,
    }));
  }, [data]);

  useEffect(() => {
    availableBusinessCategory?.length &&
      setBusinessCategories(availableBusinessCategory);
  }, [availableBusinessCategory]);

  const handleMerchantSelect = (data) => {
    setTakeAwayData({ ...takeAwayData, merchantId: data._id });
    setBusinessCategories(data.businessCategory);
  };

  const handleSelectProduct = (data) => {
    setTakeAwayData({ ...takeAwayData, items: data });
  };

  const handleCreateInvoice = useMutation({
    mutationKey: ["take-away-invoice"],
    mutationFn: () => createInvoice(role, takeAwayData, navigate),
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

  const handlePrepareInvoice = () => {
    const validationErrors = validateCreateInvoice(takeAwayData, role);

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
    <div className="bg-white mt-5 rounded">
      <div>
        <div className="flex flex-col gap-6">
          {role !== "Merchant" && (
            <SelectMerchant onMerchantSelect={handleMerchantSelect} />
          )}

          <div className="flex items-center relative">
            <label className="md:w-1/3 px-6 hidden md:block invisible"></label>
            <div className="w-full md:w-1/2 flex items-center gap-5 overflow-x-auto">
              {businessCategories?.map((category) => (
                <button
                  key={category._id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(category._id);
                  }}
                  className={`${
                    selectedCategory === category._id
                      ? `bg-gray-400`
                      : `bg-gray-100`
                  }  border border-gray-400  p-2 rounded-sm`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <SelectProduct
            merchantId={takeAwayData.merchantId}
            categoryId={selectedCategory}
            onProductSelect={handleSelectProduct}
          />

          {role !== "Merchant" && (
            <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
              <label
                className="md:w-1/3 md:px-6 text-gray-500 text-[16px]"
                htmlFor="instructionToMerchant"
              >
                Instruction to Merchant
              </label>

              <textarea
                name="instructionToMerchant"
                id="instructionToMerchant"
                placeholder="Instruction to Merchant"
                className="h-20 text-sm ps-3 pt-2 border-2 md:w-1/2 outline-none focus:outline-none resize-y overflow-y-auto"
                value={takeAwayData.instructionToMerchant}
                onChange={(e) =>
                  setTakeAwayData({
                    ...takeAwayData,
                    instructionToMerchant: e.target.value,
                  })
                }
              />
            </div>
          )}

          <button
            onClick={handlePrepareInvoice}
            className="ms-auto me-[6rem] xl:me-[12rem] my-[30px] bg-teal-700 text-white py-2 px-4 rounded-md capitalize"
          >
            {handleCreateInvoice.isPending ? `Creating...` : `Create Invoice`}
          </button>
        </div>
      </div>

      {showBill && <ShowTakeAwayBill data={cartData} />}
    </div>
  );
};

export default TakeAway;
