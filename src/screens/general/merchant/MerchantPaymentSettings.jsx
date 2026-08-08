import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WalletIcon } from "@heroicons/react/24/outline";

import { toaster } from "@/components/ui/toaster";
import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import EmptyState from "@/components/whatsapp/common/EmptyState";
import ErrorState from "@/components/whatsapp/common/ErrorState";
import SectionPanel from "@/components/whatsapp/common/SectionPanel";
import StatusBadge from "@/components/whatsapp/common/StatusBadge";

import {
  fetchPaymentConfig,
  updatePaymentConfig,
  testPaymentConfig,
  disablePaymentConfig,
  fetchMerchantWallet,
  requestPayout,
} from "@/hooks/merchant/useMerchantPayment";

import { formatCurrency, getRelativeTime } from "@/utils/whatsapp/formatters";

const MerchantPaymentSettings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState("Platform");
  const [form, setForm] = useState({
    keyId: "",
    keySecret: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
  });

  const configQuery = useQuery({
    queryKey: ["merchant-payment-config"],
    queryFn: () => fetchPaymentConfig(navigate),
  });

  const walletQuery = useQuery({
    queryKey: ["merchant-wallet"],
    queryFn: () => fetchMerchantWallet(navigate),
  });

  const config = configQuery.data;

  // Pre-fill once loaded (don't clobber typing)
  useEffect(() => {
    if (config && !form.keyId && !form.accountName) {
      setMode(config.mode || "Platform");
      setForm({
        keyId: config.keyId || "",
        keySecret: "",
        accountName: config.bankDetails?.accountName || "",
        accountNumber: config.bankDetails?.accountNumber || "",
        ifsc: config.bankDetails?.ifsc || "",
      });
    }
  }, [config, form.keyId, form.accountName]);

  const setValue = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const invalidate = () => {
    queryClient.invalidateQueries(["merchant-payment-config"]);
    queryClient.invalidateQueries(["merchant-wallet"]);
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => updatePaymentConfig(payload, navigate),
    onSuccess: () => {
      invalidate();
      toaster.create({
        title: "Success",
        description: "Payment config saved. Test a payment to validate.",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to save payment config",
        type: "error",
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => testPaymentConfig(navigate),
    onSuccess: (data) => {
      invalidate();
      toaster.create({
        title: "Success",
        description: data?.message || "Razorpay credentials validated",
        type: "success",
      });
    },
    onError: (err) => {
      invalidate();
      toaster.create({
        title: "Error",
        description: err.message || "Validation failed",
        type: "error",
      });
    },
  });

  const disableMutation = useMutation({
    mutationFn: () => disablePaymentConfig(navigate),
    onSuccess: () => {
      invalidate();
      toaster.create({
        title: "Success",
        description: "Switched back to platform Razorpay.",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to disable",
        type: "error",
      });
    },
  });

  const payoutMutation = useMutation({
    mutationFn: () => requestPayout(navigate),
    onSuccess: (data) => {
      invalidate();
      toaster.create({
        title: "Payout requested",
        description:
          data?.data?.message || data?.message || "Payout processed.",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Payout failed",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    if (!form.keyId || !form.keySecret) {
      toaster.create({
        title: "Missing fields",
        description: "Razorpay keyId and keySecret are required.",
        type: "error",
      });
      return;
    }
    if (mode === "Own" && (!form.accountName || !form.accountNumber || !form.ifsc)) {
      toaster.create({
        title: "Missing fields",
        description: "Bank details are required for Own mode.",
        type: "error",
      });
      return;
    }
    saveMutation.mutate({
      keyId: form.keyId,
      keySecret: form.keySecret,
      mode,
      bankDetails:
        mode === "Own"
          ? {
              accountName: form.accountName,
              accountNumber: form.accountNumber,
              ifsc: form.ifsc,
            }
          : undefined,
    });
  };

  if (configQuery.isLoading || walletQuery.isLoading) return <ShowSpinner />;

  const isOwn = mode === "Own" || config?.mode === "Own";

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />
      <div className="mx-8 mt-5">
        <h1 className="text-lg font-bold">Payment Settings</h1>
      </div>

      <div className="mx-8 my-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        {/* Config form */}
        <SectionPanel
          title="Razorpay account"
          description="Accept customer payments through your own Razorpay account, or keep platform Razorpay."
          action={
            config?.mode === "Own" ? (
              <StatusBadge>{config.status}</StatusBadge>
            ) : null
          }
        >
          {/* Mode toggle */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("Platform")}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === "Platform"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">Platform Razorpay</p>
              <p className="mt-1 text-xs text-slate-500">
                Payments go to Famto. Wallet balance + auto-payout to your bank.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("Own")}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === "Own"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">Own Razorpay</p>
              <p className="mt-1 text-xs text-slate-500">
                Customers pay directly to your Razorpay account.
              </p>
            </button>
          </div>

          {mode === "Own" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Razorpay Key ID
                  </span>
                  <input
                    value={form.keyId}
                    onChange={(e) => setValue("keyId", e.target.value)}
                    placeholder="rzp_live_…"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Razorpay Key Secret
                  </span>
                  <input
                    type="password"
                    value={form.keySecret}
                    onChange={(e) => setValue("keySecret", e.target.value)}
                    placeholder="Encrypted, never shown again"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Bank account name
                  </span>
                  <input
                    value={form.accountName}
                    onChange={(e) => setValue("accountName", e.target.value)}
                    placeholder="Business name on account"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Bank account number
                  </span>
                  <input
                    value={form.accountNumber}
                    onChange={(e) => setValue("accountNumber", e.target.value)}
                    placeholder="12-digit account number"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    IFSC code
                  </span>
                  <input
                    value={form.ifsc}
                    onChange={(e) => setValue("ifsc", e.target.value)}
                    placeholder="HDFC0001234"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <p className="text-xs text-slate-500">
                Saving resets status to Active; run a ₹1 test order to validate.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saveMutation.isPending}
                  onClick={handleSave}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Saving…" : "Save keys"}
                </button>
                <button
                  type="button"
                  disabled={testMutation.isPending}
                  onClick={() => testMutation.mutate()}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {testMutation.isPending ? "Testing…" : "Test ₹1 order"}
                </button>
              </div>
            </div>
          )}

          {isOwn && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Disable own Razorpay</p>
                <p className="text-xs text-slate-500">
                  Switch back to platform Razorpay + wallet payouts.
                </p>
              </div>
              <button
                type="button"
                disabled={disableMutation.isPending}
                onClick={() => disableMutation.mutate()}
                className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              >
                Disable
              </button>
            </div>
          )}
        </SectionPanel>

        {/* Wallet */}
        <div className="space-y-5">
          <SectionPanel
            title="Wallet"
            description="Platform-mode payouts for customer payments."
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Balance
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {formatCurrency(walletQuery.data?.balance)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-400">Pending payout</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatCurrency(walletQuery.data?.pendingPayout)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-400">Last payout</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {walletQuery.data?.lastPayoutAt
                      ? getRelativeTime(walletQuery.data.lastPayoutAt)
                      : "—"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={
                  payoutMutation.isPending || !walletQuery.data?.balance
                }
                onClick={() => payoutMutation.mutate()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <WalletIcon className="h-4 w-4" />
                {payoutMutation.isPending
                  ? "Processing…"
                  : "Request payout"}
              </button>
            </div>
          </SectionPanel>

          <SectionPanel title="Recent transactions">
            {walletQuery.data?.transactions?.length ? (
              <ul className="divide-y divide-slate-100">
                {walletQuery.data.transactions.slice(0, 10).map((tx) => (
                  <li key={tx._id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium text-slate-800">
                        {tx.type === "credit" ? "Credit" : "Debit"}
                        {tx.description ? ` · ${tx.description}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {getRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === "credit" ? "text-emerald-600" : "text-slate-800"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "−"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <StatusBadge size="xs">{tx.status}</StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={WalletIcon}
                title="No transactions yet"
                description="Customer payments will appear here."
              />
            )}
          </SectionPanel>
        </div>
      </div>
    </div>
  );
};

export default MerchantPaymentSettings;
