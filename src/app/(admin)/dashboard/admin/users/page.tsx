"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, UserPlus, Shield, Trash2, Mail, RefreshCw, Edit3, X } from "lucide-react";
import { User, STORAGE_KEYS, db, safeStorage, Application, formatPositionLabel } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { useAuth } from "@/context/AuthContext";

export default function UserManagementPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const cached = db.admin.users.getAll() || [];
                return cached.filter(u => u.id !== "user_1");
            } catch {
                return [];
            }
        }
        return [];
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "", email: "", password: "", role: "student" as "student" | "pastor" | "admin", church: "", level: ""
    });

    // Edit User Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Local & Remote Users
            const localUsers = typeof window !== "undefined" ? db.admin.users.getAll() : [];
            let remoteUsers: User[] = [];
            try {
                remoteUsers = await supabaseDb.admin.users.getAll();
            } catch (e) {
                console.warn("[UserManagement] Remote users fetch error:", e);
            }

            // 2. Fetch Applications to synchronize position (level) and church
            let allApps: Application[] = [];
            try {
                allApps = db.admin.applications.getAll() || [];
            } catch { }

            const appByEmail = new Map<string, Application>();
            allApps.forEach(a => {
                if (a.email) appByEmail.set(a.email.toLowerCase().trim(), a);
            });

            // 3. Smart Merge by email (lowercase)
            const userMap = new Map<string, User>();

            // Remote users first
            remoteUsers.forEach(u => {
                if (u.email) userMap.set(u.email.toLowerCase(), u);
            });

            // Local users merged
            localUsers.forEach(u => {
                const key = (u.email || u.id).toLowerCase();
                if (!userMap.has(key)) {
                    userMap.set(key, u);
                } else {
                    const existing = userMap.get(key)!;
                    userMap.set(key, {
                        ...existing,
                        ...u,
                        id: existing.id || u.id,
                        role: existing.role || u.role
                    });
                }
            });

            // 4. Synchronize with Application positions & churches
            const sanitizedUsers = Array.from(userMap.values())
                .filter(u => u.id !== "user_1")
                .map(u => {
                    const matchedApp = u.email ? appByEmail.get(u.email.toLowerCase().trim()) : null;
                    if (matchedApp) {
                        const appPos = matchedApp.position || "";
                        const isPastor = appPos.includes("목사") || appPos.toLowerCase().includes("pastor");
                        
                        // Harmonize role if not admin
                        const finalRole: "pastor" | "student" | "admin" = u.role === "admin" ? "admin" : (u.role === "pastor" || isPastor ? "pastor" : (u.role || "student"));
                        // Harmonize level with application position if level is generic
                        const finalLevel = (!u.level || u.level.includes("정규 학생") || u.level === "신입생 지원자") && appPos
                            ? appPos
                            : (u.level || appPos || "-");
                        const finalChurch = u.church || matchedApp.church || "";

                        return {
                            ...u,
                            role: finalRole,
                            level: finalLevel,
                            church: finalChurch
                        } as User;
                    }
                    return u;
                });

            setUsers(sanitizedUsers);
            try {
                safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sanitizedUsers));
            } catch { }
        } catch (error) {
            console.error("[UserManagement] loadUsers error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isPastor = newUser.role === "pastor" || newUser.level.includes("목사");
            const role = newUser.role || (isPastor ? "pastor" : "student");

            // Local signup
            db.auth.signup({
                ...newUser,
                role,
                profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
            });

            await loadUsers();
            setIsAddModalOpen(false);
            setNewUser({ name: "", email: "", password: "", role: "student", church: "", level: "" });
            alert("사용자가 성공적으로 추가되었습니다.");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "사용자 추가 중 오류가 발생했습니다.");
        }
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser({
            ...user,
            name: user.name || "",
            email: user.email || "",
            role: user.role || "student",
            church: user.church || "",
            level: user.level || ""
        });
        setIsEditModalOpen(true);
    };

    const handleSaveUserEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            // 1. Update Remote (Supabase & synced applications)
            try {
                await supabaseDb.admin.users.update(editingUser.id, editingUser);
            } catch (remoteErr) {
                console.warn("[UserManagement] Remote edit warning:", remoteErr);
            }

            // 2. Update Local Storage (Users & synced applications)
            db.admin.users.update(editingUser.id, editingUser);

            // 3. Update React State
            setUsers(prev => prev.map(u => 
                (u.id === editingUser.id || (editingUser.email && u.email?.toLowerCase() === editingUser.email.toLowerCase()))
                    ? { ...u, ...editingUser }
                    : u
            ));

            setIsEditModalOpen(false);
            setEditingUser(null);
            alert("사용자 정보가 성공적으로 수정되었으며 입학 관리와 연동되었습니다.");
        } catch (err: any) {
            console.error("[UserManagement] User edit error:", err);
            alert("사용자 수정 중 오류가 발생했습니다.");
        }
    };

    const handleRoleChange = async (userId: string, targetEmail: string, newRole: "student" | "pastor" | "admin") => {
        try {
            // If changing to pastor, also harmonize level
            const currentUserObj = users.find(u => u.id === userId || (u.email && u.email === targetEmail));
            let newLevel = currentUserObj?.level;
            if (newRole === "pastor" && (!newLevel || newLevel.includes("학생"))) {
                newLevel = "목회자 (pastor)";
            }

            // Update local
            db.admin.users.updateRole(userId, newRole, newLevel);

            // Update remote
            await supabaseDb.admin.users.update(userId, { role: newRole, level: newLevel, email: targetEmail });

            // Update local state
            setUsers(prev => prev.map(u => 
                (u.id === userId || (u.email && u.email === targetEmail)) 
                    ? { ...u, role: newRole, level: newLevel || u.level } 
                    : u
            ));
        } catch (e) {
            console.warn("[UserManagement] updateRole error:", e);
        }
    };

    const handleDelete = async (targetUser: User) => {
        // Prevent deleting primary admin
        if (targetUser.email?.toLowerCase() === "a@a.com" || (currentUser && targetUser.email?.toLowerCase() === currentUser.email?.toLowerCase())) {
            alert("시스템 최고 관리자 또는 현재 로그인된 관리자 계정은 보호를 위해 삭제할 수 없습니다.");
            return;
        }

        const confirmMessage = `[${targetUser.name} (${targetUser.email})] 사용자를 정말로 영구 삭제하시겠습니까?\n\n이 작업은 데이터베이스와 로컬 스토리지 모두에서 계정을 영구 삭제하며 되돌릴 수 없습니다.`;
        if (!confirm(confirmMessage)) return;

        setIsDeletingId(targetUser.id);
        try {
            // 1. Delete from Remote Supabase (profiles, applications foreign keys, auth users)
            try {
                await supabaseDb.admin.users.delete(targetUser.id, targetUser.email);
            } catch (remoteErr) {
                console.warn("[UserManagement] Remote delete error:", remoteErr);
            }

            // 2. Delete from Local Storage (by ID and by Email)
            db.admin.users.delete(targetUser.id);
            if (targetUser.email) {
                db.admin.users.delete(targetUser.email);
            }

            // 3. Update UI state immediately
            setUsers(prev => prev.filter(u => 
                u.id !== targetUser.id && 
                u.email?.toLowerCase() !== targetUser.email?.toLowerCase()
            ));

            alert(`"${targetUser.name} (${targetUser.email})" 사용자가 완전히 영구 삭제되었습니다.`);
        } catch (error: any) {
            console.error("[UserManagement] handleDelete error:", error);
            alert("사용자 삭제 중 오류가 발생했습니다: " + (error?.message || ""));
        } finally {
            setIsDeletingId(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">사용자 관리</h1>
                    <p className="text-slate-500">학생 권한, 역할 및 프로필을 관리합니다.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadUsers}
                        disabled={isLoading}
                        className="flex items-center justify-center px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all shadow-sm text-sm"
                        title="사용자 목록 새로고침"
                    >
                        <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                        새로고침
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        사용자 추가
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="이름 또는 이메일로 검색하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
                    >
                        <option value="all">모든 역할</option>
                        <option value="student">학생</option>
                        <option value="pastor">목회자</option>
                        <option value="admin">관리자</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">사용자</th>
                                <th className="px-6 py-4 font-medium">역할</th>
                                <th className="px-6 py-4 font-medium">직분 / 교회</th>
                                <th className="px-6 py-4 font-medium text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && filteredUsers.length === 0 ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={`skel-${idx}`} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-28 bg-slate-200 rounded" />
                                                    <div className="h-3 w-40 bg-slate-100 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 w-16 bg-slate-200 rounded-md" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <div className="h-4 w-20 bg-slate-200 rounded" />
                                                <div className="h-3 w-28 bg-slate-100 rounded" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                        검색 조건에 맞는 사용자가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const isPrimaryAdmin = user.email?.toLowerCase() === "a@a.com";
                                    const isSelf = currentUser && user.email?.toLowerCase() === currentUser.email?.toLowerCase();
                                    const isProtected = isPrimaryAdmin || isSelf;

                                    return (
                                        <tr key={user.id || user.email} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        {user.profileImage ? (
                                                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">{user.name?.[0] || "U"}</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                            {user.name}
                                                            {isProtected && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold border border-purple-200">
                                                                    관리자
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    disabled={isPrimaryAdmin}
                                                    onChange={(e) => handleRoleChange(user.id, user.email, e.target.value as any)}
                                                    className={`
                                                        px-2 py-1 rounded-md text-xs font-semibold border-0 cursor-pointer
                                                        focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
                                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                            user.role === 'pastor' ? 'bg-indigo-100 text-indigo-700' :
                                                                'bg-slate-100 text-slate-600'}
                                                        ${isPrimaryAdmin ? 'cursor-not-allowed opacity-80' : ''}
                                                    `}
                                                >
                                                    <option value="student">학생</option>
                                                    <option value="pastor">목회자</option>
                                                    <option value="admin">관리자</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-700 font-medium">{formatPositionLabel(user.level)}</span>
                                                    <span className="text-xs text-slate-400">{user.church || "교회 정보 없음"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEdit(user)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="사용자 정보 수정 (입학 관리 자동 연동)"
                                                    >
                                                        <Edit3 className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    {isProtected ? (
                                                        <span
                                                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 px-2 py-1 bg-slate-50 rounded-lg border border-slate-200"
                                                            title="최고 관리자 계정은 삭제할 수 없습니다."
                                                        >
                                                            <Shield className="w-3 h-3 text-purple-600" /> 보호됨
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            disabled={isDeletingId === user.id}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                            title="사용자 영구 삭제"
                                                        >
                                                            {isDeletingId === user.id ? (
                                                                <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4 text-red-500/80 hover:text-red-600" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                    <span>전체 {users.length}명 중 {filteredUsers.length}명 표시</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>이전</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>다음</button>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">사용자 직접 추가</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <Trash2 className="w-6 h-6 rotate-45" /> {/* Using Trash2 rotated as Close icon for simplicity if X not imported, or just import X */}
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">비밀번호</label>
                                    <input
                                        type="password" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        placeholder="초기 비밀번호"
                                        value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">이메일 (ID)</label>
                                <input
                                    type="email" required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                    value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">교회</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        value={newUser.church} onChange={(e) => setNewUser({ ...newUser, church: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">직분/레벨</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        placeholder="예: 부목사, 간사"
                                        value={newUser.level} onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">시스템 역할</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['student', 'pastor', 'admin'] as const).map(role => (
                                        <button
                                            key={role} type="button"
                                            onClick={() => setNewUser({ ...newUser, role })}
                                            className={`py-2 rounded-lg text-sm font-bold border capitalize ${newUser.role === role ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600"}`}
                                        >
                                            {role}
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
                                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                                >
                                    사용자 추가
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">사용자 정보 및 소속 수정</h3>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">이메일</label>
                                    <input
                                        type="email" disabled
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                        value={editingUser.email}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">소속 교회</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        placeholder="예: 초월선교교회"
                                        value={editingUser.church || ""} onChange={(e) => setEditingUser({ ...editingUser, church: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">직분 (Level)</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        placeholder="예: 목회자, 은퇴/원로 목사, 사모"
                                        value={editingUser.level || ""} onChange={(e) => setEditingUser({ ...editingUser, level: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">시스템 역할</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['student', 'pastor', 'admin'] as const).map(role => (
                                        <button
                                            key={role} type="button"
                                            onClick={() => setEditingUser({ ...editingUser, role })}
                                            className={`py-2 rounded-lg text-sm font-bold border capitalize ${editingUser.role === role ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600"}`}
                                        >
                                            {role === 'student' ? '학생' : role === 'pastor' ? '목회자' : '관리자'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                💡 여기서 수정한 소속 교회, 직분, 이름은 <strong>입학 관리의 신청서 정보와도 실시간 자동 연동</strong>됩니다.
                            </p>
                            <div className="pt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm"
                                >
                                    수정 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
