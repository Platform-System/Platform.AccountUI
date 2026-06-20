import { Button } from "@platform-system/design-ui/components/button";
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
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-2xl bg-gradient-to-r from-muted/5 to-muted/20">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-lg font-semibold text-foreground">Quản lý bảo mật tập trung</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hệ thống Nyxoris sử dụng giải pháp bảo mật tập trung thông qua **Keycloak Identity Server**. Tất cả thông tin nhạy cảm của bạn như mật khẩu và cấu hình bảo mật 2 lớp (2FA) đều được lưu trữ bảo mật độc lập tại đây.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button asChild className="rounded-xl font-semibold h-11 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
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
                <div className="flex gap-3 p-4 rounded-2xl bg-muted/10 border border-border/40">
                  <Lock className="h-5 w-5 text-blue-500 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold">Thay đổi mật khẩu</h5>
                    <p className="text-xs text-muted-foreground">Thiết lập mật khẩu mới có độ mạnh cao để chống lại các cuộc tấn công đoán mật khẩu.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-2xl bg-muted/10 border border-border/40">
                  <Smartphone className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold">Bảo mật hai lớp (2FA)</h5>
                    <p className="text-xs text-muted-foreground">Kích hoạt OTP thông qua Google Authenticator hoặc FreeOTP để bảo vệ tài khoản tốt nhất.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-2xl bg-muted/10 border border-border/40">
                  <History className="h-5 w-5 text-purple-500 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold">Nhật ký truy cập</h5>
                    <p className="text-xs text-muted-foreground">Theo dõi và kiểm tra thời gian, thiết bị, địa chỉ IP của tất cả các lần đăng nhập gần đây.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-2xl bg-muted/10 border border-border/40">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold">Thu hồi phiên hoạt động</h5>
                    <p className="text-xs text-muted-foreground">Đăng xuất từ xa khỏi các trình duyệt hoặc thiết bị cũ đang duy trì đăng nhập của bạn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Profile presence details */}
          <div className="lg:col-span-4">
            <div className="ds-glass-panel rounded-3xl p-6 border border-border shadow-lg space-y-4">
              <h3 className="font-serif text-lg font-semibold">Thông tin phiên hiện tại</h3>
              <div className="space-y-3.5 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Địa chỉ Email</span>
                  <span className="font-medium text-foreground">{user?.email || "Chưa xác minh"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Định danh User ID (Sub)</span>
                  <span className="font-mono text-xs text-foreground select-all break-all">{user?.sub || "—"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Email Verified</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 mt-1">
                    {user?.email_verified ? "Đã xác minh" : "Chưa xác minh"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
