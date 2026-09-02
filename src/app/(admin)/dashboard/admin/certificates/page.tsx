"use client";

import React, { useEffect, useState } from "react";
import { Award, ShieldAlert, CheckCircle, Search, Filter, Printer, Plus, X, Download, RefreshCw, Loader2 } from "lucide-react";
import { CertificateIssued, db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";

export default function CertificateManagementPage() {
    const [certificates, setCertificates] = useState<CertificateIssued[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Issue Modal
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [newCert, setNewCert] = useState({ studentName: "", trackTitle: "바라크 트랙 (전문 부목사)", trackRole: "barak" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const remote = await supabaseDb.admin.certificates.getAll();
            if (remote && remote.length > 0) {
                setCertificates(remote);
                setIsLoading(false);
                return;
            }
        } catch (e) {
            console.warn("Supabase certificate load fallback to local:", e);
        }

        if (typeof window !== "undefined") {
            setCertificates(db.admin.certificates.getAll());
        }
        setIsLoading(false);
    };

    const handleRevoke = async (id: string) => {
        if (confirm("정말로 이 자격증을 취소하시겠습니까? 등록번호가 비활성화됩니다.")) {
            try {
                await supabaseDb.admin.certificates.revoke(id);
            } catch (e) {
                console.warn("Supabase revoke error:", e);
            }
            db.admin.certificates.revoke(id);
            await loadData();
        }
    };

    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        const rolePrefix = newCert.trackRole.toUpperCase();
        const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        const licenseKey = `BA-${new Date().getFullYear()}-${rolePrefix}-${randomKey}`;

        const certData = {
            studentId: `manual_${Date.now()}`,
            studentName: newCert.studentName,
            trackId: newCert.trackRole === 'barak' ? 1 : newCert.trackRole === 'deborah' ? 2 : 3,
            trackTitle: newCert.trackTitle,
            licenseKey
        };

        try {
            await supabaseDb.admin.certificates.issue(certData);
        } catch (e) {
            console.warn("Supabase manual issue fallback to local:", e);
        }

        db.admin.certificates.issue(certData);

        await loadData();
        setIsIssueModalOpen(false);
        setNewCert({ studentName: "", trackTitle: "바라크 트랙 (전문 부목사)", trackRole: "barak" });
        alert(`공식 자격증서가 성공적으로 발급되었습니다.\n발급번호: ${licenseKey}`);
    };

    const filteredCerts = certificates.filter(c =>
        c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.trackTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-500" /> 자격증 발급 및 공인 관리 (Supabase 동기화)
                    </h1>
                    <p className="text-slate-500 text-sm">
                        산해원교회 산하 바라크아카데미에서 자동 및 수동 발급된 공식 자격증서를 실시간 조회/관리합니다.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadData}
                        className="flex items-center px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs transition-colors"
                        title="새로고침"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} /> 새로고침
                    </button>
                    <button
                        onClick={() => setIsIssueModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-bold text-xs transition-colors shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> 관리자 직접 발급
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="성명, 발급 등록번호(BA-2026-...), 과정명 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">수료자 성명</th>
                            <th className="px-6 py-4 font-medium">이수 과정 (트랙)</th>
                            <th className="px-6 py-4 font-medium">발급일시</th>
                            <th className="px-6 py-4 font-medium">공인 등록번호 / 상태</th>
                            <th className="px-6 py-4 font-medium text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-900" />자격증 데이터를 불러오는 중...</td></tr>
                        ) : filteredCerts.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">발급된 자격증 내역이 없습니다.</td></tr>
                        ) : (
                            filteredCerts.map(cert => (
                                <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{cert.studentName}</td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{cert.trackTitle}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-blue-900 font-mono font-bold">{cert.licenseKey}</code>
                                            {cert.status === 'active' ? (
                                                <span className="flex items-center text-[11px] text-emerald-600 font-bold">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> 정식 유효 (Active)
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-[11px] text-rose-600 font-bold">
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> 발급 취소됨 (Revoked)
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {cert.status === 'active' && (
                                            <button
                                                onClick={() => handleRevoke(cert.id)}
                                                className="text-xs text-rose-600 hover:text-rose-800 font-bold border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                발급 취소
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Issue Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4 text-blue-900" /> 공식 사역자 자격증 수동 발급
                            </h3>
                            <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleIssue} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">수료자 성명 *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCert.studentName}
                                    onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                                    placeholder="예: 김바라크"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">직무 자격 트랙 선택 *</label>
                                <select
                                    value={newCert.trackRole}
                                    onChange={(e) => setNewCert({
                                        ...newCert,
                                        trackRole: e.target.value,
                                        trackTitle: e.target.value === 'barak' ? "바라크 트랙 (전문 부목사)" : e.target.value === 'deborah' ? "드보라 트랙 (담임목사/선교사)" : "야엘 트랙 (평신도전도인)"
                                    })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm bg-white"
                                >
                                    <option value="barak">바락 역 (전문 부목사) - 목사 자격</option>
                                    <option value="deborah">드보라 역 (담임목사/선교사) - 목사/선교사 자격</option>
                                    <option value="jael">야엘 역 (평신도전도인) - 전도사 자격</option>
                                </select>
                            </div>
                            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsIssueModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 shadow-md"
                                >
                                    자격증 발급 실행
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
