import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { useRouter } from '../../router';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Award,
  Wallet,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Clock,
  Compass,
} from 'lucide-react';

interface StudentDetailData {
  student: {
    studentId: string;
    name: string;
    email: string;
    organizationId: string;
    preferredLanguage: string;
    currentRegionId: string;
    currentCityId: string;
    walletBalance: number;
    emergencyFund: number;
    totalScore: number;
    completedCityIds: string[];
    completedScenarioIds: string[];
    badges: string[];
    createdAt: number;
    lastActiveAt: number;
  };
  performanceByPillar: Record<
    string,
    {
      pillar: string;
      totalAttempts: number;
      bestChoices: number;
      moderateChoices: number;
      failedChoices: number;
      hintsUsed: number;
      masteryRate: number;
    }
  >;
  learningGaps: Array<{
    pillar: string;
    errorFrequency: number;
    recurringPattern: string;
    recommendedTopic: string;
    resourceTitle: string;
  }>;
  events: Array<any>;
  auditSummary: {
    totalDecisions: number;
    totalRetries: number;
    totalTrapsEncountered: number;
    totalHintsRequested: number;
  };
}

export const NgoStudentDetailPage: React.FC<{ studentId: string }> = ({ studentId }) => {
  const { navigate } = useRouter();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchStudentData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsUnauthorized(false);
    const token = AuthService.getToken();

    if (!token) {
      navigate('/ngo/login');
      return;
    }

    try {
      const res = await fetch(`/api/ngo/students/${encodeURIComponent(studentId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setIsUnauthorized(true);
        setErrorMsg('Access Denied: This student is outside your organization authorization scope.');
        return;
      }

      if (res.status === 404) {
        setErrorMsg(`Student ${studentId} not found.`);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load student profile.');
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      setData(json);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading student details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const formatCityName = (cityId: string) => {
    const map: Record<string, string> = {
      city_hostel_commons: 'Hostel Commons (Awakening)',
      city_academic_bazaar: 'Academic Bazaar (Needs vs Wants)',
      city_investment_valley: 'Investment Valley (Compounding & Returns)',
    };
    return map[cityId] || cityId.replace('city_', '').replace('_', ' ');
  };

  const pillarTitleMap: Record<string, string> = {
    budget: 'Pillar 1: Planning & Budgeting',
    save: 'Pillar 2: Saving & Managing',
    invest: 'Pillar 3: Understanding Investing',
    safety: 'Pillar 4: Financial Safety & Fraud Defense',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading authorized student records ({studentId})...</p>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">403 Forbidden: Scope Violation</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You do not have authorization to view student <span className="font-mono text-rose-300 font-bold">{studentId}</span>.
            Under data protection guidelines, NGO personnel may only inspect students assigned to their institutional cohort.
          </p>
          <button
            onClick={() => navigate('/ngo/dashboard')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to NGO Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Notice</h2>
          <p className="text-xs text-slate-400">{errorMsg || 'Student record not found.'}</p>
          <button
            onClick={() => navigate('/ngo/dashboard')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { student, performanceByPillar, learningGaps, events, auditSummary } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/ngo/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to NGO Cohort Roster</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              {student.studentId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Student Profile Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-indigo-400/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-2xl font-black shrink-0">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{student.name}</h1>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950 border border-indigo-500/40 px-2.5 py-0.5 rounded-full">
                    {student.studentId}
                  </span>
                  {student.walletBalance <= 0 ? (
                    <span className="text-[11px] font-black text-rose-400 bg-rose-950/80 border border-rose-500/50 px-2 py-0.5 rounded-full">
                      BANKRUPTCY ALERT
                    </span>
                  ) : (
                    <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      ACTIVE SCHOLAR
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Email: {student.email || 'N/A'}</span>
                  <span>•</span>
                  <span>Registered: {new Date(student.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Last Active: {new Date(student.lastActiveAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Balance HUD */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Wallet</span>
                <span
                  className={`text-base font-black ${
                    student.walletBalance <= 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  ₹{student.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Emergency Fund</span>
                <span className="text-base font-black text-sky-400">
                  ₹{student.emergencyFund.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Literacy Score</span>
                <span className="text-base font-black text-amber-400">
                  {student.totalScore} pts
                </span>
              </div>
            </div>
          </div>

          {/* Current City & Badges Row */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-400">Current Exploration:</span>
              <span className="font-bold text-white">{formatCityName(student.currentCityId)}</span>
            </div>

            {student.badges && student.badges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Award className="w-4 h-4 text-sky-400" />
                <span className="text-slate-400 mr-1">Earned Badges:</span>
                {student.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Decisions Logged</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{auditSummary.totalDecisions}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Retries Attempted</span>
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{auditSummary.totalRetries}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Scam/Trap States Hit</span>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{auditSummary.totalTrapsEncountered}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Hints Requested</span>
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400">{auditSummary.totalHintsRequested}</div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Pillar-Wise Concept Breakdown</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(performanceByPillar).map(([pillarKey, pData]) => (
              <div
                key={pillarKey}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{pillarTitleMap[pillarKey] || pillarKey}</span>
                  <span className="text-indigo-400">{pData.masteryRate}%</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full"
                    style={{ width: `${pData.masteryRate}%` }}
                  />
                </div>

                <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Optimal Choices:</span>
                    <span className="text-emerald-400 font-bold">{pData.bestChoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suboptimal Choices:</span>
                    <span className="text-slate-300 font-bold">{pData.moderateChoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trap Mistakes:</span>
                    <span className="text-rose-400 font-bold">{pData.failedChoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hints Used:</span>
                    <span className="text-sky-400 font-bold">{pData.hintsUsed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Student Learning Gaps */}
        {learningGaps.length > 0 && (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 sm:p-7">
            <h2 className="text-base font-bold text-rose-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Flagged Concepts Requiring Practice ({learningGaps.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Identified through repeated suboptimal or trap decision patterns in gameplay.
            </p>

            <div className="space-y-3">
              {learningGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-rose-500/20 rounded-2xl p-4 text-xs space-y-1.5"
                >
                  <div className="font-bold text-rose-200 flex items-center justify-between">
                    <span>{pillarTitleMap[gap.pillar] || gap.pillar.toUpperCase()}</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">
                      {gap.errorFrequency} repeated slip-ups
                    </span>
                  </div>
                  <p className="text-slate-300">{gap.recurringPattern}</p>
                  <div className="text-emerald-400 font-semibold pt-1">
                    Recommended Educator Prompt: {gap.recommendedTopic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chronological Decision History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Chronological Decision Stream (Simulated Financial Consequences)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Scenario</th>
                  <th className="py-2.5 px-3">Pillar</th>
                  <th className="py-2.5 px-3">Choice Tier</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3">Financial Impact</th>
                  <th className="py-2.5 px-3">Retry?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500 italic">
                      No decisions recorded yet for this student.
                    </td>
                  </tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.eventId} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(evt.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {evt.scenarioId || 'General Exploration'}
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-indigo-300">
                        {evt.pillar || 'General'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            evt.tier === 'best'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : evt.tier === 'good' || evt.tier === 'better'
                              ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {evt.tier || 'action'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        {evt.isFailedState ? (
                          <span className="text-rose-400">Trap Hit</span>
                        ) : (
                          <span className="text-emerald-400">Passed</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {evt.financialImpact ? (
                          <span>
                            {evt.financialImpact.walletDelta < 0 ? '-' : '+'}₹
                            {Math.abs(evt.financialImpact.walletDelta)} wallet
                            {evt.financialImpact.emergencyDelta !== 0 && (
                              <span className="text-sky-400 ml-1">
                                ({evt.financialImpact.emergencyDelta > 0 ? '+' : ''}₹
                                {evt.financialImpact.emergencyDelta} reserve)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {evt.isRetry ? `Yes (#${evt.retryAttemptNumber})` : 'First Try'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
