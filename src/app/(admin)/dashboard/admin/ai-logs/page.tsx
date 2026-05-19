"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Search, Tag, Clock } from "lucide-react";
import { AILog, db } from "@/lib/storage";

export default function AILogsPage() {
    const [logs, setLogs] = useState<AILog[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLogs(db.admin.aiLogs.getAll());
        }
        setIsLoading(false);
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.studentName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(logs.map(l => l.category).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">AI 로그 분석</h1>
                <p className="text-slate-500">학생들의 AI 상호작용 및 질문 내역을 모니터링합니다.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="질문 내용 또는 학생 이름 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
                    >
                        <option value="all">모든 카테고리</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Log Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl text-xs font-semibold text-slate-500 uppercase tracking-wider flex">
                    <div className="w-1/4">사용자 / 시간</div>
                    <div className="w-3/4">질문 및 내용</div>
                </div>
                <div className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">로그가 없습니다.</div>
                    ) : (
                        filteredLogs.map(log => (
                            <div key={log.id} className="p-4 flex flex-col md:flex-row gap-4 hover:bg-slate-50 transition-colors">
                                <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-between md:justify-start gap-1">
                                    <div className="font-medium text-slate-900">{log.studentName || "익명"}</div>
                                    <div className="flex items-center text-xs text-slate-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                    {log.category && (
                                        <div className="mt-1 md:mt-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {log.category}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-3/4">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 text-sm italic">
                                        <span className="font-semibold text-slate-900 not-italic mr-2">Q:</span>
                                        {log.query}
                                    </div>
                                    {log.responseSummary && (
                                        <div className="mt-2 text-sm text-slate-600 pl-2 border-l-2 border-slate-200">
                                            <span className="font-semibold text-slate-500 mr-2">AI 답변 요약:</span>
                                            {log.responseSummary}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
