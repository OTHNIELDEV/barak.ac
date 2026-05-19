"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { mockCourses } from "@/lib/mockData";
import { db } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";

export default function MyClassroomPage() {
    const { user } = useAuth();
    const [courseProgresses, setCourseProgresses] = useState<Record<number, number>>({});

    useEffect(() => {
        if (user) {
            const progresses: Record<number, number> = {};
            mockCourses.forEach(course => {
                const p = db.progress.get(user.id, course.id);
                progresses[course.id] = p ? (p.completedLessons.length / course.totalModules) * 100 : 0;
            });
            setCourseProgresses(progresses);
        }
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-900" />
                    내 강의실
                </h1>
                <p className="text-slate-600 mt-2">수강 중인 트랙의 진도율을 확인하고 학습을 이어가세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map((course) => {
                    const progress = courseProgresses[course.id] || 0;
                    const isCompleted = progress === 100;

                    return (
                        <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col">
                            <div className="h-48 relative group">
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors" />

                                <div className="absolute inset-0 flex items-center justify-center relative z-10 p-6">
                                    <h3 className="text-xl font-bold text-white text-center leading-tight drop-shadow-md">
                                        {course.title.split(":")[0]}
                                    </h3>
                                </div>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                    <Link href={`/course/${course.id}`} className="bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-full p-4 hover:scale-110 hover:bg-white hover:text-blue-900 transition-all">
                                        <PlayCircle className="w-8 h-8 fill-current" />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-bold">
                                        {isCompleted ? "수료 완료" : "수강 중"}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                                    {course.description}
                                </p>

                                {/* Detailed Curriculum List */}
                                <div className="mb-6 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum</h4>
                                    <div className="space-y-2">
                                        {course.modules?.map((module, idx) => (
                                            <div key={module.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-bold text-slate-800 truncate">{module.title}</h5>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{module.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className={isCompleted ? "text-green-600" : "text-blue-600"}>
                                            {Math.round(progress)}% 완료
                                        </span>
                                        <span className="text-slate-400">
                                            {isCompleted ? "수강 완료" : "이어서 학습하기"}
                                        </span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>

                                <Link
                                    href={`/course/${course.id}`}
                                    className="mt-6 w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-900 hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2"
                                >
                                    {isCompleted ? "복습하기" : "강의실 입장"}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
