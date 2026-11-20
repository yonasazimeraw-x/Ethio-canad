import React from 'react';
import { Check } from 'lucide-react';
import { FINGER_DEFINITIONS } from '../data/fingers';
import { FingerId, FingerSubmissionMap } from '../types/fingerprint';

interface HandDiagramProps {
  submissions: FingerSubmissionMap;
  nextPendingId: FingerId | null;
  onSelectFinger: (fingerId: FingerId) => void;
}

interface FingerNodePosition {
  id: FingerId;
  cx: number;
  cy: number;
  labelX: number;
  labelY: number;
}

const FINGER_NODES: FingerNodePosition[] = [
  { id: 'thumb', cx: 63, cy: 138, labelX: 30, labelY: 138 },
  { id: 'index', cx: 95, cy: 50, labelX: 82, labelY: 22 },
  { id: 'middle', cx: 135, cy: 36, labelX: 135, labelY: 12 },
  { id: 'ring', cx: 173, cy: 52, labelX: 182, labelY: 24 },
  { id: 'little', cx: 204, cy: 84, labelX: 226, labelY: 72 },
];

export const HandDiagram: React.FC<HandDiagramProps> = ({
  submissions,
  nextPendingId,
  onSelectFinger,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            የቀኝ እጅ መመሪያ · Right Hand Schematic
          </p>
          <h2 className="text-base font-semibold text-slate-900 mt-0.5">
            በቀጥታ ጣት በመንካት ይምረጡ
          </h2>
        </div>
        <span className="text-xs font-mono-tabular text-slate-500">
          1 → 5
        </span>
      </div>

      <div className="relative flex justify-center py-2">
        <svg
          viewBox="0 0 260 250"
          className="w-full max-w-[260px] h-auto select-none"
          role="group"
          aria-label="የቀኝ እጅ አምስት ጣቶች መምረጫ"
        >
          {/* Anatomical Right Hand Silhouette */}
          <path
            d="M84 222 L84 184 C73 176 58 162 50 148 C44 137 53 125 65 130 C74 134 83 143 88 150 L85 68 C85 48 106 48 107 68 L112 124 L121 44 C122 25 147 25 147 45 L146 122 L159 54 C161 36 184 39 183 58 L173 126 L191 84 C196 70 214 76 211 92 L195 162 C192 184 182 200 176 222 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Palm Inner Lines */}
          <path
            d="M106 164 C124 156 154 159 170 173"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M101 142 C122 135 148 136 166 144"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Interactive Fingertip Nodes */}
          {FINGER_NODES.map((node) => {
            const finger = FINGER_DEFINITIONS.find((f) => f.id === node.id)!;
            const isCompleted = Boolean(submissions[node.id]);
            const isNext = nextPendingId === node.id;

            return (
              <g
                key={node.id}
                onClick={() => onSelectFinger(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectFinger(node.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${finger.order}. ${finger.amharicName} (${finger.englishName}) — ${
                  isCompleted ? 'ተጠናቋል' : 'አሻራ ይስጡ'
                }`}
                className="cursor-pointer focus:outline-none group"
              >
                {/* Invisible wider hit area for accessibility */}
                <circle cx={node.cx} cy={node.cy} r="22" fill="transparent" />

                {/* Highlight halo for next recommended finger */}
                {isNext && !isCompleted && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="17"
                    fill="rgba(252, 221, 9, 0.25)"
                    stroke="#D97706"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="13"
                  fill={
                    isCompleted
                      ? '#078930'
                      : isNext
                        ? '#FEF3C7'
                        : '#FFFFFF'
                  }
                  stroke={
                    isCompleted
                      ? '#055C20'
                      : isNext
                        ? '#D97706'
                        : '#94A3B8'
                  }
                  strokeWidth="2"
                  className="transition-transform duration-150 group-hover:scale-110 origin-center"
                />

                {/* Step number inside circle */}
                <text
                  x={node.cx}
                  y={node.cy + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={isCompleted ? '#FFFFFF' : isNext ? '#92400E' : '#334155'}
                  className="font-mono-tabular pointer-events-none"
                >
                  {isCompleted ? '✓' : finger.order}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend with clear text + icon (not color-only) */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#078930] text-white inline-flex items-center justify-center">
            <Check className="w-2.5 h-2.5" />
          </span>
          <span>ተጠናቋል (Completed)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-amber-100 border border-amber-600 text-amber-900 text-[10px] font-bold inline-flex items-center justify-center">
            •
          </span>
          <span>ቀጣይ ተራ (Next)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-white border border-slate-400 text-slate-700 text-[10px] font-bold inline-flex items-center justify-center">
            #
          </span>
          <span>በመጠባበቅ ላይ (Pending)</span>
        </span>
      </div>
    </div>
  );
};
