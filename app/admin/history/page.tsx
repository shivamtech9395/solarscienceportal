'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  History, 
  Search, 
  Calendar, 
  UserCheck, 
  FileCheck2, 
  Sun, 
  Filter, 
  ExternalLink, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuditLog, Project, Employee } from '@/types';

export default function HistoricalAuditPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Photo viewer modal
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const [logsRes, projRes, empRes] = await Promise.all([
          fetch('/api/audit-logs'),
          fetch('/api/projects'),
          fetch('/api/employees')
        ]);
        if (logsRes.ok) setLogs(await logsRes.json());
        if (projRes.ok) setProjects(await projRes.json());
        if (empRes.ok) setEmployees(await empRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isAdminAuthenticated) {
      fetchHistory();
    }
  }, [isAdminAuthenticated]);

  if (isLoading || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xs font-semibold text-slate-500">Checking authorization...</p>
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    if (selectedProject !== 'ALL' && log.projectId !== selectedProject) return false;
    if (selectedEmployee !== 'ALL' && log.employeeId !== selectedEmployee) return false;
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (log.projectCode && log.projectCode.toLowerCase().includes(q)) ||
        (log.customerName && log.customerName.toLowerCase().includes(q)) ||
        (log.employeeName && log.employeeName.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" /> Comprehensive Operations Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Historical Work & Staff Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Review who worked on which milestone, exact timestamps, technician remarks, customer feedback, and proof photos.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Total Audit Logs</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{logs.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-800">Milestones Completed</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {logs.filter(l => l.action === 'STAGE_COMPLETED').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-800">Assignments Dispatched</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {logs.filter(l => l.action === 'STAGE_ASSIGNED').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <p className="text-xs font-semibold text-purple-800">Tracked Sites</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{projects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <Filter className="w-3.5 h-3.5 text-amber-500" /> Filter Work History
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Keywords</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Staff, Project, Details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Filter by Project */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Solar Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectCode} - {p.customer?.name} ({p.systemCapacityKW} kW)
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Employee */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Staff</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Staff Members</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Action */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Actions</option>
                <option value="STAGE_COMPLETED">Stage Completed</option>
                <option value="STAGE_ASSIGNED">Stage Assigned</option>
                <option value="STAGE_UPDATED">Progress Updated</option>
                <option value="PROJECT_CREATED">Project Created</option>
                <option value="REVIEW_SUBMITTED">Review Submitted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Log Feed */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading audit history...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No logs found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or clearing the search query.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredLogs.map((log) => {
              const isCompleted = log.action === 'STAGE_COMPLETED';
              const isAssigned = log.action === 'STAGE_ASSIGNED';
              const isReview = log.action === 'REVIEW_SUBMITTED';

              return (
                <div
                  key={log.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : isAssigned
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : isReview
                        ? 'bg-yellow-50 text-amber-600 border border-amber-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-5 h-5" />}
                      {isAssigned && <UserCheck className="w-5 h-5" />}
                      {isReview && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                      {!isCompleted && !isAssigned && !isReview && <Clock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isAssigned
                            ? 'bg-amber-100 text-amber-800'
                            : isReview
                            ? 'bg-yellow-100 text-amber-900 font-black'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.action.replace('_', ' ')}
                        </span>

                        {log.projectCode && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-bold">
                            {log.projectCode}
                          </span>
                        )}

                        {log.customerName && (
                          <span className="text-xs text-slate-500">
                            • Client: <strong className="text-slate-800">{log.customerName}</strong>
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-900 mb-1.5 leading-relaxed">
                        {log.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-sky-700 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                          Technician: <strong>{log.employeeName || log.performedBy}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {log.photoUrl && (
                    <div className="md:shrink-0 self-start">
                      <button
                        onClick={() => setExpandedPhoto(log.photoUrl || null)}
                        className="group relative block w-24 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:scale-105 transition-transform"
                      >
                        <img
                          src={log.photoUrl}
                          alt="Proof"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EXPANDED PHOTO MODAL */}
      {expandedPhoto && (
        <div 
          onClick={() => setExpandedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-pointer"
        >
          <div className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden p-2 shadow-2xl">
            <img
              src={expandedPhoto}
              alt="Site Proof"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <p className="text-center text-xs text-slate-500 py-2">
              Verified Site Proof • Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
