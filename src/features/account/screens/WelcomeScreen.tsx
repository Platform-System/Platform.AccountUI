import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth-context';
import { useAccount } from '../hooks/use-account';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useAccount();

  return (
    <div 
      onClick={() => {
        sessionStorage.setItem("hasUnlockedIntro", "true");
        const redirectPath = sessionStorage.getItem("introRedirectPath") || '/profile';
        sessionStorage.removeItem("introRedirectPath");
        navigate(redirectPath);
      }}
      className="group fixed inset-0 z-50 flex flex-col bg-background overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-500 cursor-pointer select-none"
    >
      {/* Background Cover Image with zoom/scale animations and GPU acceleration for maximum sharpness */}
      {profile.intro ? (
        <img
          src={profile.intro}
          alt="Cover"
          className="absolute inset-0 size-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] animate-in zoom-in-102 duration-[1000ms] [transform:translateZ(0)] [will-change:transform] [backface-visibility:hidden]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] transition-all duration-700 group-hover:scale-[1.01]" />
      )}
      
      {/* Very soft gradient shadow at the bottom only, keeping 90% of the image completely bright and untouched */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent z-10" />

      {/* Bottom Profile Information */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="flex items-center gap-3 text-white text-left animate-in slide-in-from-bottom-4 duration-500">
          {profile.avatar || user?.picture ? (
            <img
              src={profile.avatar || user?.picture || ''}
              alt={profile.displayName || user?.name || 'User Avatar'}
              className="size-24 rounded-full border-2 border-white/40 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.3)] animate-in zoom-in-50 duration-700 delay-100"
            />
          ) : (
            <div className="size-24 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)] text-white">
              <User size={36} strokeWidth={2} />
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              {profile.displayName || user?.name || 'Tài khoản Nyxoris'}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
