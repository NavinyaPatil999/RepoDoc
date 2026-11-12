import React, { useState } from 'react';
import { 
  getTodayDateString, 
  getTodayReadings, 
  isFever, 
  isVisitedToday, 
  calculateFeverFreeDays 
} from '../../utils/medicalRules';
import Modal from '../common/Modal';
import { Bed, UserCheck, Flame, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function BedGrid({ patients, totalBeds = 74 }) {
  const [selectedBedPatient, setSelectedBedPatient] = useState(null);
  const [selectedBedNumber, setSelectedBedNumber] = useState(null);

  const todayStr = getTodayDateString(0);

  // Map beds B01 to B74
  const bedSlots = Array.from({ length: totalBeds }, (_, i) => {
    const bedNumber = `B${String(i + 1).padStart(2, '0')}`;
    const patient = patients.find(
      (p) => p.bedNumber === bedNumber && p.status !== 'discharged' && p.status !== 'deceased'
    );
    return {
      bedNumber,
      patient,
    };
  });

  const handleBedClick = (slot) => {
    setSelectedBedNumber(slot.bedNumber);
    setSelectedBedPatient(slot.patient || null);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>74-Bed Facility Real-Time Map</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive ward layout. Tap any bed slot to view occupant status and triage telemetry.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 flex-wrap text-[11px] text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500 inline-block" />
            <span>Fever</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
            <span>Ready Discharge</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Visited</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
            <span>Pending Temp</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border border-dashed border-slate-400 inline-block" />
            <span>Empty Bed</span>
          </span>
        </div>
      </div>

      {/* Grid of 74 Beds */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
        {bedSlots.map(({ bedNumber, patient }) => {
          let bgClass = 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/20 text-slate-400';
          let indicatorIcon = null;

          if (patient) {
            const todayReadings = getTodayReadings(patient, todayStr);
            const latestReading = todayReadings.length > 0 ? todayReadings[todayReadings.length - 1] : null;
            const fever = latestReading ? isFever(latestReading.temp) : false;
            const visited = isVisitedToday(patient, todayStr);
            const isRecommended = patient.status === 'recommended';

            if (fever) {
              bgClass = 'bg-red-500 text-white shadow-sm shadow-red-500/30';
            } else if (isRecommended) {
              bgClass = 'bg-purple-600 text-white shadow-sm shadow-purple-500/30 ring-2 ring-purple-300 dark:ring-purple-700';
            } else if (visited) {
              bgClass = 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20';
            } else if (latestReading) {
              bgClass = 'bg-sky-500 text-white';
            } else {
              bgClass = 'bg-amber-400 text-slate-900 font-bold';
            }
          }

          return (
            <button
              key={bedNumber}
              onClick={() => handleBedClick({ bedNumber, patient })}
              className={`p-2 rounded-xl text-center transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center min-h-[50px] ${bgClass}`}
              title={`${bedNumber}: ${patient ? patient.name : 'Empty'}`}
            >
              <span className="text-[11px] font-black tracking-tight">{bedNumber}</span>
              {patient && (
                <span className="text-[9px] truncate max-w-[48px] block opacity-90">
                  {patient.name.split(' ')[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Bed Detail Modal */}
      {selectedBedNumber && (
        <Modal
          isOpen={Boolean(selectedBedNumber)}
          onClose={() => {
            setSelectedBedNumber(null);
            setSelectedBedPatient(null);
          }}
          title={`Bed ${selectedBedNumber} Details`}
          subtitle={selectedBedPatient ? `${selectedBedPatient.name} • ${selectedBedPatient.age}y / ${selectedBedPatient.gender}` : 'Unoccupied Bed'}
          maxWidth="max-w-sm"
        >
          {selectedBedPatient ? (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Admitted:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{selectedBedPatient.admittedDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="capitalize font-bold text-teal-600 dark:text-teal-400">{selectedBedPatient.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fever-Free Streak:</span>
                  <strong>{calculateFeverFreeDays(selectedBedPatient, todayStr)} / 3 days</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visited Today:</span>
                  <span>{isVisitedToday(selectedBedPatient, todayStr) ? '✓ Yes' : 'No'}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Today's Temperature History:</span>
                {getTodayReadings(selectedBedPatient, todayStr).length === 0 ? (
                  <p className="text-xs text-amber-600 italic">No temperature recorded today yet.</p>
                ) : (
                  <div className="space-y-1">
                    {getTodayReadings(selectedBedPatient, todayStr).map((r, i) => (
                      <div key={i} className="flex justify-between px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs">
                        <span>{r.time}</span>
                        <strong className={isFever(r.temp) ? 'text-red-600' : 'text-teal-600'}>{r.temp}°C {isFever(r.temp) && '(Fever)'}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Bed <strong>{selectedBedNumber}</strong> is currently clean and ready for admission.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

