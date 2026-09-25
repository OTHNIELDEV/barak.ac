"use client";

import { useState, useEffect } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MapPin, Clock, Calendar, Video, ArrowRight, Heart, X, Play, ExternalLink, Globe } from "lucide-react";

export default function ChapelPage() {
    const [selectedVideo, setSelectedVideo] = useState<{ title: string; youtubeId: string; speaker: string; scripture?: string } | null>(null);

    // ESC key closes modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedVideo(null);
            }
        };
        if (selectedVideo) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [selectedVideo]);

    const chapelSermons = [
        {
            id: 1,
            title: "항상 들으시니 항상 기도할 것인가",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "요한복음 11:41-44",
            desc: "우리의 간구를 언제나 들으시는 하나님의 은혜 속에서 성도가 지녀야 할 참된 기도의 영성",
            youtubeId: "ZbAzIGAuywg",
            thumb: "https://img.youtube.com/vi/ZbAzIGAuywg/hqdefault.jpg"
        },
        {
            id: 2,
            title: "자유하는 율법 #1 최고한 법 (가)",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "야고보서 2:8-9",
            desc: "차별 없는 사랑과 긍휼로 완성되는 최고의 법, 성도를 자유케 하는 온전한 율법의 비밀 강해",
            youtubeId: "OP79-8l715c",
            thumb: "https://img.youtube.com/vi/OP79-8l715c/hqdefault.jpg"
        },
        {
            id: 3,
            title: "자유하는 율법 #2 최고한 법 (나)",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "마태복음 19:16-22",
            desc: "부자 청년의 질문을 통해 살펴본 영생의 본질과 자기 소유를 내려놓고 주를 따르는 참된 제자도",
            youtubeId: "bftZuUKSfM8",
            thumb: "https://img.youtube.com/vi/bftZuUKSfM8/hqdefault.jpg"
        },
        {
            id: 4,
            title: "기록되었으되, 부제(1) 하나님을 시험하라",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "이사야 7:10-15, 마태복음 4:5-7",
            desc: "광야의 유혹 속에서 기록된 말씀의 권세로 원수의 궤계를 물리치신 예수 그리스도의 성경적 분별",
            youtubeId: "OWo5Up7GZEk",
            thumb: "https://img.youtube.com/vi/OWo5Up7GZEk/hqdefault.jpg"
        },
        {
            id: 5,
            title: "기록되었으되, 부제(2) 겸손하여야",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "역대상 21:1, 마태복음 4:1-4",
            desc: "사람이 떡으로만 살 것이 아니요 하나님의 모든 말씀으로 살아야 함을 선포하는 겸손의 영성",
            youtubeId: "tvWiKoF_MI8",
            thumb: "https://img.youtube.com/vi/tvWiKoF_MI8/hqdefault.jpg"
        },
        {
            id: 6,
            title: "주여, 구원을 얻는 자가 적으니이까",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "누가복음 13:18-21, 마태복음 7:22-23",
            desc: "좁은 문으로 들어가기를 힘쓰라 명하신 주님의 음성을 기억하며 깨어있는 성도의 삶과 구원의 확신",
            youtubeId: "iE0UZ2fipx0",
            thumb: "https://img.youtube.com/vi/iE0UZ2fipx0/hqdefault.jpg"
        }
    ];

    const broadcastSermons = [
        {
            id: 101,
            title: "생베 조각을 낡은 옷에 깁지 않는다",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "마태복음 9:14-17",
            series: "큰집 큰사람 (1)",
            desc: "복음의 새 포도주를 담는 영적 그릇과 생베 조각의 거룩한 연합의 비밀을 강해합니다.",
            youtubeId: "4EeTdI3EkRU",
            thumb: "https://img.youtube.com/vi/4EeTdI3EkRU/hqdefault.jpg"
        },
        {
            id: 102,
            title: "모든 말씀으로 살 것이라",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "마태복음 4:1-11",
            series: "큰집 큰사람 (2)",
            desc: "육신의 떡을 넘어 하나님의 입에서 나오는 모든 말씀으로 원수를 이기는 신앙의 삶",
            youtubeId: "5hTDZu3H8mo",
            thumb: "https://img.youtube.com/vi/5hTDZu3H8mo/hqdefault.jpg"
        },
        {
            id: 103,
            title: "다만 주를 섬기라 하였느니라",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "누가복음 4:1-13",
            series: "큰집 큰사람 (3)",
            desc: "오직 주 하나님만을 경외하고 섬김으로 악한 권세를 꺾는 거룩한 성도의 권능",
            youtubeId: "3QG-fBkdSmw",
            thumb: "https://img.youtube.com/vi/3QG-fBkdSmw/hqdefault.jpg"
        },
        {
            id: 104,
            title: "아버지의 약속하신 것 그대로",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "사도행전 1:4-5, 요엘 2:28-32",
            series: "성경성령론 (1)",
            desc: "약속하신 성령을 기다리며 권능과 성령의 세례를 온전히 사모하는 성경적 성령론 강해",
            youtubeId: "m1vIEIBsJwQ",
            thumb: "https://img.youtube.com/vi/m1vIEIBsJwQ/hqdefault.jpg"
        },
        {
            id: 105,
            title: "성령, 예루살렘으로부터라야",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "누가복음 24:45-49, 요엘 2:28-32",
            series: "성경성령론 (2)",
            desc: "위로부터 입혀지는 성령의 능력과 예루살렘에서부터 온 땅 끝으로 향하는 구속사적 사명",
            youtubeId: "OyXDNwZaP14",
            thumb: "https://img.youtube.com/vi/OyXDNwZaP14/hqdefault.jpg"
        },
        {
            id: 106,
            title: "필경은 성신을 그의 제자된 자에게",
            speaker: "이갈렙 목사 (제이합미션)",
            scripture: "이사야 32:9-15, 사도행전 2:32, 36",
            series: "성경성령론 (3)",
            desc: "광야가 아름다운 밭이 되고 주를 주로 시인하는 제자들에게 부어주시는 성령의 충만하심",
            youtubeId: "IGOT8t6eg8I",
            thumb: "https://img.youtube.com/vi/IGOT8t6eg8I/hqdefault.jpg"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-stone-50 font-serif pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-stone-900 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop"
                        alt="Chapel Interior"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-stone-50" />
                </div>

                <div className="relative z-10 text-center text-white px-4">
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-xs font-sans tracking-widest uppercase">Sanhaewon Chapel</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg">
                        산해원 채플
                    </h1>
                </div>
            </section>

            {/* Service Info Bar */}
            <section className="relative z-20 -mt-20 max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-100 font-sans border border-stone-100">
                    {/* 1. 주일 예배 */}
                    <div className="text-center p-3 flex flex-col items-center justify-center">
                        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                        <h3 className="font-bold text-stone-900 mb-1.5 text-lg">주일 예배</h3>
                        <p className="text-stone-700 text-sm font-semibold">매주일 오전 11:00</p>
                        <p className="text-stone-500 text-xs mt-0.5">산해원 채플실</p>
                    </div>

                    {/* 2. 예배 처소 */}
                    <div className="text-center p-3 pt-6 md:pt-3 flex flex-col items-center justify-center">
                        <MapPin className="w-8 h-8 text-blue-900 mx-auto mb-3" />
                        <h3 className="font-bold text-stone-900 mb-1.5 text-lg">예배 처소</h3>
                        <p className="text-stone-700 text-sm font-semibold">바라크아카데미 / 산해원교회</p>
                        <p className="text-stone-500 text-xs mt-0.5">예배 및 세미나 홀</p>
                    </div>

                    {/* 3. 산해원교회 홈페이지 */}
                    <div className="text-center p-3 pt-6 md:pt-3 flex flex-col items-center justify-center">
                        <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                        <h3 className="font-bold text-stone-900 mb-1.5 text-lg">산해원교회</h3>
                        <p className="text-stone-700 text-xs font-medium mb-2.5">말씀과 은혜의 공동체</p>
                        <a
                            href="https://sanhaewon.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-sm hover:shadow group hover:scale-105"
                        >
                            <span>홈페이지 방문</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Recent Sermons Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">최근 채플 설교</h2>
                        <p className="text-stone-500 mt-2">산해원 채플과 바라크아카데미의 은혜로운 말씀을 시청하세요.</p>
                    </div>
                    <a
                        href="https://www.youtube.com/@jhoptv/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition-colors border border-red-200 self-start sm:self-auto"
                    >
                        <Video className="w-4 h-4 text-red-600" />
                        J-HOP TV 채널 전체보기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chapelSermons.map((sermon) => (
                        <div
                            key={sermon.id}
                            onClick={() => setSelectedVideo({ 
                                title: sermon.title, 
                                youtubeId: sermon.youtubeId, 
                                speaker: sermon.speaker,
                                scripture: sermon.scripture 
                            })}
                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative aspect-video overflow-hidden bg-stone-900">
                                    <img
                                        src={sermon.thumb}
                                        alt={sermon.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-amber-500/90 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300">
                                            <Play className="w-6 h-6 ml-1 fill-white" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
                                        YouTube
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                                        <span>{sermon.scripture}</span>
                                        <span>•</span>
                                        <span className="text-stone-600">{sermon.speaker}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                                        {sermon.title}
                                    </h3>
                                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                                        {sermon.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-0">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                                    말씀 시청하기 <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Broadcast Sermons Grid */}
            <section className="py-20 bg-stone-100/70 border-t border-stone-200 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-2">
                                <Video className="w-3.5 h-3.5 text-amber-700" />
                                J-HOP TV 방송 설교
                            </div>
                            <h2 className="text-3xl font-bold text-stone-900">설교 방송</h2>
                            <p className="text-stone-500 mt-2">이갈렙 목사의 깊이 있는 성경 강해와 성경성령론 연속 방송을 시청하세요.</p>
                        </div>
                        <span className="text-xs text-stone-500 font-medium self-start sm:self-auto">
                            총 6개 방송 강해 수록
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {broadcastSermons.map((sermon) => (
                            <div
                                key={sermon.id}
                                onClick={() => setSelectedVideo({ 
                                    title: sermon.title, 
                                    youtubeId: sermon.youtubeId, 
                                    speaker: sermon.speaker,
                                    scripture: sermon.scripture 
                                })}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative aspect-video overflow-hidden bg-stone-900">
                                        <img
                                            src={sermon.thumb}
                                            alt={sermon.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 bg-amber-500/90 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300">
                                                <Play className="w-6 h-6 ml-1 fill-white" />
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-900/80 text-amber-300 text-xs font-bold backdrop-blur-sm border border-white/10">
                                            {sermon.series}
                                        </div>
                                        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
                                            설교 방송
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                                            <span>{sermon.scripture}</span>
                                            <span>•</span>
                                            <span className="text-stone-600">{sermon.speaker}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                                            {sermon.title}
                                        </h3>
                                        <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                                            {sermon.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-0">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                                        방송 시청하기 <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Modal Popup */}
            {selectedVideo && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div 
                        className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 px-6 bg-stone-950 text-white border-b border-white/10 font-sans">
                            <div className="min-w-0 pr-4">
                                <h3 className="font-bold text-base md:text-lg text-white truncate">{selectedVideo.title}</h3>
                                <p className="text-xs text-amber-300 font-medium mt-0.5">
                                    {selectedVideo.scripture ? `${selectedVideo.scripture} • ` : ""}{selectedVideo.speaker}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> YouTube에서 열기
                                </a>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                    aria-label="닫기"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}



            <PublicFooter />
        </div>
    );
}
