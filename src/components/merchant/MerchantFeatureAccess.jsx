import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchGlobalFeatureConfig,
  fetchMerchantFeatureOverride,
  upsertMerchantFeatureOverride,
} from "@/hooks/admin/useFeatureConfig";

// A feature leaf may be a bare boolean (global) or { enabled } (override).
const bool = (v) =>
  typeof v === "boolean"
    ? v
    : v && typeof v === "object" && typeof v.enabled === "boolean"
      ? v.enabled
      : undefined;

// key → extractor for BOTH the global doc and the override doc.
const EXTRACT = {
  whatsapp: (d) => bool(d?.whatsapp),
  delivery: (d) => bool(d?.delivery),
  selfPaymentOption: (d) => bool(d?.selfPaymentOption),
  cashfree: (d) => bool(d?.gateways?.cashfree),
  phonepe: (d) => bool(d?.gateways?.phonepe),
  razorpay: (d) => bool(d?.gateways?.razorpay),
};

const FEATURE_ROWS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "delivery", label: "Delivery" },
  { key: "selfPaymentOption", label: "Self payment option" },
  { key: "cashfree", label: "Cashfree gateway" },
  { key: "phonepe", label: "PhonePe gateway" },
];

// Per-merchant overrides for the platform feature toggles. Rendered on the
// merchant detail page (admin only). Only fields the admin touches are saved —
// untouched fields keep inheriting the platform default.
const MerchantFeatureAccess = ({ merchantId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [values, setValues] = useState(null); // effective values for display
  const [touched, setTouched] = useState({}); // keys admin has flipped

  const { data: globalConfig } = useQuery({
    queryKey: ["global-feature-config"],
    queryFn: () => fetchGlobalFeatureConfig(navigate),
    staleTime: 30_000,
  });

  const { data: override } = useQuery({
    queryKey: ["merchant-feature-override", merchantId],
    queryFn: () => fetchMerchantFeatureOverride(merchantId, navigate),
    staleTime: 30_000,
  });

  // Effective = override wins, else global, else default-on.
  useEffect(() => {
    if (!globalConfig) return;
    const effective = {};
    for (const key of Object.keys(EXTRACT)) {
      effective[key] =
        EXTRACT[key](override) ?? EXTRACT[key](globalConfig) ?? true;
    }
    setValues((prev) => prev ?? effective);
  }, [globalConfig, override]);

  const saveOverride = useMutation({
    mutationKey: ["upsert-merchant-feature-override", merchantId],
    mutationFn: (payload) =>
      upsertMerchantFeatureOverride(merchantId, payload, navigate),
    onSuccess: () => {
      setTouched({});
      queryClient.invalidateQueries(["merchant-feature-override", merchantId]);
      queryClient.invalidateQueries(["merchant-feature-overrides"]);
      toaster.create({
        title: "Success",
        description: "Merchant feature overrides saved",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to save overrides",
        type: "error",
      });
    },
  });

  const rows = useMemo(() => {
    if (!globalConfig || !values) return [];
    return FEATURE_ROWS.map(({ key, label }) => ({
      key,
      label,
      value: values[key],
      globalDefault: EXTRACT[key](globalConfig) ?? true,
    }));
  }, [globalConfig, values]);

  const toggle = (key, checked) => {
    setValues((prev) => ({ ...prev, [key]: checked }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSave = () => {
    const payload = {};
    for (const key of Object.keys(touched)) {
      if (key === "cashfree" || key === "phonepe" || key === "razorpay") {
        if (!payload.gateways) payload.gateways = {};
        payload.gateways[key] = { enabled: values[key] };
      } else {
        payload[key] = { enabled: values[key] };
      }
    }
    saveOverride.mutate(payload);
  };

  const hasChanges = Object.keys(touched).length > 0;

  if (!values) {
    return (
      <div className="p-6 text-center text-gray-500">
        <ShowSpinner size={18} /> Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-bold">Feature Access</h3>
        <span className="text-xs text-gray-400">
          Overrides the platform-wide defaults for this merchant
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between py-1 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Switch
                colorPalette="teal"
                checked={row.value}
                onCheckedChange={(e) => toggle(row.key, e.checked)}
                disabled={row.key === "razorpay"}
              />
              <span className="text-sm">{row.label}</span>
            </div>
            <span className="text-xs text-gray-400">
              Platform default: {row.globalDefault ? "On" : "Off"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveOverride.isPending}
          className="bg-teal-700 text-white px-6 py-2 rounded-md text-sm font-[500] hover:bg-teal-600 disabled:opacity-50"
        >
          {saveOverride.isPending ? <ShowSpinner size={16} /> : "Save overrides"}
        </button>
      </div>
    </div>
  );
};

export default MerchantFeatureAccess;
