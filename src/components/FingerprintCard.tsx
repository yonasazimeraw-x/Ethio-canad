import React from 'react';
import { CheckCircle2, Clock, Fingerprint, Eye } from 'lucide-react';
import { FingerDefinition, FingerSubmission } from '../types/fingerprint';
import { FingerprintGraphic } from './FingerprintGraphic';

interface FingerprintCardProps {
  finger: FingerDefinition;
  submission?: FingerSubmission;
  isNextInSequence: boolean;
  onOpenModal: (finger: FingerDefinition) => void;
}

export const FingerprintCard: React.FC<FingerprintCardProps> = ({
  finger,
  submission,
  isNextInSequence,
  onOpenModal,
}) => {
  const isCompleted = Boolean(submission);

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
        isCompleted
          ? 'bg-emerald-50/40 border-[#078930]/35 shadow-xs'
          : isNextInSequence
            ? 'bg-white border-amber-400/80 shadow-sm ring-2 ring-amber-400/15'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Top Row: Sequential Index + Status Text (Zero-pill clean typography) */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-mono-tabular font-semibold text-slate-500">
          0{finger.order} / 05
          {isNextInSequence && !isCompleted && (
            <span className="ml-2 text-amber-700 font-sans font-semibold">
              · ቀጣይ ተራ
            </span>
          )}
        </span>

        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#078930]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ተጠናቋል · Completed</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>በመጠባበቅ ላይ · Pending</span>
          </span>
        )}
      </div>

      {/* Center: Fingerprint Illustration & Completion Animation */}
      <div className="flex flex-col items-center text-center my-2">
        <div
          onClick={() => onOpenModal(finger)}
          className={`relative flex items-center justify-center w-28 h-32 rounded-xl transition-transform duration-200 cursor-pointer group-hover:scale-[1.03] ${
            isCompleted ? 'bg-white/90 border border-[#078930]/20' : 'bg-slate-50/80 border border-slate-100'
          }`}
        >
          {submission?.previewUrl ? (
            <img
              src={submission.previewUrl}
              alt={`${finger.amharicName} የጣት አሻራ`}
              referrerPolicy="no-referrer"
              className="w-20 h-24 object-cover rounded-lg opacity-90"
            />
          ) : (
            <FingerprintGraphic
              pattern={finger.ridgePattern}
              state={isCompleted ? 'completed' : 'pending'}
              size={92}
            />
          )}

          {isCompleted && (
            <div
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#078930] text-white flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Finger Names */}
        <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">
          {finger.amharicName}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          {finger.englishName}
        </p>

        {/* Visual Progress Bar inside Card */}
        <div className="w-full mt-4">
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isCompleted ? 'w-full bg-[#078930]' : 'w-0 bg-amber-400'
              }`}
            />
          </div>
          {submission && (
            <p className="mt-1.5 text-[11px] font-mono-tabular text-slate-500 truncate">
              መለያ: {submission.referenceCode}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {isCompleted ? (
          <button
            type="button"
            onClick={() => onOpenModal(finger)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-100/80 text-[#078930] hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>ተመዝግቧል · ዝርዝር ይመልከቱ</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenModal(finger)}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-[0.98] ${
              isNextInSequence
                ? 'bg-[#078930] text-white hover:bg-[#067027] shadow-xs'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Fingerprint className="w-4 h-4 shrink-0" />
            <span>አሻራ ይስጡ</span>
          </button>
        )}
      </div>
    </article>
  );
};
