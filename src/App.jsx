import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import LoadingSkeleton from './components/common/LoadingSkeleton';
import LoginScreen from './components/login/LoginScreen';
import NurseDashboard from './components/nurse/NurseDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { 
  loadStoredState, 
  saveStoredState, 
  clearStoredState 
} from './utils/storage';
import { 
  generateInitialPatients, 
  INITIAL_FACILITY_STATS, 
  INITIAL_ACTIVITY_LOGS 
} from './constants/initialData';
import { 
  getTodayDateString, 
  isFever, 
  FEVER_THRESHOLD, 
  calculateFeverFreeDays 
} from './utils/medicalRules';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null); // 'nurse' | 'doctor' | 'admin' | null
  const [patients, setPatients] = useState([]);
  const [facilityStats, setFacilityStats] = useState(INITIAL_FACILITY_STATS);
  const [activityLogs, setActivityLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [dismissedTooltips, setDismissedTooltips] = useState({
    nurse: false,
    doctor: false,
    admin: false,
  });
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = useCallback((type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize or Load from localStorage wrapped in try/catch
  useEffect(() => {
    try {
      const stored = loadStoredState();
      if (stored && Array.isArray(stored.patients) && stored.patients.length > 0) {
        setPatients(stored.patients);
        setFacilityStats(stored.facilityStats || INITIAL_FACILITY_STATS);
        setActivityLogs(stored.activityLogs || INITIAL_ACTIVITY_LOGS);
        setCurrentRole(stored.currentRole || null);
        setDismissedTooltips(stored.dismissedTooltips || { nurse: false, doctor: false, admin: false });
        if (typeof stored.darkMode === 'boolean') {
          setDarkMode(stored.darkMode);
        } else {
          // Detect system preference
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          setDarkMode(prefersDark);
        }
      } else {
        // Seed default
        const initialPatients = generateInitialPatients();
        setPatients(initialPatients);
        setFacilityStats(INITIAL_FACILITY_STATS);
        setActivityLogs(INITIAL_ACTIVITY_LOGS);
      }
    } catch (e) {
      console.error('Initialization error, falling back to seed:', e);
      setPatients(generateInitialPatients());
      setFacilityStats(INITIAL_FACILITY_STATS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
    } finally {
      // Simulate brief smooth medical boot skeleton
      const timer = setTimeout(() => {
        setLoading(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync state to localStorage whenever state updates
  useEffect(() => {
    if (!loading && patients.length > 0) {
      saveStoredState({
        patients,
        facilityStats,
        activityLogs,
        currentRole,
        dismissedTooltips,
        darkMode,
      });
    }
  }, [patients, facilityStats, activityLogs, currentRole, dismissedTooltips, darkMode, loading]);

  // Handle Dark Mode DOM class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Log activity helper
  const logActivity = useCallback((role, actor, action, patientName, bedNumber, details) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      role,
      actor,
      action,
      patientName,
      bedNumber,
      details,
    };
    setActivityLogs((prev) => [newEntry, ...prev]);
  }, []);

  // Reset Demo Data
  const handleResetDemoData = useCallback(() => {
    try {
      clearStoredState();
      const freshPatients = generateInitialPatients();
      setPatients(freshPatients);
      setFacilityStats({ recoveredCount: 40, deceasedCount: 5 });
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      setSearchQuery('');
      setDismissedTooltips({ nurse: false, doctor: false, admin: false });

      addToast(
        'info',
        'Demo Data Reset',
        'All 74 quarantine beds, clinical records, and baseline metrics (40 recovered, 5 deceased) have been restored.'
      );
    } catch (err) {
      addToast('error', 'Reset Failed', 'Unable to reset demo data.');
    }
  }, [addToast]);

  // NURSE: Save Temperature Reading (Initial or Re-check)
  const handleSaveTemperature = useCallback((patientId, tempValue, note, isRecheck) => {
    const todayStr = getTodayDateString(0);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const feverFlag = tempValue >= FEVER_THRESHOLD;

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;

        const newReading = {
          date: todayStr,
          time: nowTime,
          temp: tempValue,
          isRecheck,
          note: note || undefined,
        };

        const updatedHistory = [...(patient.temperatureHistory || []), newReading];

        return {
          ...patient,
          temperatureHistory: updatedHistory,
        };
      })
    );

    const targetPatient = patients.find((p) => p.id === patientId);
    const bed = targetPatient?.bedNumber || 'Patient';
    const pName = targetPatient?.name || '';

    // Log Activity
    logActivity(
      'nurse',
      'Clinical Nurse',
      isRecheck ? 'Recorded Vitals Re-Check' : 'Recorded Daily Vitals',
      pName,
      bed,
      `${tempValue.toFixed(1)}°C ${feverFlag ? '(FEVER FLAGGED)' : '(Afebrile)'}${note ? ` • Note: ${note}` : ''}`
    );

    if (feverFlag) {
      addToast(
        'warning',
        `⚠️ Fever Flagged: ${bed}`,
        `Recorded ${tempValue.toFixed(1)}°C for ${pName}. Patient flagged for attending physician review.`
      );
    } else {
      addToast(
        'success',
        `Temperature Saved: ${bed}`,
        `Logged ${tempValue.toFixed(1)}°C for ${pName} at ${nowTime}.`
      );
    }
  }, [patients, logActivity, addToast]);

  // DOCTOR: Mark Patient Visited Today
  const handleMarkVisited = useCallback((patientId) => {
    const todayStr = getTodayDateString(0);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;

        const alreadyVisited = (patient.visitHistory || []).some((v) => v.date === todayStr);
        if (alreadyVisited) return patient;

        const newVisit = {
          date: todayStr,
          time: nowTime,
          doctor: 'Dr. Vikram Seth (MD)',
        };

        return {
          ...patient,
          visitHistory: [...(patient.visitHistory || []), newVisit],
        };
      })
    );

    const targetPatient = patients.find((p) => p.id === patientId);
    const bed = targetPatient?.bedNumber || 'Patient';
    const pName = targetPatient?.name || '';

    logActivity(
      'doctor',
      'Dr. Vikram Seth',
      'Completed Physician Rounds',
      pName,
      bed,
      `Clinical evaluation complete at ${nowTime}.`
    );

    addToast(
      'success',
      `Rounds Logged: ${bed}`,
      `Marked ${pName} as visited today.`
    );
  }, [patients, logActivity, addToast]);

  // DOCTOR: Recommend Discharge
  const handleRecommendDischarge = useCallback((patientId) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    if (!targetPatient) return;

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;
        return {
          ...patient,
          status: 'recommended',
          recommendedAt: new Date().toISOString(),
          recommendedBy: 'Dr. Vikram Seth (MD)',
        };
      })
    );

    const bed = targetPatient.bedNumber;
    const pName = targetPatient.name;

    logActivity(
      'doctor',
      'Dr. Vikram Seth',
      'Recommended Discharge',
      pName,
      bed,
      'Verified 3 consecutive fever-free days. Referred to Admin Discharge Queue.'
    );

    addToast(
      'success',
      `Discharge Recommended: ${bed}`,
      `${pName} approved for discharge. Queued for Facility Admin final release.`
    );
  }, [patients, logActivity, addToast]);

  // DOCTOR: Mark Deceased
  const handleMarkDeceased = useCallback((patientId) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    if (!targetPatient) return;

    // Update patient status to deceased
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;
        return {
          ...patient,
          status: 'deceased',
          deceasedAt: new Date().toISOString(),
        };
      })
    );

    // Update facility stats (+1 deceased)
    setFacilityStats((prev) => ({
      ...prev,
      deceasedCount: prev.deceasedCount + 1,
    }));

    const bed = targetPatient.bedNumber;
    const pName = targetPatient.name;

    logActivity(
      'doctor',
      'Dr. Vikram Seth',
      'Marked Deceased',
      pName,
      bed,
      `Deceased entry recorded. Mortality statistics updated. Bed ${bed} released.`
    );

    addToast(
      'error',
      `Deceased Record Logged: ${bed}`,
      `${pName} recorded as deceased. Bed ${bed} is released and facility mortality metric has been updated.`
    );
  }, [patients, logActivity, addToast]);

  // DOCTOR: Add Clinical Treatment Note
  const handleAddTreatmentNote = useCallback((patientId, text) => {
    const todayStr = getTodayDateString(0);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;
        const newNote = {
          date: todayStr,
          time: nowTime,
          doctor: 'Dr. Vikram Seth',
          text,
        };
        return {
          ...patient,
          treatmentNotes: [...(patient.treatmentNotes || []), newNote],
        };
      })
    );

    const targetPatient = patients.find((p) => p.id === patientId);
    const bed = targetPatient?.bedNumber || 'Patient';
    const pName = targetPatient?.name || '';

    logActivity(
      'doctor',
      'Dr. Vikram Seth',
      'Added Clinical Note',
      pName,
      bed,
      text
    );

    addToast(
      'success',
      'Treatment Note Saved',
      `Added clinical note for ${pName} (${bed}).`
    );
  }, [patients, logActivity, addToast]);

  // ADMIN: Discharge Patient
  const handleDischargePatient = useCallback((patientId) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    if (!targetPatient) return;

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient;
        return {
          ...patient,
          status: 'discharged',
          dischargedAt: new Date().toISOString(),
        };
      })
    );

    // Increment recovered count
    setFacilityStats((prev) => ({
      ...prev,
      recoveredCount: prev.recoveredCount + 1,
    }));

    const bed = targetPatient.bedNumber;
    const pName = targetPatient.name;

    logActivity(
      'admin',
      'Facility Admin',
      'Discharged Recovered Patient',
      pName,
      bed,
      `Official discharge finalized. Bed ${bed} is now vacant and ready for new intake.`
    );

    addToast(
      'success',
      `🎉 Patient Discharged: Bed ${bed}`,
      `${pName} has successfully recovered and been discharged. Bed ${bed} is now open for intake.`
    );
  }, [patients, logActivity, addToast]);

  // ADMIN: Admit Patient
  const handleAdmitPatient = useCallback((patientData) => {
    const newId = `P-${String(patients.length + 1).padStart(3, '0')}`;
    const todayStr = getTodayDateString(0);

    const newPatient = {
      id: newId,
      bedNumber: patientData.bedNumber,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      admittedDate: todayStr,
      status: 'active',
      temperatureHistory: [],
      visitHistory: [],
      treatmentNotes: patientData.notes
        ? [
            {
              date: todayStr,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              doctor: 'Intake Triage',
              text: `Admission Note: ${patientData.notes}`,
            },
          ]
        : [],
    };

    setPatients((prev) => [newPatient, ...prev]);

    logActivity(
      'admin',
      'Facility Admin',
      'Admitted New Patient',
      patientData.name,
      patientData.bedNumber,
      `Age ${patientData.age}, ${patientData.gender}. Assigned to Bed ${patientData.bedNumber}.`
    );

    addToast(
      'success',
      `Patient Admitted: Bed ${patientData.bedNumber}`,
      `${patientData.name} admitted successfully to Bed ${patientData.bedNumber}.`
    );
  }, [patients.length, logActivity, addToast]);

  // Tooltip dismissal handlers
  const handleDismissTooltip = (role) => {
    setDismissedTooltips((prev) => ({ ...prev, [role]: true }));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Active Occupied Beds Count
  const occupiedBedsCount = patients.filter(
    (p) => p.status !== 'discharged' && p.status !== 'deceased'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navbar: visible on role views */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onResetDemoData={handleResetDemoData}
        occupiedBedsCount={occupiedBedsCount}
        totalBeds={74}
      />

      {/* Main Content Area: State-based Screen Switcher */}
      <div className="flex-1">
        {currentRole === null && (
          <LoginScreen
            onSelectRole={(role) => setCurrentRole(role)}
            occupiedBeds={occupiedBedsCount}
            totalBeds={74}
          />
        )}

        {currentRole === 'nurse' && (
          <NurseDashboard
            patients={patients}
            onSaveReading={handleSaveTemperature}
            searchQuery={searchQuery}
          />
        )}

        {currentRole === 'doctor' && (
          <DoctorDashboard
            patients={patients}
            onMarkVisited={handleMarkVisited}
            onRecommendDischarge={handleRecommendDischarge}
            onMarkDeceased={handleMarkDeceased}
            onAddTreatmentNote={handleAddTreatmentNote}
            searchQuery={searchQuery}
            onNotify={(notif) => addToast(notif.type, notif.title, notif.message)}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            patients={patients}
            facilityStats={facilityStats}
            activityLogs={activityLogs}
            onAdmitPatient={handleAdmitPatient}
            onDischargePatient={handleDischargePatient}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Global Toast Notifications Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
