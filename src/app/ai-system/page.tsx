"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { Bot, Cpu, Lock, MessageSquare, Zap, Database } from "lucide-react";
import Image from "next/image";

export default function AiSystemPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[60vh] bg-white">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-purple-100/50 blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white z-20" />

                {/* Hero Image with Gradient Fade */}
                <div
                    className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2565&auto=format&fit=crop')] bg-cover bg-center"
                    style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)' }}
                />

                <div className="relative z-30 max-w-7xl mx-auto px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 shadow-sm animate-fade-in-up ring-1 ring-blue-100">
                        <Bot className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest uppercase">Caleb AI Engine v1.0</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight animate-fade-in-up delay-100 drop-shadow-sm">
                        Your Prophetic<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-300% animate-gradient">Co-Pilot</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        갈렙 AI는 단순한 챗봇이 아닙니다.<br />
                        신학적 깊이와 목회적 지혜를 학습한 <span className="text-slate-900 font-bold relative inline-block">
                            당신의 전담 멘토
                            <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200/50 -z-10 rounded-full"></span>
                        </span>입니다.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Database,
                                title: "Theological Knowledge Base",
                                desc: "검증된 개혁주의 신학과 성경 주석, 그리고 2,000년 교회사 데이터베이스를 탑재하여 정확하고 깊이 있는 신학적 답변을 제공합니다."
                            },
                            {
                                icon: MessageSquare,
                                title: "Sermon Assistant",
                                desc: "본문 분석, 예화 추천, 설교 개요 작성 등 설교 준비의 모든 과정을 보조합니다. 영감은 당신의 몫, 자료 준비는 AI가 돕습니다."
                            },
                            {
                                icon: Lock,
                                title: "Private & Secure",
                                desc: "모든 상담 내용과 설교 노트는 암호화되어 저장됩니다. 당신의 목회적 고민은 오직 당신과 AI 시스템만이 공유합니다."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Video Section */}
            <section className="py-24 bg-white relative border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            The Vision of Caleb AI
                        </h2>
                        <p className="text-slate-500 text-lg">
                            갈렙 AI가 열어갈 새로운 목회 패러다임을 확인해보세요.
                        </p>
                    </div>

                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200 group">
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/lK0NiqrrA00?rel=0&modestbranding=1"
                            title="Caleb AI Vision"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            {/* Tech Specs / How it works */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex items-center gap-16">
                        <div className="lg:w-1/2 mb-12 lg:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                LLM + RAG Technology
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Caleb AI는 최신 LLM(대형 언어 모델) 기술에 RAG(검색 증강 생성) 기술을 접목했습니다. 이는 AI가 할루시네이션(거짓 정보 생성) 없이, 우리가 구축한 신뢰할 수 있는 신학 데이터베이스 내에서 답변을 생성하도록 합니다.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time Context Processing",
                                    "Vector Database Embedding",
                                    "Semantic Search Capability",
                                    "Fine-tuned for Ministry Context"
                                ].map((spec, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        {spec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="relative bg-white rounded-3xl border border-slate-200 p-2 shadow-xl">
                                <div className="bg-slate-50 rounded-2xl p-6 h-[400px] flex items-center justify-center text-slate-500">
                                    {/* Abstract Visual Representation */}
                                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
                                        <div className="flex justify-between w-full max-w-sm">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-200 shadow-sm mb-2">
                                                    <Database className="text-blue-600" />
                                                </div>
                                                <div className="text-xs font-semibold">Theology DB</div>
                                            </div>
                                            <div className="text-center pt-8">
                                                <div className="animate-pulse flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 delay-75"></div>
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 delay-150"></div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-purple-200 shadow-sm mb-2">
                                                    <Bot className="text-purple-600" />
                                                </div>
                                                <div className="text-xs font-semibold">LLM Core</div>
                                            </div>
                                        </div>
                                        <div className="w-px h-16 bg-gradient-to-b from-slate-300 to-transparent"></div>
                                        <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 text-slate-900 font-mono text-sm shadow-md">
                                            Generated Insight
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
