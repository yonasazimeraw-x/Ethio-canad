import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FINGER_DEFINITIONS } from '../data/fingers';
import { FingerSubmissionMap } from '../types/fingerprint';

interface CompletionModalProps {
  isOpen: boolean;
  submissions: FingerSubmissionMap;
  onFinish: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
}

const ETHIOPIAN_CONFETTI_COLORS = [
  '#078930',
  '#10B981',
  '#FCDD09',
  '#EAB308',
  '#DA121A',
  '#FFFFFF',
];

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  submissions,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: ConfettiParticle[] = Array.from({ length: 110 }, (_, idx) => {
      const fromLeft = idx % 2 === 0;
      return {
        x: fromLeft ? canvas.width * 0.2 : canvas.width * 0.8,
        y: canvas.height * 0.45,
        vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 8) + (Math.random() - 0.5) * 4,
        vy: -(7 + Math.random() * 10),
        size: 6 + Math.random() * 6,
        color: ETHIOPIAN_CONFETTI_COLORS[idx % ETHIOPIAN_CONFETTI_COLORS.length],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.25,
      };
    });

    const startTime = performance.now();
    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.vx *= 0.99;
        p.rotation += p.vr;

        const alpha = elapsed > 3000 ? Math.max(0, 1 - (elapsed - 3000) / 1400) : 1;
        if (alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
        ctx.restore();
      }

      if (elapsed < 4500) {
        animationFrameId = window.requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="completion-modal-heading"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Confetti Overlay */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-center"
          >
            {/* Tricolor Top Ribbon */}
            <div className="h-2 w-full flex" aria-hidden="true">
              <div className="flex-1 bg-[#078930]" />
              <div className="flex-1 bg-[#FCDD09]" />
              <div className="flex-1 bg-[#DA121A]" />
            </div>

            <div className="px-6 sm:px-8 pt-8 pb-7">
              {/* Animated Green Checkmark */}
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#078930]/25 flex items-center justify-center mb-5">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="19"
                    stroke="#078930"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                  <motion.path
                    d="M13 22.5L19 28.5L31 16"
                    stroke="#078930"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
                  />
                </svg>
              </div>

              {/* Exact Required Congratulations Copy */}
              <h2
                id="completion-modal-heading"
                className="text-2xl sm:text-3xl font-bold text-slate-900"
              >
                🎉 እንኳን ደስ አለዎት!
              </h2>
              <p className="mt-1.5 text-base font-semibold text-[#078930]">
                Successfully submitted!
              </p>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                &ldquo;አምስቱም የጣት አሻራዎችዎ በተሳካ ሁኔታ ተልከዋል።&rdquo;
              </p>

              {/* Compact Summary of 5 Registered Fingers */}
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 pb-1.5 border-b border-slate-200/80">
                  <span>የተመዘገቡ አሻራዎች (5/5)</span>
                  <span className="font-mono-tabular text-[#078930]">100%</span>
                </div>
                {FINGER_DEFINITIONS.map((finger) => {
                  const sub = submissions[finger.id];
                  return (
                    <div
                      key={finger.id}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <span className="font-medium text-slate-800">
                        {finger.order}. {finger.amharicName}
                      </span>
                      <span className="font-mono-tabular text-slate-500">
                        {sub?.referenceCode ?? 'VERIFIED'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Finish Button */}
              <button
                type="button"
                onClick={onFinish}
                className="mt-6 w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#078930] hover:bg-[#067027] active:scale-[0.98] text-white text-base font-bold shadow-sm transition-all cursor-pointer"
              >
                ጨርስ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
