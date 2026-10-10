"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, CheckCircle, XCircle, Clock, MoreHorizontal,
    Filter, GraduationCap, Building2, User, ChevronDown, Check, X,
    Edit3, Trash2, RefreshCw
} from "lucide-react";
import { db, Application, safeStorage, STORAGE_KEYS, formatPositionLabel } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";

// Reusable Section Header
const SectionHeader = ({ title, subtitle, action }: any) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {action}
    </div>
);

export default function AdminAdmissionsPage() {
    const [applications, setApplications] = useState<Application[]>(() => {
        if (typeof window !== "undefined") {
            try {
                return db.admin.applications.getAll() || [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Add Application Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newApp, setNewApp] = useState({
        name: "", email: "", phone: "", church: "", position: "pastor", department: "", track: "deborah" as "deborah" | "barak" | "jael", motivation: "관리자 수기 등록"
    });

    // Edit Application Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);

    // Delete Confirmation Modal State (Custom modal to bypass browser confirm() blocking)
    const [deleteTargetApp, setDeleteTargetApp] = useState<Application | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast notification state (Custom toast to bypass browser alert() blocking)
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch remote applications (Primary Source of Truth, no-cache)
            let remoteApps: Application[] = [];
            try {
                const res = await fetch("/api/admin/applications", {
                    cache: "no-store",
                    headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
                });
                if (res.ok) {
                    const json = await res.json();
                    remoteApps = json.applications || [];
                } else {
                    remoteApps = await supabaseDb.applications.getAll();
                }
            } catch (apiErr) {
                console.warn("[Admin Admissions] Direct API route fallback to supabaseDb:", apiErr);
                try {
                    remoteApps = await supabaseDb.applications.getAll();
                } catch (dbErr) {
                    console.warn("[Admin Admissions] SupabaseDb getAll failed:", dbErr);
                }
            }

            // 2. Fetch local applications
            let localApps: Application[] = [];
            try {
                localApps = db.admin.applications.getAll() || [];
            } catch (localErr) {
                console.warn("[Admin Admissions] Local storage fetch failed:", localErr);
            }

            // 3. Remote applications from Supabase are the primary source of truth
            const filteredRemote = remoteApps;

            // Clean up any stale blacklist entries for applications that actually exist in remote
            let deletedSet = new Set<string>();
            try {
                const deletedList = db.admin.applications.getDeleted() || [];
                const remoteIds = new Set(remoteApps.map(r => (r.id || "").toLowerCase()));
                const cleanDeleted = deletedList.filter(d => typeof d === "string" && !d.includes("@") && !remoteIds.has(d.toLowerCase()));
                safeStorage.setItem(STORAGE_KEYS.DELETED_APPLICATIONS, JSON.stringify(cleanDeleted));
                deletedSet = new Set(cleanDeleted.map(d => d.toLowerCase()));
            } catch (delErr) { }

            // Safe filter for local-only fallback applications
            const filteredLocal = localApps.filter(a => {
                if (!a) return false;
                const idLower = (a.id || "").toLowerCase();
                return !deletedSet.has(idLower);
            });

            // 4. Smart Merge (Remote is priority, with local fallback)
            const mergedMap = new Map<string, Application>();

            // Put local first
            filteredLocal.forEach(app => {
                const key = (app.email ? app.email.toLowerCase() : "") || app.id || `${app.name}_${Math.random()}`;
                mergedMap.set(key, app);
            });

            // Remote overwrites local (Remote is Source of Truth)
            filteredRemote.forEach(remoteApp => {
                const key = (remoteApp.email ? remoteApp.email.toLowerCase() : "") || remoteApp.id;
                mergedMap.set(key, remoteApp);
            });

            const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
                const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
                const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
                return dateB - dateA;
            });

            // 5. Synchronize merged applications back to local storage
            try {
                safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(mergedList));
            } catch (syncErr) { }

            setApplications(mergedList);

            // Maintain selectedApp reference if still existing
            setSelectedApp(prev => {
                if (!prev) return null;
                const found = mergedList.find(a => a.id === prev.id || (a.email && a.email.toLowerCase() === (prev.email || "").toLowerCase()));
                return found || null;
            });
        } catch (e) {
            console.error("Critical error in loadApplications:", e);
            try {
                setApplications(db.admin.applications.getAll() || []);
            } catch { }
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load & Window focus auto-refresh
    useEffect(() => {
        loadApplications();

        const handleFocus = () => {
            loadApplications();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const handleCreateApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isPastor = newApp.position === 'pastor' || (newApp.position || "").includes('목사');
            const initialRole: "student" | "pastor" = isPastor ? "pastor" : "student";

            // Also create/sync user account in localStorage
            try {
                db.auth.signup({
                    name: newApp.name,
                    email: newApp.email,
                    password: "password123!",
                    role: initialRole,
                    church: newApp.church,
                    level: newApp.position,
                    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newApp.name)}`
                });
            } catch { }

            db.applications.create({ ...newApp });
            try {
                await supabaseDb.applications.create({ ...newApp });
            } catch (remoteErr) {
                console.warn("[Admin] Supabase remote create fallback:", remoteErr);
            }
            await loadApplications();
            setIsAddModalOpen(false);
            setNewApp({ name: "", email: "", phone: "", church: "", position: "pastor", department: "", track: "deborah", motivation: "관리자 수기 등록" });
            showToast("신청서 및 사용자 계정이 성공적으로 등록 및 연동되었습니다.");
        } catch (error) {
            console.error(error);
            showToast("신청서 등록 중 오류가 발생했습니다.");
        }
    };

    // Open Edit Modal safely
    const handleOpenEdit = (app: Application) => {
        setEditingApp({
            ...app,
            name: app.name || "",
            email: app.email || "",
            phone: app.phone || "",
            church: app.church || "",
            position: app.position || "pastor",
            department: app.department || "",
            track: app.track || "deborah",
            status: app.status || "pending",
            motivation: app.motivation || "",
        });
        setIsEditModalOpen(true);
    };

    // Save Edited Application
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingApp) return;

        try {
            // 1. Update Remote (Supabase)
            try {
                const updatedRemote = await supabaseDb.applications.update(editingApp.id, editingApp);
                if (updatedRemote && updatedRemote.id) {
                    editingApp.id = updatedRemote.id; // Sync UUID
                }
            } catch (remoteErr) {
                console.warn("[Admin] Remote update warning:", remoteErr);
            }

            // 2. Update Local Storage
            db.admin.applications.update(editingApp.id, editingApp);
            if (editingApp.status === "approved" || editingApp.status === "rejected") {
                db.admin.applications.updateStatus(editingApp.id, editingApp.status);
            }

            // 3. Update React State immediately
            setApplications(prev => prev.map(a => 
                (a.id === editingApp.id || (editingApp.email && a.email?.toLowerCase() === editingApp.email.toLowerCase())) 
                    ? { ...a, ...editingApp } 
                    : a
            ));
            if (selectedApp && (selectedApp.id === editingApp.id || (editingApp.email && selectedApp.email?.toLowerCase() === editingApp.email.toLowerCase()))) {
                setSelectedApp({ ...selectedApp, ...editingApp });
            }

            setIsEditModalOpen(false);
            showToast("입학 신청서 정보가 성공적으로 수정되었습니다.");
        } catch (err: any) {
            console.error("[Admin] Edit error:", err);
            showToast("신청서 수정 중 오류가 발생했습니다.");
        }
    };

    // Open Delete Confirmation Modal
    const handleDeleteApplication = (app: Application) => {
        setDeleteTargetApp(app);
    };

    // Confirm and execute permanent deletion
    const handleConfirmDelete = async () => {
        if (!deleteTargetApp) return;
        setIsDeleting(true);

        const target = deleteTargetApp;
        try {
            // 1. Local Blacklist and Deletion (By ID only)
            db.admin.applications.delete(target.id);

            // 2. Remote Database Delete (Supabase)
            try {
                await supabaseDb.applications.delete(target.id, target.email);
            } catch (remoteErr) {
                console.warn("[Admin] Remote delete warning:", remoteErr);
            }

            // 3. Update State immediately
            setApplications(prev => prev.filter(a => 
                a.id !== target.id && 
                (!target.email || a.email?.toLowerCase() !== target.email.toLowerCase())
            ));
            if (selectedApp && (selectedApp.id === target.id || (target.email && selectedApp.email?.toLowerCase() === target.email.toLowerCase()))) {
                setSelectedApp(null);
            }

            setDeleteTargetApp(null);
            showToast(`"${target.name}" 님의 입학 신청서가 영구 삭제되었습니다.`);
        } catch (err: any) {
            console.error("[Admin] Delete error:", err);
            showToast("신청서 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
        try {
            await supabaseDb.applications.updateStatus(id, status, selectedApp?.email);
        } catch (e) {
            console.warn("Remote status update error:", e);
        }
        db.admin.applications.updateStatus(id, status);

        // Update local state immediately
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        if (selectedApp && selectedApp.id === id) {
            setSelectedApp(prev => prev ? { ...prev, status } : null);
        }
        showToast(`${status === 'approved' ? '승인' : '거절'} 처리가 완료되었습니다.`);
    };

    const filteredApps = applications.filter(app => {
        if (!app) return false;
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        const searchLower = (searchTerm || "").toLowerCase().trim();
        if (!searchLower) return matchesStatus;

        const nameMatch = (app.name || "").toLowerCase().includes(searchLower);
        const emailMatch = (app.email || "").toLowerCase().includes(searchLower);
        const churchMatch = (app.church || "").toLowerCase().includes(searchLower);
        return matchesStatus && (nameMatch || emailMatch || churchMatch);
    });

    return (
        <div>
            <SectionHeader
                title="입학 신청 관리"
                subtitle="신청서를 검토하고 입학 승인 여부를 결정합니다."
                action={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadApplications()}
                            disabled={isLoading}
                            className="flex items-center justify-center px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all shadow-sm text-sm"
                            title="신청서 목록 새로고침"
                        >
                            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                            새로고침
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <User className="w-4 h-4" /> 신청서 수기 등록
                        </button>
                    </div>
                }
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="이름, 이메일, 교회 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                                ${filterStatus === status
                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}
                            `}
                        >
                            {status === 'all' && '전체'}
                            {status === 'pending' && '대기중'}
                            {status === 'approved' && '승인됨'}
                            {status === 'rejected' && '거절됨'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* List View */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-y-auto max-h-[600px]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-500">신청자</th>
                                    <th className="px-6 py-4 font-medium text-slate-500">트랙 / 소속</th>
                                    <th className="px-6 py-4 font-medium text-slate-500">상태</th>
                                    <th className="px-6 py-4 font-medium text-slate-500">접수일</th>
                                    <th className="px-6 py-4 font-medium text-right text-slate-500">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading && filteredApps.length === 0 ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={`skel-app-${idx}`} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-24 bg-slate-200 rounded" />
                                                        <div className="h-3 w-36 bg-slate-100 rounded" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="h-4 w-24 bg-slate-200 rounded" />
                                                    <div className="h-3 w-32 bg-slate-100 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-6 w-16 bg-slate-200 rounded-full" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-20 bg-slate-100 rounded" />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="h-8 w-16 bg-slate-100 rounded-lg ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredApps.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredApps.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className={`
                                                cursor-pointer transition-colors hover:bg-slate-50
                                                ${selectedApp?.id === app.id ? "bg-amber-50 hover:bg-amber-50" : ""}
                                            `}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                                        {app.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{app.name}</div>
                                                        <div className="text-xs text-slate-500">{app.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-700 uppercase flex items-center gap-1">
                                                        <GraduationCap className="w-3 h-3 text-indigo-500" />
                                                        {app.track} Track
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {app.church} ({formatPositionLabel(app.position)})
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                                                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                                                    ${app.status === 'approved' ? "bg-green-50 text-green-700 border-green-100" :
                                                        app.status === 'rejected' ? "bg-red-50 text-red-700 border-red-100" :
                                                            "bg-amber-50 text-amber-700 border-amber-100"}
                                                `}>
                                                    {app.status === 'approved' && <><CheckCircle className="w-3 h-3" /> 승인됨</>}
                                                    {app.status === 'rejected' && <><XCircle className="w-3 h-3" /> 거절됨</>}
                                                    {app.status === 'pending' && <><Clock className="w-3 h-3" /> 대기중</>}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenEdit(app);
                                                        }}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="신청서 수정"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteApplication(app);
                                                        }}
                                                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="신청서 영구 삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail View (Side Panel) */}
                <AnimatePresence>
                    {selectedApp && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full lg:w-[400px] shrink-0"
                        >
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900 text-lg">상세 정보</h3>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEdit(selectedApp)}
                                            className="px-2.5 py-1 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-200 cursor-pointer"
                                            title="신청서 수정"
                                        >
                                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                            <span>수정</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteApplication(selectedApp)}
                                            className="px-2.5 py-1 text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-200 cursor-pointer"
                                            title="신청서 영구 삭제"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                            <span>삭제</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedApp(null)}
                                            className="p-1 text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 mb-3">
                                        {selectedApp.name[0]}
                                    </div>
                                    <div className="text-xl font-bold text-slate-900">{selectedApp.name}</div>
                                    <div className="text-sm text-slate-500">{selectedApp.email}</div>
                                    <div className="text-sm text-slate-500">{selectedApp.phone}</div>
                                </div>

                                <div className="space-y-5">
                                    {/* Track Badge & Date */}
                                    <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-blue-900" />
                                            <span className="text-xs font-bold text-blue-950 uppercase">
                                                {selectedApp.track} Track
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500">
                                            {new Date(selectedApp.submittedAt).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">교회 및 사역 정보</div>
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 text-xs md:text-sm border border-slate-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">교회명</span>
                                                <span className="font-bold text-slate-800">{selectedApp.church}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">직분 / 구분</span>
                                                <span className="font-bold text-blue-900">{formatPositionLabel(selectedApp.position)}</span>
                                            </div>
                                            {selectedApp.department && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500">소속 부서</span>
                                                    <span className="font-medium text-slate-700">{selectedApp.department}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">지원 동기</div>
                                        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100 min-h-[100px]">
                                            {selectedApp.motivation}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {selectedApp.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                                            className="px-4 py-3 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <XCircle className="w-4 h-4" /> 거절
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                                            className="px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <CheckCircle className="w-4 h-4" /> 승인
                                        </button>
                                    </div>
                                )}

                                {selectedApp.status !== 'pending' && (
                                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                        <div className={`
                                            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                                            ${selectedApp.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                                        `}>
                                            {selectedApp.status === 'approved' ? (
                                                <><CheckCircle className="w-4 h-4" /> 승인 완료된 신청서입니다</>
                                            ) : (
                                                <><XCircle className="w-4 h-4" /> 거절된 신청서입니다</>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Quick Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(selectedApp)}
                                        className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> 신청서 내용 수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteApplication(selectedApp)}
                                        className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> 신청서 영구 삭제
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Application Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900">신청서 수기 등록</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateApplication} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newApp.name} onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">연락처</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newApp.phone} onChange={(e) => setNewApp({ ...newApp, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">이메일</label>
                                    <input
                                        type="email" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={newApp.email} onChange={(e) => setNewApp({ ...newApp, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">교회</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newApp.church} onChange={(e) => setNewApp({ ...newApp, church: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">직분</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newApp.position} onChange={(e) => setNewApp({ ...newApp, position: e.target.value as "pastor" | "theology_student" | "missionary" | "lay_leader" })}
                                        >
                                            <option value="pastor">목회자</option>
                                            <option value="theology_student">신학생</option>
                                            <option value="missionary">선교사</option>
                                            <option value="lay_leader">평신도 리더</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">트랙 선택</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['deborah', 'barak', 'jael'] as const).map(track => (
                                            <button
                                                key={track} type="button"
                                                onClick={() => setNewApp({ ...newApp, track })}
                                                className={`py-2 rounded-lg text-sm font-bold border capitalize ${newApp.track === track ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-slate-200 text-slate-600"}`}
                                            >
                                                {track}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800"
                                    >
                                        등록하기
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Application Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsEditModalOpen(false); setEditingApp(null); }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900">신청서 정보 수정</h3>
                                <button onClick={() => { setIsEditModalOpen(false); setEditingApp(null); }} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                            value={editingApp.name} onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">연락처</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                            value={editingApp.phone} onChange={(e) => setEditingApp({ ...editingApp, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">이메일</label>
                                    <input
                                        type="email" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={editingApp.email} onChange={(e) => setEditingApp({ ...editingApp, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">교회명</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                            value={editingApp.church} onChange={(e) => setEditingApp({ ...editingApp, church: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">직분 / 구분</label>
                                        <input
                                            type="text" required
                                            placeholder="예: 목사 사모, 목회자, 신학생 등"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                            value={editingApp.position || ""} onChange={(e) => setEditingApp({ ...editingApp, position: e.target.value })}
                                        />
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {[
                                                { label: "목사 사모", val: "목사 사모 (pastor_wife)" },
                                                { label: "목회자", val: "목회자 (pastor)" },
                                                { label: "신학생", val: "신학생 (theology_student)" },
                                                { label: "선교사", val: "선교사 (missionary)" },
                                                { label: "평신도", val: "평신도 리더 (lay_leader)" },
                                                { label: "은퇴/원로", val: "은퇴/원로 목사 (retired_pastor)" }
                                            ].map((preset) => (
                                                <button
                                                    key={preset.label}
                                                    type="button"
                                                    onClick={() => setEditingApp({ ...editingApp, position: preset.val })}
                                                    className="text-[11px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">소속 부서 (선택)</label>
                                    <input
                                        type="text"
                                        placeholder="예: 청년부, 유초등부 등"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={editingApp.department || ""} onChange={(e) => setEditingApp({ ...editingApp, department: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">트랙</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm uppercase"
                                            value={editingApp.track} onChange={(e) => setEditingApp({ ...editingApp, track: e.target.value as any })}
                                        >
                                            <option value="deborah">Deborah</option>
                                            <option value="barak">Barak</option>
                                            <option value="jael">Jael</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">심사 상태</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-medium"
                                            value={editingApp.status} onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as any })}
                                        >
                                            <option value="pending">대기중 (pending)</option>
                                            <option value="approved">승인됨 (approved)</option>
                                            <option value="rejected">거절됨 (rejected)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">지원 동기</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                                        value={editingApp.motivation || ""}
                                        onChange={(e) => setEditingApp({ ...editingApp, motivation: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setEditingApp(null); }}
                                        className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 text-sm"
                                    >
                                        수정사항 저장
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal (Guarantees execution without browser confirm() blocking) */}
            <AnimatePresence>
                {deleteTargetApp && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDeleteTargetApp(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden p-6 text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">신청서 영구 삭제</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                <span className="font-bold text-slate-900">{deleteTargetApp.name}</span>
                                {deleteTargetApp.email ? ` (${deleteTargetApp.email})` : ""}
                                님의 입학 신청서를 영구 삭제하시겠습니까?
                                <br />
                                <span className="text-red-500 font-semibold text-xs mt-1 block">
                                    데이터베이스와 로컬 스토리지 모두에서 되돌릴 수 없이 영구 삭제됩니다.
                                </span>
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={() => setDeleteTargetApp(null)}
                                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={handleConfirmDelete}
                                    className="py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    {isDeleting ? "삭제 중..." : "영구 삭제하기"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Floating Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[150] bg-slate-900/95 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border border-slate-700 text-sm font-semibold"
                    >
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
