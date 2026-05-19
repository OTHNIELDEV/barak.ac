"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { Shield, Target, Heart, Globe, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* Hero Section */}

            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[50vh] bg-white">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-purple-100/50 blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white z-20" />

                {/* Hero Image with Gradient Fade */}
                <div
                    className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center"
                    style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)' }}
                />

                <div className="relative z-30 max-w-7xl mx-auto px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 shadow-sm animate-fade-in-up ring-1 ring-blue-100">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest uppercase">Academy Vision</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight animate-fade-in-up delay-100 drop-shadow-sm">
                        아카데미 비전
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        바라크 아카데미는 마지막 때를 준비하며,<br />
                        하나님의 말씀과 성령의 능력으로 무장된 <span className="text-slate-900 font-bold relative inline-block">
                            실전형 영적 리더
                            <span className="absolute bottom-1 left-0 w-full h-2 bg-yellow-200/50 -z-10 rounded-full"></span>
                        </span>를 양성합니다.
                    </p>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-900">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Establishment Purpose</h2>
                    <p className="text-lg text-slate-600 leading-8 mb-12">
                        현대 교회는 전례 없는 도전 앞에 서 있습니다. 전통적인 신학 교육만으로는 급변하는 시대와 영적 전쟁의 현장에 즉각적으로 대응하기 어렵습니다. 바라크 아카데미는 <strong className="text-blue-900">"드보라의 영적 통찰력과 바라크의 전략적 실행력"</strong>을 겸비한 사역자를 길러내기 위해 설립되었습니다. 우리는 학문적 지식을 넘어, 사역 현장에서 즉시 적용 가능한 실무 능력과 영성을 배양하는 데 집중합니다.
                    </p>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Core Values</h2>
                        <p className="mt-4 text-slate-600">우리가 지키고 따르는 핵심 가치입니다.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Biblical Truth",
                                desc: "타협하지 않는 성경적 진리 수호. 모든 가르침은 오직 기록된 하나님의 말씀에 기초합니다."
                            },
                            {
                                icon: Heart,
                                title: "Spirit-Filled Life",
                                desc: "성령의 임재와 동행하는 삶. 지성을 넘어선 영성의 깊이를 추구하며 기도의 능력을 체험합니다."
                            },
                            {
                                icon: Globe,
                                title: "Global Mission",
                                desc: "열방을 향한 선교적 사명. 지역 교회를 넘어 열방을 품고 나아가는 하나님 나라의 확장을 꿈꿉니다."
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-900">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder's Message */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-900 rounded-3xl p-8 md:p-12 lg:flex items-center gap-12 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                        <div className="lg:w-1/3 mb-8 lg:mb-0 relative">
                            <div className="aspect-[4/5] bg-slate-300 rounded-2xl overflow-hidden shadow-2xl relative group">
                                {/* Placeholder for Founder Image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500">
                                    <Users className="w-16 h-16 mb-2" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <div className="font-bold text-xl">Rev. Caleb Lee</div>
                                    <div className="text-sm text-blue-200">Founder & President</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 text-white">
                            <h2 className="text-3xl font-bold mb-6">설립자의 인사말</h2>
                            <div className="space-y-6 text-blue-100 text-lg leading-relaxed">
                                <p>
                                    "사랑하는 동역자 여러분, 지금은 깨어 기도할 때입니다. 하나님께서는 마지막 추수를 위해 준비된 일꾼을 찾고 계십니다."
                                </p>
                                <p>
                                    바라크 아카데미는 단순한 지식 전달의 장이 아닙니다. 이곳은 영적 야성을 회복하고, 거룩한 군사로 훈련받는 훈련소입니다. AI 기술은 도구일 뿐입니다. 그 도구를 사용하는 사람의 영성이 무엇보다 중요합니다.
                                </p>
                                <p>
                                    이곳에서 여러분의 부르심을 확인하고, 하나님 나라의 거룩한 전략가로 거듭나시기를 축복합니다.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
