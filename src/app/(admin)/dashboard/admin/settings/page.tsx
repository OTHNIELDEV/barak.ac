"use client";

import React from "react";
import { Settings, Bell, Lock, Database } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">플랫폼 설정</h1>
                <p className="text-slate-500">글로벌 애플리케이션 설정을 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-800">알림 설정</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">이메일 알림 및 시스템 공지를 관리합니다.</p>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-400 w-full text-left bg-slate-50">알림 구성하기</button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Lock className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-800">보안 및 접근 권한</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">비밀번호 정책 및 API 접근을 설정합니다.</p>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-400 w-full text-left bg-slate-50">보안 관리</button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Database className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-800">백업 및 유지보수</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">데이터베이스 백업을 다운로드하고 로그를 확인합니다.</p>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-400 w-full text-left bg-slate-50">시스템 로그</button>
                </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex items-center justify-center">
                이 데모 환경에서는 설정을 변경할 수 없습니다.
            </div>
        </div>
    );
}
