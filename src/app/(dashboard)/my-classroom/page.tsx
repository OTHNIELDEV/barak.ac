"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    BookOpen, PlayCircle, CheckCircle2, ArrowRight, Award, FileText,
    Sparkles, Download, Shield, Play, Clock, User, Check, Send, Loader2,
    MessageSquare, HelpCircle, ChevronRight, FastForward, RotateCcw, AlertCircle,
    Lock, Unlock, GraduationCap, ShieldAlert
} from "lucide-react";
import { mockCourses } from "@/lib/mockData";
import { db, CertificateIssued, Application } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { certificateEngine, ReflectionSubmission } from "@/lib/certificateEngine";
import { motion, AnimatePresence } from "framer-motion";

// 바라크아카데미 1학기 핵심 강의 및 특강 데이터 (바라크아카데미 공식 영상)
const DEMO_LECTURES = [
    {
        id: "demo-1",
        lectureNo: 1,
        title: "제1강: 이갈렙 목사의 성경해석학 — 사사기 바락의 영성과 구속사",
        instructor: "이윤주 학장 (산해원교회 담임목사)",
        instructorRole: "바라크아카데미 학장 / 구약학 박사(Ph.D)",
        duration: "25:00",
        youtubeId: "T-kY9XBB8io",
        thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1000&auto=format&fit=crop",
        category: "성경해석학 & 구속사",
        bibleVerse: "삿 4:6~14 / 히 11:32~35",
        summary: "사사기 4~5장에 나타난 바락(Barak)의 히브리어 원어적 의미(무릎 꿇다·축복하다)와 구속사적 성경 해석의 핵심 원리를 배웁니다.",
        handout: "제1강_이갈렙목사의_성경해석학_강의노트.pdf"
    },
    {
        id: "demo-2",
        lectureNo: 2,
        title: "제2강: 구약의 언약과 '바라크(ברך)' 영성의 실제",
        instructor: "이윤주 학장 (산해원교회 담임목사)",
        instructorRole: "바라크아카데미 학장 / 구약학 박사(Ph.D)",
        duration: "22:00",
        youtubeId: "bftZuUKSfM8",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop",
        category: "구약 신학 & 언약",
        bibleVerse: "창 12:1~3 / 시 103:1~5",
        summary: "구약 성경 전체를 관통하는 하나님의 언약과 무릎 꿇는 예배자에게 임하는 성경적 복(Barak)의 의미를 심층 강해합니다.",
        handout: "제2강_구약의_언약과_바라크_영성_강의노트.pdf"
    },
    {
        id: "demo-3",
        lectureNo: 3,
        title: "제3강: 복음서 강해와 예수 그리스도의 사역 원리",
        instructor: "이갈렙 목사 (바라크아카데미 설립자)",
        instructorRole: "산해원교회 설립목사 / 성경강해",
        duration: "24:00",
        youtubeId: "OP79-8l715c",
        thumbnail: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
        category: "신약 신학 & 복음서",
        bibleVerse: "요 5:39 / 롬 1:16~17",
        summary: "복음서에 나타난 예수 그리스도의 말씀 사역과 십자가 복음의 능력을 목회 및 사역 현장에 적용하는 원리를 다룹니다.",
        handout: "제3강_복음서_강해와_사역원리_강의노트.pdf"
    },
    {
        id: "demo-4",
        lectureNo: 4,
        title: "제4강: 영혼 돌봄과 성경적 목회상담의 실제",
        instructor: "이윤주 학장 (산해원교회 담임목사)",
        instructorRole: "바라크아카데미 학장 / 실천목회",
        duration: "20:00",
        youtubeId: "ZbAzIGAuywg",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
        category: "목회상담 & 영혼돌봄",
        bibleVerse: "살전 5:14 / 갈 6:1~2",
        summary: "교회 공동체와 가정 안에서 상처 입은 영혼을 말씀과 기도로 돌보며 회복시키는 성경적 상담 사역을 학습합니다.",
        handout: "제4강_영혼돌봄과_목회상담_강의노트.pdf"
    },
    {
        id: "demo-5",
        lectureNo: 5,
        title: "제5강: 기도의 영성과 시대적 사역자의 길",
        instructor: "이갈렙 목사 (바라크아카데미 설립자)",
        instructorRole: "산해원교회 설립목사 / 영성신학",
        duration: "22:00",
        youtubeId: "tvWiKoF_MI8",
        thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop",
        category: "실천 신학 & 영성",
        bibleVerse: "행 1:8 / 요 7:38~39 / 엡 6:18",
        summary: "말씀과 기도의 자리에서 성령의 인도하심을 따라 교회와 다음 세대를 섬기는 사역자의 영적 자세를 정립합니다.",
        handout: "제5강_기도의_영성과_사역자의_길_강의노트.pdf"
    }
];

export default function MyClassroomPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeLectureIndex, setActiveLectureIndex] = useState(0);
    const [completedLectures, setCompletedLectures] = useState<string[]>([]);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [reflectionContent, setReflectionContent] = useState("");
    const [hasSubmittedReflection, setHasSubmittedReflection] = useState(false);
    const [issuedCert, setIssuedCert] = useState<CertificateIssued | null>(null);
    const [showCertModal, setShowCertModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"video" | "handout" | "reflection" | "ai">("video");

    // Admission & Permission state
    const [admissionStatus, setAdmissionStatus] = useState<"approved" | "pending" | "unapplied">("unapplied");
    const [userApplication, setUserApplication] = useState<Application | null>(null);

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

    // Option 1 Freemium Gate: Lecture 1 is free for everyone, 2~5 require approved enrollment
    const isLectureLocked = (idx: number) => {
        if (idx === 0) return false; // 제1강: 누구나 무료 맛보기 개방!
        if (user?.role === "admin" || user?.role === "pastor") return false;
        if (user?.email?.trim().toLowerCase() === "axasoft@naver.com") return false;
        if (user?.level && user?.level.includes("정규")) return false;
        return admissionStatus !== "approved"; // 제2강~: 수강 승인자만 개방!
    };
    const isCurrentLectureLocked = isLectureLocked(activeLectureIndex);

    // Initial Load: Check saved progress, certificates & admission status
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

        // 4. Check Admission Status (Remote-First Sync with Local Cache)
        const checkAdmission = async () => {
            const userEmail = user.email?.trim().toLowerCase();

            // Admins & Pastors always have full access
            if (user.role === "admin" || user.role === "pastor") {
                setAdmissionStatus("approved");
                return;
            }

            // 1. Initial Local DB check (optimistic UI render)
            let app = db.applications.getByUserId(user.id) || (userEmail ? db.applications.getByEmail(userEmail) : null);
            if (app) {
                setUserApplication(app);
                if (app.status === "approved") {
                    setAdmissionStatus("approved");
                } else {
                    setAdmissionStatus("pending");
                }
            }

            // 2. Always fetch latest remote status from Supabase to prevent stale cache
            try {
                const remoteApps = await supabaseDb.applications.getAll();
                const matched = remoteApps.find(a =>
                    (a.userId && a.userId === user.id) ||
                    (a.email && a.email.trim().toLowerCase() === userEmail)
                );
                if (matched) {
                    app = matched;
                    setUserApplication(matched);
                    if (matched.status === "approved") {
                        setAdmissionStatus("approved");
                    } else if (matched.status === "rejected") {
                        setAdmissionStatus("unapplied");
                    } else {
                        setAdmissionStatus("pending");
                    }

                    // Sync remote status back to local storage
                    db.admin.applications.update(matched.id, matched);
                    if (matched.status === "approved" || matched.status === "rejected") {
                        db.admin.applications.updateStatus(matched.id, matched.status);
                    }
                    return;
                }
            } catch (e) {
                console.warn("[MyClassroom] Error checking remote admission:", e);
            }

            // 3. Fallback for axasoft@naver.com or confirmed students
            if (userEmail === "axasoft@naver.com" || (user.level && user.level.includes("정규"))) {
                setAdmissionStatus("approved");
                if (app) {
                    const approvedApp: Application = { ...app, status: "approved" };
                    setUserApplication(approvedApp);
                    db.admin.applications.update(app.id, approvedApp);
                    db.admin.applications.updateStatus(app.id, "approved");
                }
                return;
            }

            if (!app) {
                setAdmissionStatus("unapplied");
            }
        };

        checkAdmission();
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
            if (confirm("할렐루야! 이번 강의를 수강 완료하셨습니다. 다음 강의로 이동하시겠습니까?")) {
                setActiveLectureIndex(prev => prev + 1);
                setIsVideoEnded(false);
            }
        }
    };

    // Fast Test Pass
    const handleFastPass = () => {
        if (isCurrentLectureLocked) {
            alert("🔒 본 강좌는 수강 승인자 전용 강좌입니다. 수강 신청서를 먼저 작성해 주세요.");
            return;
        }
        setIsVideoEnded(true);
    };

    // Submit Reflection
    const handleReflectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !reflectionContent.trim()) return;

        if (admissionStatus !== "approved") {
            const goToApply = confirm("🔒 과목별 A4 소감문 제출 및 과정 수료증 발급은 [정규 수강 승인자] 전용 과정입니다.\n\n수강 신청 페이지로 이동하시겠습니까?");
            if (goToApply) {
                router.push("/apply");
            }
            return;
        }

        localStorage.setItem(`barak_demo_reflection_${user.id}`, reflectionContent);
        setHasSubmittedReflection(true);
        alert("과목별 A4 소감문이 성공적으로 제출되었습니다!");

        if (completedLectures.length === totalCount) {
            await autoIssueCertificate();
        }
    };

    // Auto Issue Certificate (Restricted to approved students)
    const autoIssueCertificate = async () => {
        if (!user) return;
        if (admissionStatus !== "approved") {
            console.warn("[MyClassroom] Certificate issue blocked: User is not an approved student.");
            return;
        }

        const rolePrefix = "BARAK";
        const randomKey = Math.random().toString(36).substring(2, 6).toUpperCase();
        const licenseKey = `BA-2026-${rolePrefix}-${randomKey}`;

        const newCert = db.admin.certificates.issue({
            studentId: user.id,
            studentName: user.name,
            trackId: 1,
            trackTitle: "바락 부목사 과정 (2년 4학기 120강)",
            licenseKey
        });

        try {
            await supabaseDb.admin.certificates.issue({
                studentId: user.id,
                studentName: user.name,
                trackId: 1,
                trackTitle: "바락 부목사 과정 (2년 4학기 120강)",
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
                        { role: "system", content: `당신은 바라크아카데미 학습 보조 튜터 '갈렙 AI'입니다. 현재 수강생은 [${currentLecture.title} - 강사: ${currentLecture.instructor}]를 수강 중입니다. 성경적이며 은혜롭고 신학적으로 깊이 있게 3~4문장으로 답변해 주세요.` },
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
                        <Sparkles className="w-3.5 h-3.5" /> 2026 Barak Academy • Online Classroom
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-amber-400" />
                        바라크아카데미 온라인 강의실
                    </h1>
                    <p className="text-slate-300 mt-1 text-xs md:text-sm font-light">
                        온라인 강의를 시청하고, <strong>'아멘' 출석 체크</strong>와 <strong>과목별 A4 소감문</strong>을 제출하여 <strong>과정 수료증</strong>을 발급받으세요.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                        href="/certificate"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
                    >
                        <Award className="w-4 h-4 text-slate-950" /> 과정 수료증 발급센터
                    </Link>
                </div>
            </div>

            {/* 1-1. Admission Status Banner (Freemium Gate Indicator) */}
            {admissionStatus === "unapplied" && (
                <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-amber-400/40 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    무료 맛보기 청강 모드
                                </span>
                                <h3 className="font-bold text-sm sm:text-base text-amber-200">
                                    제1강 무료 맛보기가 열려 있습니다!
                                </h3>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">
                                제2강~5강 본 과정 수강 및 과정 수료증 발급을 원하시면 간편하게 <strong>수강 신청서</strong>를 접수해 주세요.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/apply"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                    >
                        <GraduationCap className="w-4 h-4" /> 수강 신청서 접수하기
                    </Link>
                </div>
            )}

            {admissionStatus === "pending" && (
                <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/50 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 animate-spin" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                                    수강 승인 확인 중
                                </span>
                                <h3 className="font-bold text-sm sm:text-base text-white">
                                    제출하신 수강 신청서를 운영팀에서 확인 중입니다
                                </h3>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">
                                확인 중에도 제1강은 자유롭게 수강하실 수 있으며, 승인 완료 시 전체 강의가 즉시 자동 개방됩니다.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                    >
                        진행 현황 확인하기 <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {admissionStatus === "approved" && user?.role === "student" && (
                <div className="mb-6 p-3.5 sm:p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-200 shadow-md flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="text-xs">
                        <strong className="text-emerald-300">정규 수강생 승인 완료:</strong> 전체 핵심 강좌 열람, 과목별 소감문 제출 및 과정 수료증 발급 권한이 정상 활성화되었습니다.
                    </div>
                </div>
            )}

            {/* 2. Certificate Issued Notification Banner (If Ready) */}
            {issuedCert && (
                <div className="mb-6 p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-2xl text-slate-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Award className="w-7 h-7 text-slate-950" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base md:text-lg">
                                🎉 {user?.name} 님의 바라크아카데미 과정 수료증이 발급되었습니다!
                            </h3>
                            <p className="text-xs font-semibold text-slate-900/80">
                                수료번호 : <span className="font-mono underline font-bold">{issuedCert.licenseKey}</span> (산해원교회 바라크아카데미 학장 이윤주)
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/certificate"
                        className="px-5 py-2.5 bg-slate-950 text-amber-300 rounded-xl font-bold text-xs hover:bg-slate-900 transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
                    >
                        <Download className="w-4 h-4" /> 수료증 고해상도 PDF 출력
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
                                <span className={`w-2.5 h-2.5 rounded-full ${isCurrentLectureLocked ? "bg-amber-500" : "bg-red-500 animate-pulse"}`} />
                                <span className="font-bold text-amber-300">{currentLecture.category}</span>
                                <span className="text-slate-500">•</span>
                                <span className="font-medium text-slate-300">{currentLecture.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isCurrentLectureLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                        <Lock className="w-3 h-3" /> 정규 수강생 전용
                                    </span>
                                ) : activeLectureIndex === 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                        <Sparkles className="w-3 h-3" /> 무료 맛보기 개방
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                        <Unlock className="w-3 h-3" /> 정규 과정 수강 중
                                    </span>
                                )}
                                <span className="text-slate-400 font-mono text-[11px]">
                                    Lecture {activeLectureIndex + 1} / {totalCount}
                                </span>
                            </div>
                        </div>

                        {/* YouTube Embed Frame or Locked Overlay */}
                        <div className="relative aspect-video w-full bg-black">
                            {isCurrentLectureLocked ? (
                                /* Locked Screen for Lectures 2~5 */
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-6 text-center text-white z-10">
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center shadow-2xl backdrop-blur-md">
                                            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-amber-400/40 flex items-center justify-center text-[11px] font-black text-amber-300">
                                            {activeLectureIndex + 1}
                                        </div>
                                    </div>

                                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider mb-2">
                                        Regular Academy Course Locked
                                    </span>

                                    <h3 className="text-lg sm:text-2xl font-black text-white max-w-lg mb-2">
                                        {currentLecture.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                                        {admissionStatus === "pending" ? (
                                            <>
                                                제출하신 수강 신청서를 <strong className="text-amber-300">현재 확인 중</strong>입니다.
                                                <br />
                                                운영팀 승인 완료 시 본 강좌가 즉시 자동 잠금 해제됩니다.
                                            </>
                                        ) : (
                                            <>
                                                본 강좌는 <strong className="text-amber-300">바라크아카데미 정규 수강생</strong> 전용 과정입니다.
                                                <br />
                                                수강 신청서를 접수하시면 전체 강좌 수강 및 과정 수료증 발급이 가능합니다.
                                            </>
                                        )}
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md justify-center">
                                        {admissionStatus === "pending" ? (
                                            <button
                                                onClick={() => router.push("/dashboard")}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center justify-center gap-1.5"
                                            >
                                                승인 진행현황 확인하기 <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.push("/apply")}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center justify-center gap-1.5 animate-pulse"
                                            >
                                                <GraduationCap className="w-4 h-4" /> 수강 신청서 접수하기 (1기 후원금 감면)
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setActiveLectureIndex(0);
                                                setIsVideoEnded(false);
                                            }}
                                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Play className="w-3.5 h-3.5 text-amber-400" /> 제1강 무료 맛보기 시청하기
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Active YouTube Player */
                                <>
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
                                </>
                            )}
                        </div>

                        {/* Video Bottom Amen Bar */}
                        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                            <div className="text-left w-full sm:w-auto">
                                <h4 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                                    {isCurrentLectureLocked ? (
                                        <span className="text-amber-400/80 flex items-center gap-1.5 text-xs sm:text-sm">
                                            <Lock className="w-4 h-4" /> 정규 수강 승인 후 본 강좌의 출석 및 진도 저장이 가능합니다.
                                        </span>
                                    ) : isCurrentLectureDone ? (
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

                            {isCurrentLectureLocked ? (
                                <button
                                    onClick={() => router.push(admissionStatus === "pending" ? "/dashboard" : "/apply")}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-slate-750 transition-all flex items-center justify-center gap-2 shadow-md"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>{admissionStatus === "pending" ? "수강 승인 대기 중" : "수강 신청서 작성 필요"}</span>
                                </button>
                            ) : (
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
                            )}
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
                                <Award className="w-4 h-4" /> A4 과목 소감문 (수료 필수)
                                {hasSubmittedReflection && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("handout")}
                                className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === "handout" ? "text-blue-900 border-b-2 border-blue-900 font-extrabold" : "text-slate-400 hover:text-slate-700"}`}
                            >
                                <FileText className="w-4 h-4" /> 강의 요약 노트
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
                                {admissionStatus !== "approved" ? (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                                        <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-amber-950 space-y-1">
                                            <p className="font-bold text-amber-900 text-sm">
                                                🔒 정규 수강 승인자 전용 필수 과제입니다
                                            </p>
                                            <p className="text-amber-800 leading-relaxed">
                                                A4 실천 소감문 제출 및 과정 수료증 발급은 수강 신청이 승인된 정규 수강생에게만 제공됩니다. (제1강 무료 맛보기 청강생은 과제 제출 및 수료증 발급 대상에서 제외됩니다.)
                                            </p>
                                            {admissionStatus === "unapplied" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => router.push("/apply")}
                                                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all"
                                                >
                                                    <GraduationCap className="w-3.5 h-3.5" /> 수강 신청서 접수하러 가기
                                                </button>
                                            ) : (
                                                <p className="font-bold text-amber-700 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 animate-spin" /> 현재 운영팀에서 수강 신청을 확인 중입니다. 승인 완료 후 즉시 제출 가능합니다.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
                                        <strong>📜 과정 수료 기준 안내:</strong> 본 아카데미는 필기시험 대신 배운 진리를 삶과 사역에 어떻게 적용할 것인지 작성하는 <strong>과목별 A4 1장 내외의 소감문 제출</strong>을 이수 요건으로 합니다.
                                    </div>
                                )}

                                <form onSubmit={handleReflectionSubmit} className="space-y-4">
                                    <textarea
                                        value={reflectionContent}
                                        onChange={(e) => setReflectionContent(e.target.value)}
                                        disabled={admissionStatus !== "approved"}
                                        rows={6}
                                        placeholder={
                                            admissionStatus === "approved"
                                                ? "본 강좌를 통해 깨달은 성경적 진리와 사역 현장(또는 가정과 삶)에서의 구체적 실천 다짐을 기록해 주세요..."
                                                : "정규 수강생 승인 완료 후 실천 소감문을 작성 및 제출하실 수 있습니다."
                                        }
                                        className={`w-full p-4 rounded-2xl border text-sm leading-relaxed ${
                                            admissionStatus === "approved"
                                                ? "border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                                : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                        }`}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">
                                            {hasSubmittedReflection ? "✓ 소감문 제출 완료됨" : admissionStatus === "approved" ? "미제출 상태" : "승인 대기 상태"}
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={admissionStatus !== "approved"}
                                            className={`px-6 py-3 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 ${
                                                admissionStatus === "approved"
                                                    ? "bg-blue-900 text-white hover:bg-blue-800"
                                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <Send className="w-3.5 h-3.5" /> 소감문 제출하기
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
                                        <p className="text-xs text-slate-400">1학기 강의 요약 노트 및 소감문 작성 가이드</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert("강의 요약 노트 다운로드 안내가 준비되었습니다.")}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
                                >
                                    <Download className="w-3.5 h-3.5" /> 요약 노트 받기
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
                                <span>핵심 강의 출석:</span>
                                <strong className={isAllLecturesCompleted ? "text-emerald-600" : "text-slate-800"}>
                                    {isAllLecturesCompleted ? "✓ 전 강좌 수료" : `${completedCount}/5 강`}
                                </strong>
                            </div>
                            <div className="flex justify-between">
                                <span>과목별 A4 소감문:</span>
                                <strong className={hasSubmittedReflection ? "text-emerald-600" : "text-amber-600"}>
                                    {hasSubmittedReflection ? "✓ 제출 완료" : "작성 필요"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* 3-4. Playlist: 5 Lectures List */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                            <span>📚 바라크아카데미 핵심 강좌 목록</span>
                            <span className="text-xs text-slate-400 font-normal">선택 시 즉시 이동</span>
                        </h3>

                        <div className="space-y-2.5">
                            {DEMO_LECTURES.map((lec, idx) => {
                                const isCurrent = activeLectureIndex === idx;
                                const isDone = completedLectures.includes(lec.id);
                                const isLocked = isLectureLocked(idx);

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
                                                : isLocked
                                                ? "bg-slate-50/50 border-slate-100 hover:bg-amber-50/40"
                                                : "bg-slate-50/70 border-slate-100 hover:bg-slate-100"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                                            isDone
                                                ? "bg-emerald-500 text-white"
                                                : isLocked
                                                ? "bg-amber-100 border border-amber-300 text-amber-700"
                                                : isCurrent
                                                ? "bg-blue-900 text-white"
                                                : "bg-white border border-slate-200 text-slate-600"
                                        }`}>
                                            {isDone ? (
                                                <Check className="w-4 h-4" />
                                            ) : isLocked ? (
                                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-blue-900 uppercase">
                                                        {lec.category}
                                                    </span>
                                                    {idx === 0 ? (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            무료 맛보기
                                                        </span>
                                                    ) : isLocked ? (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                                                            <Lock className="w-2.5 h-2.5" /> 잠김
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                                                            본 과정
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {lec.duration}
                                                </span>
                                            </div>
                                            <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isCurrent ? "text-blue-950 font-extrabold" : "text-slate-800"}`}>
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
                                        <h4 className="font-bold text-sm text-white">갈렙 AI 학습 보조 튜터</h4>
                                        <p className="text-[10px] text-amber-300">성경·신학 질의응답 도우미</p>
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
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> 갈렙 AI가 답변을 작성 중입니다...
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
                                과정 수료증 발급 완료
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                                {user?.name} 님께서 핵심 강좌와 과목별 A4 소감문을 성실히 이수하였으므로 산해원교회 산하 바라크아카데미 과정 수료증이 발급되었습니다.
                            </p>

                            <div className="p-4 bg-slate-50 rounded-2xl mb-6 text-left text-xs space-y-1.5 border border-slate-200">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">수료번호:</span>
                                    <span className="font-mono font-bold text-amber-600">{issuedCert?.licenseKey}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">발급 주체:</span>
                                    <span className="font-medium text-slate-800">산해원교회 바라크아카데미 학장 이윤주</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href="/certificate"
                                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-4 h-4" /> 수료증 고해상도 PDF 출력
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
