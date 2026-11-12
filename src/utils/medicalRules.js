export const FEVER_THRESHOLD = 38.0;
export const MIN_TEMP = 34.0;
export const MAX_TEMP = 42.0;
export const TOTAL_BEDS = 74;
export const BENCHMARK_SUCCESS_RATE = 85.0; // 85%
export const MORTALITY_ALERT_THRESHOLD = 15.0; // 15% red banner
export const MORTALITY_WARNING_THRESHOLD = 12.0; // 12% yellow heads-up

/**
 * Format today's date as YYYY-MM-DD
 */
export const getTodayDateString = (offsetDays = 0) => {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Validate temperature input
 */
export const validateTemperature = (tempInput) => {
  const temp = parseFloat(tempInput);
  if (isNaN(temp)) {
    return { valid: false, error: 'Please enter a valid numeric temperature.' };
  }
  if (temp < MIN_TEMP || temp > MAX_TEMP) {
    return {
      valid: false,
      error: `Measurement ${temp.toFixed(1)}°C is outside clinical range (${MIN_TEMP}°C - ${MAX_TEMP}°C). Please re-measure patient.`,
    };
  }
  return { valid: true, value: parseFloat(temp.toFixed(1)) };
};

/**
 * Check if a temperature is a fever
 */
export const isFever = (temp) => {
  return typeof temp === 'number' && temp >= FEVER_THRESHOLD;
};

/**
 * Get temperature status descriptor and color class
 */
export const getTempStatus = (temp) => {
  if (temp == null) return { label: 'No Reading', color: 'text-slate-400 bg-slate-100 dark:bg-slate-800' };
  if (temp >= FEVER_THRESHOLD) {
    return { label: 'Fever (>=38.0°C)', color: 'text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-400 border-red-300 dark:border-red-800' };
  }
  if (temp >= 37.5) {
    return { label: 'Elevated (37.5-37.9°C)', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800' };
  }
  return { label: 'Normal (<37.5°C)', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' };
};

/**
 * Check today's readings for a patient
 */
export const getTodayReadings = (patient, todayStr = getTodayDateString()) => {
  if (!patient || !Array.isArray(patient.temperatureHistory)) return [];
  return patient.temperatureHistory.filter((r) => r.date === todayStr);
};

export const getLatestTodayReading = (patient, todayStr = getTodayDateString()) => {
  const todayReadings = getTodayReadings(patient, todayStr);
  if (todayReadings.length === 0) return null;
  return todayReadings[todayReadings.length - 1];
};

/**
 * Check if doctor visited patient today
 */
export const isVisitedToday = (patient, todayStr = getTodayDateString()) => {
  if (!patient || !Array.isArray(patient.visitHistory)) return false;
  return patient.visitHistory.some((v) => v.date === todayStr);
};

/**
 * Calculate consecutive fever-free days
 * Business Rule:
 * Must have 3 full consecutive fever-free days with a reading each day.
 * Any fever (>= 38.0°C) on any day OR a missing reading day resets the count to 0.
 * We evaluate day 0 (today) if measured, then day -1, day -2, day -3, etc.
 */
export const calculateFeverFreeDays = (patient, todayStr = getTodayDateString()) => {
  if (!patient || !Array.isArray(patient.temperatureHistory) || patient.temperatureHistory.length === 0) {
    return 0;
  }

  // Group readings by date
  const readingsByDate = {};
  patient.temperatureHistory.forEach((r) => {
    if (!readingsByDate[r.date]) {
      readingsByDate[r.date] = [];
    }
    readingsByDate[r.date].push(r.temp);
  });

  // Check if today has a reading
  const todayReadings = readingsByDate[todayStr] || [];
  
  // If today has readings, does today have any fever?
  if (todayReadings.length > 0) {
    const todayHasFever = todayReadings.some((t) => t >= FEVER_THRESHOLD);
    if (todayHasFever) {
      return 0; // Today fever resets count to 0 immediately
    }
  }

  // Count backwards day by day
  let streak = 0;
  // Starting day index:
  // If today has readings and no fever, today counts as 1.
  // If today hasn't been read yet, we count backwards from yesterday.
  const startOffset = todayReadings.length > 0 ? 0 : -1;

  for (let offset = startOffset; offset >= -14; offset--) {
    const checkDate = getTodayDateString(offset);
    const dayTemps = readingsByDate[checkDate];

    // If day has no reading -> missing day breaks the streak
    if (!dayTemps || dayTemps.length === 0) {
      break;
    }

    // If any temp on this day had fever -> resets streak
    const hadFever = dayTemps.some((t) => t >= FEVER_THRESHOLD);
    if (hadFever) {
      break;
    }

    // Otherwise, this day was valid and fever-free
    streak++;
  }

  return streak;
};

/**
 * Format fever-free days display (capped at 3: "3/3 Ready" or "x/3")
 */
export const formatFeverFreeDays = (streak) => {
  const s = Math.max(0, streak || 0);
  if (s >= 3) {
    return '3/3 Ready';
  }
  return `${s}/3`;
};

/**
 * Check if recommend discharge is allowed for doctor:
 * Unlocks only after:
 * 1. Visit is marked today
 * 2. Patient has at least 3 full consecutive fever-free days with a reading each day.
 */
export const canRecommendDischarge = (patient, todayStr = getTodayDateString()) => {
  if (!patient || patient.status === 'recommended' || patient.status === 'discharged' || patient.status === 'deceased') {
    return { allowed: false, reason: 'Patient is not in an eligible active state.' };
  }

  const todayReading = getLatestTodayReading(patient, todayStr);
  if (!todayReading) {
    return { allowed: false, reason: "Awaiting today's temperature reading by Nurse." };
  }

  const visited = isVisitedToday(patient, todayStr);
  if (!visited) {
    return { allowed: false, reason: "Doctor visit must be marked today before recommending discharge." };
  }

  const feverFreeStreak = calculateFeverFreeDays(patient, todayStr);
  if (feverFreeStreak < 3) {
    return {
      allowed: false,
      reason: `Requires 3 consecutive fever-free days (currently ${feverFreeStreak}/3).`,
    };
  }

  return { allowed: true, feverFreeDays: feverFreeStreak };
};

/**
 * Calculate facility quality metrics
 */
export const calculateFacilityMetrics = (recoveredCount, deceasedCount) => {
  const totalOutcomes = recoveredCount + deceasedCount;
  
  const mortalityRate = totalOutcomes > 0 
    ? (deceasedCount / totalOutcomes) * 100 
    : 0;

  const successRate = totalOutcomes > 0 
    ? (recoveredCount / totalOutcomes) * 100 
    : 100;

  let alertLevel = 'normal'; // 'normal' | 'warning' | 'alert'
  if (mortalityRate > MORTALITY_ALERT_THRESHOLD) {
    alertLevel = 'alert'; // Red banner
  } else if (mortalityRate > MORTALITY_WARNING_THRESHOLD) {
    alertLevel = 'warning'; // Yellow heads-up
  }

  return {
    totalOutcomes,
    recoveredCount,
    deceasedCount,
    mortalityRate: parseFloat(mortalityRate.toFixed(1)),
    successRate: parseFloat(successRate.toFixed(1)),
    alertLevel,
    isAboveSuccessBenchmark: successRate >= BENCHMARK_SUCCESS_RATE,
  };
};

