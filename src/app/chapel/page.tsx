"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { MapPin, Clock, Calendar, Video, ArrowRight, Music, Heart } from "lucide-react";

export default function ChapelPage() {
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
                        <h3 className="font-bold text-stone-900 mb-2">Worship Service</h3>
                        <p className="text-stone-600 text-sm">Every Sunday 11:00 AM</p>
                        <p className="text-stone-500 text-xs mt-1">Main Sanctuary</p>
                    </div>
                    <div className="text-center p-4">
                        <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-4" />
                        <h3 className="font-bold text-stone-900 mb-2">Morning Prayer</h3>
                        <p className="text-stone-600 text-sm">Mon-Fri 05:30 AM</p>
                        <p className="text-stone-500 text-xs mt-1">Online & Offline</p>
                    </div>
                    <div className="text-center p-4">
                        <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-4" />
                        <h3 className="font-bold text-stone-900 mb-2">Location</h3>
                        <p className="text-stone-600 text-sm">Barak Center, Seoul</p>
                        <p className="text-stone-500 text-xs mt-1">Gangnam-gu, Teheran-ro 123</p>
                    </div>
                </div>
            </section>

            {/* Recent Sermons Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">Recent Sermons</h2>
                        <p className="text-stone-500 mt-2">지난 주일 말씀을 다시 들어보세요.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium transition-colors">
                        View All Sermons <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-200 mb-4 shadow-lg group-hover:shadow-xl transition-all">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-300">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                                        <Video className="w-6 h-6 text-stone-900 ml-1" />
                                    </div>
                                </div>
                                <img
                                    src={`https://images.unsplash.com/photo-1445052493926-6c9ad69e7539?q=80&w=2670&auto=format&fit=crop&bg=${i}`}
                                    alt="Sermon Thumbnail"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                                <Calendar className="w-3 h-3" />
                                <span>March {10 - i}, 2024</span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-1 leading-tight group-hover:text-amber-700 transition-colors">
                                {i === 1 ? "광야에서 외치는 소리" : i === 2 ? "새 부대는 새 술을" : "믿음의 경주를 완주라하"}
                            </h3>
                            <p className="text-stone-500 text-sm line-clamp-2">
                                사도행전 말씀 강해 {30 - i}강. 본문을 통해 우리는 초대교회의 역동성을 배울 수 있습니다.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

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
