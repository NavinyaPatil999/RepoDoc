import React from 'react';
import { ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginScreen({ onSelectRole, occupiedBeds = 74, totalBeds = 74 }) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#0F141C] flex flex-col justify-between selection:bg-[#0F5B66] selection:text-white">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#D9DEE4] dark:border-[#27313F] bg-white dark:bg-[#161D26]">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Respo Doc" 
            className="h-10 sm:h-11 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg sm:text-xl text-slate-900 dark:text-white">
                Respo Doc
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                · Quarantine &amp; Treatment
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              74-bed isolation facility vitals and throughput system
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="font-mono tabular-nums">{occupiedBeds}/{totalBeds}</span>
          <span>beds occupied</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {/* Clean Hero Strip */}
        <div className="relative rounded-[6px] overflow-hidden border border-[#D9DEE4] dark:border-[#27313F] mb-6 bg-slate-900">
          <img 
            src="/hero.jpg" 
            alt="Quarantine Facility" 
            className="w-full h-40 sm:h-52 object-cover opacity-40 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white max-w-2xl">
              Coordinated clinical queues. Same-day vitals and physician rounds.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1.5">
              Role-specific workflows to record daily temperatures, unlock physician rounds, and process discharges at 3 fever-free days.
            </p>
          </div>
        </div>

        {/* How It Works Strip */}
        <div className="mb-6 p-4 rounded-[6px] bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F]">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Facility workflow protocol
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-[6px] bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-[4px] bg-[#0F5B66] text-white flex items-center justify-center font-mono font-medium text-xs flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="font-semibold text-slate-900 dark:text-slate-100">Nurse records</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Daily temperatures across all 74 beds. Fever readings (≥38.0°C) flagged in red.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-[6px] bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-[4px] bg-[#0F5B66] text-white flex items-center justify-center font-mono font-medium text-xs flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="font-semibold text-slate-900 dark:text-slate-100">Doctor visits</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Charts unlocked once measured. Doctor evaluates trends and recommends discharge at 3 fever-free days.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-[6px] bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-[4px] bg-[#0F5B66] text-white flex items-center justify-center font-mono font-medium text-xs flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="font-semibold text-slate-900 dark:text-slate-100">Admin discharges</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Monitors mortality vs 15% ceiling, finalizes discharge orders, and admits into freed beds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Cards Selection */}
        <div>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Select role to enter
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demonstration mode: select your station to proceed without credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Nurse Card */}
            <button
              onClick={() => onSelectRole('nurse')}
              className="text-left p-4 rounded-[6px] bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] hover:border-[#0F5B66] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-32 rounded-[4px] overflow-hidden bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] mb-3 flex items-center justify-center p-2">
                  <img 
                    src="/nurse.png" 
                    alt="Nurse" 
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="text-[11px] font-medium text-slate-400 mb-0.5">Role 01</div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F5B66] dark:group-hover:text-teal-400 transition-colors">
                  Nurse station
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Record daily temperatures, verify re-checks, and flag fever readings for attending staff.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9DEE4] dark:border-[#27313F] flex items-center justify-between text-xs font-medium text-[#0F5B66] dark:text-teal-400">
                <span>Enter station</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. Doctor Card */}
            <button
              onClick={() => onSelectRole('doctor')}
              className="text-left p-4 rounded-[6px] bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] hover:border-[#0F5B66] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-32 rounded-[4px] overflow-hidden bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] mb-3 flex items-center justify-center p-2">
                  <img 
                    src="/doctor.png" 
                    alt="Doctor" 
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="text-[11px] font-medium text-slate-400 mb-0.5">Role 02</div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F5B66] dark:group-hover:text-teal-400 transition-colors">
                  Doctor rounds
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Review 5-day charts, complete daily visits, verify 3 fever-free days, and recommend discharge.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9DEE4] dark:border-[#27313F] flex items-center justify-between text-xs font-medium text-[#0F5B66] dark:text-teal-400">
                <span>Enter rounds</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 3. Admin Card */}
            <button
              onClick={() => onSelectRole('admin')}
              className="text-left p-4 rounded-[6px] bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] hover:border-[#0F5B66] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-32 rounded-[4px] overflow-hidden bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] mb-3 flex items-center justify-center p-2">
                  <img 
                    src="/admin.png" 
                    alt="Administrator" 
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="text-[11px] font-medium text-slate-400 mb-0.5">Role 03</div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F5B66] dark:group-hover:text-teal-400 transition-colors">
                  Facility administration
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Manage 74-bed capacity, monitor mortality vs 15% ceiling, discharge patients, and admit intakes.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9DEE4] dark:border-[#27313F] flex items-center justify-between text-xs font-medium text-[#0F5B66] dark:text-teal-400">
                <span>Enter administration</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 border-t border-[#D9DEE4] dark:border-[#27313F] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>Respo Doc · Virus Quarantine &amp; Triage Portal</div>
        <div className="flex items-center gap-3">
          <span>74-bed cohort</span>
          <span>·</span>
          <span>Client-side storage</span>
        </div>
      </footer>
    </div>
  );
}
