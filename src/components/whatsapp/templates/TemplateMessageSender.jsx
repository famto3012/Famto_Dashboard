/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSendWhatsappTemplate } from "@/hooks/whatsapp/useSendMessage";
import { useWhatsappTemplates } from "@/hooks/whatsapp/useWhatsappResources";
import { buildTemplatePreview } from "@/utils/whatsapp/formatters";
import StatusBadge from "../common/StatusBadge";
import LoadingRows from "../common/LoadingRows";

const TemplateMessageSender = ({ conversation, open, onClose }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [variables, setVariables] = useState({});
  const templatesQuery = useWhatsappTemplates({ status: "APPROVED" });
  const sendTemplate = useSendWhatsappTemplate(conversation?.id);

  const templates = templatesQuery.data ?? [];
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) || templates[0];

  const previewText = useMemo(
    () => buildTemplatePreview(selectedTemplate, variables),
    [selectedTemplate, variables]
  );

  if (!open) return null;

  const handleSend = () => {
    if (!selectedTemplate || !conversation) return;

    sendTemplate.mutate(
      {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        to: conversation.waId,
        variables,
        previewText,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div className="absolute inset-x-3 bottom-24 z-30 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:left-auto sm:w-[420px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Send template</h3>
          <p className="mt-1 text-xs text-slate-500">
            Use approved WhatsApp templates outside the 24-hour session window.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {templatesQuery.isLoading ? (
        <div className="mt-4">
          <LoadingRows count={3} compact />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <select
            value={selectedTemplate?.id || ""}
            onChange={(event) => {
              setSelectedTemplateId(event.target.value);
              setVariables({});
            }}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          <div className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950 ring-1 ring-emerald-100">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge size="xs">{selectedTemplate?.category}</StatusBadge>
              <StatusBadge size="xs">{selectedTemplate?.status}</StatusBadge>
            </div>
            {previewText}
          </div>

          {selectedTemplate?.variables?.length > 0 && (
            <div className="grid gap-2">
              {selectedTemplate.variables.map((variable, index) => (
                <input
                  key={variable}
                  value={variables[index] || ""}
                  onChange={(event) =>
                    setVariables((current) => ({
                      ...current,
                      [index]: event.target.value,
                    }))
                  }
                  placeholder={variable}
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={sendTemplate.isPending || !selectedTemplate}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendTemplate.isPending ? "Sending..." : "Send template message"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateMessageSender;
