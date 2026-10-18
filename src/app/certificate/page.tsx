"use client";

import { CertificateGenerator } from "@/components/certificate/CertificateGenerator";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Shield, CheckCircle2, Award, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db, CertificateIssued } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { certificateEngine } from "@/lib/certificateEngine";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

function CertificateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState<"barak" | "jael" | "deborah">("barak");
    const [userCertificates, setUserCertificates] = useState<CertificateIssued[]>([]);
    const [activeLicenseKey, setActiveLicenseKey] = useState<string>("");

    // Verification Search State
    const [searchKey, setSearchKey] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [verifyResult, setVerifyResult] = useState<{
        isValid: boolean;
        cert?: any;
        issuer?: string;
        president?: string;
        verifiedAt?: string;
        message?: string;
    } | null>(null);

    // Default or User Name
    const userName = user?.name || "홍길동";
    const today = new Date().toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const trackParam = searchParams.get("track");
        if (trackParam === "deborah") setSelectedRole("deborah");
        else if (trackParam === "jael") setSelectedRole("jael");
        else if (trackParam === "barak") setSelectedRole("barak");

        // Load user's actual certificates from Supabase
        if (user) {
            const loadCerts = async () => {
                let certs: CertificateIssued[] = [];
                try {
                    certs = await supabaseDb.admin.certificates.getByUser(user.id);
                } catch (e) {
                    certs = db.admin.certificates.getAll().filter(c => c.studentId === user.id);
                }
                if (certs.length === 0) {
                    certs = db.admin.certificates.getAll().filter(c => c.studentId === user.id);
                }
                setUserCertificates(certs);
                if (certs.length > 0) {
                    setActiveLicenseKey(certs[0].licenseKey);
                }
            };
            loadCerts();
        }
    }, [user, searchParams]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKey.trim()) return;

        setIsSearching(true);
        try {
            const result = await certificateEngine.verifyLicense(searchKey);
            setVerifyResult(result);
        } catch (e) {
            setVerifyResult({ isValid: false, message: "조회 중 오류가 발생했습니다." });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* Header / Banner */}
            <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase mb-4">
                        <Award className="w-4 h-4" /> Course Completion Certificate Center
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3">
                        바라크아카데미 과정 수료증 발급센터
                    </h1>
                    <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        산해원교회 산하 바라크아카데미 2년 4학기(120강) 교육과정과 과목별 소감문을 성실히 이수한 수료생에게 과정별 수료증을 발급합니다.
                    </p>
                </div>
            </section>

            {/* Legal Notice & Criteria Banner */}
            <section className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <strong className="text-blue-900 block mb-1">🏛️ 소속 및 발급 주체</strong>
                        <p className="text-slate-600">산해원교회 산하 신학 아카데미 (바라크아카데미 학장 이윤주)</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <strong className="text-amber-600 block mb-1">📜 발급 수료증 (3과정)</strong>
                        <p className="text-slate-600">바락 부목사 과정 수료증 / 야엘 은사사역 과정 수료증 / 드보라 담임목회 과정 수료증</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <strong className="text-purple-900 block mb-1">⚖️ 과정 성격 고지</strong>
                        <p className="text-slate-600">
                            본 과정은 교육부 인가 학위·자격 과정이 아닌 산해원교회 산하 신학 아카데미의 교회 교육 과정입니다. 수료 시 과정별 수료증을 드리며, 이는 국가·민간 자격이나 학위가 아닙니다. 사역 배치와 임명은 각 교회·교단의 절차를 따릅니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Generator Component */}
            <section className="max-w-5xl mx-auto px-4 pb-12">
                <CertificateGenerator
                    userName={userName}
                    completionDate={today}
                    initialRole={selectedRole}
                    licenseKey={activeLicenseKey}
                    isAutoIssued={userCertificates.length > 0}
                />
            </section>

            {/* Live Verification Module (수료 확인) */}
            <section className="max-w-4xl mx-auto px-4 mb-20">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
                    <div className="text-center max-w-xl mx-auto mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2">
                            <Shield className="w-3.5 h-3.5" /> Completion Verification
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                            수료 확인
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            발급된 수료증의 수료번호(예: BA-2027-BARAK-XXXX)를 입력하시면 산해원교회 산하 바라크아카데미 데이터베이스에서 수료증 발급 여부를 확인합니다.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                        <input
                            type="text"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            placeholder="수료번호 입력 (예: BA-2027-BARAK-1A2B3C)"
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-900 outline-none uppercase font-mono"
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !searchKey.trim()}
                            className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-800 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            수료 확인
                        </button>
                    </form>

                    {/* Verification Result Display */}
                    {verifyResult && (
                        <div className={`p-5 rounded-2xl border text-xs md:text-sm max-w-lg mx-auto ${
                            verifyResult.isValid ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}>
                            {verifyResult.isValid ? (
                                <div className="space-y-2">
                                    <div className="font-bold flex items-center gap-1.5 text-emerald-800 text-base">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        본 아카데미가 발급한 수료증으로 확인됩니다
                                    </div>
                                    <div className="pt-2 border-t border-emerald-200 space-y-1 text-slate-700">
                                        <div>• <strong>성명:</strong> {verifyResult.cert?.studentName}</div>
                                        <div>• <strong>수료번호:</strong> <span className="font-mono font-bold text-emerald-900">{verifyResult.cert?.licenseKey}</span></div>
                                        <div>• <strong>이수 과정:</strong> {verifyResult.cert?.trackTitle}</div>
                                        <div>• <strong>발급 주체:</strong> {verifyResult.issuer} ({verifyResult.president})</div>
                                        <div>• <strong>상태:</strong> 수료 확인됨 (Active)</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-rose-800 font-bold">
                                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                    <span>{verifyResult.message || "등록되지 않은 수료번호이거나 일치하는 수료 기록이 없습니다."}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-slate-300 rounded-full font-bold text-slate-700 hover:bg-slate-100 transition-colors text-sm flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> 이전 화면으로 돌아가기
                    </button>
                    <Link
                        href="/curriculum"
                        className="px-6 py-3 bg-blue-900 text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-colors"
                    >
                        4학기 교육과정 안내 보기
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

export default function CertificatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>}>
            <CertificateContent />
        </Suspense>
    );
}
