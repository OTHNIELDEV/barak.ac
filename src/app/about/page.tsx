"use client";

import { useState, useEffect } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Shield, Heart, Users, Sparkles, ArrowRight, ScrollText, Play, Clock, ExternalLink, X, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SermonVideo {
    id: string;
    partLabel: string;
    title: string;
    duration: string;
    views: string;
    youtubeId: string;
    description: string;
}

const recommendationVideos: SermonVideo[] = [
    {
        id: "part-1",
        partLabel: "제1편 (상)",
        title: "바라크 부목사 아카데미 (상)",
        duration: "66분",
        views: "조회 199",
        youtubeId: "bkDyECVeCIc",
        description: "드보라와 바락, 담임과 부목의 모델 — 사사기 4~5장 · 히브리서 11:32 | 바라크 부목사 아카데미 1부",
    },
    {
        id: "part-2",
        partLabel: "제2편 (하)",
        title: "바라크 부목사 아카데미 (하)",
        duration: "52분",
        views: "조회 117",
        youtubeId: "R4jTPLqnchI",
        description: "마지막 때, 여성 사역자를 세우라 — 남종과 여종 (요엘 2:28, 행 2:17) | 바라크 부목사 아카데미 2부",
    },
];

export default function AboutPage() {
    const [selectedVideo, setSelectedVideo] = useState<SermonVideo | null>(null);

    useEffect(() => {
        if (!selectedVideo) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedVideo(null);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedVideo]);

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

            {/* 3. Recommendation Message (설립자 이갈렙 목사의 추천의 말씀) */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-slate-800/90 rounded-3xl p-8 md:p-14 shadow-2xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <ScrollText className="w-8 h-8 text-amber-400" />
                            <span className="text-xs md:text-sm font-bold text-amber-400 tracking-widest uppercase">Special Recommendation</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                            추천의 말씀 <span className="text-lg font-normal text-slate-400">- 설립자 이갈렙 목사</span>
                        </h2>

                        <div className="space-y-6 text-slate-200 text-base md:text-lg leading-relaxed font-light">
                            <p className="bg-slate-900/80 p-6 rounded-2xl border-l-4 border-amber-400 font-normal text-slate-100 shadow-inner">
                                “현재의 교단 신학 기관들로 남종, 담임목사 양성은 모자람이 없음 때문으로 본 아카데미 프로그램은 남종보다는 <strong>여종</strong>, 담임목사보다는 <strong>전문 부목사</strong>에 비중을 두고 있습니다.”
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-700/70">
                                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-amber-400" />
                                        현역 목사 및 사모님들께
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        성령의 은사와 사모함이 있음에도 말씀과 사역 훈련의 기회를 찾지 못하셨던 분들에게 배움과 동역의 길을 활짝 열어드립니다.
                                    </p>
                                </div>

                                <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-700/70">
                                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-amber-400" />
                                        은퇴 및 원로 목회자 분들께
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        100세 시대에 은퇴 후 원로·은퇴 목사 지위로 여생을 채우시기보다, 본원의 '바락'과 같은 충성된 전문 부목자로 헌신한다면 <strong>[히 11:35b] 더 좋은 부활, [히 11:32] 더 큰 존귀함</strong>에 이름이 기록될 것입니다!
                                    </p>
                                </div>
                            </div>

                            {/* 바라크아카데미 설명 영상 — 2편 */}
                            <div className="pt-8 mt-8 border-t border-slate-700/80">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase mb-2.5">
                                            <Video className="w-3.5 h-3.5 text-amber-400" />
                                            바라크아카데미 설명 영상 — 2편
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-extrabold text-white">
                                            설립자 이갈렙 목사 특별 설명 설교 <span className="text-amber-400 font-bold">(상·하)</span>
                                        </h3>
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-400 flex items-center gap-1.5">
                                        <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        영상을 클릭하면 화면 중앙 팝업에서 바로 시청하실 수 있습니다
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendationVideos.map((video) => (
                                        <button
                                            key={video.id}
                                            type="button"
                                            onClick={() => setSelectedVideo(video)}
                                            className="group relative text-left rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/70 transition-all duration-300 shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1 flex flex-col focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                                        >
                                            {/* 썸네일 영역 */}
                                            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                                                <Image
                                                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.82] group-hover:brightness-95"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/20" />

                                                {/* 상단 파트 배지 */}
                                                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                                                    <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-amber-400/40 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide shadow">
                                                        {video.partLabel}
                                                    </span>
                                                </div>

                                                {/* 우측 상단 재생시간 배지 */}
                                                <div className="absolute top-3.5 right-3.5">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/10">
                                                        <Clock className="w-3 h-3 text-amber-400" />
                                                        {video.duration}
                                                    </span>
                                                </div>

                                                {/* 중앙 플레이 버튼 */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative flex items-center justify-center">
                                                        <div className="absolute -inset-3 rounded-full bg-amber-500/20 group-hover:bg-amber-500/35 animate-ping duration-1000" />
                                                        <div className="absolute -inset-1.5 rounded-full bg-amber-400/30 blur-md group-hover:bg-amber-400/50 transition-all" />
                                                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300">
                                                            <Play className="w-6 h-6 fill-slate-950 text-slate-950 ml-0.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 하단 설명 영역 */}
                                            <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900/95 to-slate-950">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <span className="text-xs font-semibold text-amber-400/90">
                                                            설립자 이갈렙 목사 설교
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {video.duration} &bull; {video.views}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                                                        {video.title}
                                                    </h4>
                                                    <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed line-clamp-2">
                                                        {video.description}
                                                    </p>
                                                </div>

                                                <div className="mt-4 pt-3.5 border-t border-slate-800/90 flex items-center justify-between text-xs font-bold">
                                                    <span className="text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                                                        <Play className="w-3.5 h-3.5 fill-current" />
                                                        팝업으로 설교 영상 시청하기
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-md bg-white/5 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-300 transition-colors">
                                                        바로 재생 &rarr;
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
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
                                    <p>• 한국기독교대학 신학대학원 협의회(한기신협) 이사</p>
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
                                    바라크아카데미는 산해원교회 산하 온라인 신학 아카데미로서, 사역의 현장에서 쓰임 받기를 소망하는 분들을 위해 예비된 성경 중심 교육기관입니다. 지식의 신학을 넘어 영성과 실력이 겸비된 참된 리더십의 길에 동참하시길 바랍니다.
                                </p>
                                <div className="pt-4 flex gap-4">
                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg"
                                    >
                                        수강 신청하기 <ArrowRight className="w-4 h-4" />
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

            {/* Sermon Video Centered Modal Popup */}
            <AnimatePresence>
                {selectedVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSelectedVideo(null)}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                            aria-hidden="true"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={selectedVideo.title}
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/30 rounded-2xl md:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden z-10 flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 md:px-6 md:py-4 border-b border-slate-800/80 bg-slate-950/80 gap-4">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex-shrink-0">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        {selectedVideo.partLabel}
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-bold text-sm md:text-lg tracking-tight truncate">
                                            {selectedVideo.title}
                                        </h3>
                                        <p className="text-[11px] md:text-xs text-slate-400 truncate">
                                            설립자 이갈렙 목사 &bull; {selectedVideo.duration} &bull; {selectedVideo.views}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* 상/하 편 빠른 전환 탭 */}
                                    <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                                        {recommendationVideos.map((v) => (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => setSelectedVideo(v)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    selectedVideo.id === v.id
                                                        ? "bg-amber-500 text-slate-950 shadow"
                                                        : "text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                {v.partLabel}
                                            </button>
                                        ))}
                                    </div>

                                    <a
                                        href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors border border-slate-700"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        YouTube
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedVideo(null)}
                                        aria-label="영상 팝업 닫기"
                                        className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:rotate-90 group focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                    >
                                        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* YouTube Embed Player (16:9) */}
                            <div className="relative w-full aspect-video bg-black overflow-hidden shadow-inner">
                                <iframe
                                    key={selectedVideo.youtubeId}
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full border-0"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="px-5 py-3.5 md:px-6 md:py-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
                                <p className="text-slate-300 font-light text-center sm:text-left">
                                    {selectedVideo.description}
                                </p>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                    {/* 모바일용 상/하 전환 버튼 */}
                                    <div className="flex sm:hidden items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                                        {recommendationVideos.map((v) => (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => setSelectedVideo(v)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    selectedVideo.id === v.id
                                                        ? "bg-amber-500 text-slate-950"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {v.partLabel}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedVideo(null)}
                                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <PublicFooter />
        </div>
    );
}
