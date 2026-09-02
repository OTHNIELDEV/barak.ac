"use client";

import { useState, useEffect, use, Suspense } from "react";
import { VideoPlayer } from "@/components/features/lms/VideoPlayer";
import { AmenButton } from "@/components/features/lms/AmenButton";
import { AIChatSidebar } from "@/components/features/ai/AIChatSidebar";
import { FileText, MessageSquare, Share2, Loader2, List, ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { mockCourses } from "@/lib/mockData";
import { useRouter, useSearchParams } from "next/navigation";

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

    const courseData = mockCourses.find(c => c.id === courseId);
    // Determine active module: from query param or first module
    const activeModule = courseData?.modules?.find(m => m.id === moduleId) || courseData?.modules?.[0];

    useEffect(() => {
        if (user && activeModule) {
            const progress = db.progress.get(user.id, courseId);
            if (progress && progress.completedLessons.includes(activeModule.id)) {
                setIsVideoCompleted(true);
                setIsLessonAlreadyCompleted(true);
            } else {
                setIsVideoCompleted(false);
                setIsLessonAlreadyCompleted(false);
            }

            // Log access for stats
            db.progress.logAccess(user.id, courseId);

            setIsLoading(false);
        }
    }, [user, courseId, activeModule]);

    const handleVideoComplete = () => {
        setIsVideoCompleted(true);
    };

    const handleAmen = () => {
        if (!user || !activeModule) return;

        db.progress.completeLesson(user.id, courseId, activeModule.id);
        setIsLessonAlreadyCompleted(true);
        alert("할렐루야! 학습이 완료되었습니다.");

        // Check for next module
        const currentIndex = courseData?.modules?.findIndex(m => m.id === activeModule.id) || 0;
        const nextModule = courseData?.modules?.[currentIndex + 1];

        if (nextModule) {
            if (confirm("다음 강의로 이동하시겠습니까?")) {
                router.push(`/course/${courseId}?module=${nextModule.id}`);
            } else {
                router.refresh(); // Refresh to update button state
            }
        } else {
            router.refresh();
        }
    };

    if (!courseData || !activeModule) return <div>Course not found</div>;
    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;

    const tabs = [
        { id: "materials", label: "강의 자료", icon: FileText },
        { id: "summary", label: "AI 요약", icon: MessageSquare },
        { id: "discussion", label: "토론", icon: Share2 },
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

                    <div className="flex items-center gap-4">
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
                            key={activeModule.id} // Re-mount on module change
                            videoUrl={activeModule.videoUrl}
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
                                강의 내용을 온전히 내 것으로 만드셨나요?<br />'아멘'으로 화답하며 다음 스텝으로 나아가세요.
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
                                                ? "text-blue-900"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[200px]">
                                {activeTab === "materials" && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 font-bold text-[10px]">PDF</div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">강의안_{activeModule.id}.pdf</p>
                                                    <p className="text-xs text-slate-500">2.4 MB</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">다운로드</button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "summary" && (
                                    <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900 mb-2">[AI 자동 요약]</p>
                                        <p>이 강의는 <strong>{activeModule.title}</strong>에 대한 심층적인 내용을 다룹니다. 주요 키워드와 적용점을 중심으로 학습하세요.</p>
                                    </div>
                                )}
                                {activeTab === "discussion" && (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm">토론 게시판이 준비 중입니다.</p>
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
