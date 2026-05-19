"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, ArrowRight, Trophy, Sparkles, MessageSquare, BookOpen, Clock, Activity, Calendar } from "lucide-react";
import { db, Progress } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { mockCourses, Course, Module } from "@/lib/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Circular Progress Component
const CircularProgress = ({ value, size = 120, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-100"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-yellow-500 transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                <span className="text-3xl font-bold">{Math.round(value)}%</span>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProgress: 0,
        completedCourses: 0,
        lastAccessedCourse: null as (Course & { progress: number, nextModule?: Module }) | null,
    });
    const [weeklyData, setWeeklyData] = useState<{ day: string; value: number }[]>([]);

    useEffect(() => {
        if (user) {
            const allProgress = db.progress.getAll(user.id);
            const weeklyStats = db.progress.getWeeklyStats(user.id);
            setWeeklyData(weeklyStats);

            let totalProgressSum = 0;
            let completedCount = 0;
            let lastAccessed: any = null;
            let lastAccessDate = new Date(0);

            // Re-fetch courses from DB to ensure sync
            const courses = db.courses.getAll();

            courses.forEach(course => {
                const p = allProgress.find(ap => ap.courseId === course.id);
                let currentProgress = 0;
                let nextModule: Module | undefined;

                if (p) {
                    currentProgress = (p.completedLessons.length / (course.modules?.length || 1)) * 100;
                    totalProgressSum += currentProgress;
                    if (currentProgress >= 100) completedCount++;

                    if (course.modules) {
                        nextModule = course.modules.find(m => !p.completedLessons.includes(m.id));
                    }

                    const accessDate = new Date(p.lastAccess);
                    if (accessDate > lastAccessDate) {
                        lastAccessDate = accessDate;
                        lastAccessed = { ...course, progress: currentProgress, nextModule };
                    }
                } else {
                    if (course.modules) {
                        nextModule = course.modules[0];
                    }
                }
            });

            if (!lastAccessed && courses.length > 0) {
                const firstCourse = courses[0];
                lastAccessed = {
                    ...firstCourse,
                    progress: 0,
                    nextModule: firstCourse.modules ? firstCourse.modules[0] : undefined
                };
            }

            setStats({
                totalProgress: courses.length > 0 ? Math.round(totalProgressSum / courses.length) : 0,
                completedCourses: completedCount,
                lastAccessedCourse: lastAccessed,
            });
        }
    }, [user]);

    const handleContinueLearning = () => {
        if (stats.lastAccessedCourse) {
            const nextModId = stats.lastAccessedCourse.nextModule?.id;
            // Go to specific lesson page if implemented, or deep link
            // User requested: app/(dashboard)/course/[id]/lesson/[id]/page.tsx
            // We will route to that.
            if (nextModId) {
                router.push(`/course/${stats.lastAccessedCourse.id}?module=${nextModId}`);
            } else {
                // Course overview if completed
                router.push(`/course/${stats.lastAccessedCourse.id}`);
            }
        }
    };

    if (!user) return null; // handled by loading state in layout usually, or skeletal here

    const activeCourse = stats.lastAccessedCourse || { ...mockCourses[0], progress: 0, nextModule: mockCourses[0].modules?.[0] };

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* 1. Welcome Header (Glassmorphism on Dark or clean on light) */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Shalom, <span className="text-blue-900">{user.name}</span> 목사님.
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/my-classroom" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center">
                        내 강의실
                    </Link>
                    <button className="px-4 py-2 bg-blue-900 text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                        새로운 과정 찾기
                    </button>
                </div>
            </header>

            {/* 2. Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* A. Next Lesson Card (Large, 2x2 or 2x1) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="md:col-span-2 row-span-2 bg-[#0f172a] rounded-3xl p-8 relative overflow-hidden group text-white flex flex-col justify-between"
                >
                    {/* Background visual & Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Cinematic Background (Ken Burns Effect) */}
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.15 }}
                            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/40" />

                        {/* Animated Orbs - Intensified */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.4, 0.7, 0.4],
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/50 rounded-full blur-[80px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.3, 0.6, 0.3],
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-amber-600/40 rounded-full blur-[80px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/30 rounded-full blur-[60px]"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="text-xs font-bold tracking-wider uppercase">Continue Learning</span>
                            </div>

                            {/* Graphic Equalizer / Waveform */}
                            <div className="flex items-end gap-1 h-6">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 16, 8, 20, 4] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            delay: i * 0.1
                                        }}
                                        className="w-1 bg-yellow-500/80 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                            {activeCourse.nextModule ? activeCourse.nextModule.title : "모든 과정을 완료했습니다."}
                        </h2>
                        <p className="text-slate-400 line-clamp-2 max-w-md">
                            {activeCourse.nextModule ? activeCourse.nextModule.description : "새로운 과정을 시작하여 기름부으심을 이어가세요."}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">{activeCourse.title}</p>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: `${activeCourse.progress}%` }} />
                                </div>
                                <span className="text-xs font-mono text-yellow-500">{Math.round(activeCourse.progress)}%</span>
                            </div>
                        </div>
                        <button
                            onClick={handleContinueLearning}
                            className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 shadow-lg shadow-yellow-500/20 hover:scale-110 hover:bg-yellow-400 transition-all cursor-pointer relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/30 animate-ping rounded-full opacity-0 group-hover/btn:opacity-100" />
                            <PlayCircle className="w-8 h-8 fill-current relative z-10" />
                        </button>
                    </div>
                </motion.div>

                {/* B. Overall Progress (Circular) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy className="w-24 h-24 text-slate-900" />
                    </div>
                    <h3 className="text-slate-500 font-medium mb-4 z-10">전체 진행률</h3>
                    <div className="z-10">
                        <CircularProgress value={stats.totalProgress} />
                    </div>
                    <p className="text-sm text-slate-400 mt-2 z-10 text-center">
                        {stats.completedCourses}개 과정 수료 완료
                    </p>
                </motion.div>

                {/* C. Caleb AI Insight */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Sparkles className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 leading-none">Caleb AI</h3>
                            <span className="text-xs text-indigo-500">Insight & Mentoring</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-xl p-3 border border-indigo-50 text-sm text-slate-600 italic">
                        "목사님, 지난번 나누었던 '드보라의 듣는 마음'에 대한 적용점은 어떠셨나요? 오늘은 그 다음 단계인 선포의 능력을 묵상해보세요."
                    </div>

                    <Link href="/dashboard/caleb-ai" className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                        대화하기 <ArrowRight className="w-3 h-3" />
                    </Link>
                </motion.div>

                {/* D. Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            주간 학습 리듬
                        </h3>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-bold">Live Stats</span>
                    </div>
                    <div className="flex-1 min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 4, 4]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* E. Quick Links / Library */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
                >
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        나의 서재 (Library)
                    </h3>
                    <div className="space-y-3">
                        {db.courses.getAll().slice(0, 3).map(course => (
                            <div key={course.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail})` }} />
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">{course.title}</h4>
                                        <p className="text-xs text-slate-500">{course.totalModules} Lessons</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
