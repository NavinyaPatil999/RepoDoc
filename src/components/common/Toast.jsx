import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-800';
        let iconColor = 'text-emerald-600 dark:text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-red-50 text-red-900 border-red-300 dark:bg-red-950/90 dark:text-red-100 dark:border-red-800';
          iconColor = 'text-red-600 dark:text-red-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/90 dark:text-amber-100 dark:border-amber-800';
          iconColor = 'text-amber-600 dark:text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'bg-teal-50 text-teal-900 border-teal-300 dark:bg-teal-950/90 dark:text-teal-100 dark:border-teal-800';
          iconColor = 'text-teal-600 dark:text-teal-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${colorClasses}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

