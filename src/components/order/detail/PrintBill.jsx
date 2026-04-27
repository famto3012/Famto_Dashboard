import { useState } from "react";
import RenderIcon from "@/icons/RenderIcon";

const SIZES = [
  { label: "58mm  (Small Thermal)", value: "58mm" },
  { label: "80mm  (Standard Thermal)", value: "80mm" },
  { label: "A5  (Half Page)", value: "A5" },
  { label: "A4  (Full Page)", value: "A4" },
];

const buildItemsRows = (data) => {
  const { deliveryMode, items = [], customerDetail } = data;
  const pickupAddresses = customerDetail?.pickAddress || [];
  const dropAddresses = Array.isArray(customerDetail?.dropAddress)
    ? customerDetail.dropAddress
    : customerDetail?.dropAddress
    ? [customerDetail.dropAddress]
    : [];

  if (deliveryMode === "Home Delivery" || deliveryMode === "Take Away") {
    const rows = [];
    dropAddresses.forEach((drop) => {
      (drop.items || []).forEach((item) => {
        rows.push(
          `<tr>
            <td style="padding:4px 6px">${item.itemName || "-"}</td>
            <td style="padding:4px 6px;text-align:center">${item.variantTypeName || "-"}</td>
            <td style="padding:4px 6px;text-align:center">${item.quantity || "-"}</td>
          </tr>`
        );
      });
    });
    return {
      headers: ["Item", "Variant", "Qty"],
      rows: rows.join(""),
    };
  }

  if (deliveryMode === "Pick and Drop") {
    const rows = [];
    pickupAddresses.forEach((pickup) => {
      (pickup.items || []).forEach((item) => {
        rows.push(
          `<tr>
            <td style="padding:4px 6px">${item.itemName || "-"}</td>
            <td style="padding:4px 6px;text-align:center">${item.weight || "-"}</td>
          </tr>`
        );
      });
    });
    return {
      headers: ["Item", "Weight"],
      rows: rows.join(""),
    };
  }

  if (deliveryMode === "Custom Order") {
    const rows = [];
    [...items, ...pickupAddresses.flatMap((p) => p.items || [])].forEach(
      (item) => {
        rows.push(
          `<tr>
            <td style="padding:4px 6px">${item.itemName || "-"}</td>
            <td style="padding:4px 6px;text-align:center">${item.quantity || "-"}</td>
            <td style="padding:4px 6px;text-align:center">${item.unit || "-"}</td>
          </tr>`
        );
      }
    );
    return {
      headers: ["Item", "Qty", "Unit"],
      rows: rows.join(""),
    };
  }

  return { headers: [], rows: "" };
};

const generateHtml = (data, size) => {
  const { _id, orderTime, paymentMode, paymentStatus, deliveryMode, billDetail, customerDetail, merchantDetail } = data;

  const isNarrow = size === "58mm" || size === "80mm";
  const pageWidth = size === "58mm" ? "54mm" : size === "80mm" ? "76mm" : size === "A5" ? "148mm" : "210mm";
  const fontSize = isNarrow ? "11px" : "13px";
  const headingSize = isNarrow ? "13px" : "16px";

  const { headers, rows } = buildItemsRows(data);

  const thStyle = `background:#0f766e;color:#fff;padding:5px 6px;text-align:left;font-size:${fontSize}`;
  const headerCells = headers.map((h) => `<th style="${thStyle}">${h}</th>`).join("");

  const lineRow = (label, value, bold = false) =>
    `<tr>
      <td style="padding:3px 0;font-size:${fontSize};${bold ? "font-weight:700" : ""}">${label}</td>
      <td style="padding:3px 0;text-align:right;font-size:${fontSize};${bold ? "font-weight:700" : ""}">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Order Bill - ${_id}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: ${fontSize};
      width: ${pageWidth};
      margin: 0 auto;
      padding: ${isNarrow ? "6px" : "16px"};
      color: #111;
    }
    @page {
      size: ${size === "58mm" ? "58mm auto" : size === "80mm" ? "80mm auto" : size};
      margin: ${isNarrow ? "4mm" : "12mm"};
    }
    .center { text-align: center; }
    .divider { border-top: 1px dashed #555; margin: 6px 0; }
    .bold { font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th, td { vertical-align: top; }
    .bill-table td { border-bottom: 1px solid #eee; }
    .total-row td { font-weight: 700; font-size: ${isNarrow ? "12px" : "14px"}; border-top: 2px solid #0f766e; padding-top: 5px; }
    h1 { font-size: ${headingSize}; }
    h2 { font-size: ${isNarrow ? "12px" : "14px"}; margin: 6px 0 3px; }
  </style>
</head>
<body>
  <div class="center">
    <h1>${merchantDetail?.name || "Famto"}</h1>
    <p>Order Receipt</p>
  </div>

  <div class="divider"></div>

  <table>
    <tr><td class="bold">Order ID</td><td style="text-align:right">${_id}</td></tr>
    <tr><td class="bold">Date</td><td style="text-align:right">${orderTime || "-"}</td></tr>
    <tr><td class="bold">Customer</td><td style="text-align:right">${customerDetail?.name || "-"}</td></tr>
    <tr><td class="bold">Phone</td><td style="text-align:right">${customerDetail?.phone || "-"}</td></tr>
    <tr><td class="bold">Mode</td><td style="text-align:right">${deliveryMode || "-"}</td></tr>
    <tr><td class="bold">Payment</td><td style="text-align:right">${paymentMode || "-"} (${paymentStatus || "-"})</td></tr>
  </table>

  <div class="divider"></div>

  ${rows
    ? `<h2>Items</h2>
       <table>
         <thead><tr>${headerCells}</tr></thead>
         <tbody>${rows}</tbody>
       </table>
       <div class="divider"></div>`
    : ""}

  <h2>Bill Summary</h2>
  <table class="bill-table">
    ${lineRow("Item Total", `₹ ${(billDetail?.itemTotal || 0).toFixed(2)}`)}
    ${lineRow("Delivery Charge", `₹ ${(billDetail?.deliveryCharge || 0).toFixed(2)}`)}
    ${lineRow("Tip", `₹ ${(billDetail?.addedTip || 0).toFixed(2)}`)}
    ${lineRow("Discount", `- ₹ ${(billDetail?.discountedAmount || 0).toFixed(2)}`)}
    ${lineRow("Sub Total", `₹ ${(billDetail?.subTotal || 0).toFixed(2)}`)}
    ${lineRow("Taxes & Fees", `₹ ${(billDetail?.taxAmount || 0).toFixed(2)}`)}
    <tr class="total-row">
      <td style="padding:5px 0">Net Payable</td>
      <td style="text-align:right;padding:5px 0">₹ ${(billDetail?.grandTotal || 0).toFixed(2)}</td>
    </tr>
  </table>

  <div class="divider"></div>
  <p class="center" style="font-size:${fontSize};margin-top:6px">Thank you for your order!</p>
</body>
</html>`;
};

const PrintBill = ({ orderDetail }) => {
  const [showModal, setShowModal] = useState(false);

  const handlePrint = (size) => {
    const html = generateHtml(orderDetail, size);
    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md"
      >
        <RenderIcon iconName="PrinterIcon" size={20} loading={6} />
        Print Bill
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[320px]">
            <h2 className="text-[16px] font-semibold mb-4">Select Print Size</h2>

            <div className="flex flex-col gap-3">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handlePrint(s.value)}
                  className="w-full border border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors py-2 px-4 rounded-md text-sm font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintBill;
