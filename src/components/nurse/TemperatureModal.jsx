import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { 
  FEVER_THRESHOLD, 
  MIN_TEMP, 
  MAX_TEMP, 
  validateTemperature, 
  getTodayReadings, 
  getTodayDateString 
} from '../../utils/medicalRules';
import { 
  AlertTriangle, 
  Thermometer, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShieldAlert,
  History
} from 'lucide-react';

const PRESET_TEMPS = [36.5, 36.8, 37.2, 37.6, 38.2, 38.9];

export default function TemperatureModal({
  isOpen,
  onClose,
  patient,
  onSaveReading,
}) {
  const [tempInput, setTempInput] = useState('36.8');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);
  const [confirmedRecheck, setConfirmedRecheck] = useState(false);

  const todayStr = getTodayDateString(0);
  const todayReadings = patient ? getTodayReadings(patient, todayStr) : [];
  const hasReadingToday = todayReadings.length > 0;
  const latestTodayReading = hasReadingToday ? todayReadings[todayReadings.length - 1] : null;

  useEffect(() => {
    if (isOpen && patient) {
      // Default to 36.8 or latest reading
      if (latestTodayReading) {
        setTempInput(latestTodayReading.temp.toFixed(1));
      } else {
        setTempInput('36.8');
      }
      setNote('');
      setError(null);
      setConfirmedRecheck(false);
    }
  }, [isOpen, patient]);

  if (!patient) return null;

  const currentNumericTemp = parseFloat(tempInput);
  const isCurrentlyFever = !isNaN(currentNumericTemp) && currentNumericTemp >= FEVER_THRESHOLD;

  const handlePresetClick = (val) => {
    setTempInput(val.toFixed(1));
    setError(null);
  };

  const handleAdjust = (delta) => {
    const current = parseFloat(tempInput);
    if (isNaN(current)) {
      setTempInput('36.8');
      return;
    }
    const nextVal = Math.round((current + delta) * 10) / 10;
    if (nextVal >= MIN_TEMP - 2 && nextVal <= MAX_TEMP + 2) {
      setTempInput(nextVal.toFixed(1));
      setError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Business Rule: Validate range 34.0 - 42.0
    const validation = validateTemperature(tempInput);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Business Rule: If today's temperature is already recorded, require confirmation before saving re-check
    if (hasReadingToday && !confirmedRecheck) {
      setConfirmedRecheck(true);
      return;
    }

    // Save reading
    onSaveReading(patient.id, validation.value, note, hasReadingToday);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Vitals: Bed ${patient.bedNumber}`}
      subtitle={`${patient.name} • ${patient.age}y / ${patient.gender}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Summary Card */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Bed Number</span>
            <div className="font-extrabold text-base text-teal-600 dark:text-teal-400">
              {patient.bedNumber}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Admitted</span>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {patient.admittedDate}
            </div>
          </div>
        </div>

        {/* Warning if already recorded today */}
        {hasReadingToday && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Notice: Temperature Recorded Today</p>
                <p className="mt-0.5 opacity-90">
                  Last recorded reading: <strong className="underline">{latestTodayReading?.temp}°C</strong> at {latestTodayReading?.time}.
                </p>
                <p className="mt-1 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                  Per protocol, this entry will be logged as an official <strong>clinical re-check</strong>. Both readings will be preserved in the audit log.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Temperature Entry Section */}
        <div className="text-center py-2">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Patient Temperature (°C)
          </label>

          {/* Stepper + Display */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleAdjust(-0.1)}
              className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-transform active:scale-95"
              aria-label="Decrease temperature by 0.1"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className={`relative px-6 py-3 rounded-2xl border-2 transition-all flex items-center justify-center min-w-[160px] ${
              isCurrentlyFever
                ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/10'
                : 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300'
            }`}>
              <input
                type="number"
                step="0.1"
                min={MIN_TEMP}
                max={MAX_TEMP}
                value={tempInput}
                onChange={(e) => {
                  setTempInput(e.target.value);
                  setError(null);
                }}
                className="w-24 text-3xl font-black text-center bg-transparent focus:outline-none dark:text-white"
                autoFocus
              />
              <span className="text-lg font-bold ml-1 text-slate-500 dark:text-slate-400">°C</span>
            </div>

            <button
              type="button"
              onClick={() => handleAdjust(0.1)}
              className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-sm transition-transform active:scale-95"
              aria-label="Increase temperature by 0.1"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Fever / Normal Visual Indicator */}
          <div className="mt-3">
            {isCurrentlyFever ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold animate-soft-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>FEVER ALERT (&ge;38.0°C) &bull; Flagged for Doctor</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Afebrile / Within Normal Limits</span>
              </div>
            )}
          </div>

          {/* Quick preset buttons */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] text-slate-400 mr-1 uppercase font-semibold">Presets:</span>
            {PRESET_TEMPS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePresetClick(p)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  p >= FEVER_THRESHOLD
                    ? 'bg-red-100/70 hover:bg-red-200 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p.toFixed(1)}°
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Optional Nurse Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Nurse Observation / Symptom Note (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Mild shivering, paracetamol given at 08:00, resting"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:text-white"
          />
        </div>

        {/* Re-check Confirmation Banner (if has reading and user clicked first time) */}
        {hasReadingToday && confirmedRecheck && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs">
            <p className="font-bold">Confirmation Required:</p>
            <p className="mt-0.5">
              Click <strong>"Confirm &amp; Log Re-Check"</strong> below to record this secondary temperature.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all active:scale-98 ${
              isCurrentlyFever
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/25'
            }`}
          >
            {hasReadingToday
              ? (confirmedRecheck ? 'Confirm & Log Re-Check' : 'Proceed to Re-Check')
              : 'Save Temperature'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

