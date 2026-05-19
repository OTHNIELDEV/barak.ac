"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight, User, GraduationCap, Building2, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/storage";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function AdmissionApplyPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal
        name: "",
        email: "",
        phone: "",
        // Step 2: Ministry
        church: "",
        position: "pastor", // pastor, theology_student, lay_leader
        department: "",
        // Step 3: Academic
        track: "deborah" as "deborah" | "barak" | "jael",
        motivation: "",
    });

    // Handle URL Params and User Data
    useEffect(() => {
        // Track selection from URL
        const trackParam = searchParams.get("track");
        if (trackParam && ["deborah", "barak", "jael"].includes(trackParam)) {
            setFormData(prev => ({ ...prev, track: trackParam as any }));
        }

        // Pre-fill user data
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                church: user.church || "",
            }));
        }
    }, [user, searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to Local Storage DB
        try {
            db.applications.create({
                userId: user?.id, // Optional, links application to user account
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                church: formData.church,
                position: formData.position,
                department: formData.department,
                track: formData.track,
                motivation: formData.motivation
            });
            setIsCompleted(true);
        } catch (error) {
            console.error("Application failed", error);
            alert("신청서 제출 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return null;

    // Render Completed State
    if (isCompleted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">입학 신청 완료</h2>
                    <p className="text-slate-500 mb-8">
                        성동적으로 접수되었습니다.<br />
                        심사 결과는 이메일로 개별 안내드립니다.
                    </p>
                    <div className="p-4 bg-slate-50 rounded-xl mb-8 text-left">
                        <div className="text-sm text-slate-500 mb-1">신청 트랙</div>
                        <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            {formData.track === 'deborah' ? 'Deborah Track (드보라)' :
                                formData.track === 'barak' ? 'Barak Track (바라크)' : 'Jael Track (야엘)'}
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                    >
                        대시보드로 이동
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="py-32 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">입학 신청서</h1>
                        <p className="text-lg text-slate-600">
                            BARAK Academy의 회원이 되신 것을 환영합니다.<br />
                            체계적인 영성 훈련을 위해 아래 정보를 입력해 주세요.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between items-center mb-10 max-w-xl mx-auto relative cursor-default">
                        {/* Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                        <div className={`absolute top-1/2 left-0 h-0.5 bg-blue-900 -z-10 transition-all duration-500 ease-out`}
                            style={{ width: `${((step - 1) / 2) * 100}%` }} />

                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                                <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                                ${step >= num ? "bg-blue-900 border-blue-900 text-white" : "bg-white border-slate-300 text-slate-400"}
                            `}>
                                    {num}
                                </div>
                                <span className={`text-xs font-medium ${step >= num ? "text-blue-900" : "text-slate-400"}`}>
                                    {num === 1 ? "기본 정보" : num === 2 ? "사역 정보" : "지원 동기"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-8 md:p-12">

                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <User className="w-5 h-5 text-indigo-500" />
                                            기본 정보
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">이름</label>
                                                <input
                                                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                                    placeholder="본명 입력"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">연락처</label>
                                                <input
                                                    type="text" name="phone" required value={formData.phone} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                                    placeholder="010-0000-0000"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">이메일</label>
                                            <input
                                                type="email" name="email" required value={formData.email} onChange={handleInputChange} readOnly={!!user?.email}
                                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none ${user?.email ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                            {user?.email && <p className="text-xs text-slate-400 mt-1">* 로그인된 계정 이메일입니다.</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Ministry Info */}
                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-indigo-500" />
                                        사역 및 소속
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">교회 / 기관명</label>
                                            <input
                                                type="text" name="church" required value={formData.church} onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                                placeholder="출석 또는 사역 중인 교회"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">직분</label>
                                                <select
                                                    name="position" value={formData.position} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all bg-white"
                                                >
                                                    <option value="pastor">목회자 (담임/부목사)</option>
                                                    <option value="theology_student">신학생</option>
                                                    <option value="missionary">선교사</option>
                                                    <option value="lay_leader">평신도 리더</option>
                                                    <option value="other">기타</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">소속 부서 (선택)</label>
                                                <input
                                                    type="text" name="department" value={formData.department} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                                    placeholder="예: 청년부, 예배팀"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Motivation & Track */}
                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                                        지원 내용
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-4">희망 트랙 선택</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'deborah', title: 'Deborah', subtitle: '말씀과 분별', desc: '시대를 읽는 통찰력' },
                                                { id: 'barak', title: 'Barak', subtitle: '실행과 전략', desc: '비전을 현실로' },
                                                { id: 'jael', title: 'Jael', subtitle: '위기 관리', desc: '결정적 승리의 지혜' },
                                            ].map(track => (
                                                <div
                                                    key={track.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, track: track.id as "deborah" | "barak" | "jael" }))}
                                                    className={`
                                                    cursor-pointer p-5 rounded-xl border-2 transition-all duration-200
                                                    ${formData.track === track.id
                                                            ? "border-blue-900 bg-blue-50 ring-1 ring-blue-900"
                                                            : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"}
                                                `}
                                                >
                                                    <div className="font-bold text-slate-900 mb-1">{track.title}</div>
                                                    <div className="text-xs font-semibold text-indigo-600 mb-2">{track.subtitle}</div>
                                                    <div className="text-xs text-slate-500 leading-snug">{track.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">지원 동기</label>
                                        <textarea
                                            name="motivation" required value={formData.motivation} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all h-32 resize-none"
                                            placeholder="이 과정에 지원하게 된 계기와 기대하는 점을 자유롭게 적어주세요."
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
                                {step > 1 ? (
                                    <button
                                        type="button" onClick={handleBack}
                                        className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        이전 단계
                                    </button>
                                ) : (
                                    <div /> /* Spacer */
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button" onClick={handleNext}
                                        className="px-8 py-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
                                    >
                                        다음 <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? '처리 중...' : '신청서 제출'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
}
