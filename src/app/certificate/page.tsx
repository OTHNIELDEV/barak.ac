"use client";

import { CertificateGenerator } from "@/components/certificate/CertificateGenerator";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/storage";
import { mockCourses } from "@/lib/mockData";

function CertificateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isEligible, setIsEligible] = useState(false);

    // Certificate Data
    const [certData, setCertData] = useState({
        userName: "",
        courseTitle: "",
        date: ""
    });

    useEffect(() => {
        if (!user) {
            // Check session via DB just in case auth context is slow, or redirect
            const timer = setTimeout(() => {
                if (!db.auth.getCurrentUser()) router.push("/login");
            }, 500);
            return () => clearTimeout(timer);
        }

        const courseIdParam = searchParams.get("courseId");
        if (!courseIdParam) {
            alert("잘못된 접근입니다.");
            router.push("/dashboard");
            return;
        }

        const courseId = parseInt(courseIdParam);
        const course = mockCourses.find(c => c.id === courseId);

        if (!course) {
            alert("존재하지 않는 과정입니다.");
            router.push("/dashboard");
            return;
        }

        // Verify Completion
        const progress = db.progress.get(user.id, courseId);
        // For prototype: Relaxed check (at least one lesson done)
        const isCompleted = progress && progress.completedLessons.length > 0;

        if (isCompleted) {
            setIsEligible(true);
            setCertData({
                userName: user.name,
                courseTitle: course.title,
                date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
            });
        } else {
            alert("수료 조건이 충족되지 않았습니다 (강의를 완료해주세요).");
            router.push(`/course/${courseId}`);
        }
        setIsLoading(false);

    }, [user, router, searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isEligible) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <CertificateGenerator
                userName={certData.userName}
                courseTitle={certData.courseTitle}
                completionDate={certData.date}
            />
            <button
                onClick={() => router.back()}
                className="mt-8 text-slate-500 hover:text-slate-900 underline"
            >
                돌아가기
            </button>
        </div>
    );
}

export default function CertificatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <CertificateContent />
        </Suspense>
    );
}
