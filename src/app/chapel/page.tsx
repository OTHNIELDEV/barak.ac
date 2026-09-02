"use client";

import { useState } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MapPin, Clock, Calendar, Video, ArrowRight, Music, Heart, X, Play } from "lucide-react";

export default function ChapelPage() {
    const [selectedVideo, setSelectedVideo] = useState<{ title: string; youtubeId: string; speaker: string } | null>(null);

    const chapelSermons = [
        {
            id: 1,
            title: "광야에서 외치는 소리: 사사기적 영성",
            speaker: "이윤주 학장 (산해원교회)",
            date: "2026년 3월 주일예배",
            desc: "사사기 4~5장을 통해 하나님께서 세우시는 바락과 드보라의 동역과 거룩한 순종의 비밀을 선포합니다.",
            youtubeId: "M7lc1UVf-VE",
            thumb: "https://images.unsplash.com/photo-1445052493926-6c9ad69e7539?q=80&w=2670&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "새 부대에는 새 술을: 디지털 시대의 복음",
            speaker: "송민원 교수 (구약학)",
            date: "2026년 2월 특별채플",
            desc: "어원적 '바라크(ברך)'의 축복과 지혜를 통해 현대 문명과 기술 속에서 복음의 본질을 밝힙니다.",
            youtubeId: "kJQP7kiw5Fk",
            thumb: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2670&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "믿음의 선한 싸움과 성령의 기름부으심",
            speaker: "이윤주 학장 (산해원교회)",
            date: "2026년 2월 주일예배",
            desc: "불과 성령의 2차 세례로 무장하여 삶의 현장에서 사명을 감당하는 참된 사역자의 길을 제시합니다.",
            youtubeId: "ZbZSe6N_BXs",
            thumb: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop"
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
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                        산해원 채플
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-stone-200 max-w-2xl mx-auto italic">
                        "여호와를 경외하는 것이 지혜의 근본이라"
                    </p>
                </div>
            </section>

            {/* Service Info Bar */}
            <section className="relative z-20 -mt-20 max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-t-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-100 font-sans">
                    <div className="text-center p-4">
                        <Clock className="w-8 h-8 text-stone-400 mx-auto mb-4" />
                        <h3 className="font-bold text-stone-900 mb-2">주일 대예배</h3>
                        <p className="text-stone-600 text-sm">매주일 오전 11:00</p>
                        <p className="text-stone-500 text-xs mt-1">산해원교회 본당</p>
                    </div>
                    <div className="text-center p-4">
                        <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-4" />
                        <h3 className="font-bold text-stone-900 mb-2">새벽 기도회</h3>
                        <p className="text-stone-600 text-sm">월-금 오전 05:30</p>
                        <p className="text-stone-500 text-xs mt-1">온라인 & 오프라인 동시</p>
                    </div>
                    <div className="text-center p-4">
                        <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-4" />
                        <h3 className="font-bold text-stone-900 mb-2">예배 처소</h3>
                        <p className="text-stone-600 text-sm">바라크아카데미 / 산해원교회</p>
                        <p className="text-stone-500 text-xs mt-1">부산 해운대구</p>
                    </div>
                </div>
            </section>

            {/* Recent Sermons Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">최근 채플 설교</h2>
                        <p className="text-stone-500 mt-2">산해원 채플과 바라크아카데미의 은혜로운 말씀을 시청하세요.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {chapelSermons.map((sermon) => (
                        <div
                            key={sermon.id}
                            onClick={() => setSelectedVideo({ title: sermon.title, youtubeId: sermon.youtubeId, speaker: sermon.speaker })}
                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative aspect-video overflow-hidden bg-stone-200">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-14 h-14 bg-amber-500/90 text-white rounded-full flex items-center justify-center shadow-lg">
                                            <Play className="w-6 h-6 ml-1 fill-white" />
                                        </div>
                                    </div>
                                    <img
                                        src={sermon.thumb}
                                        alt={sermon.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{sermon.date} • {sermon.speaker}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight group-hover:text-amber-700 transition-colors">
                                        {sermon.title}
                                    </h3>
                                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                                        {sermon.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-0">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 group-hover:translate-x-1 transition-transform">
                                    말씀 시청하기 <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <div className="flex items-center justify-between p-4 px-6 bg-stone-950 text-white border-b border-white/10 font-sans">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-white">{selectedVideo.title}</h3>
                                <p className="text-xs text-amber-300 font-medium">{selectedVideo.speaker}</p>
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Quote / Meditation */}
            <section className="py-32 bg-stone-900 text-stone-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <Music className="w-12 h-12 text-amber-500 mx-auto mb-8 opacity-80" />
                    <blockquote className="text-3xl md:text-5xl font-serif leading-tight mb-10">
                        "예배는 우리의 마음을<br />하나님의 심장박동에<br />맞추는 시간입니다."
                    </blockquote>
                    <p className="text-stone-400 font-sans tracking-widest uppercase text-sm">
                        - Sanhaewon Chapel Worship Team -
                    </p>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
