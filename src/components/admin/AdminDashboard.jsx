import React, { useState, useMemo } from 'react';
import AdmitModal from './AdmitModal';
import DischargeQueue from './DischargeQueue';
import BedGrid from './BedGrid';
import ActivityLog from './ActivityLog';
import { 
  TOTAL_BEDS,
  getTodayDateString, 
  getTodayReadings, 
  isVisitedToday,
  calculateFacilityMetrics,
  BENCHMARK_SUCCESS_RATE,
  MORTALITY_ALERT_THRESHOLD,
  MORTALITY_WARNING_THRESHOLD
} from '../../utils/medicalRules';
import { 
  Building2, 
  Bed, 
  HeartPulse, 
  Thermometer, 
  Stethoscope, 
  Sparkles, 
  UserPlus, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  History,
  LayoutGrid,
  HeartHandshake
} from 'lucide-react';

export default function AdminDashboard({
  patients,
  facilityStats,
  activityLogs,
  onAdmitPatient,
  onDischargePatient,
  searchQuery,
  showOnboarding,
  onDismissOnboarding,
}) {
  const [activeTab, setActiveTab] = useState('discharge'); // 'discharge' | 'grid' | 'logs'
  const [admitModalOpen, setAdmitModalOpen] = useState(false);

  const todayStr = getTodayDateString(0);

  // Active (in-facility) patients
  const activePatients = useMemo(() => {
    return patients.filter((p) => p.status !== 'discharged' && p.status !== 'deceased');
  }, [patients]);

  const occupiedCount = activePatients.length;
  const isFacilityFull = occupiedCount >= TOTAL_BEDS;

  // Find next available bed number (e.g., lowest unoccupied bed B01 - B74)
  const nextAvailableBed = useMemo(() => {
    if (isFacilityFull) return null;
    const occupiedBeds = new Set(activePatients.map((p) => p.bedNumber));
    for (let i = 1; i <= TOTAL_BEDS; i++) {
      const bNum = `B${String(i).padStart(2, '0')}`;
      if (!occupiedBeds.has(bNum)) {
        return bNum;
      }
    }
    return null;
  }, [activePatients, isFacilityFull]);

  // Patients recommended by doctor for discharge
  const recommendedPatients = useMemo(() => {
    let list = activePatients.filter((p) => p.status === 'recommended');
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.bedNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activePatients, searchQuery]);

  // Pending tasks today
  const tempsPendingToday = useMemo(() => {
    return activePatients.filter((p) => {
      const readings = getTodayReadings(p, todayStr);
      return readings.length === 0;
    }).length;
  }, [activePatients, todayStr]);

  const doctorVisitsPendingToday = useMemo(() => {
    return activePatients.filter((p) => {
      return !isVisitedToday(p, todayStr);
    }).length;
  }, [activePatients, todayStr]);

  // Facility Quality Metrics
  const metrics = useMemo(() => {
    return calculateFacilityMetrics(
      facilityStats.recoveredCount,
      facilityStats.deceasedCount
    );
  }, [facilityStats]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Red Alert Banner if mortality > 15% */}
      {metrics.mortalityRate > MORTALITY_ALERT_THRESHOLD && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500 animate-soft-pulse">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 flex-shrink-0 mt-0.5 text-white" />
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                CRITICAL MORTALITY ALERT: {metrics.mortalityRate.toFixed(1)}% (Ceiling: 15.0%)
              </h3>
              <p className="text-xs sm:text-sm text-red-100 mt-1 leading-relaxed">
                The quarantine facility mortality rate has breached the mandatory 15.0% clinical ceiling. Immediate clinical intervention, chief medical officer review, and heightened triage protocols are required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Yellow Heads-up Banner if mortality > 12% and <= 15% */}
      {metrics.mortalityRate > MORTALITY_WARNING_THRESHOLD && metrics.mortalityRate <= MORTALITY_ALERT_THRESHOLD && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 border border-amber-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 text-slate-950" />
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                QUALITY HEADS-UP: Mortality Rate {metrics.mortalityRate.toFixed(1)}% Approaching 15.0% Limit
              </h3>
              <p className="text-xs sm:text-sm text-slate-900 mt-1 font-medium leading-relaxed">
                Facility mortality is currently above the 12.0% warning threshold. Monitor unstable patients closely to maintain the 85.0% recovery benchmark.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header with Admit Patient Action */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400">
              Facility Executive Dashboard
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Quarantine Operations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Admin Command Centre
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time bed management, clinical throughput quality control, and patient admissions.
          </p>
        </div>

        {/* Admit Patient Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => setAdmitModalOpen(true)}
            disabled={isFacilityFull}
            className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isFacilityFull
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 active:scale-95'
            }`}
            title={isFacilityFull ? 'Facility full - discharge first' : `Admit new patient to ${nextAvailableBed}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {isFacilityFull ? 'Facility full - discharge first' : 'Admit Patient'}
            </span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Beds Occupied */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider">Bed Occupancy</span>
            <Bed className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {occupiedCount} <span className="text-base sm:text-lg text-slate-400 font-bold">/ {TOTAL_BEDS}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className={isFacilityFull ? 'text-red-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                {isFacilityFull ? '100% Full (No Vacancy)' : `${TOTAL_BEDS - occupiedCount} Beds Available`}
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Ready to Discharge */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider">Ready to Discharge</span>
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {recommendedPatients.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Physician recommended
            </p>
          </div>
        </div>

        {/* Stat 3: Temperatures Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider">Vitals Pending</span>
            <Thermometer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
              {tempsPendingToday}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pending nurse record
            </p>
          </div>
        </div>

        {/* Stat 4: Doctor Visits Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider">Rounds Pending</span>
            <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
              {doctorVisitsPendingToday}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pending physician visit
            </p>
          </div>
        </div>
      </div>

      {/* Quality Card (Clinical Benchmarks) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Clinical Quality &amp; Outcome Benchmarks
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Total Resolved Outcomes: <strong>{metrics.totalOutcomes}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Success Rate vs 85% Benchmark */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Recovery / Success Rate
              </span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Benchmark &ge; {BENCHMARK_SUCCESS_RATE}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {metrics.successRate.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({metrics.recoveredCount} Recovered)
              </span>
              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                metrics.isAboveSuccessBenchmark
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}>
                {metrics.isAboveSuccessBenchmark ? 'Benchmark Met' : 'Below Target'}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.isAboveSuccessBenchmark ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, metrics.successRate)}%` }}
              />
            </div>
          </div>

          {/* Mortality Rate vs 15% Limit */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mortality Rate
              </span>
              <span className="text-xs font-bold text-red-500">
                Safety Ceiling &le; {MORTALITY_ALERT_THRESHOLD}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${
                metrics.mortalityRate > MORTALITY_ALERT_THRESHOLD
                  ? 'text-red-600 dark:text-red-400'
                  : metrics.mortalityRate > MORTALITY_WARNING_THRESHOLD
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {metrics.mortalityRate.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({metrics.deceasedCount} Deceased)
              </span>
              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                metrics.mortalityRate > MORTALITY_ALERT_THRESHOLD
                  ? 'bg-red-600 text-white animate-pulse'
                  : metrics.mortalityRate > MORTALITY_WARNING_THRESHOLD
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {metrics.mortalityRate > MORTALITY_ALERT_THRESHOLD
                  ? 'Critical Breach'
                  : metrics.mortalityRate > MORTALITY_WARNING_THRESHOLD
                  ? 'Warning'
                  : 'Safe Tier'}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.mortalityRate > MORTALITY_ALERT_THRESHOLD
                    ? 'bg-red-600'
                    : metrics.mortalityRate > MORTALITY_WARNING_THRESHOLD
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (metrics.mortalityRate / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('discharge')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'discharge'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Discharge Queue</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'discharge' ? 'bg-purple-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {recommendedPatients.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'grid'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>74-Bed Map</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'grid'
              ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {occupiedCount}/74
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'logs'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Audit Log</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'logs' ? 'bg-teal-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {(activityLogs || []).length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'discharge' && (
        <DischargeQueue
          recommendedPatients={recommendedPatients}
          onDischargePatient={onDischargePatient}
        />
      )}

      {activeTab === 'grid' && (
        <BedGrid
          patients={patients}
          totalBeds={TOTAL_BEDS}
        />
      )}

      {activeTab === 'logs' && (
        <ActivityLog logs={activityLogs} />
      )}

      {/* Admit Patient Modal */}
      <AdmitModal
        isOpen={admitModalOpen}
        onClose={() => setAdmitModalOpen(false)}
        onAdmitPatient={onAdmitPatient}
        nextAvailableBed={nextAvailableBed}
        isFacilityFull={isFacilityFull}
      />
    </div>
  );
}

