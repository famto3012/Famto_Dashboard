import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DataContext from "@/context/DataContext";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import {
  downloadCombinedProductCSV,
  downloadSampleProductCSV,
  uploadProductCSV,
} from "@/hooks/product/useProduct";
import { Button } from "@/components/ui/button";

const CSVOperation = ({ isOpen, onClose, merchantId }) => {
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);

  const { selectedCategory } = useContext(DataContext);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const closeModal = () => {
    setSelectedCSVFile(null);
    onClose();
  };

  const downloadSampleCSV = useMutation({
    mutationKey: ["download-sample-product-csv"],
    mutationFn: () => downloadSampleProductCSV(navigate),
  });

  const handleDownloadSampleCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadSampleCSV.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Product_Sample.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
          closeModal();
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

  const downloadProductCSV = useMutation({
    mutationKey: ["download-product-csv"],
    mutationFn: () => downloadCombinedProductCSV(merchantId, navigate),
  });

  const handleDownloadProductCSV = () => {
    const promise = new Promise((resolve, reject) => {
      downloadProductCSV.mutate(undefined, {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Combined_Products.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
          closeModal();
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

  const uploadProductCSVFile = useMutation({
    mutationKey: ["upload-product-csv"],
    mutationFn: () => {
      const formData = new FormData();
      formData.append("CSVFile", selectedCSVFile);
      formData.append("merchantId", merchantId);

      return uploadProductCSV(formData, navigate);
    },
  });

  const handleUploadProductCSV = () => {
    const promise = new Promise((resolve, reject) => {
      uploadProductCSVFile.mutate(undefined, {
        onSuccess: () => {
          setSelectedCSVFile(null);
          onClose();
          queryClient.invalidateQueries([
            "all-category",
            "all-product",
            "product-detail",
          ]);
          resolve();
          closeModal();
        },
        onError: (error) => {
          console.log("upload error", error);
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
      error: (err) => ({
        title: "Upload Failed",
        description:
          err.message || "Something went wrong while uploading the CSV file.",
      }),
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader></DialogHeader>
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
                    onClick={handleUploadProductCSV}
                    className="text-green-500"
                  >
                    <RenderIcon iconName="UploadIcon" size={20} loading={6} />
                  </span>
                </div>
              )}
            </div>
            <div>
              <Button
                disabled={!selectedCategory.categoryId}
                onClick={handleDownloadProductCSV}
                className="flex item-center gap-2 bg-teal-700 rounded-xl py-[25px] px-3 border text-white"
              >
                <RenderIcon iconName="DownloadIcon" size={20} loading={6} />
                <span>Download CSV</span>
              </Button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default CSVOperation;
