"use client";

import React, { useState } from "react";
import { PlayCircle, CheckCircle2, Award, FileText, Send, Sparkles, Download, ArrowRight, Shield, Database, RefreshCw, Check, AlertCircle, Laptop, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CertificateGenerator } from "@/components/certificate/CertificateGenerator";

export function InteractiveAutomationDemo() {
    // Current Simulation Step (1: Lecture, 2: Reflection, 3: Auto Issue Engine, 4: Live Certificate & Verification)
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const [isWatched, setIsWatched] = useState<boolean>(false);
    const [reflectionText, setReflectionText] = useState<string>("");
    const [isReflectionApproved, setIsReflectionApproved] = useState<boolean>(false);
    const [studentName, setStudentName] = useState<string>("김바라크");
    const [selectedRole, setSelectedRole] = useState<"barak" | "jael" | "deborah">("barak");
    
    // Auto-Generated Certificate Data
    const [generatedCert, setGeneratedCert] = useState<{
        licenseKey: string;
        issuedAt: string;
        studentName: string;
        trackTitle: string;
        status: string;
    } | null>(null);

    // Live Supabase Transaction Logs
    const [logs, setLogs] = useState<Array<{ time: string; type: "info" | "success" | "db" | "ai"; message: string }>>([
        { time: new Date().toLocaleTimeString(), type: "info", message: "⚡ 바라크아카데미 자동화 발급 엔진 초기화 완료 (Supabase DB 대기 중)" }
    ]);

    const addLog = (type: "info" | "success" | "db" | "ai", message: string) => {
        setLogs(prev => [
            { time: new Date().toLocaleTimeString(), type, message },
            ...prev.slice(0, 8)
        ]);
    };

    // Step 1 Action: Watch Video & Complete Lesson
    const handleCompleteLecture = () => {
        setIsWatched(true);
        setProgressPercent(100);
        addLog("db", `[Supabase UPDATE user_progress] user_id: 'user_demo', course_id: 1, completed_lessons: ['mod_1'], progress: 100%`);
        addLog("success", `✓ 강의 수강 및 '아멘' 화답 완료! 진도율 100% 달성`);
        setCurrentStep(2);
    };

    // Step 2 Action: Load Sample Reflection & Submit
    const handleLoadSampleReflection = () => {
        setReflectionText(
            "사사기 4장과 5장에 등장하는 바락(Barak) 장군의 무릎 꿇는 겸손(ברך)을 배우며 깊은 은혜를 받았습니다. 자신의 영광보다 하나님의 함께하심을 더 중요시했던 바락처럼, 저 또한 목회 현장에서 드보라를 존귀히 세우고 [히 11:35] 더 좋은 부활의 상급을 바라보는 충성된 전문 부목자로 헌신하겠습니다."
        );
    };

    const handleSubmitReflection = () => {
        if (!reflectionText.trim()) return;
        setIsReflectionApproved(true);
        addLog("db", `[Supabase INSERT reflections] user_id: 'user_demo', course_id: 1, status: 'submitted'`);
        addLog("ai", `[수료 요건 자동 확인] "과목별 A4 소감문 분량 및 제출 여부가 확인되어 이수 처리가 완료되었습니다."`);
        setCurrentStep(3);

        // Automatically trigger Step 3 Auto-Issuance
        setTimeout(() => {
            handleRunAutoIssuance();
        }, 1200);
    };

    // Step 3 Action: Auto Issue Pipeline
    const handleRunAutoIssuance = () => {
        const rolePrefix = selectedRole.toUpperCase();
        const year = new Date().getFullYear();
        const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        const licenseKey = `BA-${year}-${rolePrefix}-${randomKey}`;
        const issuedAt = new Date().toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' });

        const cert = {
            licenseKey,
            issuedAt,
            studentName,
            trackTitle: selectedRole === 'barak' ? "바락 부목사 과정 (120강)" : selectedRole === 'deborah' ? "드보라 담임목회 과정 (120강)" : "야엘 은사사역 과정 (120강)",
            status: "active"
        };

        setGeneratedCert(cert);
        addLog("ai", `[certificateEngine] 수료 요건 확인: 진도율 100% (충족), 과목별 A4 소감문 제출 (충족)`);
        addLog("db", `[Supabase INSERT certificates] license_key: '${licenseKey}', student: '${studentName}', status: 'active'`);
        addLog("success", `🎉 [자동 발급 완료] 과정 수료증이 성공적으로 생성되었습니다!`);
        setCurrentStep(4);
    };

    // Reset Simulation
    const handleReset = () => {
        setCurrentStep(1);
        setProgressPercent(0);
        setIsWatched(false);
        setReflectionText("");
        setIsReflectionApproved(false);
        setGeneratedCert(null);
        setLogs([
            { time: new Date().toLocaleTimeString(), type: "info", message: "⚡ 시뮬레이터가 리셋되었습니다. 1단계부터 다시 체험해보세요." }
        ]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl border border-slate-800">
            {/* Top Title & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-400/30">
                        <Sparkles className="w-3.5 h-3.5" /> Automated Certificate Workflow Simulator
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                        수료증 자동 발급 흐름 체험
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        [강의 수강 ➔ 소감문 제출 ➔ 수료 요건 확인 ➔ 수료번호 발급 ➔ PDF 다운로드] 전 과정을 직접 실행해보세요.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> 처음부터 다시 실행
                    </button>
                </div>
            </div>

            {/* 4-Step Interactive Progress Tracker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { num: 1, title: "1. 온라인 강의 수강", sub: "진도율 100% & 아멘", done: currentStep > 1, active: currentStep === 1 },
                    { num: 2, title: "2. 소감문 제출", sub: "수료 요건 자동 확인", done: currentStep > 2, active: currentStep === 2 },
                    { num: 3, title: "3. 수료번호 발급", sub: "수료번호 자동 채번", done: currentStep > 3, active: currentStep === 3 },
                    { num: 4, title: "4. 수료증 PDF 다운로드", sub: "PDF 인쇄 & 수료 확인", done: currentStep === 4, active: currentStep === 4 },
                ].map((s) => (
                    <div
                        key={s.num}
                        onClick={() => setCurrentStep(s.num)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                            s.active
                                ? "bg-blue-900/60 border-amber-400 shadow-lg"
                                : s.done
                                ? "bg-slate-800/80 border-emerald-500/80 text-slate-300"
                                : "bg-slate-800/40 border-slate-700/60 opacity-60"
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-amber-300 font-mono">STEP 0{s.num}</span>
                            {s.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
                            )}
                        </div>
                        <div className="font-bold text-sm text-white">{s.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Interactive Stage Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Step Interactive Simulator (7 cols) */}
                <div className="lg:col-span-7 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 min-h-[440px] flex flex-col justify-between">
                    
                    {/* STEP 1: Lecture Completion */}
                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                                    <PlayCircle className="w-5 h-5" /> 1단계: 온라인 영상 강의 수강 & 아멘 완료
                                </div>
                                <span className="text-xs font-mono text-slate-400">Supabase user_progress</span>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-300">제1강: 사사기 바락의 영성과 십자가의 도</span>
                                    <span className="text-amber-400 font-mono font-bold">{progressPercent}% 수강 완료</span>
                                </div>
                                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                                    <div
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-700"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    * 강의 시청 완료 후 하단 '아멘으로 수강 완료' 버튼을 클릭하면 Supabase DB에 진도율이 100% 동기화됩니다.
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleCompleteLecture}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                                >
                                    <CheckSquare className="w-4 h-4 text-amber-400" />
                                    🙏 아멘으로 수강 완료 (진도율 100% Supabase 기록)
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Reflection Submission */}
                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                                    <FileText className="w-5 h-5" /> 2단계: 과목별 소감문 제출 & 수료 요건 자동 확인
                                </div>
                                <button
                                    onClick={handleLoadSampleReflection}
                                    className="px-2.5 py-1 bg-amber-400/20 text-amber-300 rounded-lg text-[11px] font-bold hover:bg-amber-400/30 transition-colors"
                                >
                                    ✨ 샘플 소감문 즉시 불러오기
                                </button>
                            </div>

                            <div className="space-y-2">
                                <textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    placeholder="강의에서 깨달은 은혜와 사역 현장의 적용 결단을 작성하세요 (샘플 불러오기를 누르면 자동 입력됩니다)..."
                                    rows={5}
                                    className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={handleSubmitReflection}
                                disabled={!reflectionText.trim()}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 text-slate-950" />
                                소감문 제출 및 수료 요건 자동 확인 실행 ➔
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: Auto Issuance Pipeline */}
                    {currentStep === 3 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                                <Sparkles className="w-5 h-5 animate-spin" /> 3단계: 수료 요건 확인 및 수료번호 발급 중
                            </div>

                            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-700 space-y-3 text-xs">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span>① 120강 강의 수강 진도율 확인:</span>
                                    <span className="text-emerald-400 font-bold">✓ 100% 충족</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span>② 과목별 소감문 분량·제출 확인:</span>
                                    <span className="text-emerald-400 font-bold">✓ 제출 확인 완료</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800">
                                    <span>③ Supabase certificates INSERT:</span>
                                    <span className="text-amber-400 font-mono font-bold">수료번호 자동 채번 및 기록 중...</span>
                                </div>
                            </div>

                            <div className="text-center text-xs text-slate-400 animate-pulse">
                                고유 수료번호 생성 및 과정 수료증 실시간 렌더링 중...
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Certificate Rendered & Verification */}
                    {currentStep === 4 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 4단계: 과정 수료증 PDF 인쇄 및 수료 확인
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                                    LIVE IN SUPABASE
                                </span>
                            </div>

                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">발급 수료자:</span>
                                    <span className="font-bold text-white">{generatedCert?.studentName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">수료번호:</span>
                                    <span className="font-mono font-bold text-amber-300">{generatedCert?.licenseKey}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">수료 과정:</span>
                                    <span className="text-amber-200 font-semibold">{generatedCert?.trackTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">발급 주체:</span>
                                    <span className="text-slate-300">산해원교회 바라크아카데미 학장 이윤주</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="/certificate"
                                    className="py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 transition-all text-center"
                                >
                                    <Download className="w-4 h-4 text-slate-950" /> PDF 즉시 다운로드
                                </a>
                                <button
                                    onClick={() => alert(`[실시간 수료 확인]\n수료번호: ${generatedCert?.licenseKey}\n수료자: ${generatedCert?.studentName}\n결과: 본 아카데미가 발급한 과정 수료증으로 확인됩니다.`)}
                                    className="py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-600 transition-all text-center"
                                >
                                    <Shield className="w-4 h-4 text-emerald-400" /> 수료번호 조회 확인
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom Student Name & Role Customizer */}
                    <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">시뮬레이션 수강생 성명:</span>
                            <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs w-24 outline-none focus:border-amber-400"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-slate-400 mr-1">과정 트랙:</span>
                            {(['barak', 'jael', 'deborah'] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                        selectedRole === role ? "bg-amber-400 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {role === 'barak' ? '바락 부목사 과정' : role === 'jael' ? '야엘 은사사역 과정' : '드보라 담임목회 과정'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Live Supabase Transaction & Architecture Log Console (5 cols) */}
                <div className="lg:col-span-5 bg-black/60 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between font-mono min-h-[440px]">
                    <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <Database className="w-3.5 h-3.5" /> Supabase DB Realtime Console
                            </div>
                            <span className="text-[10px] text-slate-500">LIVE SYNC</span>
                        </div>

                        {/* Live Logs List */}
                        <div className="space-y-2 text-[11px] leading-relaxed">
                            {logs.map((log, i) => (
                                <div
                                    key={i}
                                    className={`p-2 rounded-lg border ${
                                        log.type === "db"
                                            ? "bg-blue-950/50 border-blue-800/60 text-blue-200"
                                            : log.type === "success"
                                            ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300"
                                            : log.type === "ai"
                                            ? "bg-purple-950/50 border-purple-800/60 text-purple-200"
                                            : "bg-slate-900/60 border-slate-800 text-slate-400"
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-[9px] opacity-70 mb-0.5">
                                        <span>[{log.type.toUpperCase()}]</span>
                                        <span>{log.time}</span>
                                    </div>
                                    <div className="break-all">{log.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
                        <span>Engine: Barak-AutoCert-v2.0</span>
                        <span className="text-emerald-400">● 100% Automated</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
