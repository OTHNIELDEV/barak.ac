"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight, User, GraduationCap, Building2, BookOpen, Gift, Heart, Sparkles, AlertCircle, FileText, CheckCircle2, Flame, Droplet, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

function AdmissionApplyForm() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal & Baptism
        name: "",
        email: "",
        phone: "",
        waterBaptism: "yes", // yes, no (물세례/침례)
        holySpiritBaptism: "experienced", // experienced, seeking (불과 성령 세례)
        
        // Step 2: Ministry & Target
        applicantType: "pastor_wife", // pastor_wife, women_minister, retired_pastor, seeker
        church: "",
        position: "목사 사모",
        department: "",
        
        // Step 3: Track & Certificate Target & Scholarship
        track: "barak" as "deborah" | "barak" | "jael",
        certificateTarget: "pastor_cert", // pastor_cert (목사 자격증), missionary_cert (선교사 자격증), evangelist_cert (전도사 자격증)
        scholarshipType: "first_batch_30", // first_batch_30, pastor_wife_50, none
        motivation: "",
    });

    // Handle URL Params and User Data
    useEffect(() => {
        const trackParam = searchParams.get("track");
        if (trackParam && ["deborah", "barak", "jael"].includes(trackParam)) {
            setFormData(prev => ({ ...prev, track: trackParam as any }));
        }

        const appTypeParam = searchParams.get("applicantType");
        if (appTypeParam && ["pastor_wife", "women_minister", "retired_pastor", "seeker"].includes(appTypeParam)) {
            setFormData(prev => ({
                ...prev,
                applicantType: appTypeParam,
                scholarshipType: appTypeParam === "pastor_wife" ? "pastor_wife_50" : prev.scholarshipType,
                position: appTypeParam === "pastor_wife" ? "목사 사모" : appTypeParam === "retired_pastor" ? "은퇴/원로 목사" : prev.position
            }));
        }

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
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "applicantType" && value === "pastor_wife") {
                updated.scholarshipType = "pastor_wife_50";
                updated.position = "목사 사모";
            } else if (name === "applicantType" && value === "retired_pastor") {
                updated.position = "은퇴/원로 목사";
            } else if (name === "applicantType" && value === "women_minister") {
                updated.position = "여성 사역자";
            }
            return updated;
        });
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const applicationData = {
            userId: user?.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            church: formData.church,
            position: `${formData.position} (${formData.applicantType})`,
            department: formData.department,
            track: formData.track,
            motivation: `[장학희망: ${formData.scholarshipType === 'pastor_wife_50' ? '사모 50% 할인' : formData.scholarshipType === 'first_batch_30' ? '1기 등록 장학금 30%' : '일반'}] ${formData.motivation}`
        };

        try {
            await supabaseDb.applications.create(applicationData);
            db.applications.create(applicationData);
            setIsCompleted(true);
        } catch (error) {
            console.warn("Remote apply failed, using local:", error);
            db.applications.create(applicationData);
            setIsCompleted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return null;

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 md:p-10 text-center border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">입학 지원서가 접수되었습니다</h2>
                    <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                        바라크아카데미 지원이 성공적으로 완료되었습니다.<br />
                        등록금 납부 및 장학 승인 안내는 개별 연락처로 안내드립니다.
                    </p>

                    <div className="p-5 bg-slate-50 rounded-2xl mb-8 text-left space-y-2.5 border border-slate-200/80 text-xs md:text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">지원자</span>
                            <span className="font-bold text-slate-800">{formData.name} ({formData.phone})</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">지망 트랙</span>
                            <span className="font-bold text-blue-900">
                                {formData.track === 'barak' ? '바라크 트랙 (충성된 전문 부목사)' :
                                    formData.track === 'deborah' ? '드보라 트랙 (말씀과 영적 통찰 여목)' : '야엘 트랙 (결행하는 평신도 전도인)'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">적용 장학 혜택</span>
                            <span className="font-bold text-amber-600">
                                {formData.scholarshipType === 'pastor_wife_50' ? '사모 특별 장학 (50% 감면 / 50만원)' :
                                    formData.scholarshipType === 'first_batch_30' ? '1기 등록 장학금 (30% 지급 / 70만원)' : '일반 등록 (100만원)'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md text-sm"
                        >
                            내 강의실 입장하기
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-4 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                        >
                            홈으로
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* 1. Header & Hero */}
            <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase mb-6 border border-amber-400/30">
                        <Sparkles className="w-4 h-4" /> 2027학년도 1기 신입생 모집
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        입학 요건 및 학생 모집 요강
                    </h1>
                </div>
            </section>

            {/* 2. Detailed Admission & Certification Criteria Cards (첨부자료 1, 2 정밀 반영) */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16 space-y-8">
                {/* 2-1. 입학 요건 & 자격증서 수령 조건 (신학적 핵심) */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
                    <div className="flex items-center gap-2.5 text-blue-900 font-bold text-xs md:text-sm tracking-wider uppercase mb-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        Biblical Admission & Certification Requirements
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                        바라크아카데미 입학 요건 및 자격증서 수여 기준
                    </h2>

                    {/* 열린 입학 안내 & 자격증서 수령 조항 */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-700 space-y-3">
                        <div className="font-bold flex items-center gap-2 text-blue-900 text-base">
                            <CheckCircle2 className="w-5 h-5 text-amber-500" />
                            누구나 제약 없이 입학 및 수강 가능 (열린 신학교육)
                        </div>
                        <p className="leading-relaxed">
                            누구나 제약 없이 입학하여 전 과목을 수강하고 수료할 수 있습니다.
                        </p>
                        <p className="leading-relaxed pt-2 border-t border-slate-200">
                            단, <strong>지도자·사역자 자격증서</strong>의 정식 수령은 재학 중이거나 수료 후 성령의 권능을 받은 자에게 수여됩니다.
                        </p>
                    </div>
                </div>

                {/* 2-2. 3대 핵심 요약 카드 (모집 대상, 장학 혜택, 학사 운영) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 카드 1: 모집 대상 */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-4">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">모집 대상 (요강)</h3>
                            <ul className="space-y-2.5 text-xs md:text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>교회 목회 현장</strong>에서 필요로 하는 사역자 및 평신도</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>목사 사모</strong>로서 교회 사역에 동역하기를 희망하는 자</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>은퇴·원로 목회자</strong> 중 '바락'과 같은 부목자로 헌신할 분</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>성경 중심의 신학과 영성</strong>을 겸비하고자 하는 은사자</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 카드 2: 수강료 및 장학 혜택 */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-4">
                                <Gift className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">수강료 및 장학 혜택</h3>
                            <div className="space-y-3 text-xs md:text-sm text-amber-50">
                                <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-xl">
                                    <span>정규 등록금 (총 4학기)</span>
                                    <span className="font-bold text-white text-base">100만원</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 p-2.5 rounded-xl">
                                    <span className="font-semibold">💖 목사 사모 특별 장학</span>
                                    <span className="font-bold text-yellow-200 text-base">50% 할인 (50만원)</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 p-2.5 rounded-xl">
                                    <span className="font-semibold">🌟 1기 등록 장학금</span>
                                    <span className="font-bold text-white text-base">30% 혜택 (70만원)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 카드 3: 학사 및 자격증 기준 */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">학사 & 자격증 기준</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>총 4학기 (120강)</strong>: 학기당 30강 자율 수강</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>시험 없음 (No Exam)</strong>: 현장 적용 중심</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>각 강의당 A4 소감문</strong>: 배운 내용을 삶에 적용</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>졸업 기한 제한 없음</strong>: 자율 이수</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Application Form Section */}
            <section className="py-12 px-4 pb-28">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">Online Application</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-1 mb-2">
                            2027학년도 1기 입학 원서 접수
                        </h2>
                        <p className="text-sm md:text-base text-slate-600">
                            아래 양식을 작성해 주시면 담당자가 확인 후 등록 절차 및 장학 혜택을 안내해 드립니다.
                        </p>
                    </div>

                    {/* Steps Indicator */}
                    <div className="flex justify-between items-center mb-10 max-w-xl mx-auto relative cursor-default">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-blue-900 -z-10 transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />

                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex flex-col items-center gap-2 bg-slate-50 px-3">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                                    ${step >= num ? "bg-blue-900 border-blue-900 text-white shadow-md" : "bg-white border-slate-300 text-slate-400"}
                                `}>
                                    {num}
                                </div>
                                <span className={`text-xs font-semibold ${step >= num ? "text-blue-900" : "text-slate-400"}`}>
                                    {num === 1 ? "기본 정보" : num === 2 ? "지원 대상 및 소속" : "트랙 & 장학 선택"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-6 md:p-10">

                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <User className="w-5 h-5 text-blue-900" />
                                            지원자 기본 정보
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">성명 (본명) *</label>
                                                <input
                                                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                                    placeholder="홍길동"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">연락처 (휴대폰) *</label>
                                                <input
                                                    type="text" name="phone" required value={formData.phone} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                                    placeholder="010-1234-5678"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 주소 *</label>
                                            <input
                                                type="email" name="email" required value={formData.email} onChange={handleInputChange} readOnly={!!user?.email}
                                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-sm ${user?.email ? 'cursor-not-allowed opacity-80' : ''}`}
                                                placeholder="example@domain.com"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Ministry & Target Info */}
                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <Building2 className="w-5 h-5 text-blue-900" />
                                        지원 대상 구분 및 사역 정보
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">지원 대상 구분 (요강) *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {[
                                                { id: "pastor_wife", title: "목사 사모", desc: "사역 동역 (50% 할인)" },
                                                { id: "women_minister", title: "여성 사역자", desc: "현장 사역 / 전도인" },
                                                { id: "retired_pastor", title: "은퇴/원로 목회자", desc: "바락 부목 헌신 (65세 이상)" },
                                                { id: "seeker", title: "성경/신학 탐구자", desc: "부목사 / 평신도 리더" },
                                            ].map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        applicantType: item.id,
                                                        scholarshipType: item.id === "pastor_wife" ? "pastor_wife_50" : prev.scholarshipType,
                                                        position: item.id === "pastor_wife" ? "목사 사모" : item.id === "retired_pastor" ? "은퇴/원로 목사" : prev.position
                                                    }))}
                                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.applicantType === item.id ? 'border-blue-900 bg-blue-50/70 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                                                    <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">소속 교회 / 기관명 *</label>
                                            <input
                                                type="text" name="church" required value={formData.church} onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                                placeholder="예: 산해원교회"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">현재 직분 *</label>
                                            <input
                                                type="text" name="position" required value={formData.position} onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                                placeholder="예: 사모, 전도사, 부목사, 권사, 집사"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">담당 사역 / 부서 (선택)</label>
                                        <input
                                            type="text" name="department" value={formData.department} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm"
                                            placeholder="예: 여성사역부, 중보기도팀, 새가족부"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Track & Scholarship */}
                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <GraduationCap className="w-5 h-5 text-blue-900" />
                                        트랙 및 장학 혜택 선택
                                    </h3>

                                    {/* Scholarship Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">희망 장학 혜택 선택 *</label>
                                        <div className="space-y-2.5">
                                            {[
                                                { id: "first_batch_30", title: "1기 등록 장학금 (30% 혜택)", desc: "1기 신입생 전원 혜택 (수강료 70만원 적용)" },
                                                { id: "pastor_wife_50", title: "목사 사모 특별 장학 (50% 감면)", desc: "목회자 사모 대상 특별 장학 (수강료 50만원 적용)" },
                                                { id: "none", title: "일반 등록 (정규 100만원)", desc: "기관 또는 교회 후원 등록" },
                                            ].map((sch) => (
                                                <label
                                                    key={sch.id}
                                                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${formData.scholarshipType === sch.id ? 'border-amber-500 bg-amber-50/60' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="scholarshipType"
                                                        value={sch.id}
                                                        checked={formData.scholarshipType === sch.id}
                                                        onChange={handleInputChange}
                                                        className="mt-1 text-amber-500 focus:ring-amber-500"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{sch.title}</div>
                                                        <div className="text-xs text-slate-500">{sch.desc}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Track Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">희망 전공 사역 트랙 *</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[
                                                { id: 'barak', title: 'Barak (바라크)', subtitle: '충성된 전문 부목사', desc: '더 나은 존귀를 얻는 동역' },
                                                { id: 'deborah', title: 'Deborah (드보라)', subtitle: '말씀과 영적 통찰 여목', desc: '시대를 이끄는 영적 리더' },
                                                { id: 'jael', title: 'Jael (야엘)', subtitle: '결행하는 평신도 전도인', desc: '삶의 현장 속 결정적 승리' },
                                            ].map(track => (
                                                <div
                                                    key={track.id}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        track: track.id as any,
                                                        certificateTarget: track.id === 'barak' ? 'pastor_cert' : track.id === 'deborah' ? 'pastor_cert' : 'evangelist_cert'
                                                    }))}
                                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.track === track.id ? "border-blue-900 bg-blue-50/70 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                                                >
                                                    <div className="font-bold text-slate-900 text-sm mb-0.5">{track.title}</div>
                                                    <div className="text-xs font-semibold text-blue-800 mb-1">{track.subtitle}</div>
                                                    <div className="text-[11px] text-slate-500 leading-snug">{track.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certificate Target Selection (첨부자료 2, 3 반영) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">희망 취득 사역자 자격증 (3종 중 택1) *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                            {[
                                                { id: "pastor_cert", title: "목사 자격증", desc: "전문 부목사 / 담임목사" },
                                                { id: "missionary_cert", title: "선교사 자격증", desc: "국내외 선교 사역자" },
                                                { id: "evangelist_cert", title: "전도사 자격증", desc: "평신도 전도인" },
                                            ].map(cert => (
                                                <label
                                                    key={cert.id}
                                                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                                                        formData.certificateTarget === cert.id ? "border-blue-900 bg-blue-50 font-bold" : "border-slate-200 text-slate-600"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="certificateTarget"
                                                        value={cert.id}
                                                        checked={formData.certificateTarget === cert.id}
                                                        onChange={handleInputChange}
                                                        className="text-blue-900"
                                                    />
                                                    <div>
                                                        <div>{cert.title}</div>
                                                        <div className="text-[10px] text-slate-400 font-normal">{cert.desc}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Motivation */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">지원 동기 및 기대하는 바</label>
                                        <textarea
                                            name="motivation" required value={formData.motivation} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all h-24 resize-none text-sm"
                                            placeholder="바라크아카데미에 지원하게 된 계기와 사역 현장에서 기대하는 영적 권능과 변화를 자유롭게 적어주세요."
                                        />
                                    </div>

                                    {/* Legal Disclaimer in Form */}
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                                        ℹ️ <strong>학사 안내 및 공지:</strong> 본 과정은 교육부 인가 학위 과정이 아니며, 산해원교회 산하 신학교에서 2년제(4학기 120강 녹화 영상 강의) 과정 이수자에게 수여하는 교회 임직 및 사역자 공인 자격 과정입니다.
                                    </div>
                                </motion.div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
                                {step > 1 ? (
                                    <button
                                        type="button" onClick={handleBack}
                                        className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
                                    >
                                        이전 단계
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button" onClick={handleNext}
                                        className="px-8 py-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors flex items-center gap-2 text-sm shadow-md"
                                    >
                                        다음 단계 <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                                    >
                                        {isSubmitting ? '접수 처리 중...' : '입학 원서 최종 제출'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

export default function AdmissionApplyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">로딩 중...</div>}>
            <AdmissionApplyForm />
        </Suspense>
    );
}
