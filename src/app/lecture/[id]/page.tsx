"use client";

import { VideoPlayer } from "@/components/lecture/VideoPlayer";
import { AIChatSidebar } from "@/components/lecture/AIChatSidebar";
import { CompletionCard } from "@/components/lecture/CompletionCard";
import { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface LecturePageProps {
    params: Promise<{ id: string }>;
}

export default function LecturePage({ params }: LecturePageProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = use(params);

    const [isVideoCompleted, setIsVideoCompleted] = useState(false);
    const [isCourseCompleted, setIsCourseCompleted] = useState(false);

    const handleVideoEnd = () => {
        setIsVideoCompleted(true);
    };

    const handleCompletion = () => {
        setIsCourseCompleted(true);
        // TODO: Update database state
        alert("강의가 완료되었습니다! 다음 강의가 잠금 해제됩니다.");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb / Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> 돌아가기
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">성령의 기름부으심: 기초와 원리</h1>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <span className="font-medium text-secondary">드보라 트랙</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span>Module 3: Hearing the Voice</span>
                            </div>
                        </div>
                        {isCourseCompleted && (
                            <div className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm border border-green-200">
                                완료된 강의입니다
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Video & Completion) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Video Player */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <VideoPlayer
                                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                poster="https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png"
                                onEnded={handleVideoEnd}
                            />
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">강의 노트</h2>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    이 강의에서는 성령의 기름부으심이 어떻게 개인의 삶과 사역에 임하는지에 대한 성경적 기초를 다룹니다.
                                    특히 기름부으심의 전이와 보존에 대한 구약과 신약의 사례들을 비교 분석합니다.
                                </p>
                            </div>
                        </div>

                        {/* Completion Card */}
                        <CompletionCard
                            isCompleted={isVideoCompleted}
                            onConfirm={handleCompletion}
                        />
                    </div>

                    {/* Sidebar (AI Chat) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <AIChatSidebar />

                            {/* Additional Resources (Optional) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm">참고 자료</h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                        강의안 (PDF) 다운로드
                                    </li>
                                    <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                        추천 도서 목록
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
