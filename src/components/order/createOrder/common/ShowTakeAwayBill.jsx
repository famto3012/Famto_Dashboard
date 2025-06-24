import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/AuthContext";

import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import { createOrder, downloadInvoiceBill } from "@/hooks/order/useOrder";

const ShowTakeAwayBill = ({ data }) => {
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
      paymentMode: "Online-payment",
      cartId: data.cartId,
      deliveryMode: data.deliveryMode,
    });
  }, [data]);

  const downloadBill = useMutation({
    mutationKey: ["download-take-away-invoice-bill"],
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
    mutationKey: ["create-takeaway-order"],
    mutationFn: () => createOrder(role, formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-orders"]);
      navigate("/order");
      toaster.create({
        title: "Success",
        description: "Order created successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while creating order",
        type: "error",
      });
    },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row my-5 gap-[20px] md:gap-0">
        <h1 className="md:px-6 md:w-1/3 font-semibold">Payment mode</h1>

        <div className=" md:w-1/2">
          <p className="border-2 p-3 rounded-md text-[16px] font-[500]">
            Online Payment
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-5 gap-[20px] md:gap-0">
        <h1 className="md:px-6 md:w-1/3 font-semibold">Bill Summary</h1>

        <div className="overflow-auto md:w-1/2">
          <table className="border-2 border-teal-700 w-full text-left ">
            <thead>
              <tr>
                {["Item", " Quantity", "Amount"].map((header, index) => (
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
              {data?.items?.map((data) => (
                <tr key={data.index} className="text-left align-middle">
                  <td className="p-4">{data.itemName}</td>
                  <td className="p-4">{data.quantity}</td>
                  <td className="p-4">{data.price}</td>
                </tr>
              ))}
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
          {handleCreateOrder.isPending ? `Creating...` : `Create Order`}
        </button>
      </div>
    </>
  );
};

export default ShowTakeAwayBill;
