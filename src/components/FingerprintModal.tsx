import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ScanLine,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  FileImage,
  Trash2,
} from 'lucide-react';
import { FingerDefinition, FingerSubmission, SubmissionMethod } from '../types/fingerprint';
import { FingerprintGraphic } from './FingerprintGraphic';

interface FingerprintModalProps {
  finger: FingerDefinition | null;
  existingSubmission?: FingerSubmission;
  onClose: () => void;
  onSubmit: (payload: {
    fingerId: FingerDefinition['id'];
    method: SubmissionMethod;
    fileName?: string;
    previewUrl?: string;
  }) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ምስሉን ማንበብ አልተቻለም።'));
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('ትክክለኛ የምስል ፋይል አይደለም።'));
      img.onload = () => {
        const maxDim = 420;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({
  finger,
  existingSubmission,
  onClose,
  onSubmit,
}) => {
  const [mode, setMode] = useState<SubmissionMethod>('simulated');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'ready'>('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);

  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scanTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearScanTimer = () => {
    if (scanTimerRef.current !== null) {
      window.clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  };

  useEffect(() => {
    clearScanTimer();
    setMode('simulated');
    setScanState('idle');
    setScanProgress(0);
    setUploadedFileName('');
    setUploadedPreviewUrl('');
    setErrorMessage(null);
    return () => clearScanTimer();
  }, [finger?.id]);

  useEffect(() => {
    if (!finger) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearScanTimer();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finger, onClose]);

  const handleStartSimulatedScan = () => {
    if (existingSubmission) return;
    clearScanTimer();
    setErrorMessage(null);
    setScanState('scanning');
    setScanProgress(0);

    let current = 0;
    scanTimerRef.current = window.setInterval(() => {
      current += 4;
      if (current >= 100) {
        clearScanTimer();
        setScanProgress(100);
        setScanState('ready');
      } else {
        setScanProgress(current);
      }
    }, 80);
  };

  const handleCancelScan = () => {
    clearScanTimer();
    setScanState('idle');
    setScanProgress(0);
    setErrorMessage(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(
        'የተሳሳተ የፋይል አይነት ነው። እባክዎ PNG, JPG ወይም WEBP የምስል ፋይል ብቻ ይምረጡ። (Invalid file format)'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        'የፋይሉ መጠን ከ5MB መብለጥ የለበትም። እባክዎ አነስ ያለ ምስል ይምረጡ። (File exceeds 5MB limit)'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const dataUrl = await compressImageToDataUrl(file);
      setUploadedFileName(file.name);
      setUploadedPreviewUrl(dataUrl);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'ምስሉን መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
      );
    }
  };

  const handleRemoveUpload = () => {
    setUploadedFileName('');
    setUploadedPreviewUrl('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmSubmission = () => {
    if (!finger) return;

    if (existingSubmission) {
      setErrorMessage('ይህ የጣት አሻራ አስቀድሞ ተመዝግቧል። ድጋሚ ማስገባት አይቻልም።');
      return;
    }

    if (mode === 'simulated') {
      if (scanState !== 'ready') {
        setErrorMessage(
          'እባክዎ መጀመሪያ «የሙከራ ስካን ጀምር» የሚለውን በመጫን ስካኑ 100% እስኪጠናቀቅ ይጠብቁ።'
        );
        return;
      }
      onSubmit({
        fingerId: finger.id,
        method: 'simulated',
      });
      return;
    }

    if (mode === 'upload') {
      if (!uploadedPreviewUrl) {
        setErrorMessage(
          'እባክዎ መጀመሪያ የጣት አሻራ ምስል ይጫኑ ወይም ወደ «የሙከራ ስካን» ይቀይሩ።'
        );
        return;
      }
      onSubmit({
        fingerId: finger.id,
        method: 'upload',
        fileName: uploadedFileName,
        previewUrl: uploadedPreviewUrl,
      });
    }
  };

  const handleCloseModal = () => {
    clearScanTimer();
    onClose();
  };

  return (
    <AnimatePresence>
      {finger && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="finger-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs"
          />

          {/* Modal Sheet / Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
          >
            {/* Top Ethiopian Tricolor Accent Hairline */}
            <div className="h-1.5 w-full flex" aria-hidden="true">
              <div className="flex-1 bg-[#078930]" />
              <div className="flex-1 bg-[#FCDD09]" />
              <div className="flex-1 bg-[#DA121A]" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-mono-tabular text-slate-500">
                  ደረጃ 0{finger.order} / 05 · {finger.patternLabel}
                </p>
                <h2
                  id="finger-modal-title"
                  className="text-xl font-bold text-slate-900 mt-0.5"
                >
                  {finger.amharicName}{' '}
                  <span className="text-base font-medium text-slate-500">
                    ({finger.englishName})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="ዝጋ"
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5 overflow-y-auto space-y-4">
              {existingSubmission ? (
                /* Read-only view preventing duplicate submission */
                <div className="space-y-4">
                  <div className="rounded-xl bg-emerald-50 border border-[#078930]/25 p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#078930] shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-[#065F21]">
                        ይህ የጣት አሻራ አስቀድሞ ተመዝግቧል።
                      </p>
                      <p className="text-slate-700 mt-1 text-xs leading-relaxed">
                        ተደጋጋሚ ምዝገባን ለመከላከል የዚህ ጣት አሻራ ተቆልፏል። ሌሎች ያልተጠናቀቁ ጣቶችን መምረጥ ወይም ሁሉንም እንደገና ለመጀመር «እንደገና ጀምር» የሚለውን መጠቀም ይችላሉ።
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    {existingSubmission.previewUrl ? (
                      <img
                        src={existingSubmission.previewUrl}
                        alt={`${finger.amharicName} የተጫነ አሻራ`}
                        referrerPolicy="no-referrer"
                        className="w-32 h-36 object-cover rounded-xl border border-[#078930]/30 shadow-xs"
                      />
                    ) : (
                      <FingerprintGraphic
                        pattern={finger.ridgePattern}
                        state="completed"
                        size={120}
                      />
                    )}

                    <dl className="w-full mt-5 pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <dt className="text-slate-500">የማረጋገጫ ኮድ (Ref ID)</dt>
                        <dd className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
                          {existingSubmission.referenceCode}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">የተላከበት ዘዴ (Method)</dt>
                        <dd className="font-medium text-slate-900 mt-0.5">
                          {existingSubmission.method === 'upload'
                            ? 'ምስል በመጫን (Upload)'
                            : 'የሙከራ ስካን (Demo Scan)'}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-slate-500">የተመዘገበበት ሰዓት (Timestamp)</dt>
                        <dd className="font-mono-tabular text-slate-700 mt-0.5">
                          {new Date(existingSubmission.submittedAt).toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <>
                  {/* Hardware Capability Transparency Notice */}
                  <div className="rounded-xl bg-amber-50/90 border border-amber-200/90 p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <span className="font-semibold">ማሳሰቢያ (Demo Mode)፦ </span>
                      መደበኛ የስልክ ወይም የኮምፒውተር ስክሪን ትክክለኛ የባዮሜትሪክ አሻራ ማንበብ አይችልም። ይህ ገፅ የሙከራ ስካን ወይም የተዘጋጀ የአሻራ ምስል በመጫን የምዝገባ ሂደቱን ለማሳየት የተዘጋጀ ነው።
                    </p>
                  </div>

                  {/* Mode Switcher (Segmented Control) */}
                  <div
                    className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/60"
                    role="tablist"
                    aria-label="የአሻራ ማስገቢያ ዘዴ"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === 'simulated'}
                      onClick={() => {
                        setMode('simulated');
                        setErrorMessage(null);
                      }}
                      className={`min-h-[42px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                        mode === 'simulated'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ScanLine className="w-4 h-4 shrink-0" />
                      <span>የሙከራ ስካን</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === 'upload'}
                      onClick={() => {
                        clearScanTimer();
                        setMode('upload');
                        setErrorMessage(null);
                      }}
                      className={`min-h-[42px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                        mode === 'upload'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-4 h-4 shrink-0" />
                      <span>ምስል ይጫኑ</span>
                    </button>
                  </div>

                  {mode === 'simulated' ? (
                    /* Simulated Scanner Pad */
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col items-center text-center">
                      <p className="text-xs text-slate-600 mb-3">
                        {finger.guidanceAm}
                      </p>

                      {/* Large Interactive Scanning Frame */}
                      <div
                        className={`relative w-44 h-52 rounded-2xl bg-white border-2 flex items-center justify-center overflow-hidden transition-colors duration-200 ${
                          scanState === 'ready'
                            ? 'border-[#078930] shadow-md shadow-[#078930]/10'
                            : scanState === 'scanning'
                              ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                              : 'border-slate-200'
                        }`}
                      >
                        {/* Corner Brackets */}
                        <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-300 rounded-tl" />
                        <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-300 rounded-tr" />
                        <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-300 rounded-bl" />
                        <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-300 rounded-br" />

                        <FingerprintGraphic
                          pattern={finger.ridgePattern}
                          state={
                            scanState === 'ready'
                              ? 'completed'
                              : scanState === 'scanning'
                                ? 'scanning'
                                : 'pending'
                          }
                          size={132}
                        />

                        {/* Animated Laser Beam during scanning */}
                        {scanState === 'scanning' && (
                          <div
                            className="absolute left-3 right-3 top-6 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.85)] animate-scan-beam pointer-events-none"
                            aria-hidden="true"
                          />
                        )}

                        {scanState === 'ready' && (
                          <div className="absolute bottom-2.5 inset-x-3 py-1 rounded-md bg-emerald-50 border border-[#078930]/20 text-[11px] font-semibold text-[#078930] flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>አሻራ ተነቧል</span>
                          </div>
                        )}
                      </div>

                      {/* Scan Progress Bar & Trigger */}
                      <div className="w-full max-w-xs mt-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">
                            {scanState === 'idle' && 'ለመጀመር ከታች ያለውን ቁልፍ ይጫኑ'}
                            {scanState === 'scanning' && 'የአሻራ መስመሮች በመነበብ ላይ...'}
                            {scanState === 'ready' && 'ስካን በተሳካ ሁኔታ ተጠናቋል'}
                          </span>
                          <span className="font-mono-tabular font-semibold text-slate-800">
                            {scanProgress}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-[#078930] transition-all duration-100 ease-linear"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-center gap-2">
                          {scanState === 'idle' && (
                            <button
                              type="button"
                              onClick={handleStartSimulatedScan}
                              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <ScanLine className="w-4 h-4" />
                              <span>የሙከራ ስካን ጀምር (Start Scan)</span>
                            </button>
                          )}

                          {scanState === 'scanning' && (
                            <button
                              type="button"
                              onClick={handleCancelScan}
                              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              ስካን አቁም (Stop Scan)
                            </button>
                          )}

                          {scanState === 'ready' && (
                            <button
                              type="button"
                              onClick={handleStartSimulatedScan}
                              className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            >
                              እንደገና ስካን አድርግ (Re-scan)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Image Upload Mode */
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="sr-only"
                        id="fingerprint-image-upload"
                      />

                      {uploadedPreviewUrl ? (
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="relative w-44 h-52 rounded-2xl bg-white border-2 border-[#078930] p-2 flex items-center justify-center overflow-hidden">
                            <img
                              src={uploadedPreviewUrl}
                              alt="የተጫነ የጣት አሻራ ምስል"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain rounded-xl"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-700 max-w-full">
                            <FileImage className="w-4 h-4 text-[#078930] shrink-0" />
                            <span className="truncate max-w-[200px] font-medium">
                              {uploadedFileName}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveUpload}
                              className="min-h-[36px] px-2 py-1 rounded-lg text-[#DA121A] hover:bg-red-50 inline-flex items-center gap-1 font-medium cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>አስወግድ</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="fingerprint-image-upload"
                          className="flex flex-col items-center justify-center text-center p-6 rounded-xl border-2 border-dashed border-slate-300 bg-white hover:border-[#078930] hover:bg-emerald-50/30 transition-colors cursor-pointer min-h-[210px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            የጣት አሻራ ምስል ይምረጡ
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG ወይም WEBP (ከፍተኛ 5MB)
                          </p>
                          <span className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                            ፋይል ይምረጡ (Choose Image)
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Inline Validation / Error Banner */}
                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-xl bg-red-50 border border-[#DA121A]/25 p-3 flex items-start gap-2.5 text-xs text-[#991B1B]"
                    >
                      <AlertCircle className="w-4 h-4 text-[#DA121A] shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-medium">{errorMessage}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
              {existingSubmission ? (
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ዝጋ (Close)
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    ሰርዝ (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSubmission}
                    className={`w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      (mode === 'simulated' && scanState === 'ready') ||
                      (mode === 'upload' && Boolean(uploadedPreviewUrl))
                        ? 'bg-[#078930] text-white hover:bg-[#067027] shadow-sm'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>አረጋግጥና ላክ (Confirm Submission)</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
