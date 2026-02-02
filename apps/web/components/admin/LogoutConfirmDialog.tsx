'use client';

import { useEffect, useRef } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  locale: 'en' | 'vi';
  isLoading?: boolean;
}

/**
 * Logout Confirmation Dialog Component
 * 
 * A modal dialog that prompts user to confirm logout action.
 * Includes:
 * - Visual warning with icon
 * - Confirm/Cancel buttons
 * - Keyboard support (Enter/Escape)
 * - Loading state during logout
 * - Click outside to close
 * - Accessibility features (focus trap, aria labels)
 */
export default function LogoutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  locale,
  isLoading = false,
}: LogoutConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Translations
  const t = {
    en: {
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout? Any unsaved changes may be lost.',
      confirm: 'Logout',
      cancel: 'Cancel',
      loggingOut: 'Logging out...',
    },
    vi: {
      title: 'Xác nhận đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất? Các thay đổi chưa lưu có thể bị mất.',
      confirm: 'Đăng xuất',
      cancel: 'Hủy',
      loggingOut: 'Đang đăng xuất...',
    },
  };

  const text = t[locale];

  // Focus trap and keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when dialog opens
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 100);

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      } else if (e.key === 'Enter' && !isLoading) {
        onConfirm();
      }
    };

    // Prevent body scroll when dialog is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel, onConfirm]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2
              id="logout-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              {text.title}
            </h2>
          </div>
          
          {/* Close button */}
          {!isLoading && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p
            id="logout-dialog-description"
            className="text-gray-600 leading-relaxed"
          >
            {text.message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={text.cancel}
          >
            {text.cancel}
          </button>
          
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[120px] justify-center"
            aria-label={text.confirm}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{text.loggingOut}</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>{text.confirm}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
