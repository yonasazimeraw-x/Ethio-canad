import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Clock } from 'lucide-react';

interface ProgressSectionProps {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
  onResetAll: () => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  total,
  completed,
  remaining,
  percentage,
  onResetAll,
}) => {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleResetClick = () => {
    if (completed === 0) return;
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    setConfirmingReset(false);
    onResetAll();
  };

  return (
    <section
      aria-label="የአሻራ ማስገቢያ ሂደት"
      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Progress Headline & Readout */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
            <span className="font-medium text-[#078930]">የምዝገባ ሂደት · Submission Progress</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-slate-800">
              {completed}/{total} ተጠናቋል ({completed}/{total} Completed — {percentage}%)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {completed === total
              ? 'ሁሉም አምስቱ የጣት አሻራዎች ተመዝግበዋል'
              : `አሻራ የማስገባት ሂደት — ${percentage}% ተጠናቋል`}
          </h2>
        </div>

        {/* Metrics & Reset Control */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-5 text-sm">
            <div>
              <p className="text-[11px] text-slate-500">ጠቅላላ (Total)</p>
              <p className="font-mono-tabular font-bold text-slate-900 text-base">{total}</p>
            </div>
            <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
            <div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#078930]" />
                <span>የተጠናቀቁ (Done)</span>
              </p>
              <p className="font-mono-tabular font-bold text-[#078930] text-base">{completed}</p>
            </div>
            <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
            <div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>የቀሩ (Remaining)</span>
              </p>
              <p className="font-mono-tabular font-bold text-slate-800 text-base">{remaining}</p>
            </div>
          </div>

          {completed > 0 && (
            <div className="flex items-center gap-2">
              {confirmingReset ? (
                <>
                  <button
                    type="button"
                    onClick={handleResetClick}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#DA121A] text-white hover:bg-[#B80E15] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    እርግጠኛ ነኝ፣ ዳግም አስጀምር
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    ተው
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleResetClick}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>እንደገና ጀምር (Reset)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="mt-4">
        <div
          className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/70"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`የተጠናቀቁ አሻራዎች ${percentage}%`}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background:
                percentage === 100
                  ? '#078930'
                  : 'linear-gradient(90deg, #078930 0%, #10A343 68%, #EAB308 100%)',
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {completed === 0
              ? 'ለመጀመር ከዚህ በታች ከሚገኙት አምስት ጣቶች የመጀመሪያውን ይምረጡ።'
              : completed === total
                ? 'ሁሉም አምስቱም ጣቶች በተሳካ ሁኔታ ተመዝግበዋል።'
                : `ቀሪ ${remaining} የጣት አሻራ${remaining > 1 ? 'ዎች' : ''} ይቀራሉ።`}
          </span>
          <span className="font-mono-tabular font-semibold text-slate-700">
            {percentage}%
          </span>
        </div>
      </div>
    </section>
  );
};
