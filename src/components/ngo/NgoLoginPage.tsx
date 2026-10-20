import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { useRouter } from '../../router';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Users,
  LineChart,
} from 'lucide-react';

export const NgoLoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await AuthService.login(email, password, 'ngo_staff');
      navigate('/ngo/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your staff credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = async (staffEmail: string, pass: string = 'NgoStaff@2026') => {
    setEmail(staffEmail);
    setPassword(pass);
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await AuthService.login(staffEmail.trim(), pass, 'ngo_staff');
      navigate('/ngo/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Staff login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white">MoneyQuest Impact Suite</h1>
            <p className="text-xs text-slate-400">Authorized NGO Monitoring & Stewardship Portal</p>
          </div>
        </div>

        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Return to Student Game Portal
        </a>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md w-full mx-auto my-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* Header */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <LineChart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">NGO Personnel Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">
              Access real-time student learning indicators and curriculum analytics.
            </p>
          </div>

          {/* Feedback alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. staff@vanguard.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Quick Demo Autofill */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1.5">Authorized Demo Logins:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('staff@vanguard.org')}
                  className="text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 text-left transition"
                >
                  <div className="font-bold">Vanguard Officer</div>
                  <div className="text-[9px] text-slate-400">staff@vanguard.org</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('mentor@pratham.org', 'NgoMentor@2026')}
                  className="text-[11px] py-1.5 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 text-left transition"
                >
                  <div className="font-bold">Pratham Mentor</div>
                  <div className="text-[9px] text-slate-400">mentor@pratham.org</div>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access NGO Monitoring Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Restricted portal. Session activity is audited under institutional child safety and data governance policies.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        MoneyQuest Educational Analytics Platform • Designed for NGO Partner Cohort Oversight
      </footer>
    </div>
  );
};
