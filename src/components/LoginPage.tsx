import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase'; // NAYA: Supabase Import

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // NAYA: Asli Supabase Authentication Function
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Login Failed: " + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      onLogin(); // Yeh call hotay hi App.tsx dashboard khol dega
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          {/* Logo with intense glow */}
          <div className="relative">
            {/* Outer glow layers */}
            <div className="absolute -inset-8 bg-yellow-400/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute -inset-6 bg-amber-400/30 blur-2xl rounded-full" />
            <div className="absolute -inset-4 bg-yellow-300/40 blur-xl rounded-full" />
            <div className="absolute -inset-3 bg-yellow-400/50 blur-lg rounded-full" />

            {/* Logo image */}
            <div className="relative">
              <img
                src="https://i.postimg.cc/pXT8p6Hw/AL-BURHAN-LOGO.png"
                alt="Al-Burhan"
                className="h-32 w-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Al-Burhan
            </h1>
            <p className="text-lg text-slate-300 font-light tracking-wide">
              Campaign Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-yellow-400/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-yellow-400/50" />
          </div>

          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Empowering communities through data-driven campaign management and strategic outreach.
          </p>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-slate-500 tracking-widest uppercase">
            Secure • Reliable • Scalable
          </p>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10"
        style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)' }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute -inset-3 bg-yellow-400/30 blur-lg rounded-full" />
              <img
                src="https://i.postimg.cc/pXT8p6Hw/AL-BURHAN-LOGO.png"
                alt="Al-Burhan"
                className="relative h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-xl font-bold text-slate-800">Al-Burhan</span>
          </div>

          {/* Glass card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@alburhan.org"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-slate-50/80 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm bg-slate-50/80 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-500">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">SECURE LOGIN</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            {/* Asli login hint */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium mb-1">Live Database Connected</p>
              <p className="text-xs text-emerald-500">Use your registered admin email and password.</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Al-Burhan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}