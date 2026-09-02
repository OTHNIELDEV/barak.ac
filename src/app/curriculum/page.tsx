"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookOpen, Shield, Zap, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Course, db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";

export default function CurriculumPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchCourses = async () => {
            try {
                const remoteCourses = await supabaseDb.courses.getAll();
                if (remoteCourses && remoteCourses.length > 0) {
                    setCourses(remoteCourses);
                } else {
                    setCourses(db.courses.getAll());
                }
            } catch (e) {
                console.warn("Failed to load remote courses, fallback to local:", e);
                setCourses(db.courses.getAll());
            }
        };
        fetchCourses();
    }, []);

    const getTheme = (index: number) => {
        const themes = [
            { color: "bg-yellow-500", icon: BookOpen, accent: "text-amber-600", border: "group-hover:border-amber-500", bgAccent: "group-hover:bg-amber-50" },
            { color: "bg-blue-900", icon: Shield, accent: "text-blue-900", border: "group-hover:border-blue-900", bgAccent: "group-hover:bg-blue-50" },
            { color: "bg-purple-600", icon: Zap, accent: "text-purple-600", border: "group-hover:border-purple-600", bgAccent: "group-hover:bg-purple-50" }
        ];
        return themes[index % themes.length];
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[50vh] bg-white">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-purple-100/50 blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white z-20" />

                {/* Hero Image with Gradient Fade */}
                <div
                    className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"
                    style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)' }}
                />

                <div className="relative z-30 max-w-5xl mx-auto px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 shadow-sm animate-fade-in-up ring-1 ring-blue-100">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest uppercase">Curriculum</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight animate-fade-in-up delay-100 drop-shadow-sm">
                        교육 과정 안내
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        성경적 원리에 기반한 체계적인 3단계 훈련 시스템.<br />
                        이론이 아닌, <span className="text-slate-900 font-bold relative inline-block">
                            현장 중심의 커리큘럼
                            <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200/50 -z-10 rounded-full"></span>
                        </span>을 제공합니다.
                    </p>
                </div>
            </section>

            {/* Tracks Detail */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                    {courses.map((track, idx) => {
                        const theme = getTheme(idx);
                        return (
                            <div key={track.id} id={`track-${track.id}`} className="scroll-mt-24">
                                {/* Header of Track (Cinematic Background) */}
                                <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl group">
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={
                                                track.id === 1 ? "/images/track-deborah-biblical.png" :
                                                    track.id === 2 ? "/images/track-barak-biblical.png" :
                                                        "/images/track-jael-biblical.png"
                                            }
                                            alt={track.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
                                        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg backdrop-blur-sm bg-white/10 border border-white/20")}>
                                            <theme.icon className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 rounded-lg text-sm font-bold tracking-wide uppercase mb-3 shadow-sm">
                                                {track.subTitle}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">{track.title}</h2>
                                            <p className="text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm font-light">
                                                {track.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Syllabus List */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                                        <PlayCircle className={cn("w-5 h-5", theme.accent)} />
                                        커리큘럼 상세
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        {track.modules.length > 0 ? (
                                            track.modules.map((item, itemIdx) => (
                                                <div key={item.id} className="flex gap-4 group">
                                                    <div className={cn("flex-none w-16 h-16 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 transition-colors", theme.border, theme.bgAccent)}>
                                                        <span className={cn("text-xs text-slate-400 uppercase font-bold group-hover:text-current transition-colors", theme.accent)}>Lecture</span>
                                                        <span className="text-xl font-bold text-slate-900">{itemIdx + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className={cn("text-lg font-bold text-slate-900 mb-1 transition-colors group-hover:text-current", theme.accent)}>{item.title}</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center text-slate-400 py-8">등록된 강의가 없습니다.</div>
                                        )}
                                    </div>

                                    {/* CTA for this track */}
                                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                                        <Link href={`/apply?track=${track.id === 1 ? 'deborah' : track.id === 2 ? 'barak' : 'jael'}`} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md hover:shadow-xl transform hover:-translate-y-1">
                                            이 과정 수강 신청하기 <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </section>

            {/* Common Requirements */}
            <section className="py-20 bg-slate-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">수료 요건 및 혜택</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-blue-900">수료 요건</h3>
                            <ul className="space-y-3 text-slate-600 list-disc list-inside">
                                <li>전체 강의 100% 수강 완료</li>
                                <li>각 주차별 퀴즈 또는 과제 제출</li>
                                <li>최종 파이널 프로젝트 수행</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-blue-900">수료 혜택</h3>
                            <ul className="space-y-3 text-slate-600 list-disc list-inside">
                                <li>Barak Academy 정식 수료증 발급 (NFT)</li>
                                <li>동문 커뮤니티 평생 멤버십</li>
                                <li>심화 과정 수강 자격 부여</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Curriculum Section */}
            <section className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <a
                        href="/curriculum.pdf"
                        download
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                    >
                        <BookOpen className="w-6 h-6" />
                        커리큘럼(PDF) 다운로드
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
