import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";

import { toaster } from "@/components/ui/toaster";
import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchQrConfig,
  updateQrConfig,
} from "@/hooks/merchant/useQrConfig";

const MerchantQrCode = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const qrRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-qr-config"],
    queryFn: () => fetchQrConfig(navigate),
  });

  const effectiveUrl = data?.qrUrl || data?.fallbackUrl || "";

  // Sync the input with the stored custom URL once loaded (don't clobber typing)
  useEffect(() => {
    if (data && urlInput === "") {
      setUrlInput(data.qrUrl || "");
    }
  }, [data, urlInput]);

  const saveMutation = useMutation({
    mutationKey: ["update-qr-config"],
    mutationFn: (url) => updateQrConfig(url, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-qr-config"]);
      toaster.create({
        title: "Success",
        description: "QR target updated",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to update QR target",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(urlInput.trim());
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${data?.merchantName || "merchant"}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(effectiveUrl);
      toaster.create({ title: "Copied", description: "Link copied", type: "success" });
    } catch {
      toaster.create({
        title: "Error",
        description: "Copy failed",
        type: "error",
      });
    }
  };

  if (isLoading) return <ShowSpinner />;

  if (isError) {
    return (
      <div className="bg-gray-100 min-h-full min-w-full">
        <GlobalSearch />
        <div className="p-8 text-center text-red-600">
          Error in fetching QR config.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />
      <div className="mx-8 mt-5">
        <h1 className="text-lg font-bold">QR Code</h1>
      </div>

      <div className="mx-8 rounded-lg mt-5 p-6 bg-white flex flex-col lg:flex-row gap-8">
        {/* QR display */}
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="p-4 border border-teal-600 rounded-lg bg-white">
            <QRCodeCanvas value={effectiveUrl || " "} size={220} level="H" />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-cyan-100 rounded-md px-4 py-2 text-sm font-semibold flex items-center gap-2"
              onClick={handleCopy}
            >
              <RenderIcon iconName="CopyIcon" size={16} loading={6} />
              Copy Link
            </button>
            <button
              className="bg-cyan-100 rounded-md px-4 py-2 text-sm font-semibold flex items-center gap-2"
              onClick={handleDownload}
            >
              <RenderIcon iconName="DownloadIcon2" size={16} loading={6} />
              Download QR
            </button>
          </div>
          <div className="text-xs text-gray-500 break-all max-w-sm text-center">
            {effectiveUrl}
          </div>
        </div>

        {/* URL setting */}
        <div className="flex-1">
          <h2 className="font-semibold mb-1">Ordering page URL</h2>
          <p className="text-sm text-gray-500 mb-3">
            Customers scanning this QR open this URL. Leave blank to use the
            default Famto ordering page.
          </p>
          <input
            type="url"
            className="border rounded p-2 w-full text-sm"
            placeholder="https://my-shop.example.com/order"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            className="mt-3 bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-semibold"
            disabled={saveMutation.isPending}
            onClick={handleSave}
          >
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantQrCode;
