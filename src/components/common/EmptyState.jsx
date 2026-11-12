import React from 'react';

export default function EmptyState({ 
  title = "All Caught Up!", 
  message = "No patients match the current filter or status queue.",
  actionText,
  onAction,
  imageSrc = "/empty.png"
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm my-4">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-4 flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt="Empty State" 
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

