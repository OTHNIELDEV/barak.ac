"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2, Award, CheckCircle2, Shield, Stamp, QrCode, Sparkles } from "lucide-react";

interface CertificateGeneratorProps {
    userName: string;
    courseTitle?: string;
    completionDate?: string;
    birthDate?: string;
    initialRole?: "barak" | "jael" | "deborah";
    licenseKey?: string;
    isAutoIssued?: boolean;
}

export function CertificateGenerator({
    userName = "홍길동",
    completionDate = new Date().toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' }),
    birthDate = "1980년 01월 01일",
    initialRole = "barak",
    licenseKey,
    isAutoIssued = false,
}: CertificateGeneratorProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"barak" | "jael" | "deborah">(initialRole);
    const [customBirthDate, setCustomBirthDate] = useState(birthDate);

    // 고유 발급번호가 없으면 역할 기반 생성
    const activeLicenseKey = licenseKey || `BA-${new Date().getFullYear()}-${selectedRole.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2.5, // High resolution for print
                logging: false,
                useCORS: true,
                backgroundColor: "#fffdf9",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`바라크아카데미_자격증서_${userName}_${activeLicenseKey}.pdf`);
        } catch (error) {
            console.error("Certificate generation failed:", error);
            alert("자격증서 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
            {/* Control Bar: Role Selection & Auto-issue Status */}
            <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                            자격증서 직무 트랙 선택
                        </span>
                        {isAutoIssued && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" /> 시스템 자동 승인됨
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "barak", title: "바락 역 (전문 부목사)", badge: "목사 자격" },
                            { id: "jael", title: "야엘 역 (평신도전도인)", badge: "전도사 자격" },
                            { id: "deborah", title: "드보라 역 (담임목사/선교사)", badge: "목사/선교사 자격" },
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    selectedRole === role.id
                                        ? "bg-blue-900 text-white shadow-md"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${selectedRole === role.id ? 'text-amber-400' : 'text-slate-400'}`} />
                                {role.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                발급 처리 중...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                공식 자격증서 PDF 발급 및 다운로드
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Official Certificate Paper Preview (A4 Ratio Portrait) */}
            <div className="w-full flex justify-center overflow-x-auto pb-6">
                <div
                    ref={certificateRef}
                    className="w-[660px] min-h-[940px] bg-[#fffdf9] p-12 sm:p-14 text-slate-900 relative shadow-2xl rounded-sm flex flex-col justify-between"
                    style={{
                        fontFamily: "'Nanum Myeongjo', 'Batang', serif",
                        border: "12px double #1e3a8a",
                        boxSizing: "border-box"
                    }}
                >
                    {/* Background Subtle Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <Shield className="w-[450px] h-[450px] text-blue-950" />
                    </div>

                    {/* Corner Ornaments */}
                    <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-600" />
                    <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-600" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-600" />
                    <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-600" />

                    {/* 1. Header & Serial Number */}
                    <div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                            <span className="font-mono font-bold text-slate-700">발급 등록번호 : {activeLicenseKey}</span>
                            <span className="text-amber-700 font-bold">산해원교회 산하 • 바라크아카데미</span>
                        </div>

                        {/* Certificate Title */}
                        <div className="text-center pt-6 pb-2">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.6em] text-slate-900 border-b-2 border-slate-900/20 pb-4 inline-block px-8">
                                자 격 증 서
                            </h1>
                        </div>
                    </div>

                    {/* 2. Personal Information */}
                    <div className="text-right pr-6 space-y-1 text-sm sm:text-base font-medium text-slate-800">
                        <div className="flex justify-end gap-6">
                            <span className="tracking-[0.5em] font-bold">성 명:</span>
                            <span className="font-extrabold text-lg min-w-[120px] text-left">{userName}</span>
                        </div>
                        <div className="flex justify-end gap-6">
                            <span className="tracking-[0.15em]">생년월일:</span>
                            <span className="min-w-[120px] text-left text-slate-700">{customBirthDate}</span>
                        </div>
                    </div>

                    {/* 3. Certificate Main Body Statement (원문 100% 반영) */}
                    <div className="my-4 px-4 sm:px-8 space-y-6 text-center">
                        <p className="text-base sm:text-lg leading-[2.2] text-slate-800 text-justify break-keep">
                            하나님께서 당신의 종 삼으시려 진작 성령으로 기름 부으신 바 된 귀하가 그 직무 수행을 위한 본원 제공의 필수 학과목 및 덕목 전 과정을 이수하였기로 날인된
                        </p>

                        {/* 3대 직무 자격 날인 테이블 */}
                        <div className="my-4 w-full border-2 border-slate-800 rounded-sm overflow-hidden bg-white shadow-inner">
                            <div className="grid grid-cols-3 divide-x-2 divide-slate-800 text-center font-bold">
                                {/* 바락 역 */}
                                <div className={`p-4 transition-all relative ${selectedRole === 'barak' ? 'bg-amber-50' : 'bg-white'}`}>
                                    <div className="text-xs text-slate-500 mb-1">바락 역</div>
                                    <div className="text-base sm:text-lg text-slate-900">전문 부목사</div>
                                    {selectedRole === 'barak' && (
                                        <div className="mt-2 inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-600 text-red-600 font-extrabold text-xs">
                                            날인
                                        </div>
                                    )}
                                </div>

                                {/* 야엘 역 */}
                                <div className={`p-4 transition-all relative ${selectedRole === 'jael' ? 'bg-amber-50' : 'bg-white'}`}>
                                    <div className="text-xs text-slate-500 mb-1">야엘 역</div>
                                    <div className="text-base sm:text-lg text-slate-900">평신도전도인</div>
                                    {selectedRole === 'jael' && (
                                        <div className="mt-2 inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-600 text-red-600 font-extrabold text-xs">
                                            날인
                                        </div>
                                    )}
                                </div>

                                {/* 드보라 역 */}
                                <div className={`p-4 transition-all relative ${selectedRole === 'deborah' ? 'bg-amber-50' : 'bg-white'}`}>
                                    <div className="text-xs text-slate-500 mb-1">드보라 역</div>
                                    <div className="text-base sm:text-lg text-slate-900">담임목사/선교사</div>
                                    {selectedRole === 'deborah' && (
                                        <div className="mt-2 inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-600 text-red-600 font-extrabold text-xs">
                                            날인
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-base sm:text-lg font-bold text-slate-900 pt-1 tracking-wide">
                            직무 자격이 있음을 증서 하여 드립니다.
                        </p>
                    </div>

                    {/* 4. Date & Official Signature / Seal */}
                    <div className="text-center pb-4 space-y-3">
                        <div className="text-base text-slate-700 tracking-widest font-medium">
                            {completionDate}
                        </div>

                        <div className="pt-1 relative flex flex-col items-center justify-center">
                            <div className="text-2xl sm:text-3xl font-extrabold tracking-widest text-slate-900">
                                바라크 아카데미
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 flex items-center justify-center gap-3">
                                <span>학장 Dr. 이윤주 (목사)</span>
                                {/* Red Official Seal Impression */}
                                <div className="w-14 h-14 rounded-full border-4 border-red-700 text-red-700 flex items-center justify-center text-[10px] font-extrabold leading-tight shadow-sm transform rotate-6 bg-red-50/20">
                                    바라크<br />학장인
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Verification & Legal Notice */}
                    <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-2.5 flex justify-between items-center px-2">
                        <span>* 산해원교회 산하 신학교 공인 사역자 자격증</span>
                        <span className="font-mono">온라인 진위 확인: https://barak.ac/certificate</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
