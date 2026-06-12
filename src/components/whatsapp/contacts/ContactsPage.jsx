import { useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatusBadge from "../common/StatusBadge";
import {
  useImportWhatsappContactsCsv,
  useSyncFromFamtoCustomers,
  useWhatsappContactTags,
  useWhatsappContacts,
} from "@/hooks/whatsapp/useWhatsappResources";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import { getRelativeTime } from "@/utils/whatsapp/formatters";
import { useNavigate } from "react-router-dom";

// ── CSV Import Panel ──────────────────────────────────────
const CsvImportPanel = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const importMutation = useImportWhatsappContactsCsv();

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) {
      setFile(picked);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith(".csv")) {
      setFile(dropped);
      setResult(null);
    }
  };

  const handleImport = () => {
    if (!file) return;
    importMutation.mutate(file, {
      onSuccess: (data) => {
        setResult(data);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onSuccess?.();
      },
    });
  };

  const handleDownloadSample = async () => {
    try {
      const res = await whatsappApi.downloadSampleCsv(navigate);
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "whatsapp_contacts_sample.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Import from CSV</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Upload a CSV file to bulk-add or update contacts
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Format info */}
      <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Required columns:</p>
        <p className="mt-1">
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs font-mono">phone</code>{" "}
          — digits only, with country code (e.g. <code className="rounded bg-slate-200 px-1 py-0.5 text-xs font-mono">919876543210</code>)
        </p>
        <p className="mt-2 font-semibold text-slate-800">Optional columns:</p>
        <p className="mt-1 text-xs leading-5">
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">name</code>{" · "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">email</code>{" · "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">tags</code>{" (semicolon-separated, e.g. vip;new) · "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">notes</code>
          {" · any extra column becomes a custom field"}
        </p>
        <button
          type="button"
          onClick={handleDownloadSample}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
          Download sample CSV
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 transition hover:border-emerald-300 hover:bg-emerald-50"
      >
        <ArrowUpTrayIcon className="mb-3 h-8 w-8 text-slate-400" />
        {file ? (
          <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-700">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-slate-400">.csv files only</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4">
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Import complete
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                Created: <b>{result.created}</b> · Updated: <b>{result.updated}</b> · Skipped: <b>{result.skipped}</b>
              </p>
              {result.errors?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-red-600">
                    Errors (first {result.errors.length}):
                  </p>
                  <ul className="mt-1 space-y-1">
                    {result.errors.map((e, i) => (
                      <li key={i} className="text-xs text-red-500">
                        Row {i + 1}: {e.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {importMutation.isError && (
        <div className="mt-4 rounded-xl bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {importMutation.error?.response?.data?.message ||
              importMutation.error?.message ||
              "Import failed. Please check your CSV format."}
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={!file || importMutation.isPending}
        onClick={handleImport}
        className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {importMutation.isPending
          ? "Importing..."
          : file
          ? `Import "${file.name}"`
          : "Select a CSV file first"}
      </button>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [50, 100, 200];

const ContactsPage = () => {
  const [filters, setFilters] = useState({ search: "", tag: "all", page: 1, limit: 50 });
  const [showImport, setShowImport] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const tagsQuery = useWhatsappContactTags();
  const tags = tagsQuery.data ?? [];
  const contactsQuery = useWhatsappContacts(filters);
  const contacts = contactsQuery.data?.data ?? contactsQuery.data ?? [];
  const pagination = contactsQuery.data?.pagination ?? { page: 1, limit: 50, total: 0, pages: 1 };
  const syncFamto = useSyncFromFamtoCustomers();

  const handleSyncFamto = () => {
    setSyncResult(null);
    syncFamto.mutate(undefined, {
      onSuccess: (data) => {
        setSyncResult(data);
        contactsQuery.refetch();
      },
    });
  };

  return (
    <div className="space-y-5">
      {showImport && (
        <CsvImportPanel
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            contactsQuery.refetch();
          }}
        />
      )}

      <SectionPanel
        title="WhatsApp contacts"
        description="Synced customers, opt-in status, order value, and segmentation tags."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSyncFamto}
              disabled={syncFamto.isPending}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
            >
              <UsersIcon className="h-4 w-4" />
              {syncFamto.isPending ? "Syncing..." : "Sync Famto Customers"}
            </button>
            <button
              type="button"
              onClick={() => setShowImport((v) => !v)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Import CSV
            </button>
            <button
              type="button"
              onClick={() => contactsQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Sync WA
            </button>
          </div>
        }
      >
        {syncResult && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-sky-50 p-4 text-sm text-sky-800">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
            <span>
              Famto customers synced — Created: <b>{syncResult.created}</b> · Updated: <b>{syncResult.updated}</b> · Skipped: <b>{syncResult.skipped}</b>
            </span>
          </div>
        )}

        {syncFamto.isError && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {syncFamto.error?.response?.data?.message || "Sync failed. Please try again."}
          </div>
        )}

        <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((c) => ({ ...c, search: e.target.value, page: 1 }))
              }
              placeholder="Search name, phone, email"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <select
            value={filters.tag}
            onChange={(e) =>
              setFilters((c) => ({ ...c, tag: e.target.value, page: 1 }))
            }
            className="h-11 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>

        {contactsQuery.isLoading ? (
          <LoadingRows count={6} />
        ) : contactsQuery.isError ? (
          <ErrorState
            message={contactsQuery.error?.message}
            onRetry={contactsQuery.refetch}
          />
        ) : contacts.length ? (
          <>
            <div className="grid gap-3 xl:grid-cols-2">
              {contacts.map((contact) => (
                <article
                  key={contact._id ?? contact.waId}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={contact.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-950">
                            {contact.name || contact.waId}
                          </h3>
                          <p className="truncate text-sm text-slate-500">
                            {contact.phone || `+${contact.waId}`}
                            {contact.email ? ` · ${contact.email}` : ""}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400">
                          {getRelativeTime(contact.createdAt)}
                        </p>
                      </div>

                      {contact.notes && (
                        <p className="mt-2 text-sm text-slate-500 line-clamp-1">
                          {contact.notes}
                        </p>
                      )}

                      {contact.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {contact.tags.map((tag) => (
                            <StatusBadge key={tag} size="xs">
                              {tag.replace(/-/g, " ")}
                            </StatusBadge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  <b className="text-slate-700">{pagination.total}</b> contacts
                </span>
                <span className="text-slate-300">·</span>
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters((c) => ({ ...c, limit: parseInt(e.target.value), page: 1 }))
                  }
                  className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none focus:border-emerald-300"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>{size} / page</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters((c) => ({ ...c, page: c.page - 1 }))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setFilters((c) => ({ ...c, page: pageNum }))}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                        pageNum === pagination.page
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setFilters((c) => ({ ...c, page: c.page + 1 }))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={UserGroupIcon}
            title="No contacts yet"
            description='Click "Sync Famto Customers" to import your existing app customers, or use "Import CSV" to upload a contact list.'
          />
        )}
      </SectionPanel>
    </div>
  );
};

export default ContactsPage;
