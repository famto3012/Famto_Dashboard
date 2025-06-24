import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import {
  downloadAllMerchantCSV,
  downloadSampleMerchantCSV,
  uploadMerchantCSV,
} from "@/hooks/merchant/useMerchant";

const CSVOperation = ({ isOpen, onClose, filter }) => {
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const closeModal = () => {
    setSelectedCSVFile(null);
    onClose();
  };

  const downloadSampleCSV = useMutation({
    mutationKey: ["download-sample-merchant-csv"],
    mutationFn: () => downloadSampleMerchantCSV(navigate),
  });

  const handleDownloadSampleCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadSampleCSV.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Merchant_Sample.csv");
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

  const downloadMerchantCSV = useMutation({
    mutationKey: ["download-merchant-csv"],
    mutationFn: (filter) => downloadAllMerchantCSV(filter, navigate),
  });

  const handleDownloadMerchantCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadMerchantCSV.mutate(filter, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "All_Merchants.csv");
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

  const uploadMerchantCSVFile = useMutation({
    mutationKey: ["upload-merchant-csv"],
    mutationFn: () => {
      const formData = new FormData();
      formData.append("merchantCSV", selectedCSVFile);

      return uploadMerchantCSV(formData, navigate);
    },
  });

  const handleUploadMerchantCSV = () => {
    const promise = new Promise((resolve, reject) => {
      uploadMerchantCSVFile.mutate(undefined, {
        onSuccess: () => {
          setSelectedCSVFile(null);
          onClose();
          queryClient.invalidateQueries(["all-merchants", filter]);
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
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

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
                    onClick={handleUploadMerchantCSV}
                    className="text-green-500"
                  >
                    <RenderIcon iconName="UploadIcon" size={20} loading={6} />
                  </span>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={handleDownloadMerchantCSV}
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
