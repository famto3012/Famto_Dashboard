import { useState } from "react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatusBadge from "../common/StatusBadge";
import { useSyncWhatsappTemplates, useWhatsappTemplates } from "@/hooks/whatsapp/useWhatsappResources";
import { buildTemplatePreview, getRelativeTime } from "@/utils/whatsapp/formatters";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const TemplatesPage = () => {
  const [search, setSearch] = useState("");
  const templatesQuery = useWhatsappTemplates({ search });
  const syncTemplates = useSyncWhatsappTemplates();
  const templates = templatesQuery.data ?? [];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <SectionPanel
        title="WhatsApp templates"
        description="Manage approved template messages for campaigns and session recovery."
        action={
          <button
            type="button"
            onClick={() => syncTemplates.mutate()}
            disabled={syncTemplates.isPending}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${syncTemplates.isPending ? "animate-spin" : ""}`} />
            Sync Meta
          </button>

        }
        create={
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://business.facebook.com/latest/whatsapp_manager/message_templates/?business_id=2147326985809412&tab=message-templates&filters=%7B%22date_range%22%3A7%2C%22language%22%3A[]%2C%22quality%22%3A[]%2C%22search_text%22%3A%22%22%2C%22status%22%3A[%22APPROVED%22%2C%22IN_APPEAL%22%2C%22PAUSED%22%2C%22PENDING%22%2C%22REJECTED%22]%2C%22tag%22%3A[]%7D&nav_ref=whatsapp_manager&asset_id=1555604799688174",
                "_blank"
              )
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <MdOutlineAddCircleOutline className="h-4 w-4" />
            Create Template
          </button>
        }
      >
        <label className="relative mb-5 block">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        {templatesQuery.isLoading ? (
          <LoadingRows count={5} />
        ) : templatesQuery.isError ? (
          <ErrorState message={templatesQuery.error?.message} onRetry={templatesQuery.refetch} />
        ) : templates.length ? (
          <div className="grid gap-3">
            {templates.map((template) => (
              <article
                key={template.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">{template.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {template.language} · synced {getRelativeTime(template.lastSyncedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge>{template.status}</StatusBadge>
                    <StatusBadge tone="sky">{template.category}</StatusBadge>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {template.header}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {template.body}
                  </p>
                  {template.footer && (
                    <p className="mt-3 text-xs text-slate-400">{template.footer}</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {template.buttons?.map((button) => (
                    <span
                      key={button}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      {button}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState icon={DocumentTextIcon} title="No templates found" />
        )}
      </SectionPanel>

      <SectionPanel
        title="Template preview"
        description="How variables render before sending."
      >
        {templates.slice(0, 1).map((template) => (
          <div key={template.id} className="space-y-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-100">
                <SparklesIcon className="h-4 w-4" />
                {template.name}
              </div>
              <p className="text-sm leading-6">
                {buildTemplatePreview(template, {
                  0: "Priya",
                  1: "ORD-9182",
                  2: "out for delivery",
                  3: "famto.in/track",
                })}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
                Meta readiness
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Phone number ID linked for sending.</li>
                <li>Webhook delivery/read events expected.</li>
                <li>Variables can be mapped from customer and order fields.</li>
              </ul>
            </div>
          </div>
        ))}
      </SectionPanel>
    </div>
  );
};

export default TemplatesPage;
