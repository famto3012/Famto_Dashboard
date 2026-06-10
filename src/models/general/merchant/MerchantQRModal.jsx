import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

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

const MerchantQRModal = ({
  isOpen,
  onClose,
  merchantId,
  businessCategoryId,
  merchantName,
}) => {
  const [activeTab, setActiveTab] = useState("qr");
  const qrRef = useRef(null);

  const orderLink = `https://order.famto.in/merchant/${merchantId}/${businessCategoryId}/products`;

  // ─── Build a branded download card on an offscreen canvas ───────────────────
  const buildDownloadCard = () => {
    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (!qrCanvas) return null;

    const QR_SIZE = 260;       // QR block inside the card
    const PADDING = 40;        // horizontal padding
    const CARD_W = QR_SIZE + PADDING * 2;  // 340
    const HEADER_H = 90;       // teal brand bar
    const NAME_H = 60;         // merchant name row
    const QR_AREA_H = QR_SIZE + PADDING * 2;  // QR + white space around it
    const FOOTER_H = 60;       // URL hint row
    const CARD_H = HEADER_H + NAME_H + QR_AREA_H + FOOTER_H;

    const card = document.createElement("canvas");
    card.width = CARD_W;
    card.height = CARD_H;
    const ctx = card.getContext("2d");

    // ── rounded-rect helper ──────────────────────────────────────────────────
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // ── Card background (white) ──────────────────────────────────────────────
    roundRect(0, 0, CARD_W, CARD_H, 18);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // ── Teal header bar ──────────────────────────────────────────────────────
    ctx.save();
    roundRect(0, 0, CARD_W, HEADER_H, 18);
    ctx.clip();
    // fill only the top portion so bottom corners stay white
    ctx.fillStyle = "#0f766e";
    ctx.fillRect(0, 0, CARD_W, HEADER_H);
    ctx.restore();

    // "Famto" brand text in header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Famto", CARD_W / 2, HEADER_H / 2);

    // ── Merchant name row ────────────────────────────────────────────────────
    const name = merchantName || "Merchant";
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Truncate long names
    const maxNameWidth = CARD_W - PADDING * 2;
    let displayName = name;
    while (
      ctx.measureText(displayName).width > maxNameWidth &&
      displayName.length > 6
    ) {
      displayName = displayName.slice(0, -4) + "...";
    }
    ctx.fillText(displayName, CARD_W / 2, HEADER_H + NAME_H / 2);

    // ── QR area: white block with teal border ────────────────────────────────
    const qrX = PADDING;
    const qrY = HEADER_H + NAME_H + PADDING;

    // Outer teal border
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 3;
    roundRect(qrX - 6, qrY - 6, QR_SIZE + 12, QR_SIZE + 12, 10);
    ctx.stroke();

    // White inner background for QR
    ctx.fillStyle = "#ffffff";
    roundRect(qrX - 4, qrY - 4, QR_SIZE + 8, QR_SIZE + 8, 8);
    ctx.fill();

    // Paste the QR canvas (already rendered at 260×260 via size prop)
    ctx.drawImage(qrCanvas, qrX, qrY, QR_SIZE, QR_SIZE);

    // ── Footer: URL hint ─────────────────────────────────────────────────────
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const footerY = HEADER_H + NAME_H + QR_AREA_H + FOOTER_H / 2;
    // Clip the URL to fit
    let urlText = orderLink;
    while (
      ctx.measureText(urlText).width > CARD_W - PADDING &&
      urlText.length > 20
    ) {
      urlText = urlText.slice(0, -4) + "...";
    }
    ctx.fillText(urlText, CARD_W / 2, footerY);

    // ── Outer card drop-shadow border ────────────────────────────────────────
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1.5;
    roundRect(0, 0, CARD_W, CARD_H, 18);
    ctx.stroke();

    return card;
  };

  // ─── Download ────────────────────────────────────────────────────────────────
  const handleDownloadQR = () => {
    const card = buildDownloadCard();
    if (!card) return;

    const url = card.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${merchantName || "merchant"}-qr.png`;
    a.click();
  };

  // ─── Share QR ────────────────────────────────────────────────────────────────
  const handleShareQR = async () => {
    const card = buildDownloadCard();
    if (!card) return;

    try {
      card.toBlob(async (blob) => {
        const file = new File(
          [blob],
          `${merchantName || "merchant"}-qr.png`,
          { type: "image/png" }
        );

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${merchantName || "Merchant"} QR Code`,
            text: `Scan this QR to order from ${merchantName || "our store"}`,
            files: [file],
          });
        } else {
          handleDownloadQR();
          toaster.create({
            title: "Info",
            description:
              "Sharing not supported on this device. QR downloaded instead.",
            type: "info",
          });
        }
      }, "image/png");
    } catch (err) {
      if (err.name !== "AbortError") {
        toaster.create({
          title: "Error",
          description: "Failed to share QR code.",
          type: "error",
        });
      }
    }
  };

  // ─── Link actions ─────────────────────────────────────────────────────────────
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(orderLink);
      toaster.create({
        title: "Copied!",
        description: "Order link copied to clipboard.",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Error",
        description: "Failed to copy link.",
        type: "error",
      });
    }
  };

  const handleShareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order from ${merchantName || "our store"}`,
          text: `Click to order from ${merchantName || "our store"}`,
          url: orderLink,
        });
      } else {
        await handleCopyLink();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toaster.create({
          title: "Error",
          description: "Failed to share link.",
          type: "error",
        });
      }
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent maxW="420px">
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Order Link & QR Code
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200 mb-5">
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-[500] border-b-2 transition-colors ${
                activeTab === "qr"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <RenderIcon iconName="QrCodeIcon" size={16} loading={6} />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-[500] border-b-2 transition-colors ${
                activeTab === "link"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <RenderIcon iconName="LinkIcon" size={16} loading={6} />
              Link
            </button>
          </div>

          {/* ── QR Tab ──────────────────────────────────────────────────── */}
          {activeTab === "qr" && (
            <div className="flex flex-col items-center gap-5 pb-4">
              <p className="text-sm text-gray-500 text-center">
                Customers can scan this QR code to go directly to your product
                page.
              </p>

              {/* Preview card — mirrors what will be downloaded */}
              <div className="flex flex-col items-center rounded-2xl overflow-hidden shadow-md border border-gray-200 w-[260px]">
                {/* Teal header */}
                <div className="w-full bg-teal-700 py-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl tracking-wide">
                    Famto
                  </span>
                </div>

                {/* Merchant name */}
                <div className="bg-white w-full py-3 flex items-center justify-center border-b border-gray-100">
                  <span className="text-gray-800 font-semibold text-sm truncate px-4 text-center">
                    {merchantName}
                  </span>
                </div>

                {/* QR with teal border */}
                <div className="bg-white w-full flex items-center justify-center py-5">
                  <div
                    ref={qrRef}
                    className="p-2 border-[3px] border-teal-600 rounded-lg"
                  >
                    {/* fgColor must be black (#000000) for scanners to work */}
                    <QRCodeCanvas
                      value={orderLink}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* URL footer */}
                <div className="bg-white w-full py-3 border-t border-gray-100 px-3">
                  <p className="text-[10px] text-gray-400 text-center break-all line-clamp-2">
                    {orderLink}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white py-2 px-4 rounded-md text-sm font-[500] hover:bg-teal-600 transition-colors"
                >
                  <RenderIcon iconName="DownloadIcon2" size={16} loading={6} />
                  Download QR
                </button>
                <button
                  onClick={handleShareQR}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-50 text-teal-700 border border-teal-300 py-2 px-4 rounded-md text-sm font-[500] hover:bg-cyan-100 transition-colors"
                >
                  <RenderIcon iconName="ShareIcon" size={16} loading={6} />
                  Share QR
                </button>
              </div>
            </div>
          )}

          {/* ── Link Tab ─────────────────────────────────────────────────── */}
          {activeTab === "link" && (
            <div className="flex flex-col gap-5 pb-4">
              <p className="text-sm text-gray-500">
                Share this link with customers so they can directly access your
                product page.
              </p>

              {/* Link display box */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="text-teal-600 shrink-0">
                  <RenderIcon iconName="LinkIcon" size={16} loading={6} />
                </span>
                <p className="text-sm text-gray-700 break-all flex-1 select-all">
                  {orderLink}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white py-2 px-4 rounded-md text-sm font-[500] hover:bg-teal-600 transition-colors"
                >
                  <RenderIcon iconName="CopyIcon" size={16} loading={6} />
                  Copy Link
                </button>
                <button
                  onClick={handleShareLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-50 text-teal-700 border border-teal-300 py-2 px-4 rounded-md text-sm font-[500] hover:bg-cyan-100 transition-colors"
                >
                  <RenderIcon iconName="ShareIcon" size={16} loading={6} />
                  Share Link
                </button>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default MerchantQRModal;
