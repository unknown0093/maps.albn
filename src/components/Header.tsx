import { ChevronDown, User, LogOut, LogIn } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  time: string;
  headerAnimating: 'visible' | 'hidden' | 'none';
  darkMode: boolean;
  onToggleHeader: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  time,
  headerAnimating,
  darkMode,
  onToggleHeader,
  isLoggedIn,
  onLogin,
  onLogout,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const animClass =
    headerAnimating === 'visible'
      ? 'animate-slide-down'
      : headerAnimating === 'hidden'
      ? 'animate-slide-up'
      : '';

  return (
    <div
      className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 ${animClass}`}
      style={{ animationDuration: '0.3s' }}
    >
      <div
        className={`flex items-center justify-between h-14 rounded-full px-6 gap-4 shadow-lg transition-all duration-300 ${
          darkMode
            ? 'bg-slate-800/80 backdrop-blur-xl border border-white/10'
            : 'bg-white/70 backdrop-blur-xl border border-white/40'
        }`}
        style={{ maxWidth: '56rem' }}
      >
        {/* Logo */}
        <div className="relative flex items-center gap-2 shrink-0">
          {/* Glow effect behind logo */}
          <div className="absolute -inset-2 bg-yellow-400/40 blur-xl rounded-full animate-pulse-glow" />
          <div className="relative flex items-center gap-2">
            <img
              src="https://i.postimg.cc/pXT8p6Hw/AL-BURHAN-LOGO.png"
              alt="Al-Burhan"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span
              className={`text-lg font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              Al-Burhan
            </span>
          </div>
        </div>

        {/* Center - Search placeholder */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={darkMode ? 'text-slate-400' : 'text-slate-400'}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search locations, zones, campaigns..."
            className={`w-full bg-transparent outline-none text-sm ${
              darkMode
                ? 'text-white placeholder:text-slate-400'
                : 'text-slate-700 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Clock */}
          <div
            className={`text-sm font-mono font-semibold tabular-nums ${
              darkMode ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            {time}
          </div>

          {/* Auth section */}
          {isLoggedIn ? (
            /* User Profile */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <User size={16} />
                <span>Admin</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-44 rounded-xl shadow-xl overflow-hidden z-50 ${
                    darkMode
                      ? 'bg-slate-800/95 backdrop-blur-xl border border-white/10'
                      : 'bg-white/95 backdrop-blur-xl border border-slate-200'
                  }`}
                >
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Admin User
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      admin@alburhan.org
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login Button */
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/25 active:scale-[0.97]"
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          )}

          {/* Hide Header Toggle */}
          <button
            onClick={onToggleHeader}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              darkMode
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80'
            }`}
            title="Hide Header"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
