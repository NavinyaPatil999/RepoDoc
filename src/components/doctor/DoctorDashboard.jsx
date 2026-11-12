import React, { useState, useMemo } from 'react';
import PatientDetailModal from './PatientDetailModal';
import EmptyState from '../common/EmptyState';
import { 
  getTodayDateString, 
  getTodayReadings, 
  getLatestTodayReading, 
  isFever, 
  calculateFeverFreeDays,
  isVisitedToday,
  canRecommendDischarge
} from '../../utils/medicalRules';
import { 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  Lock, 
  UserCheck, 
  Sparkles, 
  Flame, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function DoctorDashboard({
  patients,
  onMarkVisited,
  onRecommendDischarge,
  onMarkDeceased,
  onAddTreatmentNote,
  searchQuery,
  showOnboarding,
  onDismissOnboarding,
  onNotify,
}) {
  const [activeTab, setActiveTab] = useState('to-visit'); // 'to-visit' | 'awaiting' | 'visited'
  const [selectedPatient, setSelectedPatient] = useState(null);

  const todayStr = getTodayDateString(0);

  // Categorize active cohort
  const activePatients = useMemo(() => {
    return patients.filter((p) => p.status !== 'discharged' && p.status !== 'deceased');
  }, [patients]);

  // Patients who have today's temperature, but doctor hasn't visited yet
  const toVisitList = useMemo(() => {
    return activePatients.filter((p) => {
      const readings = getTodayReadings(p, todayStr);
      const hasTempToday = readings.length > 0;
      const visited = isVisitedToday(p, todayStr);
      return hasTempToday && !visited;
    });
  }, [activePatients, todayStr]);

  // Patients who DO NOT have today's temperature recorded yet (LOCKED)
  const awaitingTempList = useMemo(() => {
    return activePatients.filter((p) => {
      const readings = getTodayReadings(p, todayStr);
      return readings.length === 0;
    });
  }, [activePatients, todayStr]);

  // Patients already visited today
  const visitedList = useMemo(() => {
    return activePatients.filter((p) => {
      return isVisitedToday(p, todayStr);
    });
  }, [activePatients, todayStr]);

  // Filter based on active tab and search query
  const filteredPatients = useMemo(() => {
    let list = [];
    if (activeTab === 'to-visit') {
      list = toVisitList;
    } else if (activeTab === 'awaiting') {
      list = awaitingTempList;
    } else if (activeTab === 'visited') {
      list = visitedList;
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
  }, [activeTab, toVisitList, awaitingTempList, visitedList, searchQuery]);

  const handlePatientClick = (patient) => {
    const readings = getTodayReadings(patient, todayStr);
    const hasTemp = readings.length > 0;

    // Business Rule: Doctor can't open a patient until today's temperature exists
    if (!hasTemp) {
      if (onNotify) {
        onNotify({
          type: 'warning',
          title: 'Patient Chart Locked',
          message: `Bed ${patient.bedNumber} (${patient.name}) cannot be opened until today's temperature is recorded by the Nurse Station.`,
        });
      }
      return;
    }

    setSelectedPatient(patient);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Hero Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
                Attending Physician Portal
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Today's Rounds
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Doctor Clinical Rounds
            </h2>
          </div>

          {/* Rounds Summary Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 rounded-xl px-3 py-2">
              <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400">To Visit: </span>
                <strong className="text-sky-700 dark:text-sky-300">{toVisitList.length}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl px-3 py-2">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400">Visited: </span>
                <strong className="text-emerald-700 dark:text-emerald-300">{visitedList.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
            <span>
              Rounds Completion: {activePatients.length > 0 ? Math.round((visitedList.length / activePatients.length) * 100) : 0}%
            </span>
            <span>
              {awaitingTempList.length} Locked (Awaiting Temperature)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(visitedList.length / (activePatients.length || 1)) * 100}%` }}
              title="Visited"
            />
            <div
              className="h-full bg-sky-400 transition-all duration-500"
              style={{ width: `${(toVisitList.length / (activePatients.length || 1)) * 100}%` }}
              title="Ready to Visit"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('to-visit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'to-visit'
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>To Visit</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'to-visit' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {toVisitList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('awaiting')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'awaiting'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-500" />
          <span>Awaiting Temperature (Locked)</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'awaiting'
              ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {awaitingTempList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('visited')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'visited'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Visited</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'visited' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {visitedList.length}
          </span>
        </button>
      </div>

      {/* Patient Cards List */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'to-visit'
              ? 'No Unvisited Patients Awaiting Rounds'
              : activeTab === 'awaiting'
              ? 'No Patients Awaiting Temperatures'
              : 'No Visited Patients Yet'
          }
          message={
            activeTab === 'to-visit'
              ? 'All patients with recorded temperatures have been visited by the physician today.'
              : activeTab === 'awaiting'
              ? 'Every patient has their daily temperature recorded. Zero patients locked!'
              : 'Visit your first patient to log rounds and update clinical notes.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredPatients.map((patient) => {
            const todayReadings = getTodayReadings(patient, todayStr);
            const hasTemp = todayReadings.length > 0;
            const latestReading = hasTemp ? todayReadings[todayReadings.length - 1] : null;
            const hasFever = latestReading ? isFever(latestReading.temp) : false;
            const visited = isVisitedToday(patient, todayStr);
            const feverFreeDays = calculateFeverFreeDays(patient, todayStr);
            const canDischarge = canRecommendDischarge(patient, todayStr);
            const isRecommended = patient.status === 'recommended';

            // If no temp today -> Card is LOCKED (greyed out, not openable)
            if (!hasTemp) {
              return (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 opacity-75 cursor-not-allowed flex flex-col justify-between group transition-all"
                  title="Patient locked: awaiting temperature from nurse"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold px-2.5 py-1 rounded-xl bg-slate-400 text-white">
                        {patient.bedNumber}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Locked: Needs Nurse Temp</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {patient.age} yrs • Admitted {patient.admittedDate}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Chart locked per clinical protocol</span>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            }

            // UNLOCKED CARD (Has today's temperature)
            return (
              <button
                key={patient.id}
                onClick={() => handlePatientClick(patient)}
                className={`text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all duration-200 hover:shadow-lg active:scale-98 flex flex-col justify-between group relative overflow-hidden ${
                  hasFever
                    ? 'border-red-400/80 dark:border-red-900/80 shadow-red-500/5 bg-red-50/20 dark:bg-red-950/10'
                    : visited
                    ? 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500'
                    : 'border-sky-200 dark:border-sky-900/50 hover:border-sky-500'
                }`}
              >
                {/* Fever Alert Banner */}
                {hasFever && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] uppercase font-black px-2.5 py-0.5 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Fever Flag</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black px-2.5 py-1 rounded-xl bg-sky-600 text-white shadow-sm">
                        {patient.bedNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {patient.id}
                      </span>
                    </div>

                    {/* Vitals pill */}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      hasFever
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    }`}>
                      <span>{latestReading.temp.toFixed(1)}°C</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {patient.age} yrs • {patient.gender === 'F' ? 'Female' : 'Male'}
                  </p>
                </div>

                {/* Bottom info */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 dark:text-slate-400">Fever-free:</span>
                      <strong className={`font-bold ${feverFreeDays >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {feverFreeDays}/3 d
                      </strong>
                      {feverFreeDays >= 3 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          Ready
                        </span>
                      )}
                    </div>
                    <div>
                      {isRecommended ? (
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          Discharge Recommended
                        </span>
                      ) : visited ? (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Visited Today</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                          Pending Doctor Visit
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Examine</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          isOpen={Boolean(selectedPatient)}
          onClose={() => setSelectedPatient(null)}
          patient={selectedPatient}
          onMarkVisited={onMarkVisited}
          onRecommendDischarge={onRecommendDischarge}
          onMarkDeceased={onMarkDeceased}
          onAddTreatmentNote={onAddTreatmentNote}
        />
      )}
    </div>
  );
}

