import * as React from "react";
import { Button, Input, cn } from '@platform-system/design-ui';
import { useAccount } from "../hooks/use-account";
import { useTranslations } from "../translations/vi";
import { toast } from "sonner";
import { apiClient } from "../../../shared/api/apiClient";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export function WalletScreen() {
  const t = useTranslations("Account");
  const {
    wallet,
    walletTransactions,
    refetchWallet,
    refetchTransactions,
    statementFrom,
    setStatementFrom,
    statementTo,
    setStatementTo,
    walletStatement,
    refetchStatement,
    isFetchingStatement,
  } = useAccount();

  const [topupAmount, setTopupAmount] = React.useState("");
  const [isTopupLoading, setIsTopupLoading] = React.useState(false);
  const [activeSubTab, setActiveSubTab] = React.useState<"transactions" | "statement">("transactions");

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(topupAmount, 10);
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
        toast.success(t("walletDepositSuccess"));
        window.location.href = response.data.data.checkoutUrl;
      } else {
        toast.error(t("walletDepositError"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi tạo yêu cầu nạp tiền.");
    } finally {
      setIsTopupLoading(false);
    }
  };

  const getTransactionTypeLabel = (type: number) => {
    if (type === 1) return t("walletTypeTopup");
    if (type === 2) return t("walletTypePayment");
    if (type === 3) return t("walletTypeRefund");
    return "Khác";
  };

  const getTransactionStatusLabel = (status: number) => {
    if (status === 1) return t("walletStatusPending");
    if (status === 2) return t("walletStatusSucceeded");
    if (status === 3) return t("walletStatusFailed");
    return "Không rõ";
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="relative z-10 text-foreground">
      <div className="mx-auto max-w-none">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t("tabWallet")}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("tabWalletDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left panel: Balance card + Topup Form */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-80">{t("walletBalance")}</span>
                <Wallet className="h-6 w-6 opacity-80" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {wallet ? formatCurrency(wallet.balance) : "0 ₫"}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4 text-xs opacity-80">
                <span>Nyxoris Central Wallet</span>
                <button 
                  onClick={() => {
                    refetchWallet();
                    refetchTransactions();
                    toast.success("Đã làm mới dữ liệu ví");
                  }} 
                  className="flex items-center gap-1 hover:text-white"
                >
                  <RefreshCw className="h-3 w-3" /> Làm mới
                </button>
              </div>
            </div>

            {/* Topup Form */}
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-lg">
              <h3 className="font-serif text-lg font-semibold mb-4">{t("walletDeposit")}</h3>
              <form onSubmit={handleTopup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="topup-amount" className="text-xs text-muted-foreground">Mệnh giá nạp (VND)</label>
                  <Input
                    id="topup-amount"
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    placeholder="Ví dụ: 100000"
                    className="h-11 rounded-xl"
                    min="10000"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  disabled={isTopupLoading}
                >
                  {isTopupLoading ? "Đang xử lý..." : t("walletDepositButton")}
                </Button>
              </form>
            </div>
          </div>

          {/* Right panel: Sub-tabs and lists */}
          <div className="lg:col-span-8">
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-2xl min-h-[400px]">
              {/* Tab Navigation */}
              <div className="flex border-b border-border pb-3 mb-6">
                <button
                  onClick={() => setActiveSubTab("transactions")}
                  className={cn(
                    "mr-6 pb-2 text-sm font-semibold border-b-2 transition-all",
                    activeSubTab === "transactions" 
                      ? "border-blue-600 text-foreground" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("walletSubTabTransactions")}
                </button>
                <button
                  onClick={() => setActiveSubTab("statement")}
                  className={cn(
                    "pb-2 text-sm font-semibold border-b-2 transition-all",
                    activeSubTab === "statement" 
                      ? "border-blue-600 text-foreground" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("walletSubTabStatement")}
                </button>
              </div>

              {/* Transactions Tab */}
              {activeSubTab === "transactions" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-semibold">{t("walletHistory")}</h3>
                    <p className="text-xs text-muted-foreground">{t("walletHistoryDesc")}</p>
                  </div>

                  {walletTransactions.length > 0 ? (
                    <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto pr-1">
                      {walletTransactions.map((tx) => {
                        const isTopupOrRefund = tx.type === 1 || tx.type === 3;
                        return (
                          <div key={tx.id} className="flex items-center justify-between py-3.5 hover:bg-muted/10 px-2 rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full",
                                isTopupOrRefund 
                                  ? "bg-emerald-500/10 text-emerald-600" 
                                  : "bg-rose-500/10 text-rose-600"
                              )}>
                                {isTopupOrRefund ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {getTransactionTypeLabel(tx.type)}
                                </span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">
                                  {new Date(tx.createdAt).toLocaleString("vi-VN")} • Mã: #{tx.referenceCode || tx.referenceId?.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={cn(
                                "text-sm font-bold",
                                isTopupOrRefund ? "text-emerald-600" : "text-rose-600"
                              )}>
                                {isTopupOrRefund ? "+" : "-"}{formatCurrency(tx.amount)}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                {tx.status === 2 && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                {tx.status === 1 && <Clock className="h-3 w-3 text-amber-500" />}
                                {tx.status === 3 && <XCircle className="h-3 w-3 text-rose-500" />}
                                {getTransactionStatusLabel(tx.status)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <AlertCircle className="h-10 w-10 text-muted-foreground/60 mb-2" />
                      <p className="text-sm text-muted-foreground">{t("walletEmptyTransactions")}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Statement Tab */}
              {activeSubTab === "statement" && (
                <div className="space-y-6">
                  {/* Date range picker */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end bg-muted/20 p-4 rounded-2xl border border-border/60">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {t("walletStatementFrom")}
                      </label>
                      <Input
                        type="date"
                        value={statementFrom}
                        onChange={(e) => setStatementFrom(e.target.value)}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {t("walletStatementTo")}
                      </label>
                      <Input
                        type="date"
                        value={statementTo}
                        onChange={(e) => setStatementTo(e.target.value)}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        refetchStatement();
                        toast.success(t("walletStatementSuccess"));
                      }} 
                      className="h-10 rounded-xl font-semibold"
                      disabled={isFetchingStatement}
                    >
                      {isFetchingStatement ? "Đang tải..." : t("walletStatementFetch")}
                    </Button>
                  </div>

                  {/* Statement Summary Results */}
                  {walletStatement ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-serif text-base font-semibold flex items-center gap-2 text-foreground">
                          <FileText className="h-4.5 w-4.5 text-blue-600" /> {t("walletStatementSummary")}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Từ ngày {new Date(statementFrom).toLocaleDateString("vi-VN")} đến {new Date(statementTo).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      {/* Stat Cards Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="bg-muted/10 p-3 rounded-2xl border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">{t("walletOpeningBalance")}</span>
                          <span className="text-sm font-bold text-foreground mt-0.5 block">
                            {formatCurrency(walletStatement.openingBalance)}
                          </span>
                        </div>
                        <div className="bg-muted/10 p-3 rounded-2xl border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">{t("walletClosingBalance")}</span>
                          <span className="text-sm font-bold text-foreground mt-0.5 block">
                            {formatCurrency(walletStatement.closingBalance)}
                          </span>
                        </div>
                        <div className="bg-muted/10 p-3 rounded-2xl border border-border/40 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-muted-foreground block">{t("walletNetChange")}</span>
                          <span className={cn(
                            "text-sm font-bold mt-0.5 block",
                            walletStatement.netChange >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {walletStatement.netChange >= 0 ? "+" : ""}{formatCurrency(walletStatement.netChange)}
                          </span>
                        </div>
                        <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                          <span className="text-[10px] text-emerald-700 block">{t("walletTotalTopup")}</span>
                          <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                            {formatCurrency(walletStatement.totalTopup)}
                          </span>
                        </div>
                        <div className="bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10">
                          <span className="text-[10px] text-rose-700 block">{t("walletTotalPayment")}</span>
                          <span className="text-sm font-bold text-rose-600 mt-0.5 block">
                            {formatCurrency(walletStatement.totalPayment)}
                          </span>
                        </div>
                      </div>

                      {/* Transaction Count Statistics */}
                      <div className="border-t border-border pt-4">
                        <span className="text-xs font-semibold text-muted-foreground block mb-2">Số lượng giao dịch</span>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {walletStatement.succeededTransactionCount} {t("walletSucceededTransactions")}
                          </span>
                          <span className="flex items-center gap-1.5 text-amber-500">
                            <Clock className="h-3.5 w-3.5" /> {walletStatement.pendingTransactionCount} {t("walletPendingTransactions")}
                          </span>
                          <span className="flex items-center gap-1.5 text-rose-500">
                            <XCircle className="h-3.5 w-3.5" /> {walletStatement.failedTransactionCount} {t("walletFailedTransactions")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-2xl text-center">
                      <TrendingUp className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-xs text-muted-foreground">Chọn ngày giao dịch và nhấn xuất sao kê để xem tóm tắt.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
