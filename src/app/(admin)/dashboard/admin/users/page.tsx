"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, UserPlus, Shield, Trash2, Mail } from "lucide-react";
import { User, STORAGE_KEYS, db } from "@/lib/storage";

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "", email: "", password: "", role: "student" as "student" | "pastor" | "admin", church: "", level: ""
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setIsLoading(true);
        if (typeof window !== "undefined") {
            setUsers(db.admin.users.getAll());
        }
        setIsLoading(false);
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            db.auth.signup({
                ...newUser,
                profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
            });

            loadUsers(); // Reload to get fresh list
            setIsAddModalOpen(false);
            setNewUser({ name: "", email: "", password: "", role: "student", church: "", level: "" });
            alert("사용자가 추가되었습니다.");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "사용자 추가 중 오류가 발생했습니다.");
        }
    };

    const handleRoleChange = (userId: string, newRole: "student" | "pastor" | "admin") => {
        db.admin.users.updateRole(userId, newRole);
        loadUsers();
    };

    const handleDelete = (userId: string) => {
        if (confirm("정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            db.admin.users.delete(userId);
            loadUsers();
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (isLoading) return <div className="p-8">사용자 목록 로딩 중...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">사용자 관리</h1>
                    <p className="text-slate-500">학생 권한, 역할 및 프로필을 관리합니다.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    사용자 추가
                </button>
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
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                        검색 조건에 맞는 사용자가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">{user.name[0]}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.name}</div>
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
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                                className={`
                                                    px-2 py-1 rounded-md text-xs font-semibold border-0 cursor-pointer
                                                    focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'pastor' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-slate-100 text-slate-600'}
                                                `}
                                            >
                                                <option value="student">학생</option>
                                                <option value="pastor">목회자</option>
                                                <option value="admin">관리자</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700">{user.level || "-"}</span>
                                                <span className="text-xs text-slate-400">{user.church || "교회 정보 없음"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="사용자 삭제"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
        </div>
    );
}
