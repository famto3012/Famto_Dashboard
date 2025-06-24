import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import {
  downloadAllCustomerCSV,
  downloadSampleCustomerCSV,
  uploadCustomerCSV,
} from "@/hooks/customer/useCustomer";

const CSVOperation = ({ isOpen, onClose, geofence }) => {
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const closeModal = () => {
    setSelectedCSVFile(null);
    onClose();
  };

  const downloadSampleCSV = useMutation({
    mutationKey: ["download-sample-customer-csv"],
    mutationFn: () => downloadSampleCustomerCSV(navigate),
  });

  const handleDownloadSampleCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadSampleCSV.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Customer_Sample.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        },
        onError: (error) => {
          reject(
            new Error(error.message || "Failed to download the CSV file.")
          );
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Downloading...",
        description: "Preparing your CSV file.",
      },
      success: {
        title: "Download Successful",
        description: "CSV file has been downloaded successfully.",
      },
      error: {
        title: "Download Failed",
        description: "Something went wrong while downloading the CSV file.",
      },
    });
  };

  const downloadCustomerCSV = useMutation({
    mutationKey: ["download-customer-csv"],
    mutationFn: (filter) => downloadAllCustomerCSV(filter, navigate),
  });

  const handleDownloadCustomerCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadCustomerCSV.mutate(geofence, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "All_Customer.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        },
        onError: (error) => {
          reject(
            new Error(error.message || "Failed to download the CSV file.")
          );
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Downloading...",
        description: "Preparing your CSV file.",
      },
      success: {
        title: "Download Successful",
        description: "CSV file has been downloaded successfully.",
      },
      error: {
        title: "Download Failed",
        description: "Something went wrong while downloading the CSV file.",
      },
    });
  };

  const uploadCustomerCSVFile = useMutation({
    mutationKey: ["upload-customer-csv"],
    mutationFn: () => {
      const formData = new FormData();
      formData.append("customerCSV", selectedCSVFile);

      return uploadCustomerCSV(formData, navigate);
    },
  });

  const handleUploadCustomerCSV = () => {
    const promise = new Promise((resolve, reject) => {
      uploadCustomerCSVFile.mutate(undefined, {
        onSuccess: () => {
          setSelectedCSVFile(null);
          closeModal();
          queryClient.invalidateQueries(["all-customer"]);
          resolve();
        },
        onError: (error) => {
          reject(new Error(error.message || "Failed to upload the CSV file."));
        },
      });
    });

    toaster.promise(promise, {
      loading: {
        title: "Uploading...",
        description: "Reviewing your CSV file.",
      },
      success: {
        title: "Upload Successful",
        description: "CSV file has been uploaded successfully.",
      },
      error: {
        title: "Upload Failed",
        description: "Something went wrong while uploading the CSV file.",
      },
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={closeModal}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={closeModal} />

        <DialogBody>
          <div className="flex rounded-xl justify-between p-10">
            <div className="flex flex-col">
              <label
                htmlFor="uploadCSV"
                className="flex gap-2 p-3 w-fit bg-cyan-200 px-5 font-[500] rounded-xl border cursor-pointer"
              >
                <RenderIcon iconName="UploadIcon" size={20} loading={6} />
                Upload
              </label>
              <input
                id="uploadCSV"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={(e) => setSelectedCSVFile(e.target.files[0])}
              />
              <p
                onClick={handleDownloadSampleCSV}
                className="text-gray-500 hover:underline mx-2 mt-2 underline-offset-2 cursor-pointer"
              >
                Download Sample CSV
              </p>
              {selectedCSVFile && (
                <div className="flex items-center gap-4 mt-[20px]">
                  <p>{selectedCSVFile?.name}</p>
                  <span
                    onClick={handleUploadCustomerCSV}
                    className="text-green-500"
                  >
                    <RenderIcon iconName="UploadIcon" size={20} loading={6} />
                  </span>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={handleDownloadCustomerCSV}
                className="flex gap-2 p-3 bg-teal-800 rounded-xl px-5 border text-white cursor-pointer"
              >
                <div className="flex items-center gap-[10px]">
                  <RenderIcon iconName="DownloadIcon" size={20} loading={6} />
                  <span>Download CSV</span>
                </div>
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default CSVOperation;
