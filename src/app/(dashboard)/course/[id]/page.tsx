"use client";

import { useState, useEffect, use, Suspense } from "react";
import { VideoPlayer } from "@/components/features/lms/VideoPlayer";
import { AmenButton } from "@/components/features/lms/AmenButton";
import { AIChatSidebar } from "@/components/features/ai/AIChatSidebar";
import { FileText, MessageSquare, Share2, Loader2, List, ChevronLeft, Home, Award, CheckCircle2, Sparkles, Send, Download, ArrowRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { useAuth } from "@/context/AuthContext";
import { mockCourses } from "@/lib/mockData";
import { useRouter, useSearchParams } from "next/navigation";
import { certificateEngine, ReflectionSubmission } from "@/lib/certificateEngine";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function CourseContent({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = use(params);
    const courseId = parseInt(id);
    const moduleId = searchParams.get("module");

    const [isVideoCompleted, setIsVideoCompleted] = useState(false);
    const [isLessonAlreadyCompleted, setIsLessonAlreadyCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState("materials");
    const [isLoading, setIsLoading] = useState(true);

    // Reflection State
    const [reflectionText, setReflectionText] = useState("");
    const [existingReflection, setExistingReflection] = useState<ReflectionSubmission | null>(null);
    const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

    // Auto-Issuance Celebration Modal State
    const [showGraduationModal, setShowGraduationModal] = useState(false);
    const [issuedCertKey, setIssuedCertKey] = useState<string>("");

    const courseData = mockCourses.find(c => c.id === courseId);
    const activeModule = courseData?.modules?.find(m => m.id === moduleId) || courseData?.modules?.[0];

    useEffect(() => {
        if (user && activeModule) {
            const loadData = async () => {
                // 1. Progress check from Supabase & Local
                let progress = null;
                try {
                    progress = await supabaseDb.progress.get(user.id, courseId);
                } catch (e) {
                    progress = db.progress.get(user.id, courseId);
                }
                if (!progress) progress = db.progress.get(user.id, courseId);

                if (progress && progress.completedLessons.includes(activeModule.id)) {
                    setIsVideoCompleted(true);
                    setIsLessonAlreadyCompleted(true);
                } else {
                    setIsVideoCompleted(false);
                    setIsLessonAlreadyCompleted(false);
                }

                // 2. Reflection check from Supabase
                const ref = await certificateEngine.reflections.getByUserAndCourse(user.id, courseId);
                if (ref) {
                    setExistingReflection(ref);
                    setReflectionText(ref.content);
                }

                // 3. Log access
                try {
                    await supabaseDb.progress.logAccess(user.id);
                } catch (e) {
                    db.progress.logAccess(user.id, courseId);
                }

                setIsLoading(false);
            };

            loadData();
        }
    }, [user, courseId, activeModule]);

    const handleVideoComplete = () => {
        setIsVideoCompleted(true);
    };

    // Amen Button Click: Complete Lesson & Trigger Auto-issuance evaluation
    const handleAmen = async () => {
        if (!user || !activeModule) return;

        try {
            await supabaseDb.progress.completeLesson(user.id, courseId, activeModule.id);
        } catch (e) {
            console.warn("Supabase progress complete error, using local:", e);
        }
        db.progress.completeLesson(user.id, courseId, activeModule.id);
        setIsLessonAlreadyCompleted(true);

        // Auto Evaluation Pipeline
        const result = await certificateEngine.evaluateAndAutoIssue(user.id, user.name, courseId);
        if (result.success && result.isNewlyIssued) {
            setIssuedCertKey(result.certificate?.licenseKey || "");
            setShowGraduationModal(true);
            return;
        }

        alert("할렐루야! 오늘의 학습이 완료되었습니다.");

        const currentIndex = courseData?.modules?.findIndex(m => m.id === activeModule.id) || 0;
        const nextModule = courseData?.modules?.[currentIndex + 1];

        if (nextModule) {
            if (confirm("다음 강의로 바로 이동하시겠습니까?")) {
                router.push(`/course/${courseId}?module=${nextModule.id}`);
            }
        }
    };

    // Submit A4 Reflection: Saves to Supabase & triggers auto certificate issuance
    const handleReflectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !courseData || !reflectionText.trim()) return;

        setIsSubmittingReflection(true);
        try {
            const saved = await certificateEngine.reflections.submit({
                userId: user.id,
                userName: user.name,
                courseId: courseId,
                courseTitle: courseData.title,
                content: reflectionText,
            });
            setExistingReflection(saved);

            // Trigger Full-Automated Certificate Issuance Check
            const result = await certificateEngine.evaluateAndAutoIssue(user.id, user.name, courseId);
            if (result.success && (result.isNewlyIssued || result.certificate)) {
                setIssuedCertKey(result.certificate?.licenseKey || "");
                setShowGraduationModal(true);
            } else {
                alert("A4 과목 소감문이 성공적으로 제출 및 승인되었습니다! 모든 강의를 완료하시면 자격증서가 자동 발급됩니다.");
            }
        } catch (error) {
            console.error("Reflection submission failed:", error);
            alert("소감문 제출 중 오류가 발생했습니다.");
        } finally {
            setIsSubmittingReflection(false);
        }
    };

    if (!courseData || !activeModule) return <div>Course not found</div>;
    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;

    const tabs = [
        { id: "materials", label: "강의 자료", icon: FileText },
        { id: "reflection", label: "A4 과목 소감문 (자격증 필수)", icon: Award },
        { id: "summary", label: "AI 요약 & 강의노트", icon: MessageSquare },
    ];

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-white">
            {/* Left: Main Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto flex flex-col relative">

                {/* Local Navigation Header */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-100 shrink-0 sticky top-0 z-20">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        나가기
                    </button>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/certificate"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-all shadow-sm"
                        >
                            <Award className="w-3.5 h-3.5 text-amber-600" /> 공식 자격증서 센터
                        </Link>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
                            title="대시보드로 이동"
                        >
                            <Home className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-0 sm:p-6 max-w-6xl mx-auto w-full space-y-8">

                    {/* Video Player Section */}
                    <div className="w-full bg-black sm:rounded-2xl overflow-hidden shadow-2xl relative z-10">
                        <VideoPlayer
                            key={activeModule.id}
                            videoUrl={activeModule.videoUrl || "https://www.youtube.com/watch?v=M7lc1UVf-VE"}
                            onComplete={handleVideoComplete}
                            title={activeModule.title}
                        />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="px-4 sm:px-2 space-y-8 pb-20">

                        {/* Title & Description */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wide border border-blue-100">
                                    {courseData.title}
                                </span>
                                {(activeModule as any).duration && (
                                    <span className="text-xs text-slate-400 font-medium">{(activeModule as any).duration}</span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {activeModule.title}
                            </h1>
                            <p className="text-slate-600 leading-relaxed max-w-3xl text-sm sm:text-base border-l-2 border-slate-200 pl-4">
                                {activeModule.description}
                            </p>
                        </div>

                        {/* Amen Action Card */}
                        <div className="flex flex-col items-center justify-center py-10 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <h3 className="text-base font-bold text-slate-800 mb-2">학습 완료 확인</h3>
                            <p className="text-slate-500 mb-8 text-center max-w-sm text-sm">
                                강의 내용을 온전히 내 것으로 만드셨나요?<br />'아멘'으로 화답하시면 수강 진도가 실시간 동기화됩니다.
                            </p>
                            <AmenButton
                                isCompleted={isVideoCompleted}
                                isAlreadyCompleted={isLessonAlreadyCompleted}
                                onAmen={handleAmen}
                            />
                        </div>

                        {/* Tabs & Content */}
                        <div>
                            <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2 pb-3 text-sm font-medium transition-all relative",
                                            activeTab === tab.id
                                                ? "text-blue-900 font-bold"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {tab.id === "reflection" && existingReflection && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        )}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[220px]">
                                {/* 1. Lecture Materials Tab */}
                                {activeTab === "materials" && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 font-bold text-[10px]">PDF</div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">공식 강의교안_{activeModule.id}.pdf</p>
                                                    <p className="text-xs text-slate-500">산해원교회 산하 바라크아카데미 정규 교재 • 2.4 MB</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">다운로드</button>
                                        </div>
                                    </div>
                                )}

                                {/* 2. A4 Reflection Submission Tab (Core for Certification) */}
                                {activeTab === "reflection" && (
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                                        <div className="border-b border-slate-100 pb-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-amber-500" />
                                                    과목별 A4 소감문 (자격증 발급 필수 요건)
                                                </h3>
                                                {existingReflection && (
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> 제출 및 승인 완료
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                바라크아카데미는 암기식 시험 대신 배운 진리를 삶과 사역에 적용하는 소감문 작성을 통해 자격증을 자동 발급합니다.
                                            </p>
                                        </div>

                                        <form onSubmit={handleReflectionSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                    소감문 내용 (성경적 깨달음과 사역 현장 적용 결단)
                                                </label>
                                                <textarea
                                                    value={reflectionText}
                                                    onChange={(e) => setReflectionText(e.target.value)}
                                                    required
                                                    rows={6}
                                                    placeholder="강의를 통해 깨달은 은혜와, 바락·드보라·야엘과 같이 현장에서 하나님 앞에 무릎 꿇는 삶(ברך)을 어떻게 실천할 것인지 자유롭게 작성해 주세요."
                                                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all leading-relaxed"
                                                />
                                            </div>

                                            {existingReflection?.aiFeedback && (
                                                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
                                                    <div className="font-bold flex items-center gap-1.5 text-blue-900">
                                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                                        바라크 아카데미 학술위원회 심사 총평 (AI 자동 승인)
                                                    </div>
                                                    <p className="leading-relaxed text-slate-700">
                                                        {existingReflection.aiFeedback}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReflection || !reflectionText.trim()}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition-all shadow-md disabled:opacity-50"
                                                >
                                                    {isSubmittingReflection ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            제출 및 검증 중...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            {existingReflection ? "소감문 수정 및 재제출" : "A4 소감문 최종 제출 (자격증 발급 신청)"}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* 3. AI Summary Tab */}
                                {activeTab === "summary" && (
                                    <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            [AI 스마트 강의 요약 및 적용 포인트]
                                        </p>
                                        <p>
                                            본 강의 <strong>{activeModule.title}</strong>는 성령의 기름부으심을 받은 사역자가 갖추어야 할 핵심 성경적 원리와 실전 목회 지침을 심층적으로 다룹니다.
                                        </p>
                                        <ul className="text-xs space-y-1 text-slate-600 mt-2">
                                            <li>• <strong>핵심 성경 본문:</strong> 사사기 4~5장, 요엘 2:28-29, 히브리서 11:32-35</li>
                                            <li>• <strong>적용 키워드:</strong> 무릎 꿇는 겸손(ברך), 더 좋은 부활, 충성된 부목자, 결행하는 전도인</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right: AI Sidebar */}
            <div className="hidden lg:block h-full border-l border-slate-200 shadow-xl z-20">
                <AIChatSidebar />
            </div>

            {/* 🎉 Graduation & Auto Certificate Issuance Celebration Modal */}
            <AnimatePresence>
                {showGraduationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white max-w-lg w-full rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
                            
                            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Award className="w-10 h-10" />
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 전 과정 수료 및 자격증 발급 완료
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                축하합니다! {user?.name} 님
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                모든 강의 수강과 A4 과목 소감문 작성이 완료되어, <strong>산해원교회 산하 바라크아카데미 공식 사역자 자격증서</strong>가 시스템에서 자동 발급되었습니다.
                            </p>

                            <div className="p-4 bg-slate-50 rounded-2xl mb-6 text-left text-xs space-y-1.5 border border-slate-200">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">발급 등록번호:</span>
                                    <span className="font-mono font-bold text-slate-900">{issuedCertKey || `BA-2026-BARAK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">이수 과정:</span>
                                    <span className="font-bold text-blue-900">{courseData.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">발급 기관:</span>
                                    <span className="font-medium text-slate-800">바라크아카데미 (학장 이윤주 박사/목사)</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/certificate"
                                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" /> 자격증서 PDF 즉시 발급
                                </Link>
                                <button
                                    onClick={() => setShowGraduationModal(false)}
                                    className="px-6 py-3.5 border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
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

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>}>
            <CourseContent params={params} />
        </Suspense>
    );
}
