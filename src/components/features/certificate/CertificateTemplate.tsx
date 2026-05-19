"use client";

import { forwardRef } from "react";
import { Shield } from "lucide-react";

interface CertificateTemplateProps {
    userName: string;
    courseTitle: string;
    completionDate: string;
    licenseNumber: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
    ({ userName, courseTitle, completionDate, licenseNumber }, ref) => {
        return (
            <div
                ref={ref}
                className="w-[800px] h-[600px] bg-[#fffbef] p-8 text-center relative mx-auto shadow-2xl overflow-hidden"
                style={{ fontFamily: "'Times New Roman', serif" }}
            >
                <div className="w-full h-full border-4 border-double border-blue-900/30 p-8 flex flex-col items-center justify-between relative">

                    {/* Background Seal */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                        <Shield className="w-96 h-96 text-blue-900" />
                    </div>

                    {/* Header */}
                    <div className="space-y-4 w-full border-b border-blue-900/10 pb-6">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <Shield className="w-8 h-8 text-blue-900 fill-yellow-500" />
                            <span className="text-xl font-bold tracking-widest text-blue-900">BARAK ACADEMY</span>
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 uppercase tracking-widest">
                            Certificate of Completion
                        </h1>
                        <p className="text-sm font-bold text-yellow-600 uppercase tracking-[0.5em] mt-2">
                            Official Certification
                        </p>
                    </div>

                    {/* Body */}
                    <div className="space-y-6 my-auto relative z-10 w-full">
                        <p className="text-xl text-slate-600 italic">This certifies that</p>
                        <h2 className="text-4xl font-bold text-blue-900 border-b-2 border-slate-300 inline-block px-12 pb-2 min-w-[400px]">
                            {userName}
                        </h2>
                        <p className="text-lg text-slate-600 italic">
                            has successfully completed the customized curriculum for
                        </p>
                        <h3 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">
                            {courseTitle}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed mt-4">
                            위 사람은 바락 아카데미의 소정의 과정을 성실히 이수하였으며,
                            성령의 기름부으심 안에서 배운 바를 사역 현장에 적용할 준비가 되었음을 증명합니다.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end px-12 pt-6 border-t border-blue-900/10">
                        <div className="text-center">
                            <div className="text-lg font-bold text-slate-800">{completionDate}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider border-t border-slate-300 pt-1 mt-2 w-32 mx-auto">
                                Date
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="font-cursive text-2xl text-blue-900 mb-1" style={{ fontFamily: 'cursive' }}>
                                Rev. Caleb Lee
                            </div>
                            <div className="text-lg font-bold text-slate-800">Rev. Caleb Lee</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider border-t border-slate-300 pt-1 mt-2 w-48 mx-auto">
                                Academy Director
                            </div>
                        </div>
                    </div>

                    {/* License Number */}
                    <div className="absolute bottom-4 right-8 text-[10px] text-slate-400 font-mono tracking-widest">
                        LICENSE NO: {licenseNumber}
                    </div>
                </div>
            </div>
        );
    }
);

CertificateTemplate.displayName = "CertificateTemplate";
