"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    BookOpen, PlayCircle, CheckCircle2, ArrowRight, Award, FileText,
    Sparkles, Download, Shield, Play, Clock, User, Check, Send, Loader2,
    MessageSquare, HelpCircle, ChevronRight, FastForward, RotateCcw, AlertCircle
} from "lucide-react";
import { mockCourses } from "@/lib/mockData";
import { db, CertificateIssued } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { certificateEngine, ReflectionSubmission } from "@/lib/certificateEngine";
import { motion, AnimatePresence } from "framer-motion";

// 5대 핵심 실전 데모 강의 데이터 (실제 재생 가능한 YouTube 영상)
const DEMO_LECTURES = [
    {
        id: "demo-1",
        lectureNo: 1,
        title: "제1강: 디지털 시대의 성경해석학과 구속사적 통찰",
        instructor: "이윤주 학장 (Ph.D)",
        instructorRole: "바라크아카데미 학장 / 산해원교회 담임목사",
        duration: "15:00",
        youtubeId: "M7lc1UVf-VE",
        thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1000&auto=format&fit=crop",
        category: "성경해석학",
        bibleVerse: "딤후 3:16~17 / 요 5:39",
        summary: "AI의 환각과 넘치는 거짓 정보 속에서 변하지 않는 성경 원문의 진리(Canon)를 수호하고 해석하는 구속사적 성경해석학의 핵심 원리를 정립합니다.",
        handout: "공식_성경해석학_제1강_교안.pdf"
    },
    {
        id: "demo-2",
        lectureNo: 2,
        title: "제2강: 히브리어 '바라크(ברך)'의 어원과 언약적 축복",
        instructor: "송민원 교수",
        instructorRole: "더바이블 무브먼트 대표 / 구약학 교수",
        duration: "18:00",
        youtubeId: "kJQP7kiw5Fk",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop",
        category: "구약 신학",
        bibleVerse: "창 12:1~3 / 시 103:1~5",
        summary: "구약 성경 원어 히브리어 '바라크'의 3대 어원적 영성(무릎을 꿇음, 하나님을 찬양함, 하늘의 복을 받음)을 심층 분석하여 사역자의 기초를 세웁니다.",
        handout: "바라크_원어신학_연구보고서.pdf"
    },
    {
        id: "demo-3",
        lectureNo: 3,
        title: "제3강: 사사기 드보라와 바락의 거룩한 동역 리더십",
        instructor: "이윤주 학장 (Ph.D)",
        instructorRole: "바라크아카데미 학장 / 총괄교수",
        duration: "20:00",
        youtubeId: "s0dMTAQM4cw",
        thumbnail: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
        category: "실천 신학 & 리더십",
        bibleVerse: "삿 4:4~9 / 히 11:32",
        summary: "사사기 시대 영적 통찰을 가진 드보라와 충성된 순종의 바락이 함께 이룬 동사(同使) 사역의 비밀을 현대 목회와 전문 부목자 사역에 적용합니다.",
        handout: "드보라_바락_동역목회론.pdf"
    },
    {
        id: "demo-4",
        lectureNo: 4,
        title: "제4강: 스마트 목회와 AI 시대의 말씀 사역",
        instructor: "김종우 교수",
        instructorRole: "스마트목회지원 연구소장 / AI와 기독교",
        duration: "16:00",
        youtubeId: "ZbZSe6N_BXs",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
        category: "AI & 미래목회",
        bibleVerse: "단 12:4 / 마 24:14",
        summary: "생성형 AI와 디지털 기술을 복음 전파와 교회 교육, 콘텐츠 제작에 거룩하게 선용하는 실전 스마트 목회 워크플로우를 습득합니다.",
        handout: "생성형AI_스마트목회_매뉴얼.pdf"
    },
    {
        id: "demo-5",
        lectureNo: 5,
        title: "제5강: 불과 성령의 기름부으심과 실전 사역의 능력",
        instructor: "이윤주 학장 (Ph.D)",
        instructorRole: "바라크아카데미 학장 / 산해원교회 담임목사",
        duration: "22:00",
        youtubeId: "21X5lGlDOfg",
        thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop",
        category: "영성 신학",
        bibleVerse: "마 3:11 / 행 1:8 / 요 7:38~39",
        summary: "단순한 지식 신학을 넘어 오순절 마가 다락방의 불과 성령의 권능 세례를 입고 교회와 온누리 현장에 기름부음 받는 사역자로 우뚝 섭니다.",
        handout: "성령의불세례와_영적권능.pdf"
    }
];

export default function MyClassroomPage() {
    const { user } = useAuth();
    const [activeLectureIndex, setActiveLectureIndex] = useState(0);
    const [completedLectures, setCompletedLectures] = useState<string[]>([]);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [reflectionContent, setReflectionContent] = useState("");
    const [hasSubmittedReflection, setHasSubmittedReflection] = useState(false);
    const [issuedCert, setIssuedCert] = useState<CertificateIssued | null>(null);
    const [showCertModal, setShowCertModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"video" | "handout" | "reflection" | "ai">("video");

    // AI Chat local state
    const [aiInput, setAiInput] = useState("");
    const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "caleb"; text: string }>>([
        {
            sender: "caleb",
            text: "할렐루야! 바라크아카데미 온라인 강의실에 오신 것을 환영합니다. 강의를 들으시며 성경 구절이나 사역 적용에 대해 언제든 편하게 질문해 주세요."
        }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const currentLecture = DEMO_LECTURES[activeLectureIndex];
    const totalCount = DEMO_LECTURES.length;
    const completedCount = completedLectures.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);
    const isAllLecturesCompleted = completedCount === totalCount;
    const isCurrentLectureDone = completedLectures.includes(currentLecture.id);

    // Initial Load: Check saved progress & certificates
    useEffect(() => {
        if (typeof window === "undefined" || !user) return;

        // 1. Load completed demo lectures from local storage
        const savedCompleted = localStorage.getItem(`barak_demo_completed_${user.id}`);
        if (savedCompleted) {
            try {
                setCompletedLectures(JSON.parse(savedCompleted));
            } catch (e) { }
        }

        // 2. Load reflection
        const savedRef = localStorage.getItem(`barak_demo_reflection_${user.id}`);
        if (savedRef) {
            setHasSubmittedReflection(true);
            setReflectionContent(savedRef);
        }

        // 3. Load Certificate
        const allCerts = db.admin.certificates.getAll();
        const myCert = allCerts.find(c => c.studentId === user.id || c.studentName === user.name);
        if (myCert) {
            setIssuedCert(myCert);
        }
    }, [user]);

    // Handle Amen / Complete
    const handleAmenComplete = async () => {
        if (!user) return;

        const updated = Array.from(new Set([...completedLectures, currentLecture.id]));
        setCompletedLectures(updated);
        localStorage.setItem(`barak_demo_completed_${user.id}`, JSON.stringify(updated));
        setIsVideoEnded(true);

        // Check if all 5 completed
        if (updated.length === totalCount && hasSubmittedReflection) {
            await autoIssueCertificate();
        } else if (activeLectureIndex < totalCount - 1) {
            // Next Lecture prompt
            if (confirm("할렐루야! 이번 강의를 수료하셨습니다. 다음 강의로 이동하시겠습니까?")) {
                setActiveLectureIndex(prev => prev + 1);
                setIsVideoEnded(false);
            }
        }
    };

    // Fast Test Pass
    const handleFastPass = () => {
        setIsVideoEnded(true);
    };

    // Submit Reflection
    const handleReflectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !reflectionContent.trim()) return;

        localStorage.setItem(`barak_demo_reflection_${user.id}`, reflectionContent);
        setHasSubmittedReflection(true);
        alert("A4 과목 실천 소감문이 성공적으로 접수 및 승인되었습니다!");

        if (completedLectures.length === totalCount) {
            await autoIssueCertificate();
        }
    };

    // Auto Issue Certificate
    const autoIssueCertificate = async () => {
        if (!user) return;

        const rolePrefix = "BARAK";
        const randomKey = Math.random().toString(36).substring(2, 6).toUpperCase();
        const licenseKey = `BA-2026-${rolePrefix}-${randomKey}`;

        const newCert = db.admin.certificates.issue({
            studentId: user.id,
            studentName: user.name,
            trackId: 1,
            trackTitle: "제1기 바라크아카데미 정규 온라인 신학과정 (5대 핵심 강좌)",
            licenseKey
        });

        try {
            await supabaseDb.admin.certificates.issue({
                studentId: user.id,
                studentName: user.name,
                trackId: 1,
                trackTitle: "제1기 바라크아카데미 정규 온라인 신학과정 (5대 핵심 강좌)",
                licenseKey
            });
        } catch (e) { }

        setIssuedCert(newCert);
        setShowCertModal(true);
    };

    // AI Ask
    const handleAskAi = async (customPrompt?: string) => {
        const query = customPrompt || aiInput;
        if (!query.trim()) return;

        setAiMessages(prev => [...prev, { sender: "user", text: query }]);
        if (!customPrompt) setAiInput("");
        setIsAiLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: `당신은 바라크아카데미 영적 튜터 '갈렙 AI'입니다. 현재 학생은 [${currentLecture.title} - 강사: ${currentLecture.instructor}]를 수강 중입니다. 성경적이며 은혜롭고 신학적으로 깊이 있게 3~4문장으로 답변해 주세요.` },
                        { role: "user", content: query }
                    ]
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAiMessages(prev => [...prev, { sender: "caleb", text: data.response || "주님의 은혜와 평강이 함께하시길 축복합니다." }]);
            } else {
                setAiMessages(prev => [...prev, { sender: "caleb", text: `[갈렙 AI 답변] '${query}'에 대해 묵상할 때, 하나님의 말씀은 살았고 활력이 있어 우리의 영과 혼과 골수를 찔러 쪼갭니다(히 4:12). 배운 진리를 붙들고 기도할 때 성령의 지혜가 임할 줄 믿습니다!` }]);
            }
        } catch (e) {
            setAiMessages(prev => [...prev, { sender: "caleb", text: `[갈렙 AI 답변] '${query}'에 대한 귀한 질문입니다. ${currentLecture.instructor}님의 강의 핵심처럼, 인간의 지식을 넘어 성령의 기름부으심 안에서 순종할 때 사역의 열매가 맺어집니다.` }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 px-2 sm:px-4">

            {/* 1. Header & Official Banner */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-amber-400/30">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-400/30">
                        <Sparkles className="w-3.5 h-3.5" /> 2026 Barak Online Seminary • Live Demo
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-amber-400" />
                        바라크아카데미 온라인 강의실
                    </h1>
                    <p className="text-slate-300 mt-1 text-xs md:text-sm font-light">
                        유튜브 실시간 강의를 시청하고, <strong>'아멘' 출석 인증</strong>과 <strong>A4 소감문</strong>을 제출하여 <strong>공인 사역자 자격증서</strong>를 취득하세요.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                        href="/certificate"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
                    >
                        <Award className="w-4 h-4 text-slate-950" /> 공식 자격증서 발급센터
                    </Link>
                </div>
            </div>

            {/* 2. Certificate Issued Notification Banner (If Ready) */}
            {issuedCert && (
                <div className="mb-6 p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-2xl text-slate-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Award className="w-7 h-7 text-slate-950" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base md:text-lg">
                                🎉 {user?.name} 님의 공인 사역자 자격증서가 정식 발급되었습니다!
                            </h3>
                            <p className="text-xs font-semibold text-slate-900/80">
                                발급등록번호 : <span className="font-mono underline font-bold">{issuedCert.licenseKey}</span> (산해원교회 산하 • 학장 이윤주 박사/목사)
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/certificate"
                        className="px-5 py-2.5 bg-slate-950 text-amber-300 rounded-xl font-bold text-xs hover:bg-slate-900 transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
                    >
                        <Download className="w-4 h-4" /> 자격증서 고해상도 PDF 출력
                    </Link>
                </div>
            )}

            {/* 3. Main Workspace: [Video & Controls] (Left 7) + [Playlist & AI] (Right 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left 7 Columns: Video Player & Lecture Detail */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 3-1. YouTube Video Player Card */}
                    <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Player Header */}
                        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="font-bold text-amber-300">{currentLecture.category}</span>
                                <span className="text-slate-500">•</span>
                                <span className="font-medium text-slate-300">{currentLecture.duration}</span>
                            </div>
                            <span className="text-slate-400 font-mono text-[11px]">
                                Lecture {activeLectureIndex + 1} / {totalCount}
                            </span>
                        </div>

                        {/* YouTube Embed Frame */}
                        <div className="relative aspect-video w-full bg-black">
                            <iframe
                                key={currentLecture.youtubeId}
                                src={`https://www.youtube-nocookie.com/embed/${currentLecture.youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                                title={currentLecture.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />

                            {/* Test Fast-Pass Button Overlay */}
                            {!isVideoEnded && !isCurrentLectureDone && (
                                <button
                                    onClick={handleFastPass}
                                    className="absolute bottom-3 right-3 z-20 px-3 py-1.5 bg-black/80 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-bold rounded-xl border border-amber-400/40 backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5"
                                    title="테스트 목적으로 시청 완료 상태로 전환합니다."
                                >
                                    <FastForward className="w-3.5 h-3.5" />
                                    <span>[테스트] 시청 완료 처리</span>
                                </button>
                            )}
                        </div>

                        {/* Video Bottom Amen Bar */}
                        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                            <div className="text-left w-full sm:w-auto">
                                <h4 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                                    {isCurrentLectureDone ? (
                                        <span className="text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" /> 수강 완료됨 (Amen)
                                        </span>
                                    ) : isVideoEnded ? (
                                        <span className="text-amber-300 flex items-center gap-1 animate-pulse">
                                            <Sparkles className="w-4 h-4" /> 시청 완료! 아래 '아멘'을 눌러주세요
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs">
                                            강의 시청 후 [아멘] 버튼으로 출석과 진도를 저장합니다.
                                        </span>
                                    )}
                                </h4>
                            </div>

                            <button
                                onClick={handleAmenComplete}
                                disabled={!isVideoEnded && !isCurrentLectureDone}
                                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                                    isCurrentLectureDone
                                        ? "bg-slate-800 text-slate-400 cursor-default border border-slate-700"
                                        : isVideoEnded
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-105 active:scale-95 animate-pulse"
                                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{isCurrentLectureDone ? "출석 완료 (Amen)" : "AMEN / 묵상 완료"}</span>
                            </button>
                        </div>
                    </div>

                    {/* 3-2. Lecture Details & Tabs (강의 상세 / 소감문 / 교안) */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
                        {/* Tab Bar */}
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6 text-xs md:text-sm font-bold">
                            <button
                                onClick={() => setActiveTab("video")}
                                className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === "video" ? "text-blue-900 border-b-2 border-blue-900 font-extrabold" : "text-slate-400 hover:text-slate-700"}`}
                            >
                                <BookOpen className="w-4 h-4" /> 강의 개요 & 본문
                            </button>
                            <button
                                onClick={() => setActiveTab("reflection")}
                                className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === "reflection" ? "text-amber-600 border-b-2 border-amber-500 font-extrabold" : "text-slate-400 hover:text-slate-700"}`}
                            >
                                <Award className="w-4 h-4" /> A4 과목 소감문 (자격증 필수)
                                {hasSubmittedReflection && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("handout")}
                                className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === "handout" ? "text-blue-900 border-b-2 border-blue-900 font-extrabold" : "text-slate-400 hover:text-slate-700"}`}
                            >
                                <FileText className="w-4 h-4" /> 강의 교안 다운로드
                            </button>
                        </div>

                        {/* Tab 1: Video Details */}
                        {activeTab === "video" && (
                            <div className="space-y-4 text-slate-700">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg border border-blue-100">
                                            {currentLecture.category}
                                        </span>
                                        <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                            📖 본문: {currentLecture.bibleVerse}
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
                                        {currentLecture.title}
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium mb-4">
                                        강사: <strong className="text-slate-800">{currentLecture.instructor}</strong> ({currentLecture.instructorRole})
                                    </p>
                                </div>

                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 leading-relaxed text-sm text-slate-700">
                                    <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider text-blue-900">
                                        💡 강의 핵심 요약 (Lecture Summary)
                                    </h4>
                                    <p>{currentLecture.summary}</p>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: A4 Reflection Form */}
                        {activeTab === "reflection" && (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
                                    <strong>📜 자격증 발급 필수 덕목:</strong> 본 아카데미는 시험 대신 배운 진리를 삶과 사역에 어떻게 적용할 것인지 작성하는 <strong>A4 1장 내외의 실천 소감문</strong>을 평가 기준으로 삼습니다.
                                </div>

                                <form onSubmit={handleReflectionSubmit} className="space-y-4">
                                    <textarea
                                        value={reflectionContent}
                                        onChange={(e) => setReflectionContent(e.target.value)}
                                        rows={6}
                                        placeholder="본 강좌를 통해 깨달은 성경적 진리와 사역 현장(또는 가정과 삶)에서의 구체적 실천 다짐을 기록해 주세요..."
                                        className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed"
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">
                                            {hasSubmittedReflection ? "✓ 제출 및 승인 완료됨" : "미제출 상태"}
                                        </span>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-all shadow-md flex items-center gap-1.5"
                                        >
                                            <Send className="w-3.5 h-3.5" /> 소감문 제출 및 즉시 승인
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab 3: Handouts */}
                        {activeTab === "handout" && (
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                        PDF
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{currentLecture.handout}</h4>
                                        <p className="text-xs text-slate-400">산해원교회 산하 바라크아카데미 정규 교재 • 2.4 MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert("교안 다운로드가 시작되었습니다.")}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
                                >
                                    <Download className="w-3.5 h-3.5" /> 교안 받기
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right 5 Columns: Playlist & Caleb AI Mentoring */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 3-3. Progress Summary Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">Course Progress</span>
                            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                {completedCount} / {totalCount} 강 완료
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm font-extrabold text-slate-900">
                                <span>전체 진도율</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2.5 bg-slate-100" />
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                            <div className="flex justify-between">
                                <span>5대 강의 출석:</span>
                                <strong className={isAllLecturesCompleted ? "text-emerald-600" : "text-slate-800"}>
                                    {isAllLecturesCompleted ? "✓ 전 강좌 수료" : `${completedCount}/5 강`}
                                </strong>
                            </div>
                            <div className="flex justify-between">
                                <span>A4 실천 소감문:</span>
                                <strong className={hasSubmittedReflection ? "text-emerald-600" : "text-amber-600"}>
                                    {hasSubmittedReflection ? "✓ 승인 완료" : "작성 필요"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* 3-4. Playlist: 5 Lectures List */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                            <span>📚 5대 핵심 강좌 목록</span>
                            <span className="text-xs text-slate-400 font-normal">클릭 시 바로 재생</span>
                        </h3>

                        <div className="space-y-2.5">
                            {DEMO_LECTURES.map((lec, idx) => {
                                const isCurrent = activeLectureIndex === idx;
                                const isDone = completedLectures.includes(lec.id);

                                return (
                                    <div
                                        key={lec.id}
                                        onClick={() => {
                                            setActiveLectureIndex(idx);
                                            setIsVideoEnded(false);
                                        }}
                                        className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-start gap-3 ${
                                            isCurrent
                                                ? "bg-blue-50/80 border-blue-900 shadow-sm"
                                                : "bg-slate-50/70 border-slate-100 hover:bg-slate-100"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                                            isDone
                                                ? "bg-emerald-500 text-white"
                                                : isCurrent
                                                ? "bg-blue-900 text-white"
                                                : "bg-white border border-slate-200 text-slate-600"
                                        }`}>
                                            {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <span className="text-[10px] font-bold text-blue-900 uppercase">
                                                    {lec.category}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {lec.duration}
                                                </span>
                                            </div>
                                            <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isCurrent ? "text-blue-950" : "text-slate-800"}`}>
                                                {lec.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {lec.instructor}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3-5. Caleb AI Live Mentoring Widget */}
                    <div className="bg-gradient-to-b from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col justify-between h-96">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                                        AI
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">갈렙 AI 실시간 튜터</h4>
                                        <p className="text-[10px] text-amber-300">24시간 신학 질의응답</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="space-y-3 overflow-y-auto max-h-48 pr-1 text-xs">
                                {aiMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-2xl leading-relaxed ${
                                            msg.sender === "caleb"
                                                ? "bg-white/10 text-slate-200 border border-white/5"
                                                : "bg-amber-400 text-slate-950 font-medium ml-4 text-right"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                                {isAiLoading && (
                                    <div className="p-2.5 bg-white/10 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> 갈렙 AI가 묵상 중입니다...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <div className="pt-3 border-t border-white/10">
                            {/* Quick Prompts */}
                            <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 text-[10px]">
                                <button
                                    onClick={() => handleAskAi("이 강의의 핵심 구속사적 의미를 3줄로 요약해줘")}
                                    className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 whitespace-nowrap"
                                >
                                    💡 핵심 요약
                                </button>
                                <button
                                    onClick={() => handleAskAi("이 강의에 나오는 본문 말씀을 사역에 어떻게 적용하나요?")}
                                    className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 whitespace-nowrap"
                                >
                                    📖 사역 적용법
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
                                    placeholder="성경/신학 질문을 입력하세요..."
                                    className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                />
                                <button
                                    onClick={() => handleAskAi()}
                                    className="px-3 py-2 bg-amber-400 text-slate-950 rounded-xl font-bold text-xs hover:bg-amber-300 transition-colors"
                                >
                                    전송
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. Full Graduation Modal (Triggered on Completion) */}
            <AnimatePresence>
                {showCertModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl max-w-lg w-full p-8 md:p-10 text-center shadow-2xl border border-amber-400"
                        >
                            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Award className="w-10 h-10 text-amber-600" />
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
                                <Sparkles className="w-3.5 h-3.5" /> 축하합니다! 전 과정 수료
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                공인 사역자 자격증서 발급 완료
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                                {user?.name} 님께서 5대 핵심 강좌와 A4 실천 소감문을 성실히 완수하였으므로 산해원교회 산하 바라크아카데미 정규 사역자 자격증서가 정식 발급되었습니다.
                            </p>

                            <div className="p-4 bg-slate-50 rounded-2xl mb-6 text-left text-xs space-y-1.5 border border-slate-200">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">공인 등록번호:</span>
                                    <span className="font-mono font-bold text-amber-600">{issuedCert?.licenseKey}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">발급 주체:</span>
                                    <span className="font-medium text-slate-800">바라크아카데미 (학장 이윤주 박사/목사)</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href="/certificate"
                                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-4 h-4" /> 자격증서 고해상도 PDF 출력
                                </Link>
                                <button
                                    onClick={() => setShowCertModal(false)}
                                    className="px-5 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50"
                                >
                                    닫기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
