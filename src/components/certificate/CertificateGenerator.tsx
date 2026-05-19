"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";

interface CertificateGeneratorProps {
    userName: string;
    courseTitle: string;
    completionDate: string;
}

export function CertificateGenerator({ userName, courseTitle, completionDate }: CertificateGeneratorProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                backgroundColor: "#fffbef", // Parchment color
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("barak_academy_certificate.pdf");
        } catch (error) {
            console.error("Certificate generation failed:", error);
            alert("수료증 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Certificate Preview Area */}
            <div className="relative w-full max-w-[800px] aspect-[1.414/1] shadow-2xl overflow-hidden rounded-sm">
                <div
                    ref={certificateRef}
                    className="w-full h-full bg-[#fffbef] p-12 flex flex-col items-center text-center justify-between relative"
                    style={{
                        fontFamily: "serif",
                        border: "20px double rgba(15, 23, 42, 0.2)" // primary/20
                    }}
                >
                    {/* Decorative Corners */}
                    <div className="absolute top-4 left-4 w-16 h-16" style={{ borderTop: "4px solid rgba(15, 23, 42, 0.4)", borderLeft: "4px solid rgba(15, 23, 42, 0.4)" }} />
                    <div className="absolute top-4 right-4 w-16 h-16" style={{ borderTop: "4px solid rgba(15, 23, 42, 0.4)", borderRight: "4px solid rgba(15, 23, 42, 0.4)" }} />
                    <div className="absolute bottom-4 left-4 w-16 h-16" style={{ borderBottom: "4px solid rgba(15, 23, 42, 0.4)", borderLeft: "4px solid rgba(15, 23, 42, 0.4)" }} />
                    <div className="absolute bottom-4 right-4 w-16 h-16" style={{ borderBottom: "4px solid rgba(15, 23, 42, 0.4)", borderRight: "4px solid rgba(15, 23, 42, 0.4)" }} />

                    {/* Header */}
                    <div className="mt-8 space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(15, 23, 42, 0.1)" }}>
                            <svg className="w-12 h-12" style={{ color: "#0f172a" }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.8L18.6 19H5.4L12 5.8z" /></svg>
                        </div>
                        <h1 className="text-5xl font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "serif", color: "#111827" }}>Certificate</h1>
                        <p className="text-xl uppercase tracking-widest" style={{ color: "#6b7280" }}>of Completion</p>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col justify-center items-center w-full space-y-8">
                        <p className="text-lg italic" style={{ color: "#4b5563" }}>This is to certify that</p>

                        <h2 className="text-4xl font-bold pb-2 px-12 min-w-[300px]" style={{ color: "#0f172a", borderBottom: "2px solid rgba(15, 23, 42, 0.2)" }}>
                            {userName}
                        </h2>

                        <p className="text-lg italic" style={{ color: "#4b5563" }}>
                            has successfully completed the curriculum requirements for
                        </p>

                        <h3 className="text-3xl font-bold" style={{ color: "#1f2937" }}>
                            {courseTitle}
                        </h3>

                        <p className="text-base max-w-lg" style={{ color: "#6b7280" }}>
                            바락 아카데미의 모든 교육 과정을 성실히 이수하였음을 증명합니다.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end mt-12 px-8">
                        <div className="text-center">
                            <p className="text-lg font-bold pt-2 px-4 min-w-[150px]" style={{ color: "#1f2937", borderTop: "1px solid #9ca3af" }}>
                                {completionDate}
                            </p>
                            <p className="text-xs uppercase mt-1" style={{ color: "#6b7280" }}>Date</p>
                        </div>

                        <div className="text-center">
                            {/* Signature */}
                            <div className="font-script text-3xl mb-2" style={{ fontFamily: 'cursive', color: "#0f172a" }}>
                                Rev. Caleb Lee
                            </div>
                            <p className="text-lg font-bold pt-2 px-4 min-w-[150px]" style={{ color: "#1f2937", borderTop: "1px solid #9ca3af" }}>
                                Rev. Caleb Lee
                            </p>
                            <p className="text-xs uppercase mt-1" style={{ color: "#6b7280" }}>Director</p>
                        </div>
                    </div>

                    {/* License No */}
                    <div className="absolute bottom-4 text-[10px] font-mono" style={{ color: "#9ca3af" }}>
                        License No: BA-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </div>
                </div>
            </div>

            <div className="text-center max-w-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">축하합니다!</h2>
                <p className="text-gray-600 mb-8">
                    모든 과정을 성공적으로 수료하셨습니다. <br />
                    이제 이 수료증은 단순한 종이가 아닌, 새로운 사역의 시작을 알리는 증표입니다.
                </p>

                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary/90 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            생성 중...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            수료증 다운로드 (PDF)
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
