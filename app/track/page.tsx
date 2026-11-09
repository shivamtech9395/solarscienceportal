'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { 
  Search, 
  Sun, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Image as ImageIcon,
  ArrowRight,
  Star,
  MessageSquarePlus,
  ThumbsUp
} from 'lucide-react';
import { Project, ProjectStage } from '@/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clean Wiring', 'On-Time']);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const availableTags = [
    'On-Time Arrival',
    'Clean Wiring',
    'Heavy Structure',
    'Polite Technicians',
    'Smooth Net Metering',
    'Quick Commissioning'
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchVal?: string) => {
    const q = (searchVal !== undefined ? searchVal : query).trim();
    if (!q) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/track?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'No project found matching this query.');
        setProject(null);
      }
    } catch (e) {
      setErrorMsg('Failed to query installation tracker. Please try again.');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          rating: ratingVal,
          tags: selectedTags,
          comment: reviewComment || 'Great solar installation service!'
        })
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setTimeout(() => {
          setShowRatingModal(false);
          setReviewSubmitted(false);
          handleSearch(project.projectCode);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const activeStage = project?.stages.find(s => s.stageNumber === project.currentStageNumber);
  const progressPct = project ? Math.round(((project.currentStageNumber - 1) / 8) * 100) : 0;
  const allPhotos = project?.stages.flatMap(s => s.updates.filter(u => Boolean(u.photoUrl))) || [];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-20">
      {/* Search Header */}
      <div className="border-b border-amber-200/60 bg-gradient-to-b from-amber-100/50 via-amber-50/30 to-slate-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Live Customer Rooftop Solar Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Track Your Rooftop Installation Live
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-6">
            Review milestone completion, view assigned engineers, and see verified rooftop photos.
          </p>

          {/* Search Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto bg-white p-2 rounded-2xl border-2 border-amber-300 shadow-md shadow-amber-500/5"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Registered Mobile Number (e.g. 9810012345)..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Locating...' : 'Track Site'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Track View */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading installation records...</div>
        ) : errorMsg ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
            <Sun className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">{errorMsg}</h3>
            <p className="text-xs text-slate-500 mt-1">Please verify your registered phone number or call customer support.</p>
          </div>
        ) : project ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="rounded-3xl bg-white border border-amber-200 shadow-md p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-mono font-bold">
                      {project.projectCode}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {project.overallStatus}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    {project.customer?.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {project.customer?.address}, {project.customer?.city}
                  </p>
                </div>

                {/* Specs Pill */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div>
                    <p className="text-[11px] text-slate-500">System Capacity</p>
                    <p className="text-xl font-black text-amber-600">{project.systemCapacityKW} kW</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-[11px] text-slate-500">Daily Generation</p>
                    <p className="text-xl font-black text-sky-700">~{Math.round(project.systemCapacityKW * 4.2)} Units</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-[11px] text-slate-500">Monthly Savings</p>
                    <p className="text-xl font-black text-emerald-600">₹{Math.round(project.systemCapacityKW * 950)}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                  <span className="text-slate-700">Installation Progress</span>
                  <span className="text-amber-600">{progressPct}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(8, progressPct)}%` }}
                  />
                </div>
              </div>

              {/* ACTIVE STAGE HIGHLIGHT BOX */}
              {activeStage && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shrink-0">
                      {activeStage.stageNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        Current Active Milestone
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {activeStage.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {activeStage.description}
                      </p>
                    </div>
                  </div>

                  {activeStage.assignedEmployee ? (
                    <div className="sm:text-right bg-white p-3 rounded-xl border border-amber-200 shrink-0 shadow-xs">
                      <p className="text-[11px] text-slate-500">Assigned Engineer:</p>
                      <p className="text-xs font-bold text-slate-900 flex items-center sm:justify-end gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                        {activeStage.assignedEmployee.name}
                      </p>
                      <p className="text-[11px] text-amber-700 font-semibold">{activeStage.assignedEmployee.role}</p>
                      <a
                        href={`tel:${activeStage.assignedEmployee.phone}`}
                        className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> Call {activeStage.assignedEmployee.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Dispatcher assigning technician...
                    </div>
                  )}
                </div>
              )}

              {/* Customer Rating CTA Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Satisfied with our solar engineering service? Leave your 5-star feedback!
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-amber-300 self-start sm:self-auto"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  Rate Our Installation Service
                </button>
              </div>
            </div>

            {/* 8-STEP VISUAL TIMELINE */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                Step-by-Step Installation Milestones
              </h3>

              <div className="space-y-6">
                {project.stages.map((stage, idx) => {
                  const isDone = stage.status === 'Completed';
                  const isCurrent = stage.stageNumber === project.currentStageNumber;

                  return (
                    <div key={stage.id} className="relative flex items-start gap-4">
                      {idx !== project.stages.length - 1 && (
                        <div 
                          className={`absolute left-4 top-10 bottom-0 w-0.5 -ml-[1px] ${
                            isDone ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 animate-pulse font-black'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isDone ? '✓' : stage.stageNumber}
                      </div>

                      <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                          : isCurrent
                          ? 'bg-amber-50 border-amber-300 text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className={`text-sm font-bold ${
                            isDone ? 'text-slate-900' : isCurrent ? 'text-amber-800' : 'text-slate-500'
                          }`}>
                            {stage.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCurrent
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {stage.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mb-2">{stage.description}</p>

                        {isDone && stage.completedAt && (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 pt-2 border-t border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Completed on {new Date(stage.completedAt).toLocaleDateString()} by {stage.assignedEmployee?.name || 'Staff'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHOTO PROOF GALLERY */}
            {allPhotos.length > 0 && (
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-600" />
                  Rooftop Installation Photo Gallery
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Verified photos uploaded by our certified engineers on your rooftop.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allPhotos.map((item, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                      <img
                        src={item.photoUrl}
                        alt="Site Photo"
                        className="w-full h-44 object-cover hover:scale-105 transition-transform"
                      />
                      <div className="p-3 bg-white">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.remarks}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Verified by {item.employeeName} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            Enter your mobile number above to view your rooftop solar installation timeline.
          </div>
        )}
      </div>

      {/* RATING & REVIEW MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 text-slate-800">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              Rate Our Solar Installation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback is shared directly with management and the field technicians.
            </p>

            {reviewSubmitted ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Thank you for your rating!</h4>
                <p className="text-xs text-slate-500">Your review has been saved successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* 5-Star Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Select Star Rating:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingVal(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-8 h-8 ${
                          star <= ratingVal
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    What did you like the most?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                          selectedTags.includes(t)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Comments / Experience
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Clean electrical work by technician Vikram. System started generating immediately."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                  >
                    Submit 5-Star Review
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

export default function CustomerTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-500">Loading installation tracker...</p>
          </div>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
