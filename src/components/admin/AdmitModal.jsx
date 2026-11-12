import React, { useState } from 'react';
import Modal from '../common/Modal';
import { UserPlus, AlertCircle, Bed, Sparkles } from 'lucide-react';

export default function AdmitModal({
  isOpen,
  onClose,
  onAdmitPatient,
  nextAvailableBed,
  isFacilityFull,
}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (isFacilityFull) {
      setError('Facility full - discharge first');
      return;
    }

    if (!name.trim()) {
      setError('Please enter patient full name.');
      return;
    }

    const numericAge = parseInt(age, 10);
    if (isNaN(numericAge) || numericAge < 1 || numericAge > 115) {
      setError('Please enter a valid age between 1 and 115.');
      return;
    }

    onAdmitPatient({
      name: name.trim(),
      age: numericAge,
      gender,
      notes: notes.trim(),
      bedNumber: nextAvailableBed,
    });

    // Reset form
    setName('');
    setAge('');
    setGender('M');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admit New Quarantine Patient"
      subtitle="Intake triage and automated bed assignment"
      maxWidth="max-w-md"
    >
      {isFacilityFull ? (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Facility full - discharge first</span>
          </div>
          <p>
            All 74 quarantine beds are currently occupied. You must discharge a doctor-recommended patient from the discharge queue before a new admission can be processed.
          </p>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bed Assignment Pill */}
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Bed</span>
                <div className="text-base font-black text-purple-700 dark:text-purple-300">
                  {nextAvailableBed || 'Auto-Allocated'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Immediate Intake
            </span>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:text-white"
              autoFocus
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                min="1"
                max="115"
                placeholder="e.g. 42"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:text-white"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Initial Clinical Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Admission Symptoms / Reason (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Acute fever, dry cough, referred from screening centre"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:text-white"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
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
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit to Bed {nextAvailableBed}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

