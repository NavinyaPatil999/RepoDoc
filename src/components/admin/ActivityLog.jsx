import React, { useState } from 'react';
import { History, Filter, Search, Clock, User, ShieldCheck, Stethoscope, AlertTriangle } from 'lucide-react';

export default function ActivityLog({ logs }) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = (logs || []).filter((log) => {
    if (roleFilter !== 'all' && log.role !== roleFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        (log.actor && log.actor.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.patientName && log.patientName.toLowerCase().includes(q)) ||
        (log.bedNumber && log.bedNumber.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Facility Clinical Activity Audit Log</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable chronological record of nurse vitals, physician rounds, and administrative throughput.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              roleFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('nurse')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              roleFilter === 'nurse'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Nurse
          </button>
          <button
            onClick={() => setRoleFilter('doctor')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              roleFilter === 'doctor'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              roleFilter === 'admin'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Search Filter for Log */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter audit log by action, bed, or staff member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:text-white"
        />
      </div>

      {/* Logs Table / List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 italic">
            No audit log entries found matching filter.
          </p>
        ) : (
          filteredLogs.map((log) => {
            let roleBadge = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (log.role === 'nurse') roleBadge = 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
            if (log.role === 'doctor') roleBadge = 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300';
            if (log.role === 'admin') roleBadge = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';

            const formattedTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5 ${roleBadge}`}>
                    {log.role}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      {log.bedNumber && (
                        <span className="font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {log.bedNumber}
                        </span>
                      )}
                      {log.patientName && (
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          ({log.patientName})
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 sm:text-right flex-shrink-0">
                  <span>{log.actor}</span>
                  <span>&bull;</span>
                  <span className="font-mono">{formattedTime}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

