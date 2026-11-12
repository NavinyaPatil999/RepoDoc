import { getTodayDateString } from '../utils/medicalRules.js';

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Priya', 'Rajesh', 'Sunita', 'Vikram', 'Ananya', 'Rohan', 'Kavita',
  'Amit', 'Deepa', 'Manoj', 'Pooja', 'Sanjay', 'Sneha', 'Alok', 'Meera',
  'Rahul', 'Divya', 'Suresh', 'Shilpa', 'Harish', 'Radhika', 'Sandeep', 'Preeti',
  'Vinod', 'Ritu', 'Karthik', 'Neha', 'Ashok', 'Swati', 'Gaurav', 'Nandini',
  'Naveen', 'Bhavna', 'Arun', 'Shalini', 'Kiran', 'Aditi', 'Pradeep', 'Rashmi',
  'Nitin', 'Pallavi', 'Dinesh', 'Archana', 'Ajay', 'Shweta', 'Kamal', 'Vandana',
  'Mahesh', 'Renu', 'Chetan', 'Usha', 'Sameer', 'Jyoti', 'Tarun', 'Suman',
  'Vivek', 'Geeta', 'Anil', 'Anita', 'Manish', 'Rekha', 'Sachin', 'Sarita',
  'Prakash', 'Indira', 'Santosh', 'Leela', 'Mohan', 'Kusum', 'Devendra', 'Maya',
  'Hemant', 'Gayatri'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Nair', 'Kulkarni', 'Mehta', 'Gupta', 'Joshi', 'Sen',
  'Verma', 'Iyer', 'Reddy', 'Choudhury', 'Deshmukh', 'Banerjee', 'Pandey', 'Pillai',
  'Bhatia', 'Swamy', 'Nambiar', 'Mukherjee', 'Trivedi', 'Menon', 'Rao', 'Agarwal',
  'Saxena', 'Kapoor', 'Raman', 'Singhal', 'Hegde', 'Ganguly', 'Chauhan', 'Natarajan',
  'Malhotra', 'Bose', 'Shukla', 'Bhardwaj', 'Mishra', 'Chopra', 'Sarin', 'Acharya',
  'Goswami', 'Dubey', 'Sengupta', 'Gokhale', 'Chatterjee', 'Venkatesh', 'Dutta', 'Suri',
  'Bhatt', 'Thakur', 'Tripathi', 'Mahajan', 'Sethi', 'Prabhu', 'Bhandari', 'Sood',
  'Puri', 'Garg', 'Chhabra', 'Kaul', 'Dhar', 'Kashyap', 'Chakraborty', 'Gautam',
  'Pawar', 'Bhat', 'Babu', 'Biswas', 'Ghosh', 'Subramanian', 'Krishnan', 'Somani',
  'Talwar', 'Varma'
];

export const INITIAL_FACILITY_STATS = {
  recoveredCount: 40,
  deceasedCount: 5,
};

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'log-seed-1',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    role: 'nurse',
    actor: 'Nurse Priya S.',
    action: 'Logged Temperature',
    patientName: 'Aarav Sharma',
    bedNumber: 'B01',
    details: 'Logged 36.8°C (Normal)',
  },
  {
    id: 'log-seed-2',
    timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    role: 'nurse',
    actor: 'Nurse Priya S.',
    action: 'Fever Alert',
    patientName: 'Rajesh Nair',
    bedNumber: 'B03',
    details: 'High fever recorded: 38.6°C',
  },
  {
    id: 'log-seed-3',
    timestamp: new Date(Date.now() - 2.8 * 3600000).toISOString(),
    role: 'doctor',
    actor: 'Dr. Vikram Seth',
    action: 'Completed Rounds',
    patientName: 'Aarav Sharma',
    bedNumber: 'B01',
    details: 'Chest clear, oxygen stable at 98%',
  },
  {
    id: 'log-seed-4',
    timestamp: new Date(Date.now() - 2.1 * 3600000).toISOString(),
    role: 'doctor',
    actor: 'Dr. Vikram Seth',
    action: 'Recommended Discharge',
    patientName: 'Pooja Choudhury',
    bedNumber: 'B12',
    details: '3 consecutive fever-free days verified. Clinically ready.',
  },
  {
    id: 'log-seed-5',
    timestamp: new Date(Date.now() - 1.2 * 3600000).toISOString(),
    role: 'admin',
    actor: 'Admin Director',
    action: 'Discharged Patient',
    patientName: 'Sunita Rao (Past)',
    bedNumber: 'B18 (Prior)',
    details: 'Discharged after complete recovery protocol.',
  },
];

/**
 * Generate 74 patients with full occupancy and realistic distributions
 */
export const generateInitialPatients = () => {
  const patients = [];
  const today = getTodayDateString(0);
  const dayMinus1 = getTodayDateString(-1);
  const dayMinus2 = getTodayDateString(-2);
  const dayMinus3 = getTodayDateString(-3);
  const dayMinus4 = getTodayDateString(-4);

  for (let i = 1; i <= 74; i++) {
    const bedNumber = `B${String(i).padStart(2, '0')}`;
    const firstName = INDIAN_FIRST_NAMES[(i - 1) % INDIAN_FIRST_NAMES.length];
    const lastName = INDIAN_LAST_NAMES[(i - 1) % INDIAN_LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const age = 20 + ((i * 7) % 58); // Ages between 20 and 77
    const gender = i % 2 === 0 ? 'F' : 'M';
    const admitDaysAgo = 3 + (i % 8);
    const admittedDate = getTodayDateString(-admitDaysAgo);

    // Distribution setup:
    // ~45% measured today (about 33 patients): beds 1 to 33
    // Beds 34 to 74 are pending today's temperature
    const isMeasuredToday = i <= 33;

    // Past 4 days temperatures
    const tempHistory = [];

    // Let's create realistic patient patterns:
    // Group A (Beds 1-8): Ready for discharge or recommended (3+ fever free days, normal temp)
    // Group B (Beds 9-16): Measured today, high fever (>= 38.0°C)
    // Group C (Beds 17-33): Measured today, normal/elevated (36.5 - 37.8°C), 1 or 2 fever-free days
    // Group D (Beds 34-45): Pending today, previously 2 fever-free days (waiting for today to reach 3)
    // Group E (Beds 46-60): Pending today, had fever recently
    // Group F (Beds 61-74): Pending today, mixed admissions

    let feverFreeTarget = 0;
    let todayTemp = null;
    let isFeverToday = false;

    if (i <= 8) {
      // 3+ consecutive fever-free days
      feverFreeTarget = 3;
      todayTemp = parseFloat((36.5 + (i * 0.1) % 0.6).toFixed(1)); // 36.5 - 37.0
      tempHistory.push({ date: dayMinus4, time: '08:45', temp: 37.4 });
      tempHistory.push({ date: dayMinus3, time: '09:00', temp: 37.0 });
      tempHistory.push({ date: dayMinus2, time: '08:30', temp: 36.8 });
      tempHistory.push({ date: dayMinus1, time: '09:15', temp: 36.7 });
      tempHistory.push({ date: today, time: '09:00', temp: todayTemp });
    } else if (i >= 9 && i <= 15) {
      // Today high fever
      isFeverToday = true;
      todayTemp = parseFloat((38.2 + (i % 5) * 0.3).toFixed(1)); // 38.2 to 39.4°C
      tempHistory.push({ date: dayMinus3, time: '09:10', temp: 38.0 });
      tempHistory.push({ date: dayMinus2, time: '08:50', temp: 38.5 });
      tempHistory.push({ date: dayMinus1, time: '09:20', temp: 38.1 });
      tempHistory.push({ date: today, time: '08:30', temp: todayTemp, note: 'Persistent dry cough' });
    } else if (i <= 33) {
      // Measured today, normal or mild
      todayTemp = parseFloat((36.8 + (i % 4) * 0.25).toFixed(1)); // 36.8 to 37.55
      tempHistory.push({ date: dayMinus3, time: '08:40', temp: 38.2 }); // Fever 3 days ago broke streak
      tempHistory.push({ date: dayMinus2, time: '09:00', temp: 37.1 });
      tempHistory.push({ date: dayMinus1, time: '08:45', temp: 36.9 });
      tempHistory.push({ date: today, time: '09:30', temp: todayTemp });
    } else if (i <= 45) {
      // Pending today, had 2 fever free days yesterday
      tempHistory.push({ date: dayMinus3, time: '09:10', temp: 38.1 });
      tempHistory.push({ date: dayMinus2, time: '09:00', temp: 36.8 });
      tempHistory.push({ date: dayMinus1, time: '08:30', temp: 36.6 });
      // No reading today yet
    } else if (i <= 60) {
      // Pending today, recent fever yesterday
      tempHistory.push({ date: dayMinus3, time: '08:50', temp: 37.8 });
      tempHistory.push({ date: dayMinus2, time: '09:15', temp: 38.4 });
      tempHistory.push({ date: dayMinus1, time: '09:00', temp: 38.2 });
    } else {
      // Pending today, new/mixed
      tempHistory.push({ date: dayMinus2, time: '10:00', temp: 37.6 });
      tempHistory.push({ date: dayMinus1, time: '09:30', temp: 37.4 });
    }

    // Visited today logic:
    // Doctors visit patients whose temperatures have been taken.
    // Let's make ~15 patients visited today
    const visitHistory = [];
    const isVisited = isMeasuredToday && (i <= 6 || (i >= 12 && i <= 18));
    if (isVisited) {
      visitHistory.push({
        date: today,
        time: '11:15',
        doctor: 'Dr. Vikram Seth',
        note: i <= 8 ? 'Vitals excellent. Ready for discharge order.' : 'Symptomatic review complete. Continue fluids.',
      });
    }

    // Treatment notes
    const treatmentNotes = [
      {
        date: dayMinus1,
        time: '14:20',
        doctor: 'Dr. Ananya Roy',
        text: 'Initiated antiviral protocol. Monitor oxygen saturation every 4h.',
      },
    ];

    if (isVisited) {
      treatmentNotes.push({
        date: today,
        time: '11:20',
        doctor: 'Dr. Vikram Seth',
        text: i <= 8 ? 'Patient afebrile for 72+ hours. Lungs clear to auscultation.' : 'Patient resting comfortably. Hydration adequate.',
      });
    }

    // Status:
    // For beds 1, 2, 3: already visited and doctor recommended for discharge!
    // They appear immediately in the Admin Discharge Queue.
    let status = 'active';
    if (i <= 3) {
      status = 'recommended';
    }

    patients.push({
      id: `P-${String(i).padStart(3, '0')}`,
      bedNumber,
      name,
      age,
      gender,
      admittedDate,
      status, // 'active' | 'recommended' | 'discharged' | 'deceased'
      temperatureHistory: tempHistory,
      visitHistory,
      treatmentNotes,
      recommendedAt: status === 'recommended' ? new Date(Date.now() - 2 * 3600000).toISOString() : null,
      recommendedBy: status === 'recommended' ? 'Dr. Vikram Seth' : null,
    });
  }

  return patients;
};
