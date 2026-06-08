export const WHATSAPP_QUERY_KEYS = {
  overview: ["whatsapp", "overview"],
  conversations: (filters = {}) => ["whatsapp", "conversations", filters],
  messages: (conversationId) => ["whatsapp", "messages", conversationId],
  contacts: (filters = {}) => ["whatsapp", "contacts", filters],
  campaigns: ["whatsapp", "campaigns"],
  templates: (filters = {}) => ["whatsapp", "templates", filters],
  analytics: (range = "7d") => ["whatsapp", "analytics", range],
  wallet: ["whatsapp", "wallet"],
  profile: ["whatsapp", "business-profile"],
};

export const formatCurrency = (amount = 0, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

export const formatMessageTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const formatDateLabel = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(date);
};

export const getRelativeTime = (value) => {
  if (!value) return "";

  const diff = new Date(value).getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const units = [
    ["day", 24 * 60 * 60 * 1000],
    ["hour", 60 * 60 * 1000],
    ["minute", 60 * 1000],
  ];

  for (const [unit, milliseconds] of units) {
    if (absDiff >= milliseconds) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.round(diff / milliseconds),
        unit
      );
    }
  }

  return "just now";
};

export const formatPhone = (waId = "") => {
  const digits = String(waId).replace(/\D/g, "");
  if (digits.length <= 10) return `+91 ${digits}`;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
};

export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "WA";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const getMimeMessageType = (file) => {
  if (!file) return "text";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf" || file.type.includes("document")) {
    return "document";
  }

  return "document";
};

export const groupMessagesByDate = (messages = []) =>
  messages.reduce((groups, message) => {
    const key = formatDateLabel(message.createdAt || message.timestamp);
    if (!groups[key]) groups[key] = [];
    groups[key].push(message);
    return groups;
  }, {});

export const flattenInfiniteData = (data) =>
  data?.pages?.flatMap((page) => page?.items ?? page ?? []) ?? [];

export const buildTemplatePreview = (template, variables = {}) => {
  if (!template?.body) return "";

  return template.body.replace(/\{\{(\d+)\}\}/g, (_, position) => {
    const key = Number(position) - 1;
    return variables[key] || template.variables?.[key] || `{{${position}}}`;
  });
};

export const normalizeLegacyMessage = (message = {}) => ({
  id: message.id || message._id || `${message.waId || "message"}-${message.timestamp}`,
  conversationId: message.conversationId,
  direction:
    message.direction ||
    (message.received || message.fromCustomer ? "inbound" : "outbound"),
  type: message.type || message.messageType || "text",
  content: message.content || message.messageBody || "",
  createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
  status: message.status || (message.received ? "read" : "sent"),
  media: message.media || message.image || message.audio || message.document || null,
  template: message.template || null,
  replyTo: message.replyTo || null,
});

export const normalizeLegacyConversation = (conversation = {}) => ({
  id: conversation.id || conversation._id || conversation.waId,
  waId: conversation.waId,
  name: conversation.name || formatPhone(conversation.waId),
  phone: conversation.phone || formatPhone(conversation.waId),
  avatar: conversation.avatar || "",
  status: conversation.status || "open",
  priority: conversation.priority || "normal",
  unreadCount: Number(conversation.unreadCount || 0),
  isOnline: Boolean(conversation.isOnline || conversation.active),
  isPinned: Boolean(conversation.isPinned),
  assignedTo: conversation.assignedTo || null,
  tags: conversation.tags || [],
  campaignStatus: conversation.campaignStatus || "",
  lastMessage: conversation.lastMessage || conversation.message || "",
  lastMessageAt:
    conversation.lastMessageAt || conversation.updatedAt || conversation.timestamp,
  lastMessageType: conversation.lastMessageType || "text",
  source: conversation.source || "WhatsApp",
  sessionExpiresAt: conversation.sessionExpiresAt,
  typing: Boolean(conversation.typing),
  notes: conversation.notes || [],
  orderHistory: conversation.orderHistory || [],
  customFields: conversation.customFields || {},
});
