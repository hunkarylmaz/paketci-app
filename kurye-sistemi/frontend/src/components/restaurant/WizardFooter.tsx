import React from 'react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
  canProceed: boolean;
}

export function WizardFooter({
  currentStep,
  onNext,
  onPrev,
  onSubmit,
  onCancel,
  isSubmitting,
  isLastStep,
  canProceed,
}: WizardFooterProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
      {/* Sol: Geri / İptal */}
      <button
        onClick={currentStep === 0 ? onCancel : onPrev}
        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        {currentStep === 0 ? 'İptal' : '← Geri'}
      </button>

      {/* Sağ: İleri / Tamamla */}
      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !canProceed}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Kaydediliyor...
            </>
          ) : (
            'Restoranı Oluştur'
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          İleri →
        </button>
      )}
    </div>
  );
}
