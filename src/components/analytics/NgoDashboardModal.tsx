import React from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { EventLogger } from '../../engine/eventLogger';
import { StudentProfile } from '../../types';
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  X,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface NgoDashboardModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

export const NgoDashboardModal: React.FC<NgoDashboardModalProps> = ({ profile, onClose }) => {
  const overview = AnalyticsService.getOverview();
  const learningGaps = EventLogger.detectLearningGaps(profile.studentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              NGO Educational Analytics & Decision History
            </h2>
            <p className="text-xs text-slate-400">
              Community Stewardship Evaluation Portal • Authorized Program Data
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{overview.totalUniqueStudents}</div>
            <div className="text-[11px] text-slate-400 mt-1">Pseudonymous Cohort</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Passed Decisions</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {overview.totalCompletedScenarios}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Constructive choices</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Failed Traps</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{overview.totalFailedStates}</div>
            <div className="text-[11px] text-slate-400 mt-1">Learning opportunities</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Recovery Rate</span>
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {overview.overallRecoveryRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Retry success rate</div>
          </div>
        </div>

        {/* Pillar Mastery Progress Bars */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Curriculum Pillar Mastery</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(overview.pillarBreakdown).map(([pillarKey, data]) => {
              const labelMap: Record<string, string> = {
                budget: 'Plan & Budget',
                save: 'Save & Manage',
                invest: 'Understand Investing',
                safety: 'Stay Financially Safe',
              };

              return (
                <div key={pillarKey} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-200">{labelMap[pillarKey] || pillarKey}</span>
                    <span className="text-amber-400">{data.masteryPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.masteryPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>Best: {data.bestAttempts}</span>
                    <span>Traps Hit: {data.failedAttempts}</span>
                    <span>Total Attempts: {data.totalAttempts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Detected Learning Gaps (Individual Adaptive Support) */}
        {learningGaps.length > 0 && (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold text-rose-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Active Student Learning Gaps Detected ({profile.studentId})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Identified from repeated decision patterns to guide targeted remedial coaching.
            </p>

            <div className="space-y-2.5">
              {learningGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-3 text-xs"
                >
                  <div className="font-bold text-rose-200 mb-1">
                    Pillar: {gap.pillar.toUpperCase()} ({gap.errorFrequency} repeated slip-ups)
                  </div>
                  <div className="text-slate-300 mb-1.5">{gap.recurringPattern}</div>
                  <div className="text-emerald-400 font-medium">
                    Recommended Action: {gap.recommendedTopic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chronological Decision Log Table */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-white mb-3">
            Chronological Decision Stream (Audit Trail)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Student</th>
                  <th className="py-2 px-3">Scenario</th>
                  <th className="py-2 px-3">Tier</th>
                  <th className="py-2 px-3">Outcome</th>
                  <th className="py-2 px-3">Delta</th>
                  <th className="py-2 px-3">Retry?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {overview.recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-500 italic">
                      No gameplay decisions recorded yet. Start an adventure to populate the stream.
                    </td>
                  </tr>
                ) : (
                  overview.recentEvents.map((evt) => (
                    <tr key={evt.eventId} className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-mono text-slate-400">{evt.studentId}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">{evt.scenarioId}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            evt.tier === 'best'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : evt.tier === 'better'
                              ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                              : evt.tier === 'good'
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {evt.tier}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {evt.isFailedState ? (
                          <span className="text-rose-400 font-semibold">Trapped</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Passed</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono">
                        {evt.financialImpact.walletDelta < 0 ? '-' : '+'}₹
                        {Math.abs(evt.financialImpact.walletDelta)}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {evt.isRetry ? `Yes (#${evt.retryAttemptNumber})` : 'Initial'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
