"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookOpen, Shield, Zap, ChevronRight, PlayCircle, CheckCircle2, Award, FileText, Clock, Users, ArrowRight, Sparkles, Lock, Video } from "lucide-react";
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

    const semester1Subjects = [
        {
            id: 1,
            title: "이갈렙 목사의 성경해석학 실무",
            lectures: "5강",
            professor: "이윤주 학장",
            field: "성경해석학",
            image: "/images/faculty/lee-yoonju.jpg",
            desc: "성경을 바르게 해석하고 목회 현장에 접목하는 핵심 원리와 구속사적 강해"
        },
        {
            id: 2,
            title: "구약 파노라마와 원어 영성",
            lectures: "5강",
            professor: "송민원 교수",
            field: "구약학",
            image: "/images/faculty/song-minwon.jpg",
            desc: "구약의 맥을 잡고 히브리어 원어 '바라크'의 본래적 영성과 지혜 체득"
        },
        {
            id: 3,
            title: "신약 복음서와 하나님 나라",
            lectures: "5강",
            professor: "김영희 교수",
            field: "신약학",
            image: "/images/faculty/kim-younghee.jpg",
            desc: "사복음서 중심 예수 그리스도의 구속사와 초대교회 제자도의 실천"
        },
        {
            id: 4,
            title: "기독교 교육 철학과 영성형성",
            lectures: "5강",
            professor: "전예령 교수",
            field: "기독교교육학",
            image: "/images/faculty/jeon-yeryeong.jpg",
            desc: "세대 통합 교육 프락시스와 사모·여성 지도자를 위한 교육 리더십"
        },
        {
            id: 5,
            title: "성경적 목회상담과 전인 치유",
            lectures: "5강",
            professor: "박은정 교수",
            field: "목회상담학",
            image: "/images/faculty/park-eunjung.jpg",
            desc: "사역 현장의 상처 입은 영혼과 가정을 돌보는 성경적 상담 및 치유 실무"
        },
        {
            id: 6,
            title: "생성형 AI와 스마트 목회",
            lectures: "5강",
            professor: "김종우 교수",
            field: "인공지능 시대의 기독교 신학",
            image: "/images/faculty/kim-jongwoo.jpg",
            desc: "AI 기술을 거룩하게 전용하여 복음 콘텐츠를 제작하는 스마트 사역 실무"
        }
    ];

    const upcomingSemesters = [
        {
            sem: "제 2학기",
            title: "성경해석학과 교육목회 심화",
            totalLectures: "30강",
            desc: "이갈렙 목사의 성경해석학을 통해 성경을 바르게 해석하고 이를 교회와 가정에 가르치는 교육 리더십을 세웁니다.",
            professors: "이윤주 학장, 전예령 교수",
            subjects: ["이갈렙 목사의 성경해석학 실무 심화 (15강)", "기독교 교육 철학과 영성형성 심화 (15강)"]
        },
        {
            sem: "제 3학기",
            title: "목회상담과 전인적 치유 심화",
            totalLectures: "30강",
            desc: "사역 현장의 상처 입은 영혼과 가정을 돌보며, 사모 및 여성 사역자를 위한 정서적 회복과 상담 실무를 배웁니다.",
            professors: "박은정 교수",
            subjects: ["성경적 목회상담과 가족치유 (15강)", "위기상담과 여성사역자의 자기돌봄 (15강)"]
        },
        {
            sem: "제 4학기",
            title: "AI와 미래목회 & 실전 사역",
            totalLectures: "30강",
            desc: "생성형 AI 기술을 거룩하게 전용하여 복음 콘텐츠를 제작하고 온누리(산, 바다, 들)로 나아가는 종합 실천 사역을 완성합니다.",
            professors: "김종우 교수, 이윤주 학장",
            subjects: ["생성형 AI와 스마트 목회 콘텐츠 심화 (15강)", "실전 사역 프로젝트 및 소감문 완성 (15강)"]
        }
    ];

    const getTheme = (index: number) => {
        const themes = [
            { color: "bg-amber-500", icon: BookOpen, accent: "text-amber-600", border: "group-hover:border-amber-500", bgAccent: "group-hover:bg-amber-50" },
            { color: "bg-blue-900", icon: Shield, accent: "text-blue-900", border: "group-hover:border-blue-900", bgAccent: "group-hover:bg-blue-50" },
            { color: "bg-purple-600", icon: Zap, accent: "text-purple-600", border: "group-hover:border-purple-600", bgAccent: "group-hover:bg-purple-50" }
        ];
        return themes[index % themes.length];
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* 1. Hero Section */}
            <section className="relative py-28 overflow-hidden flex items-center justify-center min-h-[50vh] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-amber-500/15 blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-sm">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Barak Academy Curriculum</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                        4학기 120강 정규 교육과정
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                        한 학기 30강, 총 120강으로 완성되는 성경 중심의 실전 신학.<br />
                        <span className="text-amber-300 font-medium">시험 없는(No Exam) 소감문 중심</span>과 <span className="text-white font-medium">자율 수강</span>을 지원합니다.
                    </p>
                </div>
            </section>

            {/* 2. Key Academic Principles & Certificate Criteria (Brochure Section 4 & Attachment 1,2) */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
                    <div className="text-center max-w-3xl mx-auto mb-8">
                        <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">Academic System & Certification</span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                            자격증 발급 및 학사 운영 기준
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-base mb-1">총 4학기 (120강)</h4>
                            <p className="text-xs text-slate-600">한 학기당 30강, 졸업 전까지 총 120강 필수 과목 수강</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-base mb-1">시험 없음 (No Exam)</h4>
                            <p className="text-xs text-slate-600">암기식 시험의 압박 없이 현장 적용과 영적 성장에 집중</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-3">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-base mb-1">A4용지 소감문</h4>
                            <p className="text-xs text-slate-600">각 강의당 A4 1장 소감문 작성을 통해 배운 진리를 삶으로 정리</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-base mb-1">졸업 기한 제한 없음</h4>
                            <p className="text-xs text-slate-600">사역과 일상의 일정에 맞춰 언제든 자율 수강 가능</p>
                        </div>
                    </div>

                    {/* Certification & Holy Spirit Requirement Note */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-blue-900">📌 자격증서 수여 안내:</strong> 누구나 제약 없이 수강하고 수료할 수 있으며, 지도자·사역자 자격증서 수령은 재학 중이거나 수료 후 성령의 권능을 받은 자에게 수여됩니다.
                    </div>
                </div>
            </section>

            {/* 2-2. Academic Operations & Administration Details (첨부자료 3 완벽 반영) */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-8 md:p-10 text-white shadow-xl">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4" /> Academic Operations & Administration
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        학사행정 운영 안내 및 수여 자격증
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm text-slate-200">
                        {/* 1. 영상 강의 및 질의응답 */}
                        <div className="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                            <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-amber-400" />
                                100% 녹화 영상 강의
                            </h4>
                            <p className="leading-relaxed text-slate-300">
                                실시간이 아닌 <strong>전 과목 고화질 녹화 영상 강의</strong>로 진행되어 언제 어디서나 시간과 장소에 구애받지 않고 반복 자율 수강이 가능합니다.
                            </p>
                            <p className="text-[11px] text-amber-200/90 pt-1 border-t border-white/10">
                                • 질의응답: 전용 시스템 및 교수진 이메일 창구 상시 운영
                            </p>
                        </div>

                        {/* 2. 발급 자격증 3종 */}
                        <div className="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                            <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-400" />
                                발급 자격증 (3종)
                            </h4>
                            <ul className="space-y-1.5 text-slate-200 text-xs">
                                <li>• <strong>목사 자격증:</strong> 부목사 / 담임목사</li>
                                <li>• <strong>선교사 자격증</strong></li>
                                <li>• <strong>전도사 자격증</strong></li>
                            </ul>
                        </div>

                        {/* 3. 소속 및 비학위 고지 */}
                        <div className="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                            <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                                <Shield className="w-5 h-5 text-amber-400" />
                                소속 및 공식 공지사항
                            </h4>
                            <p className="leading-relaxed text-slate-300">
                                • <strong>소속:</strong> 산해원교회 산하 신학교 (2년제 총 4학기 과정)
                            </p>
                            <div className="p-2.5 bg-black/30 rounded-xl text-[11px] text-amber-200 border border-amber-400/30">
                                ⚠️ <strong>공지:</strong> 본 과정은 교육부 인가 학위 과정이 아니며, 산해원교회 산하 신학교에서 수여하는 목회자 자격 과정입니다.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 4-Semester Roadmap */}
            <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-blue-900 font-bold text-sm tracking-widest uppercase">Curriculum Roadmap</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                        학기별 정규 커리큘럼 로드맵
                    </h2>
                    <p className="text-slate-600 mt-3 text-base md:text-lg">
                        6인의 교수진이 전하는 제 1학기 6개 과목(30강) 집중 개설 및 전 과정 로드맵
                    </p>
                </div>

                {/* 1st Semester: Active Featured Course */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-blue-900/15 relative overflow-hidden transition-all mb-12">
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900" />

                    {/* Semester 1 Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-3.5 py-1 rounded-full bg-blue-900 text-white font-extrabold text-xs shadow-sm">
                                    제 1학기 (1st Semester)
                                </span>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 현재 정규 개설 · 수강 신청 가능
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                                6인의 교수진과 함께하는 1학기 6대 핵심 신학
                            </h3>
                            <p className="text-slate-600 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
                                6인의 전임 교수진 전원이 1학기에 참여하여 신학의 본질, 성경 해석, 교육, 상담, AI 사역까지 
                                목회 기초를 다지는 <strong>6개 과목(과목당 5개 고화질 영상, 총 30강)</strong>을 제공합니다.
                            </p>
                        </div>

                        <div className="flex-shrink-0 self-start md:self-auto">
                            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex items-center gap-2.5 shadow-sm">
                                <PlayCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-amber-800 font-medium">1학기 영상 구성</div>
                                    <div className="text-base font-extrabold text-amber-950">6개 과목 총 30강</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6 Subjects Grid */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-blue-900" /> 1학기 6대 개설 과목 목록 (과목당 5강 녹화 영상)
                            </h4>
                            <span className="text-xs text-slate-400">100% 자율 수강 · A4 1장 소감문</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {semester1Subjects.map((sub) => (
                                <div 
                                    key={sub.id} 
                                    className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Professor Header */}
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-200">
                                                    <Image 
                                                        src={sub.image} 
                                                        alt={sub.professor} 
                                                        fill 
                                                        className="object-cover group-hover:scale-105 transition-transform" 
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm leading-tight">
                                                        {sub.professor}
                                                    </div>
                                                    <span className="text-[11px] text-slate-500 block">
                                                        {sub.field}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-900 text-[11px] font-bold flex items-center gap-1 flex-shrink-0">
                                                <Video className="w-3 h-3" /> {sub.lectures}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h5 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-900 transition-colors">
                                            {sub.title}
                                        </h5>

                                        {/* Course Desc */}
                                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                            {sub.desc}
                                        </p>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                                        <span className="flex items-center gap-1 text-slate-600">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> 5개 영상 수강
                                        </span>
                                        <span className="text-slate-400">A4 1장 소감문</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Action / Guide Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs md:text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-900 flex-shrink-0" />
                            사역과 일상의 일정에 맞춰 언제든 100% 자율 수강할 수 있으며, 6개 과목 수강 및 소감문 제출 시 1학기가 수료됩니다.
                        </p>
                        <Link
                            href="/apply"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-md flex-shrink-0"
                        >
                            1학기 입학 및 수강 신청 <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Upcoming Semesters (2, 3, 4학기: 희미하게 안보임 처리) */}
                <div className="mt-14">
                    <div className="text-center mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Semesters Roadmap</span>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-500 mt-1">
                            차기 학기 순차 개설 로드맵 (2 · 3 · 4학기)
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                            1학기 학사 일정 및 수료 진행에 맞추어 순차적으로 개설됩니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingSemesters.map((sem, idx) => (
                            <div 
                                key={idx} 
                                className="relative bg-slate-100/60 rounded-3xl p-6 border border-dashed border-slate-300 opacity-40 filter blur-[0.4px] hover:opacity-60 hover:blur-none transition-all duration-300 select-none group"
                            >
                                <div className="absolute top-5 right-5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/90 text-slate-500 text-[11px] font-bold">
                                    <Lock className="w-3 h-3" /> 순차 개설 예정
                                </div>

                                <div className="mb-3">
                                    <span className="px-3 py-0.5 rounded-full bg-slate-300 text-slate-700 font-extrabold text-[11px]">
                                        {sem.sem}
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold text-slate-700 mb-1.5">{sem.title}</h4>
                                <span className="text-xs text-slate-500 block mb-3 font-medium">총 {sem.totalLectures} 예정</span>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                    {sem.desc}
                                </p>

                                <div className="space-y-1.5 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                                    <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                                        담당: {sem.professors}
                                    </div>
                                    {sem.subjects.map((sub, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                            <span>{sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Tracks Section */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">Specialization Tracks</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                            3대 사역 특성화 트랙
                        </h2>
                        <p className="text-slate-600 mt-3 text-base md:text-lg">
                            성경적 리더십의 세 가지 모델(드보라, 바라크, 야엘)을 통한 사역자 맞춤 훈련
                        </p>
                    </div>

                    <div className="space-y-16">
                        {courses.map((track, idx) => {
                            const theme = getTheme(idx);
                            return (
                                <div key={track.id} id={`track-${track.id}`} className="scroll-mt-24">
                                    <div className="relative rounded-3xl overflow-hidden mb-6 shadow-xl group">
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src={
                                                    track.id === 1 ? "/images/track-deborah-biblical.png" :
                                                        track.id === 2 ? "/images/track-barak-biblical.png" :
                                                            "/images/track-jael-biblical.png"
                                                }
                                                alt={track.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
                                        </div>

                                        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg backdrop-blur-sm bg-white/10 border border-white/20")}>
                                                <theme.icon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 rounded-lg text-xs font-bold uppercase mb-2">
                                                    {track.subTitle}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{track.title}</h3>
                                                <p className="text-sm md:text-base text-slate-200 max-w-2xl font-light">
                                                    {track.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Syllabus List */}
                                    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {track.modules.map((item, itemIdx) => (
                                                <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex gap-4 items-start shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                        {itemIdx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                                        <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
                                            <Link
                                                href={`/apply?track=${track.id === 1 ? 'deborah' : track.id === 2 ? 'barak' : 'jael'}`}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md"
                                            >
                                                이 트랙으로 입학 신청하기 <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. CTA Section */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        지금, 2027학년도 1기 신입생에 도전하세요
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl mx-auto font-light">
                        1기 등록 장학금 30% 지급, 사모 특별 장학 50% 할인 혜택과 함께 성경 중심의 영적 성장을 시작하세요.
                    </p>
                    <Link
                        href="/apply"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl hover:scale-105"
                    >
                        입학 신청서 작성하기 <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
