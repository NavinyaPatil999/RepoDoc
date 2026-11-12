import React from 'react';
import { Lightbulb, X, ArrowRight } from 'lucide-react';

const ROLE_TIPS = {
  nurse: {
    title: 'Nurse Daily Triage Workflow',
    steps: [
      'Record daily temperature for all 74 patients (Pending / Done tabs).',
      'Readings >= 38.0°C automatically trigger a high-visibility Red Flag.',
      'Re-checks on the same day prompt a warning and store both readings with timestamps.',
      'Only valid readings (34.0°C - 42.0°C) are accepted by clinical protocol.',
    ],
    highlight: 'Goal: Clear the Pending queue so doctors can begin their rounds.'
  },
  doctor: {
    title: 'Doctor Daily Rounds & Clinical Review',
    steps: [
      'Patients without today’s temperature are LOCKED until nurse logs vitals.',
      'Tap unlocked patients to review 5-day temperature charts and clinical notes.',
      'Mark Visited (1x/day) to document same-day physician evaluation.',
      'Recommend Discharge unlocks ONLY after visit is marked AND 3 consecutive fever-free days are verified.',
    ],
    highlight: 'Goal: Conduct same-day rounds and recommend afebrile patients for discharge.'
  },
  admin: {
    title: 'Facility Command & Quality Oversight',
    steps: [
      'Monitor 74-bed capacity, ready-to-discharge candidates, and pending tasks.',
      'Track Facility Mortality rate vs 15.0% limit (85% recovery benchmark).',
      'Discharge doctor-recommended patients to free beds and celebrate recovery.',
      'Admit new patients into freed beds (disabled if 74 beds are full).',
    ],
    highlight: 'Goal: Keep facility throughput smooth, beds utilized, and mortality below 15%.'
  }
};

export default function OnboardingTooltip({ role, onDismiss }) {
  const content = ROLE_TIPS[role];
  if (!content) return null;

  return (
    <div className="relative overflow-hidden mb-6 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-emerald-950/40 p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-teal-950 dark:text-teal-100 flex items-center gap-2">
              {content.title}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-200/80 dark:bg-teal-800 text-teal-800 dark:text-teal-200">
                Quick Guide
              </span>
            </h4>
            <div className="mt-2 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-teal-900/90 dark:text-teal-200/90">
              {content.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{content.highlight}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors flex-shrink-0"
          title="Dismiss tip"
          aria-label="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

