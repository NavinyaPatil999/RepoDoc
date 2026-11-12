import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  RotateCcw, 
  LogOut, 
  X,
  ChevronDown,
  User,
  Shield,
  Stethoscope
} from 'lucide-react';

const ROLE_LABELS = {
  nurse: 'Nurse',
  doctor: 'Doctor',
  admin: 'Admin',
};

export default function Navbar({
  currentRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  onResetDemoData,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetClick = () => {
    setResetConfirmOpen(true);
    setMenuOpen(false);
  };

  const confirmReset = () => {
    onResetDemoData();
    setResetConfirmOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#161D26] border-b border-[#D9DEE4] dark:border-[#27313F] h-14">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-3">
          {/* Left: Logo (40px tall, no cramped box) + Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onSelectRole(null)}
              className="flex items-center gap-2.5 focus:outline-none hover:opacity-90 transition-opacity"
              title="Return to portal overview"
            >
              <img 
                src="/logo.png" 
                alt="Respo Doc" 
                className="h-10 w-auto object-contain flex-shrink-0" 
              />
              <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-slate-100">
                Respo Doc
              </span>
            </button>
          </div>

          {/* Center: Search Box */}
          {currentRole && (
            <div className="flex-1 max-w-sm mx-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search bed (B01-B74) or patient name..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-[13px] bg-[#F4F6F8] dark:bg-[#0F141C] border border-[#D9DEE4] dark:border-[#27313F] rounded-[6px] focus:outline-none focus:border-[#0F5B66] dark:text-slate-100 placeholder:text-slate-400 font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right: Role & Dropdown Menu */}
          {currentRole ? (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] border border-[#D9DEE4] dark:border-[#27313F] bg-white dark:bg-[#161D26] hover:bg-slate-50 dark:hover:bg-[#1C2430] text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                aria-label="User menu"
              >
                <span className="w-2 h-2 rounded-full bg-[#0F5B66]" />
                <span className="capitalize">{ROLE_LABELS[currentRole] || currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#161D26] border border-[#D9DEE4] dark:border-[#27313F] rounded-[6px] shadow-sm py-1 z-50 text-[13px] animate-in fade-in-50">
                  <div className="px-3 py-1.5 border-b border-[#D9DEE4] dark:border-[#27313F]">
                    <div className="text-[11px] text-slate-400 font-medium">Active role</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                      {ROLE_LABELS[currentRole]}
                    </div>
                  </div>

                  {/* Switch Role Submenu */}
                  <div className="py-1 border-b border-[#D9DEE4] dark:border-[#27313F]">
                    <div className="px-3 py-1 text-[11px] font-medium text-slate-400">
                      Switch role
                    </div>
                    {['nurse', 'doctor', 'admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          onSelectRole(role);
                          setMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left flex items-center justify-between text-xs hover:bg-slate-100 dark:hover:bg-[#1F2631] ${
                          currentRole === role ? 'font-semibold text-[#0F5B66] dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="capitalize">{ROLE_LABELS[role]}</span>
                        {currentRole === role && <span className="text-[10px] text-[#0F5B66] dark:text-teal-400 font-medium">Current</span>}
                      </button>
                    ))}
                  </div>

                  {/* Utilities */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onToggleDarkMode();
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F2631] flex items-center gap-2"
                    >
                      {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
                    </button>

                    <button
                      onClick={handleResetClick}
                      className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F2631] flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset demo data</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectRole(null);
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-[#D9DEE4] dark:border-[#27313F] mt-1 pt-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit role</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-[6px] border border-[#D9DEE4] dark:border-[#27313F] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C2430]"
                title="Toggle light/dark theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleResetClick}
                className="px-2.5 py-1.5 rounded-[6px] border border-[#D9DEE4] dark:border-[#27313F] text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C2430] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset demo</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161D26] rounded-[6px] max-w-sm w-full p-5 border border-[#D9DEE4] dark:border-[#27313F] shadow-sm animate-in zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Reset demo data?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              This will restore all 74 beds, default vitals records, physician rounds, and baseline metrics (40 recovered, 5 deceased). Any unsaved changes will be lost.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-[6px] border border-[#D9DEE4] dark:border-[#27313F] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-3 py-1.5 rounded-[6px] bg-[#0F5B66] hover:bg-[#0c4952] text-xs font-medium text-white"
              >
                Reset data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
