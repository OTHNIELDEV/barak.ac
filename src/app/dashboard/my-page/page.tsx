"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/storage";
import { mockCourses } from "@/lib/mockData";
import { Loader2, User, Award, Save, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MyPage() {
    const { user, login } = useAuth(); // login used to refresh user session if implementation supports it, or we manual update
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: "",
        church: "",
        email: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [completedCourses, setCompletedCourses] = useState<number[]>([]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                church: user.church || "",
                email: user.email
            });

            // Check completion
            const allProgress = db.progress.getAll(user.id);
            const completedIds: number[] = [];

            mockCourses.forEach(course => {
                const p = allProgress.find(ap => ap.courseId === course.id);
                // For prototype, we assume if progress entry exists and has some completion logic...
                // But ideally we check if completedLessons.length == course.totalModules
                if (p) {
                    const isComplete = p.completedLessons.length >= course.totalModules;
                    if (isComplete) completedIds.push(course.id);
                }
            });
            setCompletedCourses(completedIds);
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (user) {
                const updatedUser = db.auth.updateUser(user.id, {
                    name: formData.name,
                    church: formData.church
                });
                // In a real app we'd update context, but for now we might need a reload or a context method to update user state
                // Assuming AuthContext automatically picks up changes if we force it, but purely local storage might strictly need a re-fetch
                alert("프로필이 업데이트 되었습니다.");
                window.location.reload();
            }
        } catch (error) {
            alert("업데이트 실패");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">마이 페이지</h1>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        activeTab === "profile"
                            ? "border-blue-900 text-blue-900"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    )}
                >
                    <User className="w-4 h-4" />
                    내 정보 수정
                </button>
                <button
                    onClick={() => setActiveTab("certificates")}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        activeTab === "certificates"
                            ? "border-blue-900 text-blue-900"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    )}
                >
                    <Award className="w-4 h-4" />
                    수료증 발급
                </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm min-h-[400px]">
                {activeTab === "profile" && (
                    <form onSubmit={handleUpdateProfile} className="max-w-lg space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">이메일 (아이디)</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                            />
                            <p className="text-xs text-slate-400">아이디는 변경할 수 없습니다.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">이름</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">교회 / 소속</label>
                            <input
                                type="text"
                                value={formData.church}
                                onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                                placeholder="섬기시는 교회를 입력해주세요"
                                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                변경사항 저장
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === "certificates" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            <p className="font-bold mb-1">💡 수료증 발급 안내</p>
                            모든 강의를 100% 수강 완료하신 후에 수료증을 발급받으실 수 있습니다.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockCourses.map(course => {
                                const isCompleted = completedCourses.includes(course.id);
                                return (
                                    <div key={course.id} className={cn(
                                        "p-6 rounded-xl border-2 transition-all",
                                        isCompleted ? "border-blue-100 bg-white" : "border-slate-100 bg-slate-50 opacity-70"
                                    )}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{course.title}</h3>
                                                <p className="text-sm text-slate-500">{course.totalModules}개의 강의</p>
                                            </div>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                                            )}
                                        </div>

                                        {isCompleted ? (
                                            <Link
                                                href={`/certificate?courseId=${course.id}`}
                                                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-900 text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                수료증 발급하기
                                            </Link>
                                        ) : (
                                            <button disabled className="w-full py-2 bg-slate-200 text-slate-400 rounded-lg font-bold text-sm cursor-not-allowed">
                                                수료 조건 미충족
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
