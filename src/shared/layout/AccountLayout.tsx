import React, { useState, useEffect, useRef } from 'react';
import {
  cn,
  Button,
  Toaster as SonnerToaster,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,

  Avatar,
  AvatarImage,
  AvatarFallback,
  UserProfileCard,
  HeaderLayout,
  UserProfileDropdown
} from '@platform-system/design-ui';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Globe,
  ShoppingBag,
  User,
  Wallet,
  Key,
  LogOut,
  Image,
  ChevronLeft,
  ChevronRight,
  Wallpaper,
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/core/auth-context';
import { useAccount } from '@/features/account/hooks/use-account';
import { motion, AnimatePresence } from 'framer-motion';

const portals = [
  { id: 'customer', name: 'Cổng khách hàng', url: 'https://nyxoris.com', icon: <Globe size={16} />, active: true },
  { id: 'merchant', name: 'Cổng người bán', url: 'https://merchant.nyxoris.com', icon: <ShoppingBag size={16} />, active: true },
  { id: 'community', name: 'Cổng cộng đồng', url: '#', icon: <MessageSquare size={16} />, active: false },
];

export const AccountLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocalSidebarOpen, setIsLocalSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const { profile } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop;
      setIsScrolled((prev) => {
        if (prev) {
          return scrollTop > 15;
        }
        return scrollTop > 35;
      });
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { icon: <User size={18} />, label: 'Hồ sơ cá nhân', path: '/profile' },
    { icon: <Image size={18} />, label: 'Cập nhật hình ảnh', path: '/media' },
    { icon: <Wallet size={18} />, label: 'Ví của tôi', path: '/wallet' },
    { icon: <Key size={18} />, label: 'Bảo mật & Đổi mật khẩu', path: '/security' },
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-500">
      <HeaderLayout
        isScrolled={isScrolled}
        rightActions={
          <>
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="relative rounded-full ml-1 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shrink-0">
                  <Avatar className="size-9 transition-transform hover:scale-110 active:scale-95 shrink-0" showDropdownIndicator>
                    <AvatarImage src={profile.avatar || user?.picture || ""} alt={profile.displayName || user?.name || "User Avatar"} className="object-cover shrink-0" />
                    <AvatarFallback className="shrink-0">
                      <User className="size-5 shrink-0" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" alignOffset={5} forceMount>
                <UserProfileDropdown
                  userCard={
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer font-normal p-2.5 min-w-0 focus:bg-[rgb(var(--store-accent-rgb)/0.05)] focus:text-foreground w-full"
                    >
                      <UserProfileCard
                        name={profile.displayName || (user?.preferred_username as string) || (user?.name as string) || "Người dùng"}
                        avatarSrc={profile.avatar || user?.picture || ""}
                        subtext="Gói: Miễn phí"
                        showChevron={true}
                      />
                    </DropdownMenuItem>
                  }
                  menuItems={
                    <DropdownMenuItem
                      onClick={() => {
                        sessionStorage.removeItem("hasUnlockedIntro");
                        sessionStorage.setItem("introRedirectPath", location.pathname);
                        navigate('/');
                      }}
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Wallpaper className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>Màn hình chờ</span>
                    </DropdownMenuItem>
                  }
                  portals={portals.map((portal) => ({
                    id: portal.id,
                    name: portal.name,
                    icon: portal.icon,
                    href: portal.url,
                    active: portal.active,
                    target: portal.active ? '_blank' : undefined,
                    rel: portal.active ? 'noreferrer' : undefined,
                  }))}
                  currentPortalId="customer"
                  logoutItem={
                    <DropdownMenuItem
                      onClick={logout}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4 shrink-0" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden rounded-xl size-[42px] max-sm:size-[36px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </>
        }
      >
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-secondary/95 backdrop-blur-xl border-t border-border lg:hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HeaderLayout>

      {/* Container below Topbar containing Sidebar and Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Floating Sidebar Toggle Button (Desktop Only - Slim Glass Pill) */}
        <button
          type="button"
          onClick={() => setIsLocalSidebarOpen(!isLocalSidebarOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out hidden lg:flex h-10 w-[12px] hover:w-[18px] items-center justify-center rounded-r-xl border border-l-0 border-black bg-black shadow-[2px_0_10px_rgba(0,0,0,0.15)] text-white hover:bg-white hover:text-black hover:border-slate-200 cursor-pointer focus:outline-none group",
            isLocalSidebarOpen ? "left-[280px]" : "left-0"
          )}
          title={isLocalSidebarOpen ? "Đóng menu cài đặt" : "Mở menu cài đặt"}
        >
          {isLocalSidebarOpen ? (
            <ChevronLeft size={8} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          ) : (
            <ChevronRight size={8} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </button>

        {/* Local Sidebar (Desktop Only, slides in from left below Header) */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 z-20 w-[280px] bg-background/80 backdrop-blur-md shadow-[4px_0_16px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out transform hidden lg:flex flex-col p-6",
            isLocalSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-3 tracking-wider text-left">Danh mục cài đặt</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold shadow-[0_2px_8px_rgba(var(--store-accent-rgb),0.04)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>


        </div>

        {/* Content Area (slides to make space for Sidebar) */}
        <main
          ref={mainRef}
          className={cn(
            "relative z-10 flex-1 overflow-y-scroll bg-background/50 transition-[padding] duration-300 ease-in-out [overscroll-behavior-y:none]",
            isLocalSidebarOpen ? "lg:pl-[280px]" : "lg:pl-0"
          )}
        >
          <div className="w-full p-10 max-md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <SonnerToaster />
    </div>
  );
};
