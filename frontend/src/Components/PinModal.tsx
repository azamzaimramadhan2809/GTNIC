import React, { useState, useEffect } from 'react';
import { Lock, X, Check, AlertCircle, Sparkles, Delete, ShieldCheck } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export interface PinModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSuccess: propOnSuccess,
  title = 'Autentikasi PIN Owner',
  description = 'Masukkan 6 digit PIN Owner untuk membuka akses sementara ke menu sensitif.',
}) => {
  const { isPinModalOpen, closePinModal, verifyPin, pinCallback, isCashier, currentPinTargetPage } = useAuth();
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : isPinModalOpen;
  const handleClose = propOnClose || closePinModal;

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setIsSuccess(false);
      setShake(false);
    }
  }, [isOpen]);

  // Handle key press globally when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 6) {
          handleDigit(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length >= 4) {
          validatePin(pin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  const handleDigit = (digit: string) => {
    if (pin.length >= 6 || isSuccess) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    setErrorMessage('');

    // Trigger auto-check when 6 digits are entered
    if (newPin.length === 6) {
      validatePin(newPin);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
      setError(false);
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    if (!isSuccess) {
      setPin('');
      setError(false);
      setErrorMessage('');
    }
  };

  const validatePin = (pinToTest: string) => {
    const isValid = verifyPin(pinToTest, currentPinTargetPage);
    if (isValid) {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        if (propOnSuccess) {
          propOnSuccess();
        } else if (pinCallback) {
          pinCallback();
        }
        handleClose();
      }, 500);
    } else {
      setShake(true);
      setError(true);
      setErrorMessage('PIN Owner salah! Coba lagi (PIN: 123456)');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setPin(''), 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 select-none"
    >
      <div
        className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all ${
          shake ? 'animate-shake' : ''
        }`}
        style={{
          animation: shake ? 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both' : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
            40%, 60% { transform: translate3d(6px, 0, 0); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10 cursor-pointer"
          aria-label="Tutup Modal"
        >
          <X size={18} />
        </button>

        {/* Top Header Card */}
        <div className="pt-7 pb-4 px-6 text-center bg-gradient-to-b from-emerald-50/70 to-white flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#057A55] text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 mb-3.5">
            {isSuccess ? (
              <Check size={28} className="stroke-[3] animate-in zoom-in-50 duration-300" />
            ) : (
              <Lock size={26} strokeWidth={2.4} />
            )}
          </div>

          <h3 id="pin-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
            {isSuccess ? 'Otorisasi Diberikan!' : title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[270px] leading-relaxed">
            {isSuccess
              ? (isCashier ? 'Akses sementara diaktifkan untuk Kasir Siti...' : 'Memverifikasi...')
              : description}
          </p>

          {/* 6-Digit PIN Dots Display */}
          <div className="flex items-center justify-center gap-2.5 my-5">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const filled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    isSuccess
                      ? 'bg-emerald-500 scale-110 ring-4 ring-emerald-100'
                      : error
                      ? 'bg-rose-500 ring-4 ring-rose-100'
                      : filled
                      ? 'bg-[#057A55] scale-110 ring-4 ring-emerald-100'
                      : 'bg-slate-200 border border-slate-300'
                  }`}
                />
              );
            })}
          </div>

          {/* Status Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 animate-in fade-in duration-150">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {!error && !isSuccess && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Sparkles size={13} className="text-amber-500" />
              <span>PIN Bawaan Demo: <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">123456</span></span>
            </div>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="p-6 pt-2 bg-white">
          <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                disabled={isSuccess || pin.length >= 6}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-[#057A55] text-lg font-bold border border-slate-200/80 shadow-xs transition-all duration-150 flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
              >
                {digit}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={isSuccess || pin.length === 0}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 active:bg-slate-200 text-xs font-bold border border-slate-200/80 shadow-xs transition-colors flex items-center justify-center cursor-pointer select-none disabled:opacity-40"
            >
              HAPUS
            </button>

            {/* Digit 0 */}
            <button
              type="button"
              onClick={() => handleDigit('0')}
              disabled={isSuccess || pin.length >= 6}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-[#057A55] text-lg font-bold border border-slate-200/80 shadow-xs transition-all duration-150 flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              disabled={isSuccess || pin.length === 0}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 active:bg-rose-100 border border-slate-200/80 shadow-xs transition-colors flex items-center justify-center cursor-pointer select-none disabled:opacity-40"
              aria-label="Hapus satu angka"
            >
              <Delete size={18} />
            </button>
          </div>

          {/* Quick bypass button */}
          <div className="mt-3.5 text-center flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => validatePin('123456')}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 py-1 px-2.5 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Otorisasi Cepat (Demo PIN 123456)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
