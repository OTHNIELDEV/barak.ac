"use client";

import React, { useEffect, useState } from "react";
import { Award, ShieldAlert, CheckCircle, Search, Filter, Printer, Plus, X } from "lucide-react";
import { CertificateIssued, db } from "@/lib/storage";

export default function CertificateManagementPage() {
    const [certificates, setCertificates] = useState<CertificateIssued[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Issue Modal
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [newCert, setNewCert] = useState({ studentName: "", trackTitle: "", licenseKey: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (typeof window !== "undefined") {
            setCertificates(db.admin.certificates.getAll());
        }
        setIsLoading(false);
    };

    const handleRevoke = (id: string) => {
        if (confirm("정말로 이 자격증을 취소하시겠습니까? 인증 키가 비활성화됩니다.")) {
            db.admin.certificates.revoke(id);
            loadData();
        }
    };

    const handleIssue = (e: React.FormEvent) => {
        e.preventDefault();
        const key = newCert.licenseKey || `LIC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        db.admin.certificates.issue({
            studentId: `manual_${Date.now()}`,
            studentName: newCert.studentName,
            trackId: 0,
            trackTitle: newCert.trackTitle,
            licenseKey: key
        });

        loadData();
        setIsIssueModalOpen(false);
        setNewCert({ studentName: "", trackTitle: "", licenseKey: "" });
        alert("자격증이 발급되었습니다.");
    };

    const filteredCerts = certificates.filter(c =>
        c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.licenseKey.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">자격증 관리</h1>
                    <p className="text-slate-500">발급된 자격증을 조회하고 검증합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsIssueModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" /> 직접 발급
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        <Printer className="w-4 h-4 mr-2" /> 내역 내보내기
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="학생 이름 또는 자격증 번호 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50">
                    <Filter className="w-4 h-4" /> 필터
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">학생 이름</th>
                            <th className="px-6 py-4 font-medium">수료 과정 (트랙)</th>
                            <th className="px-6 py-4 font-medium">발급일</th>
                            <th className="px-6 py-4 font-medium">라이선스 / 상태</th>
                            <th className="px-6 py-4 font-medium text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCerts.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">발급된 자격증이 없습니다.</td></tr>
                        ) : (
                            filteredCerts.map(cert => (
                                <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{cert.studentName}</td>
                                    <td className="px-6 py-4 text-slate-600">{cert.trackTitle}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">{cert.licenseKey}</code>
                                            {cert.status === 'active' ? (
                                                <span className="flex items-center text-xs text-emerald-600 font-medium">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> 유효함
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-xs text-red-600 font-medium">
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> 취소됨
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {cert.status === 'active' && (
                                            <button
                                                onClick={() => handleRevoke(cert.id)}
                                                className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:bg-red-50 px-3 py-1 rounded"
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-800">자격증 수기 발급</h3>
                            <button onClick={() => setIsIssueModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleIssue} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">학생 이름</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={newCert.studentName} onChange={e => setNewCert({ ...newCert, studentName: e.target.value })} placeholder="학생명" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">과정명 (트랙)</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={newCert.trackTitle} onChange={e => setNewCert({ ...newCert, trackTitle: e.target.value })} placeholder="예: Deborah Track" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">라이선스 키 (선택)</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={newCert.licenseKey} onChange={e => setNewCert({ ...newCert, licenseKey: e.target.value })} placeholder="비워두면 자동 생성됨" />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">취소</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">발급하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
