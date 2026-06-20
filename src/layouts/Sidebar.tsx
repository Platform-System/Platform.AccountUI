import React from 'react';
import { BrandMark } from '@platform-system/design-ui/components/brand-mark';
import { Button } from '@platform-system/design-ui/components/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarNavItem } from '@platform-system/design-ui/components/sidebar-nav';
import { SidebarShell } from '@platform-system/design-ui/components/sidebar-shell';
import { UserIdentity } from '@platform-system/design-ui/components/user-identity';
import { 
  User, 
  Wallet, 
  Key, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../core/auth-context';
import { useAccount } from '../features/account/hooks/use-account';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { profile } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <User size={18} />, label: 'Hồ sơ cá nhân', path: '/profile' },
    { icon: <Wallet size={18} />, label: 'Ví của tôi', path: '/wallet' },
    { icon: <Key size={18} />, label: 'Bảo mật & Đổi mật khẩu', path: '/security' },
  ];

  return (
    <SidebarShell open={isOpen}>
      <div className="flex h-20 min-h-20 items-center justify-between gap-4 border-b border-border px-6 lg:justify-start">
        <div className="flex items-center gap-3">
          <BrandMark letter="N" />
          <div className="flex flex-col">
            <span className="text-xl font-sans font-black tracking-tighter text-foreground">Nyxoris</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Account Portal</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          className="lg:hidden rounded-lg"
        >
          <X size={18} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-[18px]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              active={isActive}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              {item.label}
            </SidebarNavItem>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border px-[18px] pb-5 pt-[18px]">
        <div className="flex items-center justify-between gap-3 bg-transparent py-1">
          <UserIdentity
            name={profile.displayName || user?.name || user?.preferred_username || user?.email || 'Tài khoản Nyxoris'}
            avatarSrc={profile.avatar || user?.picture || null}
            avatarAlt={profile.displayName || user?.name || 'User Avatar'}
            showPresence
          />
          
          <Button
            type="button"
            variant="danger-ghost"
            size="icon"
            onClick={logout} 
            className="icon-action-shift h-[38px] w-[38px] shrink-0 rounded-xl"
            title="Đăng xuất"
          >
            <LogOut size={17} />
          </Button>
        </div>
      </div>
    </SidebarShell>
  );
};
