import React, { useState } from 'react';
import { StudentProfile, GameLanguage } from '../../types';
import { REGIONS, CITIES } from '../../data/regions';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from './audioManager';
import {
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Shield,
  TrendingUp,
  MapPin,
  X,
  ArrowRight,
} from 'lucide-react';

interface RegionQuestPanelProps {
  profile: StudentProfile;
  language: GameLanguage;
  isOpen: boolean;
  onClose: () => void;
  onSelectCity?: (cityId: string) => void;
}

export const RegionQuestPanel: React.FC<RegionQuestPanelProps> = ({
  profile,
  language,
  isOpen,
  onClose,
  onSelectCity,
}) => {
  const t = TRANSLATIONS[language].regions;
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    profile.currentRegionId || 'region_scholars_district'
  );
  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    profile.currentCityId || 'city_hostel_commons'
  );

  if (!isOpen) return null;

  const currentRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
  const regionCities = currentRegion.cityIds.map((id) => CITIES[id]).filter(Boolean);
  const activeCityData = selectedCityId ? CITIES[selectedCityId] : regionCities[0];

  const getPillarBadge = (pillar: string) => {
    switch (pillar) {
      case 'budget':
        return { label: 'Plan & Budget', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300' };
      case 'save':
        return { label: 'Save & Manage', color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' };
      case 'invest':
        return { label: 'Understand Investing', color: 'bg-sky-950/60 border-sky-500/40 text-sky-300' };
      case 'safety':
        return { label: 'Stay Financially Safe', color: 'bg-purple-950/60 border-purple-500/40 text-purple-300' };
      default:
        return { label: 'Financial Literacy', color: 'bg-slate-800 border-slate-700 text-slate-300' };
    }
  };

  const isCityUnlocked = (cityId: string, requiredPredecessorId?: string) => {
    if (!requiredPredecessorId) return true;
    return profile.completedCityIds.includes(requiredPredecessorId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-4xl w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-sky-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Panel Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{t.panelTitle}</h3>
            <p className="text-xs text-slate-400">{t.panelSub}</p>
          </div>
        </div>

        {/* Region Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {REGIONS.map((region, idx) => {
            const isSelected = region.id === selectedRegionId;
            const completedCount = region.cityIds.filter((cid) =>
              profile.completedCityIds.includes(cid)
            ).length;

            return (
              <button
                key={region.id}
                onClick={() => {
                  audioManager.playClick();
                  setSelectedRegionId(region.id);
                  setSelectedCityId(region.cityIds[0]);
                }}
                className={`p-3 rounded-2xl border text-left transition relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 bg-slate-950 shadow-lg ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1">
                  Region 0{idx + 1}
                </div>
                <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {region.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{region.cityIds.length} Cities</span>
                  <span className="font-semibold text-emerald-400">
                    {completedCount}/{region.cityIds.length} done
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Cities List & City Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Cities List Column (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Cities in {currentRegion.name}
            </div>

            {regionCities.map((city, idx) => {
              const isCompleted = profile.completedCityIds.includes(city.id);
              const unlocked = isCityUnlocked(city.id, city.requiredPredecessorId);
              const isSelected = selectedCityId === city.id;

              return (
                <button
                  key={city.id}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedCityId(city.id);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'border-amber-500/80 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{city.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {city.pillar} pillar
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : unlocked ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active City Detail Card (7 cols) */}
          <div className="md:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            {activeCityData ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border mb-2 ${
                        getPillarBadge(activeCityData.pillar).color
                      }`}
                    >
                      {getPillarBadge(activeCityData.pillar).label}
                    </span>
                    <h4 className="text-xl font-extrabold text-white">{activeCityData.name}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {t.rewardPoints}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeCityData.description}
                </p>

                {/* Status & Prerequisite */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status:</span>
                    {profile.completedCityIds.includes(activeCityData.id) ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.statusCompleted}
                      </span>
                    ) : isCityUnlocked(activeCityData.id, activeCityData.requiredPredecessorId) ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {t.statusCurrent}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> {t.statusLocked}
                      </span>
                    )}
                  </div>

                  {activeCityData.requiredPredecessorId && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Requirement:</span>
                      <span className="text-slate-300">
                        Complete {CITIES[activeCityData.requiredPredecessorId]?.name || 'Predecessor'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => {
                  audioManager.playClick();
                  if (activeCityData && onSelectCity) {
                    onSelectCity(activeCityData.id);
                  }
                  onClose();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <span>{t.exploreCityBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
