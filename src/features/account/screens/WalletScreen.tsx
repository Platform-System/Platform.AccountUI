import * as React from "react";
import { 
  Button, 
  Input, 
  DatePicker, 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from '@platform-system/design-ui';
import { useAccount } from "../hooks/use-account";
import { useTranslations } from "../translations/vi";
import { toast } from "sonner";
import { apiClient } from "../../../shared/api/apiClient";
import { 
  Wallet, 
  Receipt, 
  Loader2
} from "lucide-react";

export function WalletScreen() {
  const t = useTranslations("Account");
  const {
    wallet,
    walletTransactions,
    statementFrom,
    setStatementFrom,
    statementTo,
    setStatementTo,
    walletStatement,
    isFetchingStatement,
  } = useAccount();

  const [topupAmount, setTopupAmount] = React.useState("");
  const [isTopupLoading, setIsTopupLoading] = React.useState(false);
  const [walletSubTab, setWalletSubTab] = React.useState<"transactions" | "statement">("transactions");

  const formatNumber = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(clean, 10));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopupAmount(formatNumber(e.target.value));
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmountStr = topupAmount.replace(/\D/g, "");
    const amount = parseInt(rawAmountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    setIsTopupLoading(true);
    try {
      const response = await apiClient.post("/api/wallet/me/topups", {
        amount,
        provider: "PayOS",
      });
      if (response.data?.success && response.data.data?.checkoutUrl) {
        toast.success("Tạo link nạp tiền thành công! Đang chuyển hướng...");
        window.location.href = response.data.data.checkoutUrl;
      } else {
        toast.error("Không tạo được link nạp tiền. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi tạo yêu cầu nạp tiền.");
    } finally {
      setIsTopupLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (
      allowedKeys.includes(e.key) ||
      ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative z-10 text-foreground">
      <div className="mx-auto max-w-none">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">Ví</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Quản lý số dư ví, nạp tiền và xem lịch sử giao dịch ví điện tử của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          {/* Balance Card */}
          <div className="md:col-span-1 rounded-2xl border border-border p-6 bg-foreground text-background flex flex-col justify-between min-h-[160px] select-none relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm opacity-80">Số dư khả dụng</p>
              <p className="mt-2 text-3xl font-bold">
                {wallet ? `${wallet.balance.toLocaleString("vi-VN")} đ` : "0 đ"}
              </p>
            </div>
            <Wallet className="absolute -bottom-6 -right-6 h-28 w-28 opacity-10 rotate-12 pointer-events-none" />
          </div>

          {/* Topup Form */}
          <form onSubmit={handleTopup} className="md:col-span-2 rounded-2xl border border-border p-6 flex flex-col justify-between min-h-[160px] bg-card shadow-sm">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Nạp tiền vào ví</h4>
              <Input
                type="text"
                className="h-11 rounded-xl"
                placeholder="Nhập số tiền nạp (ví dụ: 100.000)"
                value={topupAmount}
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full"
              disabled={isTopupLoading || !topupAmount}
            >
              {isTopupLoading ? "Đang xử lý..." : "Nạp tiền ngay"}
            </Button>
          </form>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex border-b border-border mt-4 mb-6">
          <button
            onClick={() => setWalletSubTab("transactions")}
            className={`pb-3 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
              walletSubTab === "transactions"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("wallet.tabTransactions")}
          </button>
          <button
            onClick={() => setWalletSubTab("statement")}
            className={`pb-3 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
              walletSubTab === "statement"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("wallet.tabStatement")}
          </button>
        </div>

        {/* Tab Content */}
        {walletSubTab === "statement" ? (
          /* Sao kê ví section */
          <div className="rounded-2xl border border-border p-6 bg-card animate-in fade-in duration-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{t("wallet.statementTitle")}</h4>
                <p className="text-xs text-muted-foreground">{t("wallet.statementDesc")}</p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted-foreground shrink-0 w-8 sm:w-auto text-left">{t("wallet.from")}</span>
                  <DatePicker
                    date={statementFrom ? new Date(statementFrom) : undefined}
                    setDate={(d) => setStatementFrom(d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : "")}
                    className="flex-1 sm:flex-initial sm:w-36 text-xs h-9"
                    disabled={statementTo ? { after: new Date(statementTo) } : { after: new Date() }}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted-foreground shrink-0 w-8 sm:w-auto text-left">{t("wallet.to")}</span>
                  <DatePicker
                    date={statementTo ? new Date(statementTo) : undefined}
                    setDate={(d) => setStatementTo(d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : "")}
                    className="flex-1 sm:flex-initial sm:w-36 text-xs h-9"
                    disabled={statementFrom ? [{ before: new Date(statementFrom) }, { after: new Date() }] : { after: new Date() }}
                  />
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 self-end sm:self-auto">
                  {isFetchingStatement && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            </div>

            {walletStatement ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.openingBalance")}</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {walletStatement.openingBalance.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.closingBalance")}</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {walletStatement.closingBalance.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.netChange")}</p>
                  <p className={`mt-1 text-base font-bold ${walletStatement.netChange >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {walletStatement.netChange >= 0 ? "+" : ""}{walletStatement.netChange.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.totalTopup")}</p>
                  <p className="mt-1 text-base font-bold text-emerald-500">
                    +{walletStatement.totalTopup.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.totalPayment")}</p>
                  <p className="mt-1 text-base font-bold text-destructive">
                    -{walletStatement.totalPayment.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                  <p className="text-xs text-muted-foreground">{t("wallet.succeededTxCount")}</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {walletStatement.succeededTransactionCount} {t("wallet.succeededTxCountUnit")}
                  </p>
                </div>
              </div>
            ) : (
              <Empty className="border-none bg-transparent px-0 py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="store-surface-soft store-muted-text flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
                    <Receipt className="h-8 w-8" />
                  </EmptyMedia>
                  <EmptyTitle>{t("wallet.emptyTitle")}</EmptyTitle>
                  <EmptyDescription className="max-w-md">
                    {t("wallet.emptyDesc")}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border p-6 bg-card animate-in fade-in duration-200">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-foreground">{t("wallet.txTitle")}</h4>
              <p className="text-xs text-muted-foreground">{t("wallet.txDesc")}</p>
            </div>
            {walletTransactions && walletTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border pb-2 text-foreground font-medium">
                      <th className="py-2">{t("wallet.txHeaderCode")}</th>
                      <th className="py-2">{t("wallet.txHeaderTime")}</th>
                      <th className="py-2">{t("wallet.txHeaderDesc")}</th>
                      <th className="py-2">{t("wallet.txHeaderAmount")}</th>
                      <th className="py-2">{t("wallet.txHeaderStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletTransactions.map((tx) => {
                      const isPlus = tx.type === 1 || tx.type === 3; // Topup = 1, Refund = 3
                      const statusColor = tx.status === 2 ? "text-emerald-500" : tx.status === 1 ? "text-amber-500" : "text-destructive";
                      const statusText = tx.status === 2 ? t("wallet.txStatusSuccess") : tx.status === 1 ? t("wallet.txStatusPending") : t("wallet.txStatusFailed");
                      return (
                        <tr key={tx.id} className="border-b border-border/40 last:border-0">
                          <td className="py-3 font-mono text-xs text-foreground">#{tx.referenceCode || tx.id.substring(0, 8)}</td>
                          <td className="py-3 text-xs">{new Date(tx.createdAt).toLocaleString("vi-VN")}</td>
                          <td className="py-3 text-xs text-foreground">{tx.description}</td>
                          <td className={`py-3 font-semibold ${isPlus ? "text-emerald-500" : "text-destructive"}`}>
                            {isPlus ? "+" : "-"}{tx.amount.toLocaleString("vi-VN")} đ
                          </td>
                          <td className={`py-3 text-xs font-medium ${statusColor}`}>{statusText}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty className="border-none bg-transparent px-0 py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="store-surface-soft store-muted-text flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
                    <Receipt className="h-8 w-8" />
                  </EmptyMedia>
                  <EmptyTitle>{t("wallet.emptyTxTitle")}</EmptyTitle>
                  <EmptyDescription className="max-w-md">
                    {t("wallet.emptyTxDesc")}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
