import { useMemo, useState } from "react";
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  UserGroupIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import AnalyticsDashboard from "@/components/whatsapp/analytics/AnalyticsDashboard";
import CampaignsPage from "@/components/whatsapp/campaigns/CampaignsPage";
import ContactsPage from "@/components/whatsapp/contacts/ContactsPage";
import InboxPage from "@/components/whatsapp/inbox/InboxPage";
import BusinessProfileSettings from "@/components/whatsapp/profile/BusinessProfileSettings";
import TemplatesPage from "@/components/whatsapp/templates/TemplatesPage";
import WalletRechargePage from "@/components/whatsapp/wallet/WalletRechargePage";
import { useWhatsappOverview } from "@/hooks/whatsapp/useWhatsapp";
import { formatCurrency } from "@/utils/whatsapp/formatters";

const tabs = [
  { id: "inbox", label: "Inbox", icon: ChatBubbleLeftRightIcon },
  { id: "campaigns", label: "Campaigns", icon: MegaphoneIcon },
  { id: "contacts", label: "Contacts", icon: UserGroupIcon },
  { id: "templates", label: "Templates", icon: DocumentTextIcon },
  { id: "analytics", label: "Analytics", icon: ChartBarIcon },
  { id: "wallet", label: "Wallet", icon: WalletIcon },
  { id: "profile", label: "Profile", icon: Cog6ToothIcon },
];

const pageMeta = {
  inbox: {
    title: "WhatsApp Business CRM",
    description: "Real-time support inbox, templates, tags, notes, orders, and Cloud API events.",
  },
  campaigns: {
    title: "Campaigns",
    description: "Create broadcast campaigns, track delivery funnel, and monitor WhatsApp spend.",
  },
  contacts: {
    title: "Contacts",
    description: "Search, segment, and sync WhatsApp opt-in customer profiles.",
  },
  templates: {
    title: "Templates",
    description: "Manage approved Meta templates for utility, marketing, and service workflows.",
  },
  analytics: {
    title: "Analytics",
    description: "Support performance, conversation volume, campaign funnel, and team response health.",
  },
  wallet: {
    title: "Wallet & Recharge",
    description: "Manage WhatsApp billing balance and conversation category spend.",
  },
  profile: {
    title: "Business Profile",
    description: "Configure WhatsApp Business account, phone number, webhook, and profile details.",
  },
};

const WhatsappDashboard = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const overview = useWhatsappOverview();
  const meta = pageMeta[activeTab];

  const activePage = useMemo(() => {
    const pages = {
      inbox: <InboxPage />,
      campaigns: <CampaignsPage />,
      contacts: <ContactsPage />,
      templates: <TemplatesPage />,
      analytics: <AnalyticsDashboard />,
      wallet: <WalletRechargePage />,
      profile: <BusinessProfileSettings />,
    };

    return pages[activeTab];
  }, [activeTab]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100 p-3">
      <div className="mb-3 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Famto Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
              {meta.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">{meta.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 xl:min-w-[520px]">
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-800">
              <p className="text-xs font-medium opacity-75">Open</p>
              <p className="text-lg font-semibold">
                {overview.data?.inbox?.open ?? "--"}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sky-800">
              <p className="text-xs font-medium opacity-75">Unread</p>
              <p className="text-lg font-semibold">
                {overview.data?.inbox?.unread ?? "--"}
              </p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-3 py-2 text-violet-800">
              <p className="text-xs font-medium opacity-75">Templates</p>
              <p className="text-lg font-semibold">
                {overview.data?.templates?.approved ?? "--"}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-3 py-2 text-amber-800">
              <p className="text-xs font-medium opacity-75">Wallet</p>
              <p className="text-lg font-semibold">
                {overview.data?.wallet
                  ? formatCurrency(overview.data.wallet.balance)
                  : "--"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 wa-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        className={`min-h-0 flex-1 ${
          activeTab === "inbox" ? "overflow-hidden" : "overflow-y-auto pb-6 wa-scrollbar"
        }`}
      >
        {activePage}
      </div>
    </div>
  );
};

export default WhatsappDashboard;
