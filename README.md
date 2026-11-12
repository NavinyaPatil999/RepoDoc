# Respo Doc 🫁🩺
### 74-Bed Virus Quarantine & Treatment Command Portal

A mobile-first, desktop-responsive clinical workflow web application built for a 74-bed virus isolation and treatment facility. Built with **React + Vite + Tailwind CSS**, zero backend required, robust state synchronization persisted in `localStorage` (safely wrapped in `try/catch`), and zero-config deployment for **Vercel**.

---

## 🌟 Clinical Problem Solved
In quarantine and viral isolation facilities:
1. Nurses must record every patient's temperature daily, but backlog status is frequently invisible.
2. Attending physicians must conduct rounds on the same day, but cannot easily identify who has fresh vitals versus who is awaiting measurement.
3. Patients overstay extra days because discharge readiness isn't flagged the moment 3 consecutive fever-free days are achieved.
4. Facilities struggle to monitor their critical clinical safety threshold (Mortality $\le$ 15%, Success Benchmark $\ge$ 85%).

**Respo Doc** resolves this with **one dedicated, role-specific to-do queue per staff member**:
- **Nurse Station**: 100% daily temperature triage with fever alerts ($\ge$ 38.0°C).
- **Doctor Rounds**: Charts locked until nurse vitals exist; 5-day charts, 3-day fever-free streak verification, visit certification, and discharge recommendation.
- **Admin Command**: 74-bed occupancy grid, quality metrics with automatic warning and alert banners, discharge release queue, and patient admissions.

---

## 🩺 Business Rules & Logic Implemented
- **Fever Definition**: Any temperature reading $\ge$ 38.0°C is automatically flagged as a high-visibility fever with clinical warnings.
- **Valid Clinical Range**: Valid readings are strictly between **34.0°C and 42.0°C**. Any reading outside this range is rejected with a message asking staff to re-measure.
- **Re-check Verification**: If a patient already has today's temperature, a warning prompt appears before submitting another reading. It is logged as an official **clinical re-check**, and both readings are preserved with time stamps in the immutable audit trail.
- **Doctor Locking**: Physicians cannot open a patient's chart until today's temperature is recorded by the nurse.
- **Daily Rounds**: Physicians can mark a patient visited once per day.
- **Discharge Criteria**: "Recommend Discharge" unlocks **only** after today's physician visit is marked **AND** the patient maintains **3 full consecutive fever-free days** with a reading each day. Any fever or missing day resets the streak to 0.
- **Administrative Discharge**: Only the administrator can discharge a patient, and only if recommended by the attending doctor. Discharging frees the bed and increments the recovery counter.
- **Deceased Records**: Marking a patient deceased requires typed `CONFIRM` verification, cannot be undone, frees the bed, and updates the facility mortality statistics.
- **Quality Banners**:
  - **Mortality Rate** = $\frac{\text{Deceased}}{\text{Recovered} + \text{Deceased}}$
  - **Red Alert Banner**: Displayed when mortality rate $> 15.0\%$.
  - **Yellow Heads-up Banner**: Displayed when mortality rate $> 12.0\%$ and $\le 15.0\%$.
- **Admit Safeguard**: "Admit Patient" is disabled with `"Facility full - discharge first"` whenever all 74 beds are occupied.
- **Action Feedback**: Success, warning, and error toasts appear on every single clinical and operational action.

---

## 📱 Mobile-First & Desktop Design
- Optimized down to **375px phone screens** (large tap targets, accessible bottom sheets, stepper buttons).
- Supports both **Light Mode** and **Dark Mode** with instant toggle and persistence.
- State-based screen switching without `react-router` — refreshing the browser never produces 404s.

---

## 📁 Final Folder Structure

```
RespoDoc/
├── dist/                              # Production build output
├── public/                            # Static branding assets
│   ├── admin.png                      # Administrator role card
│   ├── doctor.png                     # Attending physician role card
│   ├── empty.png                      # All-caught-up empty state illustration
│   ├── hero.jpg                       # Clinical quarantine bay hero image
│   ├── logo.png                       # Respo Doc logo (official branding)
│   └── nurse.png                      # Clinical nurse role card
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ActivityLog.jsx        # Audit log (who did what, when)
│   │   │   ├── AdminDashboard.jsx     # Bed occupancy, quality card, banners
│   │   │   ├── AdmitModal.jsx         # New intake form (safeguarded at 74 beds)
│   │   │   ├── BedGrid.jsx            # 74-Bed interactive facility layout (B01-B74)
│   │   │   └── DischargeQueue.jsx     # Doctor-recommended queue with confetti
│   │   ├── common/
│   │   │   ├── EmptyState.jsx         # Contextual empty state with /empty.png
│   │   │   ├── LoadingSkeleton.jsx    # Smooth medical telemetry skeleton
│   │   │   ├── Modal.jsx              # Accessible backdrop modal dialog
│   │   │   ├── Navbar.jsx             # Top bar with logo, search, roles, theme
│   │   │   ├── OnboardingTooltip.jsx  # Workflow guide for each role
│   │   │   └── Toast.jsx              # Global notification toast system
│   │   ├── doctor/
│   │   │   ├── DoctorDashboard.jsx    # To visit / Awaiting / Visited tabs & locked cards
│   │   │   └── PatientDetailModal.jsx # 5-day SVG chart, 38°C fever line, notes, actions
│   │   ├── login/
│   │   │   └── LoginScreen.jsx        # Hero, workflow strip, 3 role selection cards
│   │   └── nurse/
│   │       ├── NurseDashboard.jsx     # Pending/Done/All tabs, progress bar, patient cards
│   │       └── TemperatureModal.jsx   # Stepper, 34-42°C validation, re-check warnings
│   ├── constants/
│   │   └── initialData.js             # 74 patients (Indian names, B01-B74), seed metrics
│   ├── utils/
│   │   ├── medicalRules.js            # Fever streak logic, range checks, mortality math
│   │   └── storage.js                 # Safe localStorage wrapper with try/catch
│   ├── App.jsx                        # State container, screen switcher, event handlers
│   ├── index.css                      # Tailwind base & custom medical styles
│   └── main.jsx                       # React root entry point
├── index.html                         # App root HTML with typography & favicon
├── package.json                       # Dependencies & scripts
├── postcss.config.js                  # PostCSS plugins
├── tailwind.config.js                 # Tailwind theme configuration
└── vite.config.js                     # Vite build configuration
```

---

## 🚀 Run Instructions

### 1. Development Mode
Run the development server locally:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Production Build
Verify the production build:
```bash
npm run build
```
This compiles the application cleanly into the `dist/` directory in under 1 second.

### 3. Local Preview
Preview the production build locally:
```bash
npm run preview
```

### 4. Deploying to Vercel (Zero Config)
- Connect this repository to **Vercel** via GitHub/GitLab or run `vercel` via CLI.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Because screens are managed via React state rather than client routing paths, page refreshes never cause 404 errors.

---

## 🧪 Testing the Clinical Workflows & Banners

1. **Test Nurse Triage**:
   - Log in as **Nurse**. Tap any pending patient (e.g. `B34`).
   - Enter `38.4°C` and save. Notice the red fever alert banner and toast.
   - Tap `B34` again to record another reading. Observe the re-check warning banner and timestamp audit preservation.

2. **Test Doctor Rounds & Discharge Locking**:
   - Switch to **Doctor**.
   - Notice patients without today's temperature are greyed out and locked with lock badges.
   - Open an unlocked patient (e.g. `B01` or `B02`).
   - Review the **5-Day Temperature Trend Chart** with the 38.0°C dashed fever line.
   - Click "Mark Visited Today".
   - Notice that if the patient has 3 fever-free days, "Recommend Discharge" unlocks. Click it to send the patient to Admin.

3. **Test Admin Discharge & Confetti**:
   - Switch to **Admin**.
   - Check the **Discharge Queue** tab: observe the recommended patients.
   - Click "Discharge Patient" and confirm. Notice the celebratory confetti, bed release, and +1 to Recovered.

4. **Test Facility Full & Admission**:
   - When all 74 beds are occupied, "Admit Patient" is disabled with `"Facility full - discharge first"`.
   - Once a patient is discharged, "Admit Patient" becomes active. Click it to intake a new patient into the newly freed bed.

5. **Test Mortality Threshold Banners**:
   - The initial seed has **40 recovered** and **5 deceased** ($5 / 45 = 11.1\%$, normal).
   - In Doctor view, mark 1 patient deceased. Mortality becomes $6 / 46 = 13.0\%$, immediately triggering the **Yellow Quality Heads-up Banner** ($> 12\%$).
   - Mark another patient deceased. Mortality reaches $> 15.0\%$, immediately triggering the **Critical Red Quality Alert Banner**.

6. **Reset Demo Data Anytime**:
   - Click **Reset Demo** in the top bar menu at any time to restore the pristine 74-bed dataset.
