import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { useRouter } from '../../router';
import { audioManager } from '../ui/audioManager';
import {
  Sparkles,
  Lock,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Gamepad2,
} from 'lucide-react';
import titleScreenImg from '../../assets/ui/title_screen.jpg';

const AVATARS = [
  { id: 'avatar_arjun', name: 'Arjun (The Scholar)', icon: '👨‍🎓', desc: 'Diligent note-taker, careful with mess bills' },
  { id: 'avatar_priya', name: 'Priya (The Tech Whiz)', icon: '👩‍💻', desc: 'Code lover, passionate about cyber scam defense' },
  { id: 'avatar_rahul', name: 'Rahul (The Saver)', icon: '🧑‍💼', desc: 'Invests early, masters compound interest' },
  { id: 'avatar_aisha', name: 'Aisha (The Guardian)', icon: '👩‍🔬', desc: 'Protects peers from deceptive UPI schemes' },
];

export const StudentLoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      audioManager.playClick();
      await AuthService.login(email.trim(), password, 'student');
      audioManager.playFanfare();
      navigate('/game');
    } catch (err: any) {
      audioManager.playError();
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      audioManager.playClick();
      await AuthService.registerStudent({
        email: email.trim(),
        password,
        name: name.trim(),
        avatar: selectedAvatar,
      });
      audioManager.playFanfare();
      navigate('/game');
    } catch (err: any) {
      audioManager.playError();
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoStudent = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Scholar@123');
    setErrorMsg(null);
    setIsLoading(true);
    try {
      audioManager.playClick();
      await AuthService.login(demoEmail, 'Scholar@123', 'student');
      audioManager.playFanfare();
      navigate('/game');
    } catch (err: any) {
      audioManager.playError();
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    audioManager.playClick();
    setTimeout(async () => {
      // Simulate Google Sign-In provider convenience authentication
      try {
        await AuthService.login('arjun@student.in', 'Scholar@123', 'student');
        audioManager.playFanfare();
        navigate('/game');
      } catch (e: any) {
        setErrorMsg('Google Sign-In service unavailable. Please use email & password.');
      } finally {
        setIsGoogleLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full relative bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950 overflow-y-auto">
      {/* Background artwork with dark overlay vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={titleScreenImg}
          alt="MoneyQuest Background"
          className="w-full h-full object-cover filter blur-sm scale-105 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
      </div>

      <div className="max-w-md w-full relative z-10 my-8">
        {/* Game Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 text-3xl shadow-xl shadow-amber-500/20 mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
            🪙
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 tracking-tight">
            MoneyQuest
          </h1>
          <p className="text-xs text-amber-200/80 font-medium tracking-wide mt-1">
            Student Financial-Literacy Adventure • Class 11-12 Edition
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Tab Selector: Login vs Register */}
          <div className="flex rounded-2xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                setIsRegister(false);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                !isRegister
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                setIsRegister(true);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                isRegister
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Scholar Registration
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isRegister ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arjun@student.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
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
                    placeholder="Enter your password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              {/* Fast Demo Autofill Helper */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block mb-1.5">Quick Demo Scholars:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoStudent('arjun@student.in')}
                    className="flex-1 text-[10px] py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 transition"
                  >
                    Arjun (STU-1042)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoStudent('priya@student.in')}
                    className="flex-1 text-[10px] py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 transition"
                  >
                    Priya (STU-2088)
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Entering Quest...</span>
                ) : (
                  <>
                    <span>Enter Money Quest</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Google Sign-In Convenience Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900 px-2 text-slate-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name / Scholar Alias
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Reddy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@telangana.edu.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Choose Your Character
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        audioManager.playClick();
                        setSelectedAvatar(av.id);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                        selectedAvatar === av.id
                          ? 'border-amber-500 bg-amber-500/15 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200">{av.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-400 truncate">{av.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stipend Banner */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Automatic Scholarship Grant:</span>
                <span className="font-extrabold text-emerald-400">₹5,000 / mo</span>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Account & Start Quest</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy Footnote */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Safe Educational Privacy</span>
            </div>
            <a
              href="/ngo/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/ngo/login');
              }}
              className="text-indigo-400 hover:text-indigo-300 hover:underline transition"
            >
              NGO Personnel Login →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
