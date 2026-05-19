"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/features/lms/VideoPlayer";
import { AmenButton } from "@/components/features/lms/AmenButton";
import { AIChatSidebar } from "@/components/features/ai/AIChatSidebar";
import { db } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Menu, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
    const { id: courseIdStr, lessonId } = use(params);
    const courseId = parseInt(courseIdStr);
    const { user } = useAuth();
    const router = useRouter();

    const [isVideoCompleted, setIsVideoCompleted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [currentModule, setCurrentModule] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);

    useEffect(() => {
        const c = db.courses.get(courseId);
        if (c) {
            setCourse(c);
            const m = c.modules.find((mod: any) => mod.id === lessonId);
            setCurrentModule(m);
        }
    }, [courseId, lessonId]);

    // Check progress
    useEffect(() => {
        if (user && lessonId) {
            // Log access
            db.progress.logAccess(user.id, courseId);

            const progress = db.progress.get(user.id, courseId);
            if (progress && progress.completedLessons.includes(lessonId)) {
                setIsVideoCompleted(true);
            }
        }
    }, [user, courseId, lessonId]);

    const handleVideoComplete = () => {
        setIsVideoCompleted(true);
    };

    const handleAmen = () => {
        if (!user || !currentModule) return;

        // 1. Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#0f172a', '#ffffff'] // Gold, Navy, White
        });

        // 2. DB Update
        db.progress.completeLesson(user.id, courseId, currentModule.id);

        // 3. Navigate to Next
        const currentIdx = course?.modules.findIndex((m: any) => m.id === currentModule.id);
        const nextModule = course?.modules[currentIdx + 1];

        setTimeout(() => {
            if (nextModule) {
                router.push(`/course/${courseId}/lesson/${nextModule.id}`);
            } else {
                alert("모든 강의를 완료했습니다! 수고하셨습니다.");
                router.push("/dashboard");
            }
        }, 1500);
    };

    if (!currentModule || !course) return null;

    return (
        <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="flex-none h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium">돌아가기</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-sm font-bold text-slate-400">{course.title}</h1>
                        <p className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{currentModule.title}</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 lg:hidden" // Only show toggle on mobile/tablet, usually sidebar is fixed on right for "Immersive"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-8 lg:hidden" /> {/* Spacer */}
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
                    {/* Video Section */}
                    <div className="w-full">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <VideoPlayer
                                videoUrl={currentModule.videoUrl}
                                onComplete={handleVideoComplete}
                                title={currentModule.title}
                            />
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-yellow-50/50 opacity-50" />
                        <div className="relative z-10 text-center space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Lecture Complete</h3>
                                <p className="text-slate-500">강의 내용을 묵상하며 '아멘' 버튼을 눌러주세요.</p>
                            </div>

                            <AmenButton
                                isCompleted={isVideoCompleted}
                                isAlreadyCompleted={false} // Always create "fresh" amen feel or strictly check DB? 
                                // Let's simplify: allows clicking if video finished. 
                                onAmen={handleAmen}
                            />
                        </div>
                    </div>

                    {/* Lesson Details */}
                    <div className="prose prose-slate max-w-none">
                        <h3>강의 소개</h3>
                        <p>{currentModule.description}</p>
                        {/* Placeholder for future rich text content */}
                    </div>
                </main>
            </div>

            {/* Right Sidebar (Caleb AI) */}
            <div className={
                `fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `
            }>
                <AIChatSidebar />
            </div>
        </div>
    );
}
