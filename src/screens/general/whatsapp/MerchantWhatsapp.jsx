import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MegaphoneIcon,
  PaperAirplaneIcon,
  UsersIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import { toaster } from "@/components/ui/toaster";
import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import EmptyState from "@/components/whatsapp/common/EmptyState";
import ErrorState from "@/components/whatsapp/common/ErrorState";
import LoadingRows from "@/components/whatsapp/common/LoadingRows";
import SectionPanel from "@/components/whatsapp/common/SectionPanel";
import StatusBadge from "@/components/whatsapp/common/StatusBadge";

import {
  fetchMerchantConnection,
  saveMerchantConnection,
  testMerchantConnection,
} from "@/hooks/merchant/useWhatsappConnection";
import {
  fetchMerchantCampaigns,
  createMerchantCampaign,
  sendMerchantCampaign,
  fetchMerchantTemplates,
  fetchMerchantContacts,
} from "@/hooks/merchant/useMerchantCampaigns";

import { formatCompactNumber, getRelativeTime } from "@/utils/whatsapp/formatters";

const TABS = [
  { id: "connection", label: "Connection", Icon: PhoneIcon },
  { id: "campaigns", label: "Campaigns", Icon: MegaphoneIcon },
];

const MerchantWhatsapp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("connection");

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />
      <div className="mx-8 mt-5">
        <h1 className="text-lg font-bold">WhatsApp</h1>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto px-8 pb-1 wa-scrollbar">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mx-8 my-6">
        {activeTab === "connection" ? (
          <ConnectionTab />
        ) : (
          <CampaignsTab />
        )}
      </div>
    </div>
  );
};

// ─── Connection tab ────────────────────────────────────────────

const ConnectionTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    phoneNumberId: "",
    wabaId: "",
    accessToken: "",
    displayName: "",
  });

  const { data: connection, isLoading, isError } = useQuery({
    queryKey: ["merchant-whatsapp-connection"],
    queryFn: () => fetchMerchantConnection(navigate),
  });

  const isActive = connection?.status === "Active";
  const showForm = !isActive || editing;

  const setValue = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Pre-fill once loaded (don't clobber typing)
  useEffect(() => {
    if (connection && form.phoneNumber === "" && form.phoneNumberId === "") {
      setForm({
        phoneNumber: connection.phoneNumber || "",
        phoneNumberId: connection.phoneNumberId || "",
        wabaId: connection.wabaId || connection.businessAccountId || "",
        accessToken: "",
        displayName: connection.displayName || "",
      });
    }
  }, [connection, form.phoneNumber, form.phoneNumberId]);

  const saveMutation = useMutation({
    mutationFn: (payload) => saveMerchantConnection(payload, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-whatsapp-connection"]);
      setEditing(false);
      toaster.create({
        title: "Success",
        description: "Connection saved. Test the credentials to activate.",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to save connection",
        type: "error",
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => testMerchantConnection(navigate),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["merchant-whatsapp-connection"]);
      toaster.create({
        title: "Success",
        description: data?.message || "WhatsApp number verified and active!",
        type: "success",
      });
    },
    onError: (err) => {
      queryClient.invalidateQueries(["merchant-whatsapp-connection"]);
      toaster.create({
        title: "Error",
        description: err.message || "Connection test failed",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    if (!form.phoneNumber || !form.phoneNumberId) {
      toaster.create({
        title: "Missing fields",
        description: "Phone number and phoneNumberId are required.",
        type: "error",
      });
      return;
    }
    saveMutation.mutate({
      phoneNumber: form.phoneNumber,
      phoneNumberId: form.phoneNumberId,
      wabaId: form.wabaId,
      displayName: form.displayName,
      token: form.accessToken,
      mode: "OwnWABA",
    });
  };

  if (isLoading) return <ShowSpinner />;

  if (isError) {
    return (
      <SectionPanel title="Connection" description="Your WhatsApp Business number.">
        <ErrorState message="Failed to load connection" onRetry={() => queryClient.refetchQueries(["merchant-whatsapp-connection"])} />
      </SectionPanel>
    );
  }

  return (
    <SectionPanel
      title="WhatsApp connection"
      description="Connect your own WhatsApp Business number so messages are sent from your brand."
      action={
        isActive && !editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Edit credentials
          </button>
        ) : null
      }
    >
      {/* Read-only status when active */}
      {isActive && !showForm && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusField label="Status">
            <StatusBadge>{connection.status}</StatusBadge>
          </StatusField>
          <StatusField label="Phone number">{connection.phoneNumber}</StatusField>
          <StatusField label="Display name">{connection.displayName || "—"}</StatusField>
          <StatusField label="Verified">
            {connection.verifiedAt
              ? new Date(connection.verifiedAt).toLocaleDateString("en-IN")
              : "—"}
          </StatusField>
        </div>
      )}

      {showForm && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Business phone number
              </span>
              <input
                value={form.phoneNumber}
                onChange={(e) => setValue("phoneNumber", e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Display name
              </span>
              <input
                value={form.displayName}
                onChange={(e) => setValue("displayName", e.target.value)}
                placeholder="My Business"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Meta phoneNumberId
              </span>
              <input
                value={form.phoneNumberId}
                onChange={(e) => setValue("phoneNumberId", e.target.value)}
                placeholder="From WhatsApp Business settings"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                WABA ID (business account)
              </span>
              <input
                value={form.wabaId}
                onChange={(e) => setValue("wabaId", e.target.value)}
                placeholder="For template management"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Meta access token
              </span>
              <input
                type="password"
                value={form.accessToken}
                onChange={(e) => setValue("accessToken", e.target.value)}
                placeholder="Paste a system user token with WhatsApp access"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Credentials are encrypted and never shown again. Saving resets the
            connection to Pending until you test them.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saveMutation.isPending}
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving…" : "Save credentials"}
            </button>
            {connection && (
              <button
                type="button"
                disabled={testMutation.isPending}
                onClick={() => testMutation.mutate()}
                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                {testMutation.isPending ? "Testing…" : "Test & activate"}
              </button>
            )}
          </div>
        </div>
      )}
    </SectionPanel>
  );
};

const StatusField = ({ label, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1.5 text-sm font-semibold text-slate-800">{children}</p>
  </div>
);

// ─── Campaigns tab ─────────────────────────────────────────────

const CampaignsTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    name: "",
    templateId: "",
    audience: "all_contacts",
    recipients: [],
  });
  const [contactSearch, setContactSearch] = useState("");
  const [createError, setCreateError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const campaignsQuery = useQuery({
    queryKey: ["merchant-campaigns", page],
    queryFn: () => fetchMerchantCampaigns({ page, limit: 20 }, navigate),
    keepPreviousData: true,
  });

  const templatesQuery = useQuery({
    queryKey: ["merchant-whatsapp-templates"],
    queryFn: () => fetchMerchantTemplates(navigate),
    staleTime: 5 * 60 * 1000,
  });

  const contactsQuery = useQuery({
    queryKey: ["merchant-whatsapp-contacts", contactSearch],
    queryFn: () =>
      fetchMerchantContacts({ search: contactSearch, page: 1, limit: 100 }, navigate),
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createMerchantCampaign(payload, navigate),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["merchant-campaigns"]);
      setForm({ name: "", templateId: "", audience: "all_contacts", recipients: [] });
      setCreateError("");
      setSuccessMsg(data?.message || "Campaign created. Send it when ready.");
      setTimeout(() => setSuccessMsg(""), 5000);
    },
    onError: (err) => {
      setCreateError(err.message || "Failed to create campaign");
    },
  });

  const sendMutation = useMutation({
    mutationFn: (campaignId) => sendMerchantCampaign(campaignId, navigate),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["merchant-campaigns"]);
      toaster.create({
        title: "Sent",
        description: data?.message || "Campaign is sending.",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to send campaign",
        type: "error",
      });
    },
  });

  const { items: campaigns = [], nextPage, total } = campaignsQuery.data || {};
  const contacts = contactsQuery.data?.items || [];
  const contactTotal = contactsQuery.data?.total || 0;
  const audienceCount = useMemo(
    () => (form.audience === "all_contacts" ? contactTotal : form.recipients.length),
    [form.audience, form.recipients, contactTotal]
  );

  const setValue = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleRecipient = (waId) => {
    const selected = form.recipients.includes(waId)
      ? form.recipients.filter((r) => r !== waId)
      : [...form.recipients, waId];
    setValue("recipients", selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreateError("");
    if (!form.name || !form.templateId) return;
    if (audienceCount === 0) {
      setCreateError("No contacts selected. Add contacts first.");
      return;
    }
    createMutation.mutate({
      name: form.name,
      templateId: form.templateId,
      audience: form.audience,
      recipients: form.audience === "all_contacts" ? [] : form.recipients,
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
      {/* Campaign list */}
      <SectionPanel
        title="Broadcast campaigns"
        description="Send template messages to your WhatsApp customers."
        action={<span className="text-xs text-slate-400">{total ?? 0} total</span>}
      >
        {campaignsQuery.isLoading ? (
          <LoadingRows count={5} />
        ) : campaignsQuery.isError ? (
          <ErrorState message={campaignsQuery.error?.message} onRetry={campaignsQuery.refetch} />
        ) : campaigns.length ? (
          <>
            <div className="overflow-x-auto wa-scrollbar">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 font-semibold">Campaign</th>
                    <th className="pb-3 font-semibold">Audience</th>
                    <th className="pb-3 font-semibold">Funnel</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id} className="align-top">
                      <td className="py-4">
                        <p className="font-semibold text-slate-950">{campaign.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {campaign.templateName} · {getRelativeTime(campaign.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 text-slate-600">
                        {campaign.audience}
                        <p className="mt-1 text-xs text-slate-400">
                          {formatCompactNumber(campaign.recipients?.length || 0)} recipients
                        </p>
                      </td>
                      <td className="py-4">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <span>{formatCompactNumber(campaign.stats?.sent || 0)} sent</span>
                          <span>{formatCompactNumber(campaign.stats?.delivered || 0)} delivered</span>
                          <span>{formatCompactNumber(campaign.stats?.read || 0)} read</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <StatusBadge>{campaign.status}</StatusBadge>
                      </td>
                      <td className="py-4">
                        {campaign.status === "draft" && (
                          <button
                            type="button"
                            disabled={sendMutation.isPending}
                            onClick={() => sendMutation.mutate(campaign._id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            <PaperAirplaneIcon className="h-3.5 w-3.5" />
                            Send now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {nextPage && (
              <button
                type="button"
                onClick={() => setPage(page + 1)}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Load more
              </button>
            )}
          </>
        ) : (
          <EmptyState icon={MegaphoneIcon} title="No campaigns yet" />
        )}
      </SectionPanel>

      {/* Create form */}
      <SectionPanel
        title="Create broadcast"
        description="Compose a template campaign for your customers."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Campaign name
            </span>
            <input
              value={form.name}
              onChange={(e) => setValue("name", e.target.value)}
              placeholder="Weekend offer"
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Template
            </span>
            <select
              value={form.templateId}
              onChange={(e) => setValue("templateId", e.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Choose template</option>
              {(templatesQuery.data || []).map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Audience
            </span>
            <select
              value={form.audience}
              onChange={(e) => setValue("audience", e.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all_contacts">All contacts</option>
              <option value="Custom">Custom selection</option>
            </select>
          </label>

          {form.audience === "Custom" && (
            <div className="space-y-2">
              <input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search contacts…"
                className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
              <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-100 wa-scrollbar">
                {contactsQuery.isLoading ? (
                  <p className="p-3 text-xs text-slate-400">Loading contacts…</p>
                ) : contacts.length ? (
                  contacts.map((contact) => {
                    const checked = form.recipients.includes(contact.waId);
                    return (
                      <label
                        key={contact.waId}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-3 py-2 text-sm hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRecipient(contact.waId)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-medium text-slate-800">
                          {contact.name || contact.waId}
                        </span>
                        <span className="ml-auto text-xs text-slate-400">
                          +{contact.waId}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <p className="p-3 text-xs text-slate-400">No contacts found.</p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">
            {audienceCount === 0 ? (
              <span className="font-semibold text-red-500">
                ⚠ No contacts for this audience
              </span>
            ) : (
              <span className="font-semibold text-emerald-600">
                ✓ {formatCompactNumber(audienceCount)} contacts will receive this
              </span>
            )}
          </p>

          {successMsg && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              ✓ {successMsg}
            </p>
          )}
          {createError && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {createError}
            </p>
          )}

          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              !form.name ||
              !form.templateId ||
              audienceCount === 0
            }
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending
              ? "Creating…"
              : `Create campaign · ${audienceCount ?? 0} contacts`}
          </button>
        </form>
      </SectionPanel>
    </div>
  );
};

export default MerchantWhatsapp;
