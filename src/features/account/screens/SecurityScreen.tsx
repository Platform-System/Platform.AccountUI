import { Button, cn } from '@platform-system/design-ui';
import { useTranslations } from "../translations/vi";
import { useAuth } from "../../../core/auth-context";
import { 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  Lock, 
  Smartphone, 
  History,
  AlertCircle
} from "lucide-react";

export function SecurityScreen() {
  const t = useTranslations("Account");
  const { user } = useAuth();
  
  const keycloakConsoleUrl = `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/account`;

  return (
    <div className="relative z-10 text-foreground">
      <div className="mx-auto max-w-none">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t("securityAndChangePasswordShort")}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Quản lý thông tin đăng nhập, bảo mật 2 lớp, và theo dõi lịch sử truy cập tài khoản của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main info panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Console Redirect Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-inner">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-serif text-xl font-bold text-foreground">Quản lý bảo mật tập trung</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hệ thống Nyxoris sử dụng giải pháp bảo mật tập trung thông qua <strong className="font-semibold text-foreground">Keycloak Identity Server</strong>. Tất cả thông tin nhạy cảm của bạn như mật khẩu và cấu hình bảo mật 2 lớp (2FA) đều được lưu trữ bảo mật độc lập tại đây.
                  </p>
                  <div className="pt-2">
                    <Button asChild variant="default" size="lg">
                      <a href={keycloakConsoleUrl} target="_blank" rel="noopener noreferrer">
                        <Key className="h-4 w-4 mr-2" />
                        {t("securityAndChangePassword")}
                        <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-70" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* List of actions inside console */}
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-lg space-y-6">
              <h4 className="font-serif text-base font-semibold">Các thiết lập bảo mật khả dụng tại Identity Server</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="transition-all duration-300 hover:scale-[1.01] flex gap-4 p-5 rounded-2xl bg-muted/10 border border-border/40 hover:border-border hover:bg-muted/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-foreground">Thay đổi mật khẩu</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">Thiết lập mật khẩu mới có độ mạnh cao để chống lại các cuộc tấn công đoán mật khẩu.</p>
                  </div>
                </div>

                <div className="transition-all duration-300 hover:scale-[1.01] flex gap-4 p-5 rounded-2xl bg-muted/10 border border-border/40 hover:border-border hover:bg-muted/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-foreground">Bảo mật hai lớp (2FA)</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">Kích hoạt OTP thông qua Google Authenticator hoặc FreeOTP để bảo vệ tài khoản tốt nhất.</p>
                  </div>
                </div>

                <div className="transition-all duration-300 hover:scale-[1.01] flex gap-4 p-5 rounded-2xl bg-muted/10 border border-border/40 hover:border-border hover:bg-muted/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                    <History className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-foreground">Nhật ký truy cập</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">Theo dõi và kiểm tra thời gian, thiết bị, địa chỉ IP của tất cả các lần đăng nhập gần đây.</p>
                  </div>
                </div>

                <div className="transition-all duration-300 hover:scale-[1.01] flex gap-4 p-5 rounded-2xl bg-muted/10 border border-border/40 hover:border-border hover:bg-muted/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-foreground">Thu hồi phiên hoạt động</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">Đăng xuất từ xa khỏi các trình duyệt hoặc thiết bị cũ đang duy trì đăng nhập của bạn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Profile presence details */}
          <div className="lg:col-span-4">
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-lg space-y-6 relative overflow-hidden bg-card">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
              <h3 className="font-serif text-lg font-bold text-foreground pb-2 border-b border-border">Thông tin phiên hiện tại</h3>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Địa chỉ Email</span>
                  <span className="font-semibold text-foreground">{user?.email || "Chưa cập nhật"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Định danh User ID (Sub)</span>
                  <span className="font-mono text-xs text-foreground/80 select-all break-all block p-2 rounded-xl bg-muted/20 border border-border/40">{user?.sub || "—"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Email Verified</span>
                  <div>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1 border",
                      user?.email_verified 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    )}>
                      {user?.email_verified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
