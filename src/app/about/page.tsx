"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { Shield, Heart, Users, Sparkles, ArrowRight, ScrollText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* 1. Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[55vh] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse-slow" />
                    <div className="absolute top-[30%] -right-[10%] w-[50%] h-[60%] rounded-full bg-amber-500/15 blur-[120px] animate-pulse-slow delay-1000" />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Barak Academy Vision & Theology</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight"
                    >
                        바라크 아카데미<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                            설립 취지 및 목적
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        하나님 앞에 겸손히 무릎 꿇는 영성(<span className="text-amber-300 font-medium">ברך</span>)으로 새 시대 사역자를 세웁니다.
                    </motion.p>
                </div>
            </section>

            {/* 2. 3 Key Biblical Archetypes (Barak, Deborah, Jael) */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">3 Biblical Archetypes</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                            바라크아카데미 3대 사역 모델
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. Barak - Assistant Pastor */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-6">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-bold text-blue-900 bg-blue-200/60 px-3 py-1 rounded-full uppercase">
                                    바락 (Barak) • 충성된 부목사
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">
                                    더 나은 존귀를 얻은 부목사
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    담임목사 역 여선지 사사 드보라를 백성들 앞에 존귀히 여김 받도록 시종일관 보좌하여, 그 사사보다 오히려 <strong>[히 11:35] 더 좋은 부활, [히 11:32] 더 나은 존귀</strong>를 얻은 충성된 부목사의 원형입니다.
                                </p>
                            </div>
                        </div>

                        {/* 2. Deborah - Senior Pastor / Leader */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full uppercase">
                                    드보라 (Deborah) • 담임목사
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">
                                    말씀과 영적 통찰의 여선지자
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    하나님의 말씀을 받아 백성을 재판하고 영적 방향을 제시한 여선지 사사로서, 오늘날 시대를 분별하고 양 떼를 먹이는 <strong>영적 지도자</strong>의 모형입니다.
                                </p>
                            </div>
                        </div>

                        {/* 3. Jael - Lay Minister */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center mb-6">
                                    <Heart className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-bold text-purple-900 bg-purple-200/60 px-3 py-1 rounded-full uppercase">
                                    야엘 (Jael) • 평신도 사역자
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">
                                    결정적 승리를 거둔 평신도
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    평민 여성으로서 결행한 일로 [삿 5:24-27] 바락과 드보라의 찬양을 받고, 온 백성으로 하여금 빌립, 스데반 집사같이 하나님께 영광을 돌리게 한 <strong>평신도 사역자</strong>의 표상입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Recommendation Message (학장 이윤주 박사의 추천의 말씀) */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-slate-800/90 rounded-3xl p-8 md:p-14 shadow-2xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <ScrollText className="w-8 h-8 text-amber-400" />
                            <span className="text-xs md:text-sm font-bold text-amber-400 tracking-widest uppercase">Special Recommendation</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                            추천의 말씀 <span className="text-lg font-normal text-slate-400">- 학장 이윤주 박사 (목사)</span>
                        </h2>

                        <div className="space-y-6 text-slate-200 text-base md:text-lg leading-relaxed font-light">
                            <p className="bg-slate-900/80 p-6 rounded-2xl border-l-4 border-amber-400 font-normal text-slate-100 shadow-inner">
                                “현재의 교단 신학 기관들로 남종, 담임목사 양성은 모자람이 없음 때문으로 본 아카데미 프로그램이 남종보다는 <strong>여종</strong>, 담임목사보다는 <strong>전문 부목사</strong>에 비중이 주어졌음입니다.”
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-700/70">
                                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-amber-400" />
                                        현역 목사 및 사모님들께
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        성령과 불의 세례로 각양 은사를 받았음에도 제도적 직임 자격이 주어지지 않아 바락·드보라로 온전히 동사하지 못하고 계신 분들에게 거룩한 사역의 문을 활짝 열어드립니다.
                                    </p>
                                </div>

                                <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-700/70">
                                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-amber-400" />
                                        은퇴 및 원로 목회자(65세 이상) 분들께
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        100세 시대에 65세 은퇴 후 원로·은퇴 목사 지위로 여생을 채우시기보다, 본원의 '바락'과 같은 충성된 전문 부목자로 헌신한다면 <strong>[히 11:35b] 더 좋은 부활, [히 11:32] 더 큰 존귀함</strong>에 이름이 기록될 것입니다!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Director Profile Card */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            {/* Profile Left */}
                            <div className="lg:col-span-5 text-center">
                                <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden mb-6 border-4 border-amber-400/90 shadow-2xl">
                                    <Image
                                        src="/images/faculty/lee-yoonju.jpg"
                                        alt="이윤주 박사 (학장 / 목사)"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white">이윤주 박사 <span className="text-sm text-amber-300 font-normal">(학장 / 목사)</span></h3>
                                <p className="text-amber-300 font-medium text-xs mt-1 mb-4">바라크아카데미 학장 / 산해원교회 담임목사</p>
                                
                                <div className="text-left bg-black/30 rounded-2xl p-4 space-y-1.5 text-xs text-slate-200 border border-white/10">
                                    <p>• 이화여자대학교 신학대학원 졸업 (Th.M)</p>
                                    <p>• 호서대학교 일반대학원 구약학 졸업 (Ph.D)</p>
                                    <p>• 제이합미션(JHOP Mission) 대표</p>
                                    <p>• 한국기독교신학교협의회(한기신협) 이사</p>
                                    <p>• 산해원교회 담임목사</p>
                                    <p>• 바라크아카데미 학장</p>
                                </div>
                            </div>

                            {/* Message Right */}
                            <div className="lg:col-span-7 space-y-5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
                                    Director's Message
                                </div>
                                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                    “이 부르심은 하나님께서 주신<br />
                                    마지막 거룩한 사명입니다.”
                                </h2>
                                <p className="text-slate-200 text-sm md:text-base leading-relaxed font-light">
                                    바라크아카데미는 성령의 불세례를 받고도 사역의 길을 찾지 못하던 여종들과 충성된 부목자들을 위해 예비된 하나님의 섭리입니다. 지식의 신학을 넘어 영성과 권능이 겸비된 참된 리더십의 길에 동참하시길 축복합니다.
                                </p>
                                <div className="pt-4 flex gap-4">
                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg"
                                    >
                                        입학 원서 접수 <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/curriculum"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                                    >
                                        교육과정 안내
                                    </Link>
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
