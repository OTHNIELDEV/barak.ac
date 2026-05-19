"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Users, Activity, Award, MessageSquare, TrendingUp, MoreHorizontal } from "lucide-react";
import { db, Banner, AILog, User } from "@/lib/storage";

// --- Components ---

const StatCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
            {change && (
                <div className="flex items-center mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {change}
                </div>
            )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle, action }: any) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {action}
    </div>
);

// --- Main Page ---

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [recentLogs, setRecentLogs] = useState<AILog[]>([]);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);

    useEffect(() => {
        // Load Data
        const dashboardStats = db.admin.getStats();
        const logs = db.admin.aiLogs.getAll().slice(0, 5); // Get last 5
        const users = JSON.parse(localStorage.getItem("barak_users") || "[]").slice(-5).reverse(); // Last 5 users

        setStats(dashboardStats);
        setRecentLogs(logs);
        setRecentUsers(users);
    }, []);

    if (!stats) return <div className="p-10 text-center">대시보드 로딩 중...</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Mock Data for Charts (since we don't have historical data yet)
    const activityData = [
        { name: '월', students: 4, queries: 12 },
        { name: '화', students: 7, queries: 18 },
        { name: '수', students: 5, queries: 14 },
        { name: '목', students: 9, queries: 25 },
        { name: '금', students: 12, queries: 30 },
        { name: '토', students: 15, queries: 45 },
        { name: '일', students: 10, queries: 20 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">대시보드 개요</h1>
                <p className="text-slate-500">관리자님 환영합니다. 오늘의 주요 현황입니다.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="총 학생 수"
                    value={stats.totalStudents}
                    change="지난주 대비 +12%"
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="오늘의 접속자"
                    value={stats.activeToday}
                    change="어제 대비 +5%"
                    icon={Activity}
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="수료율"
                    value={`${stats.completionRate}%`}
                    change="+2% 상승"
                    icon={Award}
                    colorClass="bg-amber-500"
                />
                <StatCard
                    title="AI 질문 수"
                    value={stats.totalAiQueries}
                    change="+28% 급증"
                    icon={MessageSquare}
                    colorClass="bg-indigo-500"
                />
            </div>

            {/* Content Row 1: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <SectionHeader title="주간 활동 내역" subtitle="학생 참여 및 AI 상호작용" />
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="students" name="활동 학생" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="queries" name="AI 질문" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Track Distribution - Pie */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <SectionHeader title="트랙별 등록 현황" subtitle="과정별 학생 분포" />
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.trackData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.trackData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900">{stats.totalStudents}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest">명</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {stats.trackData.map((entry: any, index: number) => (
                            <div key={entry.name} className="flex items-center text-xs text-slate-500">
                                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Row 2: Recent Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent AI Logs */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <SectionHeader
                        title="최근 AI 질문"
                        subtitle="실시간 학생 질문 내역"
                        action={<button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">전체 보기</button>}
                    />
                    <div className="space-y-4">
                        {recentLogs.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 text-sm">최근 질문이 없습니다</div>
                        ) : (
                            recentLogs.map((log) => (
                                <div key={log.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                                AI
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">{log.studentName || "익명"}</span>
                                            {log.category && (
                                                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                                    {log.category}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">"{log.query}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <SectionHeader
                        title="신규 가입 학생"
                        subtitle="최근 가입자 목록"
                        action={<button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">전체 보기</button>}
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium">이름</th>
                                    <th className="px-4 py-3 font-medium">권한</th>
                                    <th className="px-4 py-3 font-medium">가입일</th>
                                    <th className="px-4 py-3 font-medium text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentUsers.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">{user.name[0]}</div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 capitalize">{user.role === 'student' ? '학생' : user.role === 'pastor' ? '목회자' : '관리자'}</td>
                                        <td className="px-4 py-3 text-slate-400">오늘</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
