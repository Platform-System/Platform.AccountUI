import * as React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth-context';
import { useAccount } from '../hooks/use-account';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useAccount();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  const hasIntro = !!profile.intro;
  const displayName = profile.displayName || profile.name || user?.preferred_username || user?.email || 'Tài khoản Nyxoris';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => {
        sessionStorage.setItem("hasUnlockedIntro", "true");
        const redirectPath = sessionStorage.getItem("introRedirectPath") || '/profile';
        sessionStorage.removeItem("introRedirectPath");
        navigate(redirectPath);
      }}
      className="group fixed inset-0 z-50 flex flex-col bg-background overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-500 cursor-pointer select-none"
    >
      {/* Fallback Gradient Background (White -> Gray -> Soft Dark/Black in Light Theme) with Grid Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-100 to-zinc-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] opacity-70" />
      </div>

      {/* Background Cover Image with zoom/scale animations and GPU acceleration for maximum sharpness */}
      {hasIntro && (
        <img
          src={profile.intro}
          alt="Cover"
          className="absolute inset-0 size-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] animate-in fade-in zoom-in-102 duration-[1000ms] [transform:translateZ(0)] [will-change:transform] [backface-visibility:hidden]"
        />
      )}
      
      {/* Very soft gradient shadow at the bottom only, keeping 90% of the image completely bright and untouched */}
      {hasIntro && (
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent z-10 animate-in fade-in duration-700" />
      )}

      {/* Bottom Profile Information */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className={`flex items-center gap-3 text-left transition-colors duration-500 ${hasIntro ? 'text-white' : 'text-zinc-800'}`}>
          {profile.avatar || user?.picture ? (
            <img
              src={profile.avatar || user?.picture || ''}
              alt={displayName}
              className={`size-24 rounded-full border-2 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-500 ${hasIntro ? 'border-white/40' : 'border-zinc-200'}`}
            />
          ) : (
            <div className={`size-24 rounded-full border-2 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-500 ${hasIntro ? 'border-white/40 bg-white/10 backdrop-blur-md text-white' : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}>
              <User size={36} strokeWidth={2} />
            </div>
          )}
          <div className="flex flex-col">
            <h1 className={`text-3xl font-extrabold tracking-tight leading-tight transition-colors duration-500 ${hasIntro ? 'text-white drop-shadow-lg' : 'text-zinc-800'}`}>
              {displayName}
            </h1>
          </div>
        </div>
      </div>

      {/* Floating text helper offset to the bottom-right of the cursor pointer */}
      <div 
        className="pointer-events-none fixed z-[60] hidden md:flex items-center text-[10px] font-semibold tracking-wide select-none transition-transform duration-75 ease-out px-2 py-0.5 rounded-md backdrop-blur-[1px]"
        style={{
          left: 'var(--mouse-x, -500px)',
          top: 'var(--mouse-y, -500px)',
          transform: 'translate(12px, 16px)', // Offset to the bottom-right of the cursor tip
          backgroundColor: 'rgba(24, 24, 27, 0.9)',
          color: '#ffffff',
        }}
      >
        Nhấp để tiếp tục
      </div>

      {/* Mobile-only fallback tap text */}
      <div className="absolute bottom-6 right-6 z-20 md:hidden pointer-events-none">
        <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${hasIntro ? 'text-white/50 drop-shadow-sm' : 'text-zinc-400'}`}>
          Chạm để tiếp tục
        </span>
      </div>
    </div>
  );
}
