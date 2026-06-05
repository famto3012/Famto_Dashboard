import {
  CreditCardIcon,
  CurrencyRupeeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import { useWhatsappWallet } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCurrency, getRelativeTime } from "@/utils/whatsapp/formatters";

const WalletRechargePage = () => {
  const walletQuery = useWhatsappWallet();
  const wallet = walletQuery.data;

  if (walletQuery.isLoading) return <LoadingRows count={4} />;

  if (walletQuery.isError) {
    return <ErrorState message={walletQuery.error?.message} onRetry={walletQuery.refetch} />;
  }

  if (!wallet) {
    return <ErrorState message="Unable to load billing data" onRetry={walletQuery.refetch} />;
  }

  const monthlySpend = wallet.monthlySpend || 0;
  const totalConversations = wallet.totalConversations || 0;
  const pricing = wallet.pricing || [];
  const transactions = wallet.transactions || [];
  const billingPeriod = wallet.billingPeriod || {};

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Monthly spend"
          value={formatCurrency(monthlySpend)}
          hint={billingPeriod.start ? `Since ${new Date(billingPeriod.start).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}` : "Current billing period"}
          icon={CurrencyRupeeIcon}
          tone="amber"
        />
        <StatCard
          label="Total conversations"
          value={totalConversations.toLocaleString()}
          hint="This month (all categories)"
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          label="Currency"
          value={wallet.currency || "INR"}
          hint="Billed by Meta directly"
          icon={CreditCardIcon}
          tone="sky"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SectionPanel title="Conversation pricing" description="Meta charges per conversation category. Billed directly to your Meta payment method.">
          <div className="grid gap-3">
            {pricing.map((item) => (
              <div key={item.category} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">{item.category}</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(item.rate)} / conversation
                  </p>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-sm text-slate-500">
                    {item.conversations} conversations
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(item.spend)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {pricing.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              No conversation data for this billing period yet.
            </p>
          )}
        </SectionPanel>

        <SectionPanel title="Daily usage" description="Conversation charges by day this month.">
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{transaction.reference}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.type} · {getRelativeTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <StatusBadge>{transaction.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              No transactions yet this month.
            </p>
          )}
        </SectionPanel>
      </div>

      {wallet.account?.name && (
        <SectionPanel title="Account info" description="Your WhatsApp Business Account details from Meta.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account</p>
              <p className="mt-1 font-semibold text-slate-900">{wallet.account.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Review status</p>
              <p className="mt-1">
                <StatusBadge>{wallet.account.reviewStatus || "UNKNOWN"}</StatusBadge>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Timezone</p>
              <p className="mt-1 font-semibold text-slate-900">{wallet.account.timezone || "-"}</p>
            </div>
          </div>
        </SectionPanel>
      )}
    </div>
  );
};

export default WalletRechargePage;
