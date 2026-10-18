"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Shield, FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
                                <FileText className="w-3.5 h-3.5" /> TERMS OF SERVICE
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight">
                                바라크아카데미 이용약관
                            </h1>
                            <p className="text-slate-300 text-sm mt-2">
                                산해원교회 산하 신학 아카데미 교육과정 운영 및 이용에 관한 약관
                            </p>
                        </div>

                        <div className="p-8 md:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
                            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-slate-800 text-xs md:text-sm leading-relaxed">
                                <strong className="text-amber-900 block mb-1 flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-amber-700" /> 교육과정 성격 고지
                                </strong>
                                본 과정은 교육부 인가 학위·자격 과정이 아닌 산해원교회 산하 신학 아카데미의 교회 교육 과정입니다. 수료 시 과정별 수료증을 드리며, 이는 국가·민간 자격이나 학위가 아닙니다. 사역 배치와 임명은 각 교회·교단의 절차를 따릅니다.
                            </div>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제1조 (목적)</h2>
                                <p>
                                    본 약관은 산해원교회 산하 바라크아카데미(이하 &ldquo;아카데미&rdquo;)가 운영하는 온라인 신학 아카데미 웹사이트(barak.ac) 및 관련 교육 서비스(이하 &ldquo;과정&rdquo;)의 이용 조건, 수강 신청 절차, 수료 기준, 교육후원금 운영 및 당사자의 권리·의무를 규정함을 목적으로 합니다.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제2조 (교육과정의 성격 및 법적 지위)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>아카데미가 제공하는 모든 교육과정(바락 부목사 과정, 드보라 담임목회 과정, 야엘 은사사역 과정)은 산해원교회의 위임을 받아 운영하는 교회 내부 성경·사역 교육과정입니다.</li>
                                    <li>본 과정은 「고등교육법」에 따른 학교(대학·신학대학원 등) 또는 「평생교육법」에 따른 학력인정 시설이 아니며, 교육부 인가 학위 과정을 운영하지 않습니다.</li>
                                    <li>본 과정 수료 시 발급되는 「수료증」은 아카데미의 2년 4학기(120강) 교육과정을 성실히 이수하였음을 증명하는 교회 교육 수료 문서이며, 「자격기본법」에 따른 국가자격 또는 등록·공인 민간자격이 아닙니다.</li>
                                    <li>수료 후 각 지교회 및 교단에서의 사역 배치, 직분 임명, 안수 등은 해당 교회와 교단의 고유 헌법 및 인사 절차를 따릅니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제3조 (수강 신청 및 계정 관리)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>수강을 희망하는 자는 본 약관과 개인정보 수집·이용에 동의한 후 온라인 수강 신청서를 작성하여 제출합니다.</li>
                                    <li>수강 신청 시 설정하는 계정 비밀번호는 보안 유지를 위해 8자 이상으로 설정해야 하며, 수강생 본인이 안전하게 관리해야 합니다.</li>
                                    <li>신앙 문답(세례 여부, 성령 체험 여부 등)은 선택 입력 사항이며, 이에 응답하거나 동의하지 않아도 수강 신청 및 승인에 불이익이 없습니다.</li>
                                    <li>운영팀은 제출된 신청서를 확인한 후 수강 승인 여부를 안내합니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제4조 (과정 구성 및 수료 기준)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>전체 교육과정은 2년 4학기(총 120강, 학기당 15주) 온라인 영상 강의로 구성됩니다.</li>
                                    <li>수료 요건은 ① 전 과정(120강) 영상 강의 수강 완료(진도율 100%) 및 ② 과목별(또는 강의별) A4 2장 분량의 소감문(설교문·묵상문) 작성·제출로 합니다.</li>
                                    <li>온라인 학습실의 &lsquo;아멘 / 수강 완료&rsquo; 버튼 및 갈렙 AI 도우미 기능은 수강생의 학습 진도 체크와 소감문 제출 편의를 돕는 자동화 도구입니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제5조 (수료증 발급 및 수료 확인)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>제4조의 수료 요건을 충족한 수강생에게는 산해원교회 바라크아카데미 학장 명의의 과정별 「수료증」이 발급됩니다.</li>
                                    <li>발급된 수료증에는 고유 수료번호가 부여되며, 웹사이트 내 「과정 수료증 발급센터」의 수료 확인 메뉴를 통해 아카데미 발급 여부를 확인할 수 있습니다.</li>
                                    <li>허위 작성, 대리 수강 등 부정한 방법으로 수료증을 발급받은 사실이 확인될 경우 아카데미는 해당 수료증의 효력을 취소할 수 있습니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제6조 (저작권 및 학습 자료 이용)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>아카데미가 자체 제작하여 제공하는 영상 강의, 강의안, 교재 등의 저작권은 산해원교회 바라크아카데미 또는 해당 강의 교수자에게 있습니다.</li>
                                    <li>수강생은 학습 목적 범위 내에서만 자료를 이용할 수 있으며, 사전 동의 없이 이를 복제·배포·상업적으로 이용할 수 없습니다.</li>
                                    <li>외부 공개 강의나 참고 영상이 안내되는 경우 해당 자료의 저작권과 출처는 원저작자 및 해당 기관에 귀속됩니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base md:text-lg font-bold text-slate-900">제7조 (교육후원금 운영)</h2>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                                    <li>바라크아카데미는 산해원교회의 교육 사역으로 운영되며, 수강생의 교육후원금으로 강의 제작과 시스템 운영비를 충당합니다.</li>
                                    <li>2년 전 과정(4학기, 120강)의 권장 교육후원금은 100만원입니다.</li>
                                    <li>2027년 1기 수강생 전원에게는 권장 후원금의 30% 감면(70만원)을 적용하며, 목회자 사모에게는 50% 감면(50만원)을 적용합니다.</li>
                                    <li>경제적 형편이 어려운 수강 희망자는 운영팀과 별도로 상의하여 후원금 감면 또는 분할 납부 등을 조율할 수 있습니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                <h2 className="text-base md:text-lg font-bold text-blue-950">제8조 (수강 취소 및 교육후원금 반환·중단 기준)</h2>
                                <p className="text-slate-600 mb-2">
                                    수강생이 개인 사정 등으로 수강을 취소하거나 중단하는 경우, 아카데미는 다음 기준에 따라 교육후원금을 반환 또는 정산합니다.
                                </p>
                                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-700">
                                    <li><strong>개강 전 또는 강의 수강 개시 전 취소:</strong> 납부한 교육후원금 전액 반환</li>
                                    <li><strong>전체 과정의 1/3 경과 전(또는 40강 미만 수강 시) 중단 요청:</strong> 납부 후원금의 2/3 해당액 반환</li>
                                    <li><strong>전체 과정의 1/2 경과 전(또는 60강 미만 수강 시) 중단 요청:</strong> 납부 후원금의 1/2 해당액 반환</li>
                                    <li><strong>전체 과정의 1/2 이상 경과 후(또는 60강 이상 수강 시):</strong> 원칙적으로 반환하지 않으나, 질병·장기 입원 등 불가피한 사유가 있는 경우 운영팀과 협의하여 조정할 수 있습니다.</li>
                                    <li>반환 요청은 운영팀 이메일(caleb@barak.ac) 또는 유선(031-797-0153)으로 접수하며, 접수일로부터 영업일 기준 7일 이내에 처리합니다.</li>
                                </ol>
                            </section>

                            <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                <p><strong>부칙</strong></p>
                                <p>본 약관은 2026년 10월 18일부터 시행합니다.</p>
                                <p>운영기관: 산해원교회 바라크아카데미 | 소재지: 경기도 광주시 초월읍 경충대로 1337-46 | 문의: 031-797-0153 / caleb@barak.ac</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
