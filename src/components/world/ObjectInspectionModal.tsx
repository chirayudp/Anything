import React from 'react';
import { createPortal } from 'react-dom';
import { GameLanguage } from '../../types';
import { CityObject } from '../../data/maps/city1Data';
import { Landmark, FileText, Receipt, Compass, X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface ObjectInspectionModalProps {
  object: CityObject;
  language: GameLanguage;
  isCitySolved: boolean;
  onClose: () => void;
  onTransition?: (targetCityId: string) => void;
}

export const ObjectInspectionModal: React.FC<ObjectInspectionModalProps> = ({
  object,
  language,
  isCitySolved,
  onClose,
  onTransition,
}) => {
  const title = object.title[language] || object.title.en;
  const content = object.content[language] || object.content.en;

  const getIcon = () => {
    switch (object.type) {
      case 'kiosk':
        return <Landmark className="w-6 h-6 text-emerald-400" />;
      case 'collectible':
        return <FileText className="w-6 h-6 text-amber-400" />;
      case 'landmark':
        return <Receipt className="w-6 h-6 text-sky-400" />;
      case 'portal':
        return <Compass className="w-6 h-6 text-indigo-400" />;
      default:
        return <FileText className="w-6 h-6 text-amber-400" />;
    }
  };

  const isPortal = object.type === 'portal';

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
            {getIcon()}
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-base leading-snug text-white">{title}</h3>
            {object.details && (
              <span className="inline-block px-2 py-0.5 mt-1 bg-slate-800 text-amber-400 text-[10px] font-semibold rounded uppercase tracking-wider">
                {object.details.category}
              </span>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed mb-4 text-slate-200 whitespace-pre-line font-mono">
          {content}
        </div>

        {/* Financial Lesson Callout */}
        {object.details?.financialLesson && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Financial Takeaway: </span>
              {object.details.financialLesson}
            </div>
          </div>
        )}

        {/* Portal Status or Actions */}
        {isPortal && (
          <div className="mb-4 p-3 rounded-xl border text-xs flex items-center gap-2.5 bg-slate-950/60 border-slate-800">
            {object.id === 'portal_city1_return' || object.id === 'portal_city2_return' || object.id === 'portal_city3_return' ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-300 font-medium">
                  {object.id === 'portal_city1_return' && 'Road back to City 1 (Hostel Commons) is open. Return anytime to explore or speak with seniors.'}
                  {object.id === 'portal_city2_return' && 'Road back to City 2 (Academic Bazaar) is open. Return anytime to explore or speak with seniors.'}
                  {object.id === 'portal_city3_return' && 'Pier ferry back to City 3 (Investment Valley) is open. Return anytime to explore or review.'}
                </span>
              </>
            ) : isCitySolved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-300 font-medium">
                  All city quests completed! Highway passage is fully unlocked.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-300 font-medium">
                  Complete all active city quests first before advancing through this highway portal.
                </span>
              </>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>

          {isPortal && object.id === 'portal_city1_return' && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_hostel_commons');
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Return to City 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPortal && object.id === 'portal_city2_return' && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_academic_bazaar');
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Return to City 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPortal && object.id === 'portal_city3_return' && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_investment_valley');
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Return to City 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPortal && object.id === 'portal_city2_exit' && isCitySolved && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_academic_bazaar');
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Travel to City 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPortal && object.id === 'portal_city3_exit' && isCitySolved && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_investment_valley');
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Travel to City 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPortal && object.id === 'portal_city4_exit' && isCitySolved && onTransition && (
            <button
              onClick={() => {
                onClose();
                onTransition('city_harbor_town');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>Travel to City 4</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const mountNode = document.fullscreenElement || document.body;
  return createPortal(modalContent, mountNode);
};
