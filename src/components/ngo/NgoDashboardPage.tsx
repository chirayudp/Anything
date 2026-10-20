import React, { useState, useEffect } from 'react';
import { AuthService, AuthUser } from '../../services/authService';
import { useRouter } from '../../router';
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  LogOut,
  Building2,
  ShieldAlert,
  Info,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface NgoOverviewData {
  organization: {
    id: string;
    name: string;
    code: string;
  };
  overview: {
    totalAssignedStudents: number;
    activeStudentsCount: number;
    overallCompletionRate: number;
    totalEventsLogged: number;
    pillarBreakdown: Record<
      string,
      {
        pillar: string;
        totalAttempts: number;
        bestAttempts: number;
        failedAttempts: number;
        masteryPercentage: number;
      }
    >;
    studentsNeedingSupportCount: number;
    studentsNeedingSupport: Array<{
      studentId: string;
      walletBalance: number;
      emergencyFund: number;
      completedScenariosCount: number;
      failedAttemptsCount: number;
      learningGapsCount: number;
      primaryIndicator: string;
      lastActiveAt: number;
    }>;
    recentEvents: Array<any>;
  };
}

interface StudentListItem {
  studentId: string;
  name: string;
  email: string;
  currentRegionId: string;
  currentCityId: string;
  walletBalance: number;
  emergencyFund: number;
  totalScore: number;
  completedScenariosCount: number;
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  learningGapsCount: number;
  isNeedingSupport: boolean;
  lastActiveAt: number;
  createdAt: number;
}

export const NgoDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => AuthService.getUser());
  const [overview, setOverview] = useState<NgoOverviewData | null>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNeedsSupport, setFilterNeedsSupport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const token = AuthService.getToken();

    if (!token) {
      navigate('/ngo/login');
      return;
    }

    try {
      const [overviewRes, studentsRes] = await Promise.all([
        fetch('/api/ngo/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `/api/ngo/students?q=${encodeURIComponent(searchQuery)}&needsSupport=${filterNeedsSupport}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      if (overviewRes.status === 401 || overviewRes.status === 403) {
        AuthService.logout();
        navigate('/ngo/login');
        return;
      }

      if (!overviewRes.ok || !studentsRes.ok) {
        throw new Error('Failed to load dashboard data from server.');
      }

      let overviewData: any = null;
      let studentsData: any = { students: [] };
      try {
        const overviewText = await overviewRes.text();
        overviewData = overviewText ? JSON.parse(overviewText) : null;
        const studentsText = await studentsRes.text();
        studentsData = studentsText ? JSON.parse(studentsText) : { students: [] };
      } catch (e) {
        throw new Error('Invalid response received from monitoring server.');
      }

      setOverview(overviewData);
      setStudents(studentsData.students || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to monitoring services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterNeedsSupport]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/ngo/login');
  };

  const formatCityName = (cityId: string) => {
    const map: Record<string, string> = {
      city_hostel_commons: 'Hostel Commons',
      city_academic_bazaar: 'Academic Bazaar',
      city_investment_valley: 'Investment Valley',
    };
    return map[cityId] || cityId.replace('city_', '').replace('_', ' ');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top NGO Portal Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white">MoneyQuest Impact Suite</h1>
                {overview && (
                  <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                    {overview.organization.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Authorized Cohort Monitoring & Educational Intervention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.name || 'Staff Member'}</div>
              <div className="text-[11px] text-slate-400">{user?.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-xs text-rose-200 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={fetchDashboardData}
              className="text-xs font-bold underline text-rose-300 hover:text-white ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Overview Metric KPI Cards */}
        {overview && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold">Assigned Cohort</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {overview.overview.totalAssignedStudents}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <span>{overview.overview.activeStudentsCount} active this week</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold">Curriculum Progression</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {overview.overview.overallCompletionRate}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Across 15 City Scenarios</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold">Need Support Flag</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                {overview.overview.studentsNeedingSupportCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Require remedial coaching</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold">Audit Event Stream</span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-sky-400">
                {overview.overview.totalEventsLogged}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Logged financial decisions</div>
            </div>
          </div>
        )}

        {/* 4 Financial Literacy Curriculum Pillars */}
        {overview && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Curriculum Pillar Mastery Across Cohort</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregate concept mastery calculated from optimal choices vs trap retries
                </p>
              </div>
              <div className="text-[11px] bg-slate-950 px-3 py-1 rounded-xl text-slate-400 border border-slate-800 flex items-center gap-1.5 self-start sm:self-auto">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Deterministic game metrics, not diagnostic certification</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(overview.overview.pillarBreakdown).map(([pillarKey, data]) => {
                const labelMap: Record<string, { title: string; desc: string }> = {
                  budget: {
                    title: '1. Plan & Budget',
                    desc: 'Needs vs Wants, 50-30-20 rule, hostel fees',
                  },
                  save: {
                    title: '2. Save & Manage',
                    desc: 'Emergency buffers, phone repairs, bank deposits',
                  },
                  invest: {
                    title: '3. Understand Investing',
                    desc: 'Compounding, time horizon, beating inflation',
                  },
                  safety: {
                    title: '4. Stay Financially Safe',
                    desc: 'UPI QR traps, phishing links, helpline 1930',
                  },
                };

                const info = labelMap[pillarKey] || {
                  title: pillarKey,
                  desc: 'Financial literacy concept',
                };

                return (
                  <div
                    key={pillarKey}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-white">{info.title}</span>
                        <span className="text-indigo-400 font-black">{data.masteryPercentage}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">{info.desc}</p>
                    </div>

                    <div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.masteryPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Best: {data.bestAttempts}</span>
                        <span>Traps: {data.failedAttempts}</span>
                        <span>Total: {data.totalAttempts}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Students Requiring Additional Support Callout */}
        {overview && overview.overview.studentsNeedingSupport.length > 0 && (
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-amber-200">
                Actionable Attention List ({overview.overview.studentsNeedingSupport.length} Scholars)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Identified through transparent learning signals (stipend depletion, recurring traps, or high retry friction) to guide educator intervention.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {overview.overview.studentsNeedingSupport.map((stu) => (
                <div
                  key={stu.studentId}
                  onClick={() => navigate(`/ngo/students/${stu.studentId}`)}
                  className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-4 cursor-pointer transition hover:scale-[1.02] flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-amber-300 transition">
                      {stu.studentId}
                    </div>
                    <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                      {stu.primaryIndicator}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Wallet: ₹{stu.walletBalance} • Reserve: ₹{stu.emergencyFund}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Student Roster Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Assigned Student Roster</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authorized cohort members in your monitoring jurisdiction
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, name, city..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </form>

              <button
                type="button"
                onClick={() => setFilterNeedsSupport(!filterNeedsSupport)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  filterNeedsSupport
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Needs Support</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Scholar Name</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Wallet</th>
                  <th className="py-3 px-3">Reserve</th>
                  <th className="py-3 px-3">Scenarios</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                      {isLoading ? 'Loading student cohort...' : 'No matching students found in your organization.'}
                    </td>
                  </tr>
                ) : (
                  students.map((stu) => (
                    <tr
                      key={stu.studentId}
                      className="hover:bg-slate-950/50 transition cursor-pointer"
                      onClick={() => navigate(`/ngo/students/${stu.studentId}`)}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-indigo-300">
                        {stu.studentId}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {stu.name}
                        {stu.email && (
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {stu.email}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {formatCityName(stu.currentCityId)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={stu.walletBalance <= 0 ? 'text-rose-400' : 'text-emerald-400'}>
                          ₹{stu.walletBalance.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-sky-400">
                        ₹{stu.emergencyFund.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {stu.completedScenariosCount} / 15
                      </td>
                      <td className="py-3 px-3">
                        {stu.isNeedingSupport ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/40">
                            Needs Support
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            On Track
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ngo/students/${stu.studentId}`);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <span>Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pedagogical Notice */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200">Educator Evaluation Guidance:</span> Game
            choices reflect simulated behavioral trade-offs designed for Class 11-12 context in
            Hyderabad. Decisions should be interpreted as formative learning milestones to direct
            mentorship conversations rather than summative financial credit ratings.
          </div>
        </div>
      </main>
    </div>
  );
};
