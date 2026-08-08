import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";


import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchGlobalFeatureConfig,
  updateGlobalFeatureConfig,
} from "@/hooks/admin/useFeatureConfig";

const GATEWAY_KEYS = ["razorpay", "cashfree", "phonepe"];
const GATEWAY_LABELS = { razorpay: "Razorpay", cashfree: "Cashfree", phonepe: "PhonePe" };
// Valid names from src/icons/Icons.jsx (no credit-card/smartphone icon exists there).
const GATEWAY_ICONS = { razorpay: "WalletIcon", cashfree: "PricingIcon", phonepe: "AccountIcon" };

const FeatureConfig = () => {
  const navigate = useNavigate();
  const [globalConfig, setGlobalConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: configData, isLoading: configLoading } = useQuery({
    queryKey: ["global-feature-config"],
    queryFn: () => fetchGlobalFeatureConfig(navigate),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (configData) setGlobalConfig(configData);
  }, [configData]);

  const saveGlobalConfig = useMutation({
    mutationKey: ["updateGlobalFeatureConfig"],
    mutationFn: (cfg) => updateGlobalFeatureConfig(cfg, navigate),
    onMutate: () => setSaving(true),
    onSuccess: (data) => {
      setSaving(false);
      if (data) setGlobalConfig(data);
      toaster.create({
        title: "Success",
        description: "Global feature config updated",
        type: "success",
      });
    },
    onError: () => {
      setSaving(false);
      toaster.create({
        title: "Error",
        description: "Failed to update global config",
        type: "error",
      });
    },
  });

  const handleGlobalSwitch = (path, value) => {
    if (!globalConfig) return;
    const newConfig = { ...globalConfig };
    const parts = path.split(".");
    let target = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      target[parts[i]] = { ...target[parts[i]] };
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    saveGlobalConfig.mutate(newConfig);
  };

  const handleGlobalSortOrder = (gateway, value) => {
    if (!globalConfig) return;
    const newConfig = { ...globalConfig };
    newConfig.gateways = { ...globalConfig.gateways };
    newConfig.gateways[gateway] = { ...globalConfig.gateways[gateway], sortOrder: Number(value) };
    saveGlobalConfig.mutate(newConfig);
  };

  if (configLoading) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <ShowSpinner /> Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex justify-between mt-5 mx-5">
        <h1 className="font-bold text-xl sm:text-2xl md:text-2xl">Feature Configuration</h1>
      </div>

      {/* ── Global Gateways ── */}
      <div className="mx-5 mt-6">
        <h2 className="font-semibold text-lg mb-3">Payment Gateways (Global)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GATEWAY_KEYS.map((gw) => {
            const enabled = globalConfig?.gateways?.[gw]?.enabled ?? true;
            const sortOrder = globalConfig?.gateways?.[gw]?.sortOrder ?? 0;
            return (
              <div key={gw} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RenderIcon iconName={GATEWAY_ICONS[gw]} size={24} loading={6} />
                    <span className="font-medium">{GATEWAY_LABELS[gw]}</span>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(v) => handleGlobalSwitch(`gateways.${gw}.enabled`, v)}
                    colorPalette="teal"
                    disabled={gw === "razorpay"} // Razorpay must stay on (platform gateway)
                  />
                </div>
                {gw !== "razorpay" && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => handleGlobalSortOrder(gw, e.target.value)}
                      min={0}
                      className="w-24 h-9 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-teal-300"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Self Payment Option ── */}
      <div className="mx-5 mt-6">
        <h2 className="font-semibold text-lg mb-3">Self Payment Option</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Allow merchants to process payments themselves</p>
              <p className="text-sm text-gray-500 mt-1">
                When disabled, all merchants use platform Razorpay. When enabled, merchants
                in "Own" mode pick their gateway (Razorpay/Cashfree/PhonePe).
              </p>
            </div>
            <Switch
              checked={globalConfig?.selfPaymentOption ?? true}
              onCheckedChange={(v) => handleGlobalSwitch("selfPaymentOption", v)}
              colorPalette="teal"
            />
          </div>
        </div>
      </div>

      {/* ── WhatsApp ── */}
      <div className="mx-5 mt-6">
        <h2 className="font-semibold text-lg mb-3">WhatsApp</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable WhatsApp messaging</p>
              <p className="text-sm text-gray-500 mt-1">
                Controls merchant WhatsApp inbox, templates, campaigns, and platform notifications.
              </p>
            </div>
            <Switch
              checked={globalConfig?.whatsapp?.enabled ?? true}
              onCheckedChange={(v) => handleGlobalSwitch("whatsapp.enabled", v)}
              colorPalette="teal"
            />
          </div>
        </div>
      </div>

      {/* ── Delivery ── */}
      <div className="mx-5 mt-6">
        <h2 className="font-semibold text-lg mb-3">Delivery</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable merchant own-delivery fleet</p>
              <p className="text-sm text-gray-500 mt-1">
                When disabled, merchants cannot enable own-delivery; platform fleet serves all orders.
              </p>
            </div>
            <Switch
              checked={globalConfig?.delivery?.enabled ?? true}
              onCheckedChange={(v) => handleGlobalSwitch("delivery.enabled", v)}
              colorPalette="teal"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default FeatureConfig;