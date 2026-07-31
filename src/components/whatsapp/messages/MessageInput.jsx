/* eslint-disable react/prop-types */
import {
  BoltIcon,
  DocumentIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useSendWhatsappMessage } from "@/hooks/whatsapp/useSendMessage";
import { getMimeMessageType } from "@/utils/whatsapp/formatters";
import TemplateMessageSender from "../templates/TemplateMessageSender";

const whatsappQuickReplies = [
  "Hi {{name}}! How can I help you today?",
  "Thanks for reaching out, {{name}}. We'll get back to you shortly.",
  "Your order is on its way, {{name}}!",
  "Sorry for the inconvenience, {{name}}. Let us fix that for you.",
  "Please share your order ID so we can assist you faster.",
];

const MessageInput = ({
  conversation,
  templatePanelOpen,
  setTemplatePanelOpen,
}) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const sendMessage = useSendWhatsappMessage(conversation?.id);
  const templatesOpen = templatePanelOpen ?? showTemplates;
  const updateTemplatesOpen = (nextValue) => {
    const resolved =
      typeof nextValue === "function" ? nextValue(templatesOpen) : nextValue;

    if (setTemplatePanelOpen) {
      setTemplatePanelOpen(resolved);
    } else {
      setShowTemplates(resolved);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setContent("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowEmojiPicker(false);
    updateTemplatesOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetFile();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSend = () => {
    if (!conversation || sendMessage.isPending) return;
    if (!content.trim() && !selectedFile) return;

    sendMessage.mutate(
      {
        conversationId: conversation.id,
        to: conversation.waId,
        name: conversation.name,
        content: content.trim(),
        messageType: getMimeMessageType(selectedFile),
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setContent("");
          resetFile();
          textAreaRef.current?.focus();
        },
      }
    );
  };

  return (
    <div className="relative border-t border-slate-200 bg-white p-3 sm:p-4">
      <TemplateMessageSender
        conversation={conversation}
        open={templatesOpen}
        onClose={() => updateTemplatesOpen(false)}
      />

      {selectedFile && (
        <div className="mb-3 flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Selected attachment"
                className="h-full w-full object-cover"
              />
            ) : (
              <DocumentIcon className="h-7 w-7" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={resetFile}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200"
            aria-label="Remove attachment"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition hover:bg-slate-100"
          title="Attach file"
        >
          <PaperClipIcon className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition hover:bg-slate-100"
          title="Emoji"
        >
          <FaceSmileIcon className="h-5 w-5" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-24 left-3 z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <EmojiPicker
              height={380}
              width={320}
              lazyLoadEmojis
              onEmojiClick={(emojiData) =>
                setContent((current) => `${current}${emojiData.emoji}`)
              }
            />
          </div>
        )}

        <div className="min-h-[44px] flex-1 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
          <textarea
            ref={textAreaRef}
            value={content}
            rows={1}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            className="max-h-32 min-h-[28px] w-full resize-none bg-transparent text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            updateTemplatesOpen((current) => !current);
          }}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm transition hover:bg-emerald-50 sm:flex"
          title="Send template"
        >
          <SparklesIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={sendMessage.isPending || (!content.trim() && !selectedFile)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Send message"
        >
          {sendMessage.isPending ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
          )}
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 wa-scrollbar">
        {whatsappQuickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() =>
              setContent(reply.replace("{{name}}", conversation?.name?.split(" ")[0] || "there"))
            }
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <BoltIcon className="h-3.5 w-3.5" />
            {reply.split(".")[0]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => updateTemplatesOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:hidden"
        >
          <SparklesIcon className="h-3.5 w-3.5" />
          Template
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          <PhotoIcon className="h-3.5 w-3.5" />
          Image/PDF
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
