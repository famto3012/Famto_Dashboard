import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import { paymentOptions } from "@/utils/defaultData";

import { createOrder, downloadInvoiceBill } from "@/hooks/order/useOrder";

const ShowBill = ({ data }) => {
  const [formData, setFormData] = useState({
    paymentMode: "",
    cartId: "",
    deliveryMode: "",
  });

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData({
      ...formData,
      cartId: data.cartId,
      deliveryMode: data.deliveryMode,
    });
  }, [data]);

  const downloadBill = useMutation({
    mutationKey: ["download-invoice-bill"],
    mutationFn: () =>
      downloadInvoiceBill(formData?.cartId, formData?.deliveryMode, navigate),
  });

  const handleDownloadBill = () => {
    const promise = new Promise((resolve, reject) => {
      downloadBill.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Invoice.pdf");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        },
        onError: (error) => {
          reject(new Error(error.message || "Failed to download the invoice"));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Downloading...",
        description: "Preparing your invoice",
      },
      success: {
        title: "Download Successful",
        description: "Invoice has been downloaded successfully.",
      },
      error: {
        title: "Download Failed",
        description: "Something went wrong while downloading the invoice",
      },
    });
  };

  const handleCreateOrder = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async () => {
      if (!formData.paymentMode) {
        throw new Error("Please select a payment mode");
      }
      return await createOrder(role, formData, navigate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
      navigate("/order");
      toaster.create({
        title: "Success",
        description: "Order created successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error.message || "Error while creating order",
        type: "error",
      });
    },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0">
        <label className="md:w-1/3 md:px-6" htmlFor="paymentType">
          Payment Types
        </label>

        <Select
          options={paymentOptions}
          value={paymentOptions?.find(
            (option) => option.value === formData.paymentMode
          )}
          onChange={(option) =>
            setFormData({ ...formData, paymentMode: option.value })
          }
          className="md:w-1/2 outline-none focus:outline-none "
          placeholder="Select payment mode"
          menuPlacement="auto"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0 mt-5">
        <h1 className="md:px-6 md:w-1/3 font-semibold">Bill Summary</h1>
        <div className="overflow-auto md:w-1/2">
          <table className="border-2 border-teal-700 w-full text-left ">
            <thead>
              <tr>
                {["Item", "Amount"].map((header, index) => (
                  <th
                    key={index}
                    className="bg-teal-700 text-white p-4 border-[#eee]/50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.items && (
                <>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">ItemTotal</td>
                    <td className="p-4">{data.billDetail.itemTotal}</td>
                  </tr>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">Delivery charges</td>
                    <td className="p-4">
                      {data?.deliveryMode === "Custom Order"
                        ? "Will be updated soon"
                        : data?.billDetail?.discountedDeliveryCharge ||
                          data?.billDetail?.originalDeliveryCharge ||
                          0}
                    </td>
                  </tr>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">Added tip</td>
                    <td className="p-4">{data?.billDetail?.addedTip || 0}</td>
                  </tr>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">Discount</td>
                    <td className="p-4">
                      {data?.billDetail?.discountedAmount || 0}
                    </td>
                  </tr>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">Surge charge</td>
                    <td className="p-4">{data?.billDetail?.surgePrice || 0}</td>
                  </tr>
                  <tr key={data.index} className="text-left align-middle">
                    <td className="p-4">Taxes & Fees</td>
                    <td className="p-4">{data?.billDetail?.taxAmount || 0}</td>
                  </tr>
                  <tr className="bg-teal-700 text-white font-semibold text-[18px]">
                    <td className="p-4">Net Payable Amount</td>
                    <td className="p-4">
                      {data?.deliveryMode === "Custom Order"
                        ? "Will be updated soon"
                        : data?.billDetail?.discountedGrandTotal ||
                          data?.billDetail?.originalGrandTotal ||
                          0}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-16 mx-10">
        <button
          className="bg-cyan-50 py-2 px-4 rounded-md flex items-center gap-2"
          onClick={handleDownloadBill}
        >
          <RenderIcon iconName="DownloadIcon" size={16} loading={6} />
          <span>Bill</span>
        </button>

        <button
          className="bg-teal-700 text-white py-2 px-4 rounded-md"
          onClick={() => handleCreateOrder.mutate()}
        >
          {handleCreateOrder.isPending
            ? `Creating Order....`
            : `Create Order of ₹${
                data?.billDetail?.discountedGrandTotal ||
                data?.billDetail?.originalGrandTotal
              }`}
        </button>
      </div>
    </>
  );
};

export default ShowBill;
