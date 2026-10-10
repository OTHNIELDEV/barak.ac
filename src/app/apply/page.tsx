"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight, User, GraduationCap, Building2, BookOpen, Gift, Heart, Sparkles, AlertCircle, FileText, CheckCircle2, Flame, Droplet, Clock, Lock, KeyRound } from "lucide-react";
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
    const [stepError, setStepError] = useState("");
    const [submitError, setSubmitError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal & Account
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
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

        const scholarshipParam = searchParams.get("scholarship");
        if (scholarshipParam && ["first_batch_30", "pastor_wife_50", "none"].includes(scholarshipParam)) {
            setFormData(prev => ({ ...prev, scholarshipType: scholarshipParam }));
        }

        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                church: user.church || prev.church,
            }));
        }
    }, [user, searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStepError("");
        setSubmitError("");
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

    const handleNext = () => {
        setStepError("");
        if (step === 1) {
            if (!formData.name.trim()) {
                setStepError("지원자 성명(본명)을 입력해 주세요.");
                return;
            }
            if (!formData.phone.trim()) {
                setStepError("연락처(휴대폰 번호)를 입력해 주세요.");
                return;
            }
            if (!formData.email.trim()) {
                setStepError("이메일 주소를 입력해 주세요.");
                return;
            }
            // Check password if not logged in
            if (!user) {
                if (!formData.password || formData.password.length < 4) {
                    setStepError("학사 계정 접속을 위해 비밀번호(최소 4자 이상)를 입력해 주세요.");
                    return;
                }
                if (formData.password !== formData.passwordConfirm) {
                    setStepError("비밀번호 확인이 일치하지 않습니다. 다시 확인해 주세요.");
                    return;
                }
            }
        } else if (step === 2) {
            if (!formData.church.trim()) {
                setStepError("소속 교회 또는 기관명을 입력해 주세요.");
                return;
            }
            if (!formData.position.trim()) {
                setStepError("현재 직분을 입력해 주세요.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStepError("");
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            let activeUserId = user?.id;

            // 1. If not logged in, auto-create user account & log in
            if (!user) {
                if (formData.password.length < 4) {
                    throw new Error("비밀번호는 최소 4자 이상이어야 합니다.");
                }
                if (formData.password !== formData.passwordConfirm) {
                    throw new Error("비밀번호 확인이 일치하지 않습니다.");
                }

                try {
                    const newUser = db.auth.signup({
                        email: formData.email.trim(),
                        name: formData.name.trim(),
                        password: formData.password,
                        role: "student",
                        church: formData.church.trim(),
                        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
                        level: "신입생 지원자"
                    });
                    activeUserId = newUser.id;

                    // Automatically login to create active local session
                    db.auth.login(formData.email.trim(), formData.password);
                } catch (signupErr: any) {
                    // If account already exists, try logging in
                    try {
                        const existingUser = db.auth.login(formData.email.trim(), formData.password);
                        activeUserId = existingUser.id;
                    } catch {
                        throw new Error(signupErr.message || "이미 등록된 이메일입니다. 비밀번호를 확인하시거나 기존 계정으로 로그인 후 신청해 주세요.");
                    }
                }
            }

            // 2. Format detailed motivation
            const baptismNote = `[세례문답: 물세례=${formData.waterBaptism === 'yes' ? '완료' : '예정'}, 성령세례=${formData.holySpiritBaptism === 'experienced' ? '체험' : '사모'}]`;
            const certTargetNote = `[희망자격증: ${formData.certificateTarget === 'pastor_cert' ? '목사' : formData.certificateTarget === 'missionary_cert' ? '선교사' : '전도사'}]`;
            const scholarshipNote = `[장학희망: ${formData.scholarshipType === 'pastor_wife_50' ? '사모 50% 할인' : formData.scholarshipType === 'first_batch_30' ? '1기 등록 장학금 30%' : '일반'}]`;
            const fullMotivation = `${baptismNote} ${certTargetNote} ${scholarshipNote}\n\n${formData.motivation}`.trim();

            const applicationData = {
                userId: activeUserId,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                church: formData.church.trim(),
                position: `${formData.position.trim()} (${formData.applicantType})`,
                department: formData.department.trim(),
                track: formData.track,
                motivation: fullMotivation
            };

            // 3. Save to Supabase & LocalStorage
            try {
                await supabaseDb.applications.create(applicationData);
            } catch (error) {
                console.warn("[Admission] Supabase apply error (fallback to local):", error);
            }

            db.applications.create(applicationData);
            setIsCompleted(true);
        } catch (err: any) {
            console.error("[Admission] Submit Error:", err);
            setSubmitError(err.message || "원서 접수 중 오류가 발생했습니다. 입력 정보를 확인해 주세요.");
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
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3 border border-emerald-200">
                        원스톱 접수 및 계정 생성 완료
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">입학 지원서가 접수되었습니다</h2>
                    <p className="text-slate-600 mb-6 text-xs md:text-sm leading-relaxed">
                        바라크아카데미 2027학년도 1기 신입생 지원이 성공적으로 완료되었습니다.<br />
                        학사 계정이 함께 생성되어 관리자 심사 중에도 강의실 시스템을 미리 둘러보실 수 있습니다.
                    </p>

                    <div className="p-5 bg-slate-50 rounded-2xl mb-8 text-left space-y-2.5 border border-slate-200/80 text-xs md:text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">지원자 / 계정</span>
                            <span className="font-bold text-slate-800">{formData.name} ({formData.email})</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">연락처</span>
                            <span className="font-medium text-slate-700">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">소속 교회</span>
                            <span className="font-medium text-slate-700">{formData.church} ({formData.position})</span>
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

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                window.location.href = '/dashboard';
                            }}
                            className="flex-1 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md text-sm flex items-center justify-center gap-2"
                        >
                            내 강의실 입장하기 <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-4 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm text-center"
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
                            단, <strong>자격증서</strong>의 정식 수령은 재학 중이거나 수료 후 성령을 받은 자에게 수여됩니다.
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
                            <h3 className="text-xl font-bold text-slate-900 mb-3">모집 요강</h3>
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

                            {/* 1. Account Status Guidance Banner */}
                            {user ? (
                                <div className="mb-8 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                                                <span>안녕하세요, <strong>{user.name}</strong>님!</span>
                                                <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-200/70 text-blue-800 rounded-full">인증 완료</span>
                                            </div>
                                            <div className="text-xs text-blue-700 mt-0.5">
                                                회원 계정({user.email}) 정보가 입학 지원서에 자동으로 연동됩니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm shrink-0 mt-0.5">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                                <span>원스톱 간편 입학 신청</span>
                                                <span className="text-[11px] font-bold px-2 py-0.2 bg-amber-200/80 text-amber-900 rounded-full">회원가입 자동</span>
                                            </div>
                                            <div className="text-xs text-amber-800 leading-relaxed mt-0.5">
                                                별도의 회원가입 없이 아래 원서를 작성하시면 <strong>학사 계정이 자동 생성</strong>되어 합격 확인 및 내 강의실 이용이 즉시 가능합니다.
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/login?redirect=/apply"
                                        className="shrink-0 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 text-xs font-bold transition-all text-center shadow-sm"
                                    >
                                        기존 회원 로그인 &rarr;
                                    </Link>
                                </div>
                            )}

                            {/* Step Error Banner */}
                            {stepError && (
                                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{stepError}</span>
                                </div>
                            )}

                            {/* Submit Error Banner */}
                            {submitError && (
                                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <User className="w-5 h-5 text-blue-900" />
                                            지원자 기본 정보 및 계정 설정
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
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 주소 (학사 로그인 ID) *</label>
                                            <input
                                                type="email" name="email" required value={formData.email} onChange={handleInputChange} readOnly={!!user?.email}
                                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-sm ${user?.email ? 'cursor-not-allowed opacity-80' : ''}`}
                                                placeholder="example@domain.com"
                                            />
                                            {!user && (
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    ※ 이메일은 수강 안내문 수신 및 내 강의실 로그인 아이디로 사용됩니다.
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field for New Guests (One-stop Sign Up) */}
                                        {!user && (
                                            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 pt-4">
                                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    <Lock className="w-4 h-4 text-amber-600" />
                                                    학사 계정 비밀번호 설정 (합격 확인 및 강의실 접속용) *
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">비밀번호 (4자 이상)</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            required
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            placeholder="비밀번호 입력"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">비밀번호 확인</label>
                                                        <input
                                                            type="password"
                                                            name="passwordConfirm"
                                                            required
                                                            value={formData.passwordConfirm}
                                                            onChange={handleInputChange}
                                                            placeholder="비밀번호 재입력"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Faith & Baptism Questionnaire */}
                                        <div className="pt-2">
                                            <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                                                <Droplet className="w-4 h-4 text-blue-600" />
                                                신앙 및 세례 문답 (자격증서 수여 기준 반영)
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                                                    <div className="text-xs font-bold text-slate-700 mb-2">물세례(침례) 여부 *</div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, waterBaptism: 'yes' }))}
                                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.waterBaptism === 'yes' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            받음 (기세례자)
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, waterBaptism: 'no' }))}
                                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.waterBaptism === 'no' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            미세례 (학기 중 예정)
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                                                    <div className="text-xs font-bold text-slate-700 mb-2">성령 세례(은사/기름부으심) *</div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, holySpiritBaptism: 'experienced' }))}
                                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.holySpiritBaptism === 'experienced' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            체험함
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, holySpiritBaptism: 'seeking' }))}
                                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.holySpiritBaptism === 'seeking' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            체험 사모함
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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

                            {/* Bottom Error Notice */}
                            {stepError && (
                                <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{stepError}</span>
                                </div>
                            )}

                            {submitError && (
                                <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
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
