'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Users, 
  Sun, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  ExternalLink, 
  MapPin, 
  Phone, 
  UserCheck, 
  Calendar,
  Layers,
  ArrowRight,
  Search,
  MessageSquareShare,
  LogOut,
  ShieldCheck,
  Star,
  History
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Project, Employee, Review } from '@/types';
import { SOLAR_INSTALLATION_STAGES, EMPLOYEE_ROLES } from '@/lib/constants';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdminAuthenticated, adminUser, logoutAdmin, isLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStageNumber, setSelectedStageNumber] = useState<number>(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // WhatsApp Alert state after assignment
  const [assignmentSuccess, setAssignmentSuccess] = useState<{
    whatsappUrl: string;
    employeeName: string;
    stageTitle: string;
  } | null>(null);

  // Form State for new project
  const [newProject, setNewProject] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    systemCapacityKW: '5.0',
    panelType: '550W Mono PERC Bifacial',
    inverterType: '5kW On-Grid String Inverter',
    structureType: 'Elevated HDG Structure (7ft)',
    contractValue: '240000',
    notes: ''
  });

  // Protect Admin Route: Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, empRes, revRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/employees'),
        fetch('/api/reviews')
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchData();
    }
  }, [isAdminAuthenticated]);

  if (isLoading || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <ShieldCheck className="w-10 h-10 text-amber-500 animate-bounce mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Checking Admin Permissions...</p>
        </div>
      </div>
    );
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewProject({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          address: '',
          city: 'New Delhi',
          state: 'Delhi',
          systemCapacityKW: '5.0',
          panelType: '550W Mono PERC Bifacial',
          inverterType: '5kW On-Grid String Inverter',
          structureType: 'Elevated HDG Structure (7ft)',
          contractValue: '240000',
          notes: ''
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAssignModal = (proj: Project, stageNum: number) => {
    setSelectedProject(proj);
    setSelectedStageNumber(stageNum);
    const stage = proj.stages.find(s => s.stageNumber === stageNum);
    const matching = employees.find(e => e.role === stage?.requiredRole);
    setSelectedEmployeeId(matching ? matching.id : (employees[0]?.id || ''));
    setAssignmentSuccess(null);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedEmployeeId) return;

    try {
      const res = await fetch('/api/stages/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          stageNumber: selectedStageNumber,
          employeeId: selectedEmployeeId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const emp = employees.find(e => e.id === selectedEmployeeId);
        const stage = selectedProject.stages.find(s => s.stageNumber === selectedStageNumber);
        setAssignmentSuccess({
          whatsappUrl: data.whatsappUrl,
          employeeName: emp?.name || 'Technician',
          stageTitle: stage?.title || `Stage ${selectedStageNumber}`
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customer?.phone.includes(searchQuery) ||
    p.customer?.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      {/* Top Header */}
      <div className="border-b border-amber-200/60 bg-white py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" /> Admin Operations Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Solar Project Pipeline & Staff Dispatcher
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs sm:text-sm text-slate-500">
                  Assign milestones, dispatch automated alerts, and monitor verified field updates.
                </p>
                {adminUser && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
                    <span>Admin:</span>
                    <span className="font-mono">{adminUser.email}</span>
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded text-[9px] font-black">SUPER ADMIN</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Links & Logout */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/employees"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <Users className="w-4 h-4 text-sky-600" />
                Staff Directory
              </Link>

              <Link
                href="/admin/history"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <History className="w-4 h-4 text-purple-600" />
                Work History Logs
              </Link>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Solar Contract
              </button>

              <button
                onClick={logoutAdmin}
                title="Logout Admin"
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Total Installations</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{projects.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-700">In Progress Sites</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {projects.filter(p => p.overallStatus === 'In Progress').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <p className="text-xs font-semibold text-sky-700">Field Staff</p>
              <p className="text-2xl font-black text-sky-700 mt-1">{employees.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-700">Customer Reviews</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{reviews.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Code, Customer Name, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredProjects.length} Solar Projects
          </span>
        </div>

        {/* Project Pipeline Cards */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading solar projects data...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Sun className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1">Click "+ New Solar Contract" above to onboard a customer.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => {
              const activeStage = project.stages.find(s => s.stageNumber === project.currentStageNumber);
              const progressPct = Math.round(((project.currentStageNumber - 1) / 8) * 100);

              return (
                <div 
                  key={project.id}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Project Header */}
                  <div className="p-6 border-b border-slate-100 bg-amber-50/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-mono font-bold">
                          {project.projectCode}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                          {project.systemCapacityKW} kW Rooftop System
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          project.overallStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {project.overallStatus}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {project.customer?.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {project.customer?.address}, {project.customer?.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {project.customer?.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          {project.panelType}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Current Stage */}
                    <div className="lg:w-80">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-500">Current Milestone:</span>
                        <span className="text-amber-600">
                          Stage {project.currentStageNumber} of 8
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, progressPct)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 truncate">
                        Active: <strong className="text-slate-900">{activeStage?.title}</strong>
                      </p>
                    </div>
                  </div>

                  {/* 8 Stages Pipeline Flow */}
                  <div className="p-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" /> Milestone Lifecycle & Staff Assignments
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {project.stages.map((stage) => {
                        const isDone = stage.status === 'Completed';
                        const isCurrent = stage.stageNumber === project.currentStageNumber;
                        const hasAssignee = Boolean(stage.assignedEmployee);

                        return (
                          <div
                            key={stage.id}
                            className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                              isDone
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                : isCurrent
                                ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                  isDone
                                    ? 'bg-emerald-500 text-white'
                                    : isCurrent
                                    ? 'bg-amber-500 text-slate-950 font-black'
                                    : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {isDone ? '✓' : stage.stageNumber}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isDone
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isCurrent
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {stage.status}
                                </span>
                              </div>

                              <p className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{stage.title}</p>
                              <p className="text-[10px] text-slate-500 mb-2">Role: {stage.requiredRole}</p>

                              {/* Assignee Details */}
                              {hasAssignee ? (
                                <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] mb-2 shadow-xs">
                                  <div className="flex items-center gap-1 text-slate-900 font-bold truncate">
                                    <UserCheck className="w-3 h-3 text-sky-600" />
                                    {stage.assignedEmployee?.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {stage.assignedEmployee?.role}
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 rounded-xl bg-slate-100/60 border border-dashed border-slate-300 text-[10px] text-slate-400 mb-2 italic">
                                  No staff assigned
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            {!isDone && (
                              <button
                                onClick={() => openAssignModal(project, stage.stageNumber)}
                                className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                  isCurrent
                                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <Send className="w-3 h-3" />
                                {hasAssignee ? 'Reassign Staff' : 'Assign Employee'}
                              </button>
                            )}

                            {isDone && stage.completedAt && (
                              <p className="text-[10px] text-emerald-700 text-center font-semibold">
                                Done: {new Date(stage.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ASSIGN MODAL WITH IN-APP ALERT & WHATSAPP DISPATCH */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-amber-200 shadow-2xl p-6 text-slate-800">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Send className="w-5 h-5 text-amber-500" />
              Assign Milestone & Dispatch Alert
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Project: <strong className="text-slate-900">{selectedProject.projectCode}</strong> ({selectedProject.customer?.name} - {selectedProject.systemCapacityKW} kW)
            </p>

            {assignmentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Task Successfully Assigned!
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  In-App Notification has been sent directly to <strong>{assignmentSuccess.employeeName}</strong>.
                </p>

                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs">
                  <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <MessageSquareShare className="w-4 h-4 text-emerald-600" />
                    Instant WhatsApp Job Alert Dispatch:
                  </p>
                  <a
                    href={assignmentSuccess.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                  >
                    Send WhatsApp Alert to Staff <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssignmentSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 mb-1">
                    Stage {selectedStageNumber}: {selectedProject.stages.find(s => s.stageNumber === selectedStageNumber)?.title}
                  </div>
                  <p className="text-slate-600">
                    Recommended Technical Role: <strong className="text-slate-900">{selectedProject.stages.find(s => s.stageNumber === selectedStageNumber)?.requiredRole}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Employee / Technician:
                  </label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role} ({emp.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Confirm & Send Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-amber-200 shadow-2xl p-6 text-slate-800 my-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Sun className="w-5 h-5 text-amber-500" />
              Register New Rooftop Solar Contract
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Creates customer record and generates all 8 standard installation milestones.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject.customerName}
                    onChange={(e) => setNewProject({ ...newProject, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newProject.customerPhone}
                    onChange={(e) => setNewProject({ ...newProject, customerPhone: e.target.value })}
                    placeholder="e.g. 9810012345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Site Address *</label>
                <input
                  type="text"
                  required
                  value={newProject.address}
                  onChange={(e) => setNewProject({ ...newProject, address: e.target.value })}
                  placeholder="e.g. B-42, Sector 14, Rohini"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newProject.city}
                    onChange={(e) => setNewProject({ ...newProject, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity (kW) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProject.systemCapacityKW}
                    onChange={(e) => setNewProject({ ...newProject, systemCapacityKW: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={newProject.contractValue}
                    onChange={(e) => setNewProject({ ...newProject, contractValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  Create Contract & Milestones
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
