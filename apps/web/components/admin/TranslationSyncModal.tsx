/**
 * Translation Sync Modal
 * 
 * Modal to ask admin if they want to sync/translate service to other locale
 * after saving changes
 */

'use client';

import { useState } from 'react';
import { X, Languages, Copy, Sparkles, Loader2 } from 'lucide-react';

interface TranslationSyncModalProps {
  isOpen: boolean;
  currentLocale: 'en' | 'vi';
  serviceTitle: string;
  onClose: () => void;
  onConfirm: (mode: 'skip' | 'manual' | 'auto') => void;
  loading?: boolean;
}

export function TranslationSyncModal({
  isOpen,
  currentLocale,
  serviceTitle,
  onClose,
  onConfirm,
  loading = false,
}: TranslationSyncModalProps) {
  const [selectedMode, setSelectedMode] = useState<'skip' | 'manual' | 'auto'>('skip');
  
  if (!isOpen) return null;
  
  const targetLocale = currentLocale === 'en' ? 'vi' : 'en';
  const targetLanguageName = targetLocale === 'vi' ? 'Tiếng Việt' : 'English';
  
  const t = currentLocale === 'vi' ? {
    title: 'Cập Nhật Bản Dịch?',
    description: `Bạn có muốn cập nhật bản ${targetLanguageName} của dịch vụ này không?`,
    serviceName: 'Dịch vụ',
    options: {
      skip: {
        title: 'Bỏ Qua',
        description: 'Không cập nhật bản dịch',
      },
      manual: {
        title: 'Sao Chép Thủ Công',
        description: 'Sao chép nội dung sang ngôn ngữ khác (không dịch)',
      },
      auto: {
        title: 'Tự Động Dịch',
        description: 'Dịch tự động sang ngôn ngữ khác',
      },
    },
    cancelButton: 'Hủy',
    confirmButton: 'Xác Nhận',
    confirmingButton: 'Đang xử lý...',
  } : {
    title: 'Update Translation?',
    description: `Do you want to update the ${targetLanguageName} version of this service?`,
    serviceName: 'Service',
    options: {
      skip: {
        title: 'Skip',
        description: 'Do not update translation',
      },
      manual: {
        title: 'Manual Copy',
        description: 'Copy content to other language (no translation)',
      },
      auto: {
        title: 'Auto Translate',
        description: 'Automatically translate to other language',
      },
    },
    cancelButton: 'Cancel',
    confirmButton: 'Confirm',
    confirmingButton: 'Processing...',
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6" />
              <h2 className="text-2xl font-bold">{t.title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-blue-100">{t.description}</p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">{t.serviceName}</p>
            <p className="font-semibold text-gray-900 mt-1">{serviceTitle}</p>
            <p className="text-sm text-gray-500 mt-2">
              {currentLocale === 'en' ? 'English' : 'Tiếng Việt'} → {targetLanguageName}
            </p>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {/* Skip Option */}
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedMode === 'skip'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="sync-mode"
                value="skip"
                checked={selectedMode === 'skip'}
                onChange={(e) => setSelectedMode(e.target.value as any)}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{t.options.skip.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.options.skip.description}</p>
              </div>
            </label>
            
            {/* Manual Copy Option */}
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedMode === 'manual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="sync-mode"
                value="manual"
                checked={selectedMode === 'manual'}
                onChange={(e) => setSelectedMode(e.target.value as any)}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{t.options.manual.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.options.manual.description}</p>
              </div>
            </label>
            
            {/* Auto Translate Option */}
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedMode === 'auto'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="sync-mode"
                value="auto"
                checked={selectedMode === 'auto'}
                onChange={(e) => setSelectedMode(e.target.value as any)}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">{t.options.auto.title}</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    AI
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.options.auto.description}</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.cancelButton}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedMode)}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.confirmingButton}
              </>
            ) : (
              t.confirmButton
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
