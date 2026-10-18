"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 pt-28 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> 홈으로 돌아가기
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-900 text-white p-8 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-3">
                                <Lock className="w-3.5 h-3.5" /> PRIVACY POLICY
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight">
                                개인정보처리방침
                            </h1>
                            <p className="text-slate-300 text-sm mt-2">
                                산해원교회 바라크아카데미는 수강생의 개인정보와 신앙 정보를 관련 법령에 따라 안전하게 보호합니다.
                            </p>
                        </div>

                        <div className="p-8 md:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
                            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-slate-800 text-xs md:text-sm leading-relaxed">
                                <strong className="text-blue-950 block mb-1 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-blue-800" /> 개인정보 보호 원칙 안내
                                </strong>
                                산해원교회 산하 바라크아카데미(이하 &ldquo;아카데미&rdquo;)는 「개인정보 보호법」 등 관련 법령을 준수하며, 수강 신청 및 교육과정 운영에 필요한 최소한의 개인정보만을 적법하고 안전하게 처리합니다.
                            </div>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">1. 수집하는 개인정보 항목 및 수집 방법</h2>
                                <p>아카데미는 온라인 수강 신청, 수강 계정 생성, 학습 진도 및 수료증 발급 관리를 위해 다음과 같은 개인정보를 수집합니다.</p>
                                <ul className="list-disc list-inside space-y-1.5 pl-1 mt-2">
                                    <li>
                                        <strong>[필수 항목]</strong> 성명, 연락처(휴대전화번호), 이메일 주소(로그인 ID), 비밀번호(8자 이상), 소속 교회명, 직분/사역 구분, 희망 교육과정, 지원 동기 및 자기소개
                                    </li>
                                    <li>
                                        <strong>[선택 항목 (별도 동의)]</strong> 신앙 문답 정보(세례 여부, 성령 체험 여부 등)
                                        <span className="block text-xs text-slate-500 pl-5 mt-0.5">
                                            ※ 신앙 정보는 「개인정보 보호법」 제23조에 따른 민감정보(종교·신조 관련 정보)에 해당할 수 있으므로 일반 개인정보와 분리하여 별도의 선택 동의를 받으며, 동의하지 않아도 수강 신청 및 수료에 아무런 불이익이 없습니다.
                                        </span>
                                    </li>
                                    <li>
                                        <strong>[학습 과정에서 생성되는 정보]</strong> 강의 수강 진도율, 과목별 소감문 제출 내역, 수료번호 및 수료증 발급 일시
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">2. 개인정보의 수집 및 이용 목적</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li><strong>수강 신청 확인 및 본인 식별:</strong> 온라인 수강 신청서 접수, 승인 안내, 수강 계정 발급 및 로그인 인증</li>
                                    <li><strong>교육과정 운영 및 학사 지원:</strong> 2년 4학기(120강) 진도율 관리, 과목별 소감문 제출 확인, 공지사항 전달, 교육후원금 감면 대상 확인</li>
                                    <li><strong>수료증 발급 및 수료 확인:</strong> 과정 수료 시 수료증 발급, 고유 수료번호 부여 및 수료 확인 서비스 제공</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">3. 개인정보의 보유 및 이용기간</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>수강생의 개인정보는 원칙적으로 <strong>과정 수료일로부터 5년간 보관</strong>하며, 보관 기간 경과 후 지체 없이 파기합니다.</li>
                                    <li>다만, 수료생 본인의 재발급 요청 및 수료 사실 확인을 위해 최소한의 수료 대장 정보(성명, 이수 과정명, 수료번호, 수료일자)는 정보주체의 삭제 요청 시까지 보관할 수 있습니다.</li>
                                    <li>수강 신청 후 미승인되거나 개강 전 수강을 철회한 경우, 정보주체의 요청 시 즉시 삭제합니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">4. 개인정보 처리 위탁</h2>
                                <p className="text-slate-600 mb-2">
                                    아카데미는 안정적인 온라인 학습 시스템 및 데이터베이스 운영을 위하여 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs md:text-sm border-collapse border border-slate-200 bg-white">
                                        <thead className="bg-slate-100 text-slate-700">
                                            <tr>
                                                <th className="border border-slate-200 px-4 py-2.5 text-left font-bold">수탁업체명</th>
                                                <th className="border border-slate-200 px-4 py-2.5 text-left font-bold">위탁 업무 내용</th>
                                                <th className="border border-slate-200 px-4 py-2.5 text-left font-bold">보유 및 이용기간</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-slate-200 px-4 py-2.5 font-semibold">Supabase Inc.</td>
                                                <td className="border border-slate-200 px-4 py-2.5">클라우드 데이터베이스 저장, 회원 인증 및 시스템 인프라 운영</td>
                                                <td className="border border-slate-200 px-4 py-2.5">회원 탈퇴 또는 위탁 계약 종료 시까지 (수료 후 5년)</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-slate-200 px-4 py-2.5 font-semibold">Vercel Inc.</td>
                                                <td className="border border-slate-200 px-4 py-2.5">웹사이트 호스팅 및 웹 애플리케이션 전송</td>
                                                <td className="border border-slate-200 px-4 py-2.5">위탁 계약 종료 시까지</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">5. 개인정보의 파기 절차 및 방법</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li><strong>파기 절차:</strong> 보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 내부 방침에 따라 지체 없이 삭제합니다.</li>
                                    <li><strong>파기 방법:</strong> 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법(데이터베이스 영구 삭제)을 사용하여 파기하며, 종이 문서는 분쇄기로 분쇄하여 파기합니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">6. 정보주체의 권리·의무 및 행사방법</h2>
                                <p>
                                    수강생(정보주체)은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보 수집·이용에 대한 동의 철회 및 삭제(계정 탈퇴)를 요청할 수 있습니다. 마이페이지 또는 운영팀(caleb@barak.ac / 031-797-0153)으로 요청하시면 지체 없이 조치하겠습니다.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">7. 개인정보 보호책임자 및 담당 부서</h2>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs md:text-sm space-y-1">
                                    <p><strong>운영기관:</strong> 산해원교회 바라크아카데미 운영팀</p>
                                    <p><strong>책임자:</strong> 이갈렙 목사 (설립자·운영책임)</p>
                                    <p><strong>연락처:</strong> 031-797-0153 / 이메일: caleb@barak.ac</p>
                                    <p><strong>소재지:</strong> 경기도 광주시 초월읍 경충대로 1337-46</p>
                                </div>
                            </section>

                            <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                <p><strong>고지 일자 및 시행 일자:</strong> 2026년 10월 18일</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
