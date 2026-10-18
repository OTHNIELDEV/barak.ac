"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, User, GraduationCap, Building2, Gift, Sparkles, AlertCircle, FileText, CheckCircle2, Flame, Droplet, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

function AdmissionApplyForm() {
    const { user, isLoading: authLoading } = useAuth();
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
        waterBaptism: "none", // yes, no, none (선택 안 함)
        holySpiritBaptism: "none", // experienced, seeking, none (선택 안 함)
        privacyConsent: false, // [필수] 개인정보 수집·이용 동의
        faithConsent: false,   // [선택] 신앙 정보 수집·이용 동의
        
        // Step 2: Ministry & Target
        applicantType: "pastor_wife", // pastor_wife, women_minister, retired_pastor, seeker
        church: "",
        position: "목사 사모",
        department: "",
        
        // Step 3: Track & Sponsorship Reduction
        track: "barak" as "deborah" | "barak" | "jael",
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
                setStepError("신청자 성명(본명)을 입력해 주세요.");
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
            // Check password if not logged in (8자 이상 - R7)
            if (!user) {
                if (!formData.password || formData.password.length < 8) {
                    setStepError("수강 계정 접속을 위해 비밀번호(8자 이상)를 입력해 주세요.");
                    return;
                }
                if (formData.password !== formData.passwordConfirm) {
                    setStepError("비밀번호 확인이 일치하지 않습니다. 다시 확인해 주세요.");
                    return;
                }
            }
            if (!formData.privacyConsent) {
                setStepError("[필수] 개인정보 수집·이용에 동의해 주세요.");
                return;
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
                if (formData.password.length < 8) {
                    throw new Error("비밀번호는 8자 이상이어야 합니다.");
                }
                if (formData.password !== formData.passwordConfirm) {
                    throw new Error("비밀번호 확인이 일치하지 않습니다.");
                }

                const fullPosition = `${formData.position.trim()} (${formData.applicantType})`;
                const isPastor = formData.applicantType === 'retired_pastor' || formData.position.includes('목사') || formData.position.includes('pastor');
                const initialRole: "student" | "pastor" = isPastor ? "pastor" : "student";

                try {
                    const newUser = db.auth.signup({
                        email: formData.email.trim(),
                        name: formData.name.trim(),
                        password: formData.password,
                        role: initialRole,
                        church: formData.church.trim(),
                        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
                        level: fullPosition
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

            // 2. Format detailed motivation (only store faith info if consented - R7)
            const waterLabel = formData.waterBaptism === 'yes' ? '기세례' : formData.waterBaptism === 'no' ? '예정' : '미선택';
            const spiritLabel = formData.holySpiritBaptism === 'experienced' ? '체험' : formData.holySpiritBaptism === 'seeking' ? '사모' : '미선택';
            const baptismNote = formData.faithConsent && (formData.waterBaptism !== 'none' || formData.holySpiritBaptism !== 'none')
                ? `[신앙문답(동의): 물세례=${waterLabel}, 성령체험=${spiritLabel}] `
                : "";
            const sponsorshipNote = `[후원금감면: ${formData.scholarshipType === 'pastor_wife_50' ? '목사 사모 50% 감면' : formData.scholarshipType === 'first_batch_30' ? '1기 후원금 30% 감면' : '권장 후원금 일반'}]`;
            const fullMotivation = `${baptismNote}${sponsorshipNote}\n\n${formData.motivation}`.trim();

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

            // 4. Provision / sync Supabase Auth account immediately if password provided
            if (formData.password) {
                try {
                    await fetch("/api/auth/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: formData.email.trim(),
                            password: formData.password
                        })
                    });
                } catch (syncErr) {
                    console.warn("[Admission] Auth sync background notice:", syncErr);
                }
            }

            setIsCompleted(true);
        } catch (err: any) {
            console.error("[Admission] Submit Error:", err);
            setSubmitError(err.message || "수강 신청서 접수 중 오류가 발생했습니다. 입력 정보를 확인해 주세요.");
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
                        원스톱 수강 신청 및 계정 생성 완료
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">수강 신청서가 접수되었습니다</h2>
                    <p className="text-slate-600 mb-6 text-xs md:text-sm leading-relaxed">
                        바라크아카데미 2027년 1기 수강 신청이 완료되었습니다.<br />
                        수강 계정이 함께 생성되어 운영팀 확인 중에도 강의실 시스템을 미리 둘러보실 수 있습니다.
                    </p>

                    <div className="p-5 bg-slate-50 rounded-2xl mb-8 text-left space-y-2.5 border border-slate-200/80 text-xs md:text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">신청자 / 계정</span>
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
                            <span className="text-slate-500">신청 과정</span>
                            <span className="font-bold text-blue-900">
                                {formData.track === 'barak' ? '바락 부목사 과정' :
                                    formData.track === 'deborah' ? '드보라 담임목회 과정' : '야엘 은사사역 과정'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">후원금 감면 구분</span>
                            <span className="font-bold text-amber-600">
                                {formData.scholarshipType === 'pastor_wife_50' ? '목사 사모 감면 (50% 감면 / 50만원)' :
                                    formData.scholarshipType === 'first_batch_30' ? '1기 교육후원금 감면 (30% 감면 / 70만원)' : '권장 교육후원금 (100만원)'}
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
                        <Sparkles className="w-4 h-4" /> 2027년 1기 수강생 모집
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        1기 과정 안내 및 수강 신청
                    </h1>
                </div>
            </section>

            {/* 2. Course Guide & Completion Criteria Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16 space-y-8">
                {/* 2-1. 수강 안내 & 과정 수료 기준 */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
                    <div className="flex items-center gap-2.5 text-blue-900 font-bold text-xs md:text-sm tracking-wider uppercase mb-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        Biblical Course Guide & Completion Criteria
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                        바라크아카데미 수강 안내 및 과정 수료 기준
                    </h2>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-700 space-y-3">
                        <div className="font-bold flex items-center gap-2 text-blue-900 text-base">
                            <CheckCircle2 className="w-5 h-5 text-amber-500" />
                            열린 성경·신학 아카데미 교육과정
                        </div>
                        <p className="leading-relaxed">
                            말씀과 사역을 사모하는 분이라면 누구나 수강 신청하여 전 과목(2년 4학기 120강)과 과목별 소감문을 이수할 수 있습니다.
                        </p>
                        <p className="leading-relaxed pt-2 border-t border-slate-200 text-slate-600">
                            본 과정은 교육부 인가 학위·자격 과정이 아닌 산해원교회 산하 신학 아카데미의 교회 교육 과정입니다. 수료 시 과정별 수료증을 드리며, 이는 국가·민간 자격이나 학위가 아닙니다. 사역 배치와 임명은 각 교회·교단의 절차를 따릅니다.
                        </p>
                    </div>
                </div>

                {/* 2-2. 3대 핵심 요약 카드 (수강 대상, 교육후원금 감면, 과정 운영) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 카드 1: 수강 대상 */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-4">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">수강 대상</h3>
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
                                    <span><strong>은퇴·원로 목회자</strong> 중 &lsquo;바락&rsquo;과 같은 부목사로 헌신할 분</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>성경 중심의 신학과 영성</strong>을 겸비하고자 하는 은사자</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 카드 2: 교육후원금 및 감면 */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-4">
                                <Gift className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">교육후원금 및 감면</h3>
                            <div className="space-y-3 text-xs md:text-sm text-amber-50">
                                <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-xl">
                                    <span>권장 후원금 (2년 4학기)</span>
                                    <span className="font-bold text-white text-base">100만원</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 p-2.5 rounded-xl">
                                    <span className="font-semibold">💖 목사 사모 감면</span>
                                    <span className="font-bold text-yellow-200 text-base">50% 감면 (50만원)</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 p-2.5 rounded-xl">
                                    <span className="font-semibold">🌟 1기 교육후원금 감면</span>
                                    <span className="font-bold text-white text-base">30% 감면 (70만원)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 카드 3: 과정 운영 및 수료 기준 */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">과정 운영 & 수료 기준</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>2년 4학기 (120강)</strong>: 학기당 30강 자율 수강</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>시험 없음 (No Exam)</strong>: 현장 적용 중심</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>과목별 A4 소감문</strong>: 배운 내용을 삶에 적용</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span><strong>수료 기한 제한 없음</strong>: 자율 이수</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 2-3. 교육후원금 안내문 (R5) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs md:text-sm text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 font-bold">💡 교육후원금 안내:</strong> 바라크아카데미는 산해원교회의 교육 사역으로 운영되며, 수강생의 교육후원금으로 강의 제작과 운영비를 충당합니다. 권장 후원금은 2년 과정 100만원이며, 2027년 1기 수강생은 30%, 목사 사모는 50%를 감면합니다. 형편이 어려운 분은 운영팀과 상의할 수 있습니다. (<Link href="/terms" className="text-blue-900 font-semibold underline underline-offset-2">환불·중단 기준은 이용약관 제8조 참조</Link>)
                </div>
            </section>

            {/* 3. Application Form Section */}
            <section className="py-12 px-4 pb-28">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">Online Enrollment</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-1 mb-2">
                            2027년 1기 온라인 수강 신청
                        </h2>
                        <p className="text-sm md:text-base text-slate-600">
                            아래 양식을 작성해 주시면 운영팀이 확인 후 수강 절차 및 교육후원금 감면 안내를 드립니다.
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
                                    {num === 1 ? "기본 정보" : num === 2 ? "수강 대상 및 소속" : "과정 & 후원금 감면"}
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
                                                회원 계정({user.email}) 정보가 수강 신청서에 자동으로 연동됩니다.
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
                                                <span>원스톱 간편 수강 신청</span>
                                                <span className="text-[11px] font-bold px-2 py-0.2 bg-amber-200/80 text-amber-900 rounded-full">계정 자동 생성</span>
                                            </div>
                                            <div className="text-xs text-amber-800 leading-relaxed mt-0.5">
                                                별도의 회원가입 없이 아래 신청서를 작성하시면 <strong>수강 계정이 자동 생성</strong>되어 승인 확인 및 내 강의실 이용이 즉시 가능합니다.
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
                                            신청자 기본 정보 및 수강 계정 설정
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
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 주소 (수강 로그인 ID) *</label>
                                            <input
                                                type="email" name="email" required value={formData.email} onChange={handleInputChange} readOnly={!!user?.email}
                                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-sm ${user?.email ? 'cursor-not-allowed opacity-80' : ''}`}
                                                placeholder="example@domain.com"
                                            />
                                            {!user && (
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    ※ 이메일은 수강 안내 수신 및 내 강의실 로그인 아이디로 사용됩니다.
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field for New Guests (8자 이상 - R7) */}
                                        {!user && (
                                            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 pt-4">
                                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    <Lock className="w-4 h-4 text-amber-600" />
                                                    수강 계정 비밀번호 설정 (승인 확인 및 강의실 접속용) *
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">비밀번호 (8자 이상)</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            required
                                                            minLength={8}
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            placeholder="8자 이상 비밀번호 입력"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">비밀번호 확인</label>
                                                        <input
                                                            type="password"
                                                            name="passwordConfirm"
                                                            required
                                                            minLength={8}
                                                            value={formData.passwordConfirm}
                                                            onChange={handleInputChange}
                                                            placeholder="비밀번호 재입력"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Faith & Baptism Questionnaire (Optional - R7) */}
                                        <div className="pt-2">
                                            <div className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                                                <Droplet className="w-4 h-4 text-blue-600" />
                                                신앙 및 세례 문답 <span className="text-xs font-normal text-slate-500">(선택 사항)</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3">
                                                아래 문답은 목회적 참고를 위한 선택 입력 사항이며, 응답하지 않아도 수강 신청 및 수료에 불이익이 없습니다.
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                                                    <div className="text-xs font-bold text-slate-700 mb-2">물세례(침례) 여부 (선택)</div>
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                        {[
                                                            { id: "yes", label: "기세례자" },
                                                            { id: "no", label: "미세례(예정)" },
                                                            { id: "none", label: "선택 안 함" },
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                type="button"
                                                                onClick={() => setFormData(p => ({ ...p, waterBaptism: opt.id }))}
                                                                className={`py-2 rounded-lg text-xs font-bold border transition-all ${formData.waterBaptism === opt.id ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                                                    <div className="text-xs font-bold text-slate-700 mb-2">성령 체험 여부 (선택)</div>
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                        {[
                                                            { id: "experienced", label: "체험함" },
                                                            { id: "seeking", label: "사모함" },
                                                            { id: "none", label: "선택 안 함" },
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                type="button"
                                                                onClick={() => setFormData(p => ({ ...p, holySpiritBaptism: opt.id }))}
                                                                className={`py-2 rounded-lg text-xs font-bold border transition-all ${formData.holySpiritBaptism === opt.id ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Privacy & Sensitive Info Consent Checkboxes (Separated - R7) */}
                                        <div className="pt-3 space-y-3 border-t border-slate-100">
                                            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.privacyConsent}
                                                    onChange={(e) => {
                                                        setStepError("");
                                                        setFormData(p => ({ ...p, privacyConsent: e.target.checked }));
                                                    }}
                                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                                                />
                                                <span className="text-xs text-slate-700 leading-relaxed">
                                                    <strong className="text-blue-900">[필수]</strong> 개인정보 수집·이용 및 이용약관에 동의합니다.
                                                    <span className="block text-[11px] text-slate-500 mt-0.5">
                                                        (수집항목: 성명·연락처·이메일·소속·직분 / 목적: 수강 안내·과정 운영·수료증 발급 / 보유기간: 수료 후 5년 보관 / 처리 위탁: Supabase Inc. · <Link href="/privacy" target="_blank" className="underline text-blue-800">개인정보처리방침</Link> · <Link href="/terms" target="_blank" className="underline text-blue-800">이용약관</Link>)
                                                    </span>
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.faithConsent}
                                                    onChange={(e) => setFormData(p => ({ ...p, faithConsent: e.target.checked }))}
                                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                                                />
                                                <span className="text-xs text-slate-700 leading-relaxed">
                                                    <strong className="text-slate-600">[선택]</strong> 신앙 정보(세례·성령 체험 여부) 수집·이용에 동의합니다.
                                                    <span className="block text-[11px] text-slate-500 mt-0.5">
                                                        동의하지 않아도 수강 신청 및 수료에 아무런 불이익이 없습니다.
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Ministry & Target Info */}
                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <Building2 className="w-5 h-5 text-blue-900" />
                                        수강 대상 구분 및 사역 정보
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">수강 대상 구분 *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {[
                                                { id: "pastor_wife", title: "목사 사모", desc: "사역 동역 (50% 감면)" },
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

                            {/* Step 3: Course Track & Sponsorship Reduction */}
                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <GraduationCap className="w-5 h-5 text-blue-900" />
                                        교육과정 및 교육후원금 감면 선택
                                    </h3>

                                    {/* Sponsorship Reduction Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">교육후원금 감면 구분 선택 *</label>
                                        <div className="space-y-2.5">
                                            {[
                                                { id: "first_batch_30", title: "1기 교육후원금 감면 (30% 감면)", desc: "2027년 1기 수강생 전원 감면 (권장 후원금 70만원 적용)" },
                                                { id: "pastor_wife_50", title: "목사 사모 특별 감면 (50% 감면)", desc: "목회자 사모 대상 특별 감면 (권장 후원금 50만원 적용)" },
                                                { id: "none", title: "권장 교육후원금 (2년 과정 100만원)", desc: "일반 또는 소속 교회 후원 참여" },
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
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">희망 교육과정 선택 *</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[
                                                { id: 'barak', title: '바락 부목사 과정', subtitle: '충성된 부목사 사역', desc: '더 나은 존귀를 얻는 동역' },
                                                { id: 'deborah', title: '드보라 담임목회 과정', subtitle: '말씀과 영적 통찰 리더십', desc: '시대를 이끄는 영적 리더' },
                                                { id: 'jael', title: '야엘 은사사역 과정', subtitle: '결행하는 평신도 사역', desc: '삶의 현장 속 복음 실천' },
                                            ].map(track => (
                                                <div
                                                    key={track.id}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        track: track.id as any,
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

                                    {/* Motivation */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">지원 동기 및 사명 선언문 *</label>
                                        <textarea
                                            name="motivation" required value={formData.motivation} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all h-28 resize-none text-sm"
                                            placeholder="바라크아카데미 교육과정을 수강하게 된 동기와 사역 현장에서의 소망을 자유롭게 적어주세요."
                                        />
                                    </div>

                                    {/* Common Legal Disclaimer in Form (R6) */}
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                                        ℹ️ <strong>과정 성격 안내 및 고지:</strong> 본 과정은 교육부 인가 학위·자격 과정이 아닌 산해원교회 산하 신학 아카데미의 교회 교육 과정입니다. 수료 시 과정별 수료증을 드리며, 이는 국가·민간 자격이나 학위가 아닙니다. 사역 배치와 임명은 각 교회·교단의 절차를 따릅니다.
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
                                        {isSubmitting ? '접수 처리 중...' : '수강 신청서 최종 제출'}
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
