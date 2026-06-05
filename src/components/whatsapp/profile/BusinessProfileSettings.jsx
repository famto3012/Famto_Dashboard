import { useEffect, useState } from "react";
import {
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  CloudArrowUpIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatusBadge from "../common/StatusBadge";
import { useUpdateWhatsappBusinessProfile, useWhatsappBusinessProfile } from "@/hooks/whatsapp/useWhatsappResources";

const BusinessProfileSettings = () => {
  const profileQuery = useWhatsappBusinessProfile();
  const updateProfile = useUpdateWhatsappBusinessProfile();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (profileQuery.data) setForm(profileQuery.data);
  }, [profileQuery.data]);

  if (profileQuery.isLoading) return <LoadingRows count={5} />;

  if (profileQuery.isError) {
    return <ErrorState message={profileQuery.error?.message} onRetry={profileQuery.refetch} />;
  }

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile.mutate(form);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <SectionPanel title="Business profile" description="Official WhatsApp Cloud API business identity and customer-facing details.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Display name
            </span>
            <input
              value={form.displayName || ""}
              onChange={(event) => setValue("displayName", event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Verified name
            </span>
            <input
              value={form.verifiedName || ""}
              onChange={(event) => setValue("verifiedName", event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              About
            </span>
            <textarea
              value={form.about || ""}
              onChange={(event) => setValue("about", event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Website
            </span>
            <input
              value={form.website || ""}
              onChange={(event) => setValue("website", event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Business vertical
            </span>
            <input
              value={form.vertical || ""}
              onChange={(event) => setValue("vertical", event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Address
            </span>
            <input
              value={form.address || ""}
              onChange={(event) => setValue("address", event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </SectionPanel>

      <div className="space-y-5">
        <SectionPanel title="Cloud API connection">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-emerald-800">
              <CheckBadgeIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Business verified</p>
                <p className="text-sm opacity-75">{form.status}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                <PhoneIcon className="h-4 w-4 text-slate-500" />
                <span>{form.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                <BuildingStorefrontIcon className="h-4 w-4 text-slate-500" />
                <span className="truncate">{form.businessAccountId}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                <LinkIcon className="h-4 w-4 text-slate-500" />
                <span className="truncate">{form.webhookUrl}</span>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Health">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Quality rating</span>
              <StatusBadge tone="emerald">{form.health?.qualityRating}</StatusBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Messaging limit</span>
              <span className="font-semibold text-slate-900">{form.health?.messagingLimit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Certificate</span>
              <StatusBadge>{form.health?.certificateStatus}</StatusBadge>
            </div>
          </div>
        </SectionPanel>
      </div>
    </div>
  );
};

export default BusinessProfileSettings;
