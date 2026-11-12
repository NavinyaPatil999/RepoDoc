import React, { useState, useMemo } from 'react';
import TemperatureModal from './TemperatureModal';
import EmptyState from '../common/EmptyState';
import { 
  getTodayDateString, 
  getTodayReadings, 
  getLatestTodayReading, 
  isFever, 
  calculateFeverFreeDays,
  formatFeverFreeDays
} from '../../utils/medicalRules';
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  X,
  ChevronRight
} from 'lucide-react';

export default function NurseDashboard({
  patients,
  onSaveReading,
  searchQuery,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'done' | 'all'
  const [onlyFevers, setOnlyFevers] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const todayStr = getTodayDateString(0);

  const totalOccupied = patients.filter((p) => p.status !== 'discharged' && p.status !== 'deceased').length;
  
  const measuredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.status === 'discharged' || p.status === 'deceased') return false;
      const readings = getTodayReadings(p, todayStr);
      return readings.length > 0;
    });
  }, [patients, todayStr]);

  const pendingPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.status === 'discharged' || p.status === 'deceased') return false;
      const readings = getTodayReadings(p, todayStr);
      return readings.length === 0;
    });
  }, [patients, todayStr]);

  const recordedCount = measuredPatients.length;
  const progressPercent = totalOccupied > 0 ? Math.round((recordedCount / totalOccupied) * 100) : 0;

  // Filter list
  const filteredPatients = useMemo(() => {
    let list = [];
    if (activeTab === 'pending') {
      list = pendingPatients;
    } else if (activeTab === 'done') {
      list = measuredPatients;
    } else {
      list = patients.filter((p) => p.status !== 'discharged' && p.status !== 'deceased');
    }

    if (onlyFevers) {
      list = list.filter((p) => {
        const latest = getLatestTodayReading(p, todayStr);
        return latest && isFever(latest.temp);
      });
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.bedNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true }));
  }, [activeTab, pendingPatients, measuredPatients, patients, onlyFevers, searchQuery, todayStr]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9DEE4] dark:border-[#27313F]">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Nurse station</span>
              {/* Help Popover Trigger Button */}
              <div className="relative inline-block">
                <button
                  onClick={() => setHelpOpen(!helpOpen)}
                  className="p-1 rounded-[4px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Workflow instructions"
                  aria-label="Help"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {helpOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-72 bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] rounded-[6px] shadow-sm p-3 z-50 text-xs animate-in fade-in-50">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9DEE4] dark:border-[#27313F] font-semibold text-slate-900 dark:text-slate-100">
                      <span>Nurse triage instructions</span>
                      <button onClick={() => setHelpOpen(false)} className="p-0.5 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                      <li>• Record daily temperatures for all 74 patients.</li>
                      <li>• Readings ≥38.0°C show a red border and fever tag.</li>
                      <li>• Re-checks require confirmation and preserve both timestamps.</li>
                      <li>• Clinical protocol strictly accepts 34.0°C to 42.0°C.</li>
                    </ul>
                  </div>
                )}
              </div>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily vitals recording queue for virus quarantine cohort
            </p>
          </div>
        </div>

        {/* Coverage Progress Indicator */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
              {recordedCount} of {totalOccupied} recorded
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {pendingPatients.length} pending today
            </div>
          </div>
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0F5B66] dark:bg-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Underlined Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#D9DEE4] dark:border-[#27313F] text-xs">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-2.5 font-medium flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'pending'
                ? 'border-[#0F5B66] text-[#0F5B66] dark:text-teal-400 dark:border-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Pending</span>
            <span className="font-mono tabular-nums text-slate-400">
              ({pendingPatients.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('done')}
            className={`pb-2.5 font-medium flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'done'
                ? 'border-[#0F5B66] text-[#0F5B66] dark:text-teal-400 dark:border-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Done</span>
            <span className="font-mono tabular-nums text-slate-400">
              ({measuredPatients.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 font-medium flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'all'
                ? 'border-[#0F5B66] text-[#0F5B66] dark:text-teal-400 dark:border-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>All patients</span>
            <span className="font-mono tabular-nums text-slate-400">
              ({totalOccupied})
            </span>
          </button>
        </div>

        {/* Filter Fevers Only */}
        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={onlyFevers}
            onChange={(e) => setOnlyFevers(e.target.checked)}
            className="rounded-[3px] border-slate-300 text-[#0F5B66] focus:ring-0"
          />
          <span>Fever only (≥38.0°C)</span>
        </label>
      </div>

      {/* Dense Clinical Patient Table */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          title={
            onlyFevers
              ? 'No fever patients found'
              : activeTab === 'pending'
              ? 'All daily temperatures recorded'
              : 'No patients found'
          }
          message={
            onlyFevers
              ? 'No patients currently meet the fever threshold (≥38.0°C).'
              : activeTab === 'pending'
              ? 'All patient temperatures have been logged today. Physicians can proceed with rounds.'
              : 'Try clearing your search query.'
          }
        />
      ) : (
        <div className="bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] rounded-[6px] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D9DEE4] dark:border-[#27313F] bg-[#F4F6F8] dark:bg-[#0F141C] text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
                <th className="py-2.5 px-3.5 w-16">Bed</th>
                <th className="py-2.5 px-3.5">Patient</th>
                <th className="py-2.5 px-3.5 w-32">Today's temp</th>
                <th className="py-2.5 px-3.5 w-32">Status</th>
                <th className="py-2.5 px-3.5 w-32">Fever-free days</th>
                <th className="py-2.5 px-3.5 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE4] dark:divide-[#27313F]">
              {filteredPatients.map((patient) => {
                const todayReadings = getTodayReadings(patient, todayStr);
                const latestReading = todayReadings.length > 0 ? todayReadings[todayReadings.length - 1] : null;
                const fever = latestReading ? isFever(latestReading.temp) : false;
                const feverFreeStreak = calculateFeverFreeDays(patient, todayStr);
                const feverFreeDisplay = formatFeverFreeDays(feverFreeStreak);

                return (
                  <tr
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`h-11 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-[#1F2631] ${
                      fever ? 'border-l-2 border-l-red-600 bg-red-50/20 dark:bg-red-950/10' : ''
                    }`}
                  >
                    {/* Bed */}
                    <td className="py-2 px-3.5 font-mono font-medium text-slate-900 dark:text-slate-100">
                      {patient.bedNumber}
                    </td>

                    {/* Patient */}
                    <td className="py-2 px-3.5">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {patient.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {patient.age}y / {patient.gender} · {patient.id}
                      </div>
                    </td>

                    {/* Today's Temp */}
                    <td className="py-2 px-3.5 font-mono tabular-nums">
                      {latestReading ? (
                        <div className="flex items-center gap-1.5">
                          <span className={fever ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}>
                            {latestReading.temp.toFixed(1)}°C
                          </span>
                          {fever && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-semibold uppercase">
                              Fever
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3.5">
                      {latestReading ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Recorded ({latestReading.time})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting</span>
                        </span>
                      )}
                    </td>

                    {/* Fever-Free Days (Capped at 3: 3/3 Ready or x/3) */}
                    <td className="py-2 px-3.5 font-mono tabular-nums">
                      <span className={feverFreeStreak >= 3 ? 'font-medium text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}>
                        {feverFreeDisplay}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3.5 text-right font-medium text-[#0F5B66] dark:text-teal-400">
                      <span>{latestReading ? 'Re-check' : 'Record'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Temperature Modal */}
      {selectedPatient && (
        <TemperatureModal
          isOpen={Boolean(selectedPatient)}
          onClose={() => setSelectedPatient(null)}
          patient={selectedPatient}
          onSaveReading={onSaveReading}
        />
      )}
    </div>
  );
}
