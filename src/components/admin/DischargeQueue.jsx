import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import EmptyState from '../common/EmptyState';
import { 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  Bed, 
  Calendar, 
  UserCheck, 
  ShieldCheck,
  Flame,
  AlertTriangle
} from 'lucide-react';

export default function DischargeQueue({
  recommendedPatients,
  onDischargePatient,
}) {
  const [confirmPatient, setConfirmPatient] = useState(null);

  const handleExecuteDischarge = (patient) => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#0284c7', '#10b981', '#f59e0b']
      });
    } catch (e) {
      // Ignore confetti if not supported in test environment
    }

    onDischargePatient(patient.id);
    setConfirmPatient(null);
  };

  if (!recommendedPatients || recommendedPatients.length === 0) {
    return (
      <EmptyState
        title="Discharge Queue Clear"
        message="No patients are currently recommended by attending physicians. Patients unlock for recommendation once doctor visits them and verifies 3 consecutive fever-free days."
        imageSrc="/empty.png"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Doctor-Recommended Discharge Queue</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-extrabold">
              {recommendedPatients.length} Ready
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Patients verified with &ge;3 fever-free days and clinical physician sign-off.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedPatients.map((patient) => {
          return (
            <div
              key={patient.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black px-2.5 py-1 rounded-xl bg-purple-600 text-white shadow-sm">
                      {patient.bedNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {patient.id}
                    </span>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>3/3 Fever-Free Verified</span>
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {patient.age} yrs • {patient.gender === 'F' ? 'Female' : 'Male'} • Admitted {patient.admittedDate}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>
                    Approved by: <strong>{patient.recommendedBy || 'Attending Physician'}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Frees {patient.bedNumber} upon discharge
                </span>

                <button
                  onClick={() => setConfirmPatient(patient)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Discharge Patient</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <HeartHandshake className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Confirm Patient Discharge
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Discharge <strong>{confirmPatient.name}</strong> from <strong>Bed {confirmPatient.bedNumber}</strong>?
            </p>

            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 text-left space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Adds +1 to facility <strong>Recovered</strong> count.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-emerald-600" />
                <span>Frees <strong>Bed {confirmPatient.bedNumber}</strong> for new admissions.</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmPatient(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteDischarge(confirmPatient)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition-all"
              >
                Confirm Discharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

