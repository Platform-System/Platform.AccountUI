import React, { useState } from 'react';
import { Button, OverlayBackdrop, PlatformSwitcherMenu, Toaster as SonnerToaster, TopbarShell } from '@platform-system/design-ui';
import { Outlet } from 'react-router-dom';
import { Menu, HelpCircle, Globe, ShoppingBag, Shield } from 'lucide-react';
import { Sidebar } from './Sidebar';

const portals = [
  { id: 'customer', name: 'Cổng khách hàng', url: 'https://nyxoris.com', icon: <Globe size={16} />, active: true },
  { id: 'merchant', name: 'Cổng người bán', url: 'https://merchant.nyxoris.com', icon: <ShoppingBag size={16} />, active: true },
  { id: 'admin', name: 'Cổng quản trị', url: 'https://admin.nyxoris.com', icon: <Shield size={16} />, active: true },
];

export const AccountLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background font-['Plus_Jakarta_Sans',sans-serif]">
      {isSidebarOpen && (
        <OverlayBackdrop
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="relative z-10 flex min-w-0 flex-grow flex-col pl-[288px] max-lg:pl-0">
        <TopbarShell>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden rounded-lg"
            >
              <Menu size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              asChild
              type="button"
              variant="outline"
              size="icon"
              className="size-[42px] rounded-xl text-muted-foreground"
            >
              <a
                href="https://docs.nyxoris.com"
                target="_blank"
                rel="noreferrer"
                title="Tài liệu Hệ thống"
              >
                <HelpCircle size={20} />
              </a>
            </Button>

            <div className="h-6 w-px bg-border" />
            <PlatformSwitcherMenu
              items={portals.map((portal) => ({
                id: portal.id,
                name: portal.name,
                icon: portal.icon,
                href: portal.url,
                active: portal.active,
                target: portal.active ? '_blank' : undefined,
                rel: portal.active ? 'noreferrer' : undefined,
              }))}
              currentPlatformId="account"
            />
          </div>
        </TopbarShell>

        <div className="relative flex-1 overflow-y-auto p-10 max-md:p-6">
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </main>

      <SonnerToaster />
    </div>
  );
};
