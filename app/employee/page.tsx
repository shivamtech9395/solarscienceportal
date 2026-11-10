'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HardHat, 
  Bell, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Send, 
  Layers, 
  Star,
  LogOut,
  Briefcase,
  History,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Project, Notification, ProjectStage, AuditLog } from '@/types';

export default function EmployeePortalPage() {
  const router = useRouter();
  const { currentEmployee, logoutEmployee, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Milestone Update Modal State
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeStage, setActiveStage] = useState<ProjectStage | null>(null);
  const [remarks, setRemarks] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [markComplete, setMarkComplete] = useState(false);
  const [checklist, setChecklist] = useState<{ task: string; completed: boolean }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Photo presets
  const samplePhotos = [
    { label: 'Rooftop Panels', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80' },
    { label: 'Inverter Wiring', url: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&auto=format&fit=crop&q=80' },
    { label: 'Structure Assembly', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80' },
    { label: 'Net Metering Test', url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80' },
  ];

  // Route Protection: Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !currentEmployee) {
      router.push('/employee/login');
    }
  }, [currentEmployee, isLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, notifRes, auditRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/notifications'),
        fetch('/api/audit-logs')
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentEmployee) {
      fetchData();
    }
  }, [currentEmployee]);

  if (isLoading || !currentEmployee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <HardHat className="w-10 h-10 text-amber-500 animate-bounce mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Authenticating Staff Workspace...</p>
        </div>
      </div>
    );
  }

  // Filter tasks assigned to current employee
  const myAssignedTasks = projects.flatMap(p => {
    return p.stages
      .filter(s => s.assignedEmployeeId === currentEmployee.id)
      .map(stage => ({ project: p, stage }));
  });

  const myNotifications = notifications.filter(n => n.employeeId === currentEmployee.id);

  // My personal work history (completed stages and updates)
  const myCompletedLogs = auditLogs.filter(
    (l) => l.employeeId === currentEmployee.id || l.performedBy === currentEmployee.name
  );

  const handleMarkNotifRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const openUpdateModal = (proj: Project, stage: ProjectStage) => {
    setActiveProject(proj);
    setActiveStage(stage);
    setRemarks('');
    setPhotoUrl(samplePhotos[0].url);
    setMarkComplete(false);
    setChecklist(stage.checklist || []);
    setUpdateSuccess(false);
  };

  const toggleChecklistItem = (index: number) => {
    setChecklist(prev => {
      const next = [...prev];
      next[index].completed = !next[index].completed;
      return next;
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !activeStage || !currentEmployee) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/stages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          stageNumber: activeStage.stageNumber,
          employeeId: currentEmployee.id,
          remarks,
          photoUrl: photoUrl || samplePhotos[0].url,
          markCompleted: markComplete,
          checklist
        })
      });

      if (res.ok) {
        setUpdateSuccess(true);
        setTimeout(() => {
          setActiveProject(null);
          setActiveStage(null);
          fetchData();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      {/* EMPLOYEE PROFILE HEADER BANNER */}
      <div className="bg-white border-b border-slate-200/90 shadow-sm py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Profile Avatar & Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-sky-500/20">
                {currentEmployee.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentEmployee.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {currentEmployee.role}
                  </span>
                  <span>Code: <strong className="text-slate-700 font-mono">{currentEmployee.employeeCode}</strong></span>
                  <span>Phone: <strong className="text-slate-700 font-mono">{currentEmployee.phone}</strong></span>
                </div>
              </div>
            </div>

            {/* Performance Stats & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right pr-4 border-r border-slate-200">
                <div className="flex items-center justify-end gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-extrabold text-slate-900 text-sm">
                    {currentEmployee.rating || 5.0} / 5.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentEmployee.totalCompletedJobs || 12} Milestones Completed
                </p>
              </div>

              <button
                onClick={logoutEmployee}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* IN-APP NOTIFICATIONS DRAWER */}
        <div className="rounded-3xl bg-white border border-amber-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Task Assignment Notifications
              {myNotifications.filter(n => !n.isRead).length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {myNotifications.filter(n => !n.isRead).length} New
                </span>
              )}
            </h3>
            <span className="text-[11px] text-slate-400">Direct Admin Dispatch</span>
          </div>

          {myNotifications.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No new assignment notifications.</p>
          ) : (
            <div className="space-y-2">
              {myNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    notif.isRead
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-amber-50 border-amber-300 text-slate-800 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${notif.isRead ? 'bg-slate-400' : 'bg-amber-500 animate-pulse'}`} />
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    {notif.customerName && (
                      <p className="text-[11px] text-amber-800 font-semibold mt-1">
                        📍 Site: {notif.siteAddress} • Customer: {notif.customerName} ({notif.customerPhone})
                      </p>
                    )}
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkNotifRead(notif.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 whitespace-nowrap self-start sm:self-auto shadow-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WORK TABS: ACTIVE SITES VS MY COMPLETED WORK HISTORY */}
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'ACTIVE'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Assigned Active Sites ({myAssignedTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'HISTORY'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Work History / Completed Portfolio ({myCompletedLogs.length})</span>
            </button>
          </div>

          {/* TAB 1: ASSIGNED ACTIVE SITES */}
          {activeTab === 'ACTIVE' && (
            <div>
              {loading ? (
                <div className="py-16 text-center text-slate-400">Loading assigned tasks...</div>
              ) : myAssignedTasks.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No Pending Tasks!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You have finished all active site tasks. Check your notification drawer for new assignments.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myAssignedTasks.map(({ project, stage }) => {
                    const isCompleted = stage.status === 'Completed';

                    return (
                      <div
                        key={`${project.id}-${stage.stageNumber}`}
                        className={`rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-amber-300 shadow-amber-500/5'
                        }`}
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                              {project.projectCode}
                            </span>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {stage.status}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 mb-1">
                            Stage {stage.stageNumber}: {stage.title}
                          </h3>
                          <p className="text-xs text-slate-500 mb-4">{stage.description}</p>

                          {/* Site Location Card */}
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Customer Name:</span>
                              <span className="font-bold text-slate-900">{project.customer?.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Address:</span>
                              <span className="font-semibold text-slate-700 text-right truncate max-w-[200px]">
                                {project.customer?.address}, {project.customer?.city}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">System Capacity:</span>
                              <span className="font-black text-amber-600">{project.systemCapacityKW} kW</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="text-slate-500">Phone Call:</span>
                              <a
                                href={`tel:${project.customer?.phone}`}
                                className="text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call {project.customer?.phone}
                              </a>
                            </div>
                          </div>

                          {/* SOP Checklist */}
                          <div className="mb-4">
                            <p className="text-[11px] font-bold text-slate-700 mb-2">Milestone Checklist (SOP):</p>
                            <div className="space-y-1.5 text-xs text-slate-600">
                              {stage.checklist?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  {item.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                                  )}
                                  <span className={item.completed ? 'line-through text-slate-400' : ''}>
                                    {item.task}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Submit Button */}
                        <div className="pt-4 border-t border-slate-100">
                          {isCompleted ? (
                            <div className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5 py-2 bg-emerald-100/60 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Milestone Completed
                            </div>
                          ) : (
                            <button
                              onClick={() => openUpdateModal(project, stage)}
                              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
                            >
                              <Camera className="w-4 h-4" />
                              Submit Site Photos & Complete Milestone
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY COMPLETED WORK HISTORY / PORTFOLIO */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Personal completed jobs record for <strong>{currentEmployee.name}</strong></span>
                <span className="font-bold text-amber-700">{myCompletedLogs.length} Records</span>
              </div>

              {myCompletedLogs.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No completed jobs yet</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    When you finish assigned site stages and submit photos, your work history portfolio builds here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCompletedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-bold">
                              {log.projectCode}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              Customer: {log.customerName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium mb-1.5">{log.details}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Completed on: {new Date(log.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                      </div>

                      {log.photoUrl && (
                        <div className="shrink-0">
                          <img
                            src={log.photoUrl}
                            alt="Site Proof"
                            className="w-20 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: SUBMIT STAGE PROGRESS & PHOTO PROOF */}
      {activeProject && activeStage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-amber-200 shadow-2xl p-5 sm:p-6 text-slate-800 my-auto">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-500" />
                  Submit Milestone Verification Proof
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Project: <strong className="text-slate-900">{activeProject.projectCode}</strong> • Stage {activeStage.stageNumber}: {activeStage.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveProject(null);
                  setActiveStage(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateSuccess ? (
              <div className="p-6 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Work Verified & Submitted!</h4>
                <p className="text-xs text-slate-500">Admin audit trail and customer live tracker updated in real time.</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                {/* Checklist SOP */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800 mb-2">Check off verified tasks on site:</p>
                  <div className="space-y-2">
                    {checklist.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistItem(idx)}
                        className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-950"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={item.completed ? 'text-slate-400 line-through' : ''}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Field Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Field Remarks & Technical Observations *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Completed DC string conduits and tested inverter sync. Earthing pit resistance tested under 2.5 Ohms."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Photo Proof */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Rooftop Photo Proof
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter photo URL or choose sample below"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 mb-2"
                  />

                  {/* Photo Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(p.url)}
                        className={`p-1.5 rounded-xl border text-[10px] text-center truncate transition-all ${
                          photoUrl === p.url
                            ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mark as Completed Checkbox */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="markComplete"
                    checked={markComplete}
                    onChange={(e) => setMarkComplete(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="markComplete" className="text-xs text-amber-950 cursor-pointer">
                    <strong>Mark this milestone as 100% Completed</strong>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      Advances the solar project to the next stage and records your name in the audit log.
                    </p>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProject(null);
                      setActiveStage(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Confirm & Save Proof'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
