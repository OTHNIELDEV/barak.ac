"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { User, Award, BookOpen, GraduationCap, Mail } from "lucide-react";
import Image from "next/image";

export default function FacultyPage() {
    const faculty = [
        {
            id: 1,
            name: "Dr. Lee Caleb",
            role: "President & Professor of Practical Theology",
            bio: "Barak Academy의 설립자이자 갈렙 AI 시스템의 비전 제시자입니다. 전통적 신학과 현대 기술의 융합을 통해 다음 세대 목회자를 양성하는 데 헌신하고 있습니다.",
            image: "/images/caleb-real-v2.png", // Existing asset
            academics: ["Ph.D. in Practical Theology, Fuller Seminary", "M.Div. at Westminster Theological Seminary"],
            expertise: ["Prophetic Leadership", "Church Administration", "AI in Ministry"]
        },
        {
            id: 2,
            name: "Rev. Sarah Kim",
            role: "Dean of Deborah Track & Professor of Spirituality",
            bio: "영적 분별력과 중보기도 사역의 권위자입니다. 드보라 트랙을 이끌며 예언적 리더십을 가진 여성 사역자들을 배출하고 있습니다.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
            academics: ["D.Min in Spiritual Formation, Gordon-Conwell", "M.A. in Counseling"],
            expertise: ["Intercessory Prayer", "Spiritual Discernment", "Christian Counseling"]
        },
        {
            id: 3,
            name: "Dr. David Park",
            role: "Dean of Barak Track & Professor of Leadership",
            bio: "전략적 기획과 실행의 전문가입니다. 바라크 트랙에서 실제적인 목회 행정과 팀 빌딩 전략을 가르칩니다.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
            academics: ["Ph.D. in Organizational Leadership, Regent University", "MBA, Seoul National University"],
            expertise: ["Strategic Planning", "Team Building", "Crisis Management"]
        },
        {
            id: 4,
            name: "Dr. James Han",
            role: "Professor of Old Testament",
            bio: "고대 근동학과 구약 원어에 정통한 학자입니다. 성경의 역사적 배경을 통해 현대 목회에 적용 가능한 통찰을 제시합니다.",
            image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=2670&auto=format&fit=crop",
            academics: ["Ph.D. in Old Testament, Trinity Evangelical Divinity School", "Th.M., Chongshin University"],
            expertise: ["Hebrew Exegesis", "Pentateuch", "Prophetic Literature"]
        },
        {
            id: 5,
            name: "Dr. Esther Choi",
            role: "Professor of New Testament",
            bio: "바울 신학과 초기 기독교 역사에 대한 깊은 이해를 바탕으로, 복음의 본질을 명쾌하게 강의합니다.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop",
            academics: ["Ph.D. in New Testament, University of Aberdeen", "M.Div., torch Trinity"],
            expertise: ["Pauline Theology", "Gospels", "Greek Exegesis"]
        },
        {
            id: 6,
            name: "Dr. Paul Jeong",
            role: "Professor of Systematic Theology",
            bio: "개혁주의 신학의 기틀 위에 현대적 이슈들을 신학적으로 조명하는 조직신학 전문가입니다.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
            academics: ["Ph.D. in Systematic Theology, Calvin Seminary", "Th.M., ACTS"],
            expertise: ["Reformed Dogmatics", "Apologetics", "Christian Ethics"]
        },
        {
            id: 7,
            name: "Rev. Michael Ryu",
            role: "Professor of Christian Counseling",
            bio: "임상 경험이 풍부한 상담 전문가로서, 성경적 원리와 심리학적 기법을 통합하여 치유 사역을 돕습니다.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
            academics: ["Ph.D. in Psychology & Theology, Rosemead", "M.Div., Hapdong"],
            expertise: ["Pastoral Counseling", "Family Therapy", "Trauma Healing"]
        },
        {
            id: 8,
            name: "Dr. Grace Lee",
            role: "Professor of Church History",
            bio: "초대교회부터 현대교회까지 성령의 역사를 추적하며, 교회가 나아갈 방향을 제시하는 역사학자입니다.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
            academics: ["Ph.D. in Church History, Yale Divinity School", "M.A. in History"],
            expertise: ["Reformation History", "Korean Church History", "Revivalism"]
        },
        {
            id: 9,
            name: "Rev. Peter Song",
            role: "Professor of Missiology",
            bio: "20년간의 선교 현장 경험을 바탕으로 선교적 교회론과 타문화권 사역의 실제를 가르칩니다.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
            academics: ["D.Miss, Fuller School of Intercultural Studies", "M.Div., Kosin"],
            expertise: ["Urban Mission", "Cross-Cultural Ministry", "Church Planting"]
        },
        {
            id: 10,
            name: "Dr. Lydia Kang",
            role: "Professor of Worship & Music",
            bio: "예배의 신학적 의미와 실제적인 찬양 인도를 통합하여, 영과 진리로 드리는 예배자를 양성합니다.",
            image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=2574&auto=format&fit=crop",
            academics: ["D.W.S (Doctor of Worship Studies), Robert E. Webber", "M.Mus., Juilliard"],
            expertise: ["Worship Theology", "Liturgical Design", "Church Music"]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans pt-20">
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
                    className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center"
                    style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)' }}
                />

                <div className="relative z-30 max-w-7xl mx-auto px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 shadow-sm animate-fade-in-up ring-1 ring-blue-100">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest uppercase">Faculty & Leadership</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight animate-fade-in-up delay-100 drop-shadow-sm">
                        World-Class Theologians
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        신학적 깊이와 목회적 통찰력을 겸비한 <span className="text-slate-900 font-bold relative inline-block">
                            바라크 아카데미의 교수진
                            <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200/50 -z-10 rounded-full"></span>
                        </span>.<br className="hidden md:block" />
                        하나님의 말씀을 바르게 분별하고, 시대를 이끌어갈 영적 리더를 양성합니다.
                    </p>
                </div>
            </section>

            {/* Faculty Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {faculty.map((member) => (
                        <div key={member.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group border border-slate-100 flex flex-col h-full">
                            {/* Image Area */}
                            <div className="relative h-80 overflow-hidden bg-slate-100">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <p className="text-amber-400 font-bold text-xs tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {member.role.split('&')[0]}
                                    </p>
                                    <h3 className="text-2xl font-bold leading-tight">{member.name}</h3>
                                    <p className="text-slate-300 text-sm mt-1 opacity-90">{member.role}</p>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex-1 flex flex-col">
                                <p className="text-slate-600 mb-8 leading-relaxed text-sm flex-1">
                                    {member.bio}
                                </p>

                                <div className="space-y-6 mt-auto">
                                    <div className="pt-6 border-t border-slate-100">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                                            <GraduationCap className="w-4 h-4 text-blue-900" />
                                            Academics
                                        </h4>
                                        <ul className="space-y-2">
                                            {member.academics.map((deg, i) => (
                                                <li key={i} className="text-xs text-slate-500 pl-4 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-blue-200 before:rounded-full">
                                                    {deg}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                                            <Award className="w-4 h-4 text-amber-500" />
                                            Expertise
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {member.expertise.map((exp, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-semibold border border-slate-200">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                        최고의 스승과 함께하는 여정
                    </h2>
                    <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
                        바라크 아카데미의 교수진은 단순한 지식 전달자가 아닌, 여러분의 영적 여정을 함께하는 멘토가 되어드릴 것입니다.
                    </p>
                    <button className="px-8 py-4 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl shadow-blue-900/20">
                        입학 상담 신청하기
                    </button>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
