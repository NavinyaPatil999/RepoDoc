import React, { useState } from 'react';
import Modal from '../common/Modal';
import { 
  FEVER_THRESHOLD, 
  getTodayDateString, 
  getTodayReadings, 
  getLatestTodayReading, 
  isFever, 
  calculateFeverFreeDays,
  isVisitedToday,
  canRecommendDischarge
} from '../../utils/medicalRules';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Send, 
  AlertOctagon, 
  Flame, 
  Calendar, 
  FileText, 
  Sparkles,
  Lock,
  X
} from 'lucide-react';

export default function PatientDetailModal({
  isOpen,
  onClose,
  patient,
  onMarkVisited,
  onRecommendDischarge,
  onMarkDeceased,
  onAddTreatmentNote,
}) {
  const [newNoteText, setNewNoteText] = useState('');
  const [deceasedConfirmOpen, setDeceasedConfirmOpen] = useState(false);
  const [deceasedConfirmText, setDeceasedConfirmText] = useState('');

  if (!patient) return null;

  const todayStr = getTodayDateString(0);
  const todayReadings = getTodayReadings(patient, todayStr);
  const latestToday = getLatestTodayReading(patient, todayStr);
  const visited = isVisitedToday(patient, todayStr);
  const feverFreeDays = calculateFeverFreeDays(patient, todayStr);
  const dischargeEligibility = canRecommendDischarge(patient, todayStr);
  const isRecommended = patient.status === 'recommended';

  // Last 5 days temperatures for chart
  // Group readings by date and take the highest or latest reading per day
  const pastDays = [4, 3, 2, 1, 0].map((offset) => {
    const dStr = getTodayDateString(-offset);
    const dayReadings = (patient.temperatureHistory || []).filter((r) => r.date === dStr);
    const latest = dayReadings.length > 0 ? dayReadings[dayReadings.length - 1] : null;
    return {
      offset,
      date: dStr,
      displayDate: offset === 0 ? 'Today' : `D-${offset}`,
      reading: latest,
      temp: latest ? latest.temp : null,
      isFever: latest ? latest.temp >= FEVER_THRESHOLD : false,
    };
  });

  // Calculate SVG chart coordinates
  const chartHeight = 110;
  const chartWidth = 320;
  const minChartTemp = 35.5;
  const maxChartTemp = 40.5;
  const tempRange = maxChartTemp - minChartTemp;

  const getY = (temp) => {
    if (temp == null) return null;
    const clamped = Math.max(minChartTemp, Math.min(maxChartTemp, temp));
    const ratio = (clamped - minChartTemp) / tempRange;
    return chartHeight - ratio * chartHeight;
  };

  const feverLineY = getY(FEVER_THRESHOLD);

  // SVG points for line
  const points = pastDays
    .map((day, idx) => {
      if (day.temp == null) return null;
      const x = 30 + idx * ((chartWidth - 60) / 4);
      const y = getY(day.temp);
      return { x, y, ...day };
    })
    .filter(Boolean);

  const pathD = points.length > 0
    ? points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddTreatmentNote(patient.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleConfirmDeceased = () => {
    onMarkDeceased(patient.id);
    setDeceasedConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !deceasedConfirmOpen}
        onClose={onClose}
        title={`Bed ${patient.bedNumber} — Clinical Examination`}
        subtitle={`${patient.name} (${patient.age}y / ${patient.gender}) • Admitted ${patient.admittedDate}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5">
          {/* Today Vitals Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Today's Recorded Vitals
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                {latestToday ? (
                  <>
                    <span className={`text-2xl font-black ${
                      isFever(latestToday.temp) ? 'text-red-600 dark:text-red-400' : 'text-teal-700 dark:text-teal-300'
                    }`}>
                      {latestToday.temp.toFixed(1)}°C
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      at {latestToday.time}
                    </span>
                    {isFever(latestToday.temp) ? (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-red-600" />
                        <span>Active Fever (&ge;38.0°C)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Afebrile</span>
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    Awaiting nurse temperature
                  </span>
                )}
              </div>
            </div>

            {/* Visit Status Indicator */}
            <div className="flex items-center gap-2">
              {visited ? (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Physician Visited Today</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Rounds Pending Today</span>
                </div>
              )}
            </div>
          </div>

          {/* 5-Day Temperature Sparkline Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  5-Day Temperature Trend
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-red-500 inline-block border-b border-dashed border-red-500" />
                  <span>Fever Line (38.0°C)</span>
                </span>
              </div>
            </div>

            {/* Responsive Chart Container */}
            <div className="w-full overflow-x-auto pb-1">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`} 
                className="w-full max-w-lg mx-auto overflow-visible"
              >
                {/* Horizontal reference grids */}
                <line x1="20" y1={getY(36.0)} x2={chartWidth - 20} y2={getY(36.0)} stroke="#94a3b8" strokeOpacity="0.15" strokeWidth="1" />
                <line x1="20" y1={getY(37.0)} x2={chartWidth - 20} y2={getY(37.0)} stroke="#94a3b8" strokeOpacity="0.15" strokeWidth="1" />
                <line x1="20" y1={getY(39.0)} x2={chartWidth - 20} y2={getY(39.0)} stroke="#94a3b8" strokeOpacity="0.15" strokeWidth="1" />

                {/* 38.0°C Fever Threshold Dashed Red Line */}
                <line 
                  x1="20" 
                  y1={feverLineY} 
                  x2={chartWidth - 20} 
                  y2={feverLineY} 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                />
                <text x="24" y={feverLineY - 4} fill="#ef4444" fontSize="9" fontWeight="bold">
                  38.0°C FEVER
                </text>

                {/* Temperature trend line */}
                {pathD && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#0284c7" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                )}

                {/* Data Points & Labels */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    {/* Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.isFever ? 5.5 : 4.5}
                      fill={pt.isFever ? '#ef4444' : '#0284c7'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Temp Value Label */}
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fill={pt.isFever ? '#dc2626' : '#0369a1'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {pt.temp.toFixed(1)}°
                    </text>
                    {/* Day Label */}
                    <text
                      x={pt.x}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {pt.displayDate}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Audit Trail Note */}
            <p className="text-[10px] text-slate-400 text-center mt-1">
              *Historical vitals are immutable and sealed per clinical audit protocol.
            </p>
          </div>

          {/* Fever-Free Days Counter (x/3) */}
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 dark:text-teal-300">
                Discharge Criterion: Fever-Free Streak
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                feverFreeDays >= 3
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
              }`}>
                {feverFreeDays} / 3 Days Met
              </span>
            </div>

            {/* 3 Steps Visual Tracker */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1, 2, 3].map((step) => {
                const isPassed = feverFreeDays >= step;
                return (
                  <div
                    key={step}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isPassed
                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 font-bold text-xs">
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>Day {step}</span>
                    </div>
                    <span className="text-[10px] block opacity-90 mt-0.5">
                      {isPassed ? 'Fever-free' : 'Required'}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-teal-900/80 dark:text-teal-300/80 mt-2.5 leading-relaxed">
              <strong>Rule:</strong> Recommend discharge unlocks only after doctor visit is marked AND the patient maintains 3 full consecutive fever-free days with a reading each day. Any fever (&ge;38.0°C) or missing day resets streak to 0.
            </p>
          </div>

          {/* Doctor Treatment Notes Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Clinical Progress Notes</span>
            </div>

            {/* Notes List */}
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {(patient.treatmentNotes || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No previous notes recorded for this patient.
                </p>
              ) : (
                patient.treatmentNotes.map((n, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-sky-700 dark:text-sky-300">{n.doctor || 'Physician'}</span>
                      <span>{n.date} at {n.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add clinical observation, orders, or prognosis..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Button 1: Mark Visited */}
              <button
                onClick={() => onMarkVisited(patient.id)}
                disabled={visited}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  visited
                    ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 cursor-default'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20 active:scale-98'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{visited ? '✓ Patient Visited Today' : 'Mark Visited Today'}</span>
              </button>

              {/* Button 2: Recommend Discharge */}
              <button
                onClick={() => onRecommendDischarge(patient.id)}
                disabled={!dischargeEligibility.allowed || isRecommended}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isRecommended
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 cursor-default'
                    : dischargeEligibility.allowed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 active:scale-98 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                }`}
                title={!dischargeEligibility.allowed ? dischargeEligibility.reason : 'Submit discharge recommendation to Admin'}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isRecommended 
                    ? '✓ Recommended to Admin' 
                    : dischargeEligibility.allowed 
                    ? 'Recommend Discharge' 
                    : 'Discharge Locked (3 Days Needed)'}
                </span>
              </button>
            </div>

            {/* Helper explanation for locked discharge */}
            {!dischargeEligibility.allowed && !isRecommended && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 text-center">
                🔒 {dischargeEligibility.reason}
              </p>
            )}

            {/* Button 3: Mark Deceased (Critical Action) */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDeceasedConfirmOpen(true)}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Mark Patient Deceased</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Mark Deceased */}
      {deceasedConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-300 dark:border-red-900 text-left animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
              Confirm Patient Death Record
            </h3>

            <div className="mt-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200 space-y-1.5">
              <p>
                <strong>Patient:</strong> {patient.name} (Bed {patient.bedNumber})
              </p>
              <p>
                <strong>Clinical Warning:</strong> This irreversible action will discharge the deceased patient, increment facility mortality statistics, and release Bed {patient.bedNumber} for sanitization.
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              To prevent accidental execution, please type <strong>CONFIRM</strong> below:
            </p>

            <input
              type="text"
              placeholder="Type CONFIRM"
              value={deceasedConfirmText}
              onChange={(e) => setDeceasedConfirmText(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 uppercase font-mono dark:text-white"
            />

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDeceasedConfirmOpen(false);
                  setDeceasedConfirmText('');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeceased}
                disabled={deceasedConfirmText.trim() !== 'CONFIRM'}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/25 transition-all"
              >
                Execute Death Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

