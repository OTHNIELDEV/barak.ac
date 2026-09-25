"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { GraduationCap, Award, BookOpen, Sparkles, UserCheck, ArrowRight, Shield, Heart, Cpu, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FacultyPage() {
    const facultyList = [
        {
            id: 1,
            name: "이윤주 학장",
            title: "바라크아카데미 학장 / 산해원교회 담임목사",
            subject: "이갈렙 목사의 성경해석학",
            category: "성경해석학 & 실천신학",
            badge: "학장 / 산해원교회 담임목사",
            accentColor: "from-amber-500 to-orange-600",
            borderColor: "border-amber-400",
            bio: "이화여대와 호서대에서 구약학을 전공하였으며, 사역 현장과 학문을 잇는 탁월한 성경해석으로 사모와 여성 사역자, 충성된 부목자들을 깨우는 영적 지도자입니다.",
            image: "/images/faculty/lee-yoonju.jpg",
            academics: [
                "이화여자대학교 신학대학원 졸업 (Th.M)",
                "호서대학교 일반대학원 구약학 졸업 (Ph.D)",
            ],
            careers: [
                "바라크아카데미 학장",
                "산해원교회 담임목사",
                "제이합미션(JHOP Mission) 대표",
                "한국기독교대학 신학대학원 협의회(한기신협) 이사"
            ],
            books: [
                "이갈렙 목사의 성경해석학 실무 강해",
                "십자가의 도와 구속사적 여종 환원론",
                "사사기 바락의 영성과 리더십"
            ],
            courses: [
                "이갈렙 목사의 성경해석학 (15강)",
                "사사기적 영성과 바락 리더십 (15강)",
                "말씀 중심의 실천 목회학"
            ]
        },
        {
            id: 2,
            name: "송민원 교수",
            title: "더바이블 무브먼트 대표 / 구약학 교수",
            subject: "구약학 (Old Testament)",
            category: "구약 신학 & 성서언어",
            badge: "더바이블 무브먼트 대표",
            accentColor: "from-blue-600 to-indigo-700",
            borderColor: "border-blue-400",
            bio: "서울대 독문과 및 시카고대 고대근동학, 맥코믹신학교 구약학을 전공하였으며, '바라크(ברך)'의 히브리어 어원적 영성을 제시한 세계적 성서언어·구약 신학자입니다.",
            image: "/images/faculty/song-minwon.jpg",
            academics: [
                "서울대학교 독일문학 전공",
                "맥코믹신학교(McCormick Theological Seminary) 구약 전공",
                "시카고대학교(University of Chicago) 고대근동학 전공"
            ],
            careers: [
                "더바이블 무브먼트 대표",
                "Israel Institute of Biblical Studies 성서언어 분과 교수",
                "바라크아카데미 구약학 전임교수"
            ],
            books: [
                "지혜란 무엇인가: 잠언-욥기-전도서의 상호작용",
                "히브리어의 시간",
                "태초에 질문이 있었다",
                "더바이블 욥기: 정답이 무너진 자리에서",
                "더바이블 전도서: 성숙한 신앙을 위한 지혜",
                "Jesus for You: 당신에게 들려주고 싶은 예수님의 말씀 외 다수"
            ],
            courses: [
                "구약 파노라마와 구속사 (15강)",
                "히브리어 성경과 '바라크'의 본래적 영성",
                "모세오경 및 지혜문학 심층 강해"
            ]
        },
        {
            id: 3,
            name: "김영희 교수",
            title: "신약학 교수",
            subject: "신약학 (New Testament)",
            category: "신약 신학 & 복음서",
            badge: "신약학 전문가",
            accentColor: "from-emerald-600 to-teal-700",
            borderColor: "border-emerald-400",
            bio: "복음서의 예수 그리스도 중심 구속사와 바울 신학을 현대 목회 현장의 실천적 제자도와 연결하는 명쾌한 강의를 펼칩니다.",
            image: "/images/faculty/kim-younghee.jpg",
            academics: [
                "신약학 전공 (Ph.D / Th.M)",
                "초대교회 사본학 및 바울신학 연구"
            ],
            careers: [
                "바라크아카데미 신약학 교수",
                "신약성경연구소 전문위원",
                "목회자 성경연구원 외래교수"
            ],
            books: [
                "사복음서와 하나님 나라의 구속사",
                "바울서신에 나타난 초대교회 직분과 동역"
            ],
            courses: [
                "신약 복음서와 하나님 나라 (15강)",
                "바울서신과 초대교회 영성",
                "신약 원어 주해와 설교 적용"
            ]
        },
        {
            id: 4,
            name: "전예령 교수",
            title: "기독교교육학 교수 / 교육철학 박사",
            subject: "기독교교육학 (Christian Education)",
            category: "교육철학 & 세대 연합",
            badge: "토론토대 교육철학 Ph.D",
            accentColor: "from-purple-600 to-pink-600",
            borderColor: "border-purple-400",
            bio: "연세대 및 McMaster대 종교교육, 토론토대 교육철학 박사로서, 청장년 회복과 2세를 위한 교육 프락시스(Praxis)를 개발하고 사모 및 여성 지도자의 교육 리더십을 세웁니다.",
            image: "/images/faculty/jeon-yeryeong.jpg",
            academics: [
                "연세대학교 종교교육 (M.A.)",
                "McMaster University 종교교육 (M.A.)",
                "University of Toronto 교육철학 (Ph.D)"
            ],
            careers: [
                "서울신학대학교 교양학부 교수 활동",
                "청장년(30-40세) 회복 신앙공동체 형성 및 2세 교육 프락시스 사역",
                "바라크아카데미 기독교교육학 전임교수"
            ],
            books: [
                "Caring- Application for Christian Ethics and Faith Education (신앙과지성사)",
                "성찰의 힘으로서 대화: 사람들을 변화시키는 힘 (신앙과지성사, Joyce Bellous)",
                "부모교육 교재 집필 (2017)"
            ],
            courses: [
                "기독교 교육 철학과 영성형성 (15강)",
                "세대 통합 교육과 회복의 프락시스",
                "사모 및 여성 지도자를 위한 교육 목회론"
            ]
        },
        {
            id: 5,
            name: "박은정 교수",
            title: "웨스트민스터신학대학원 일반학부장 / 목회상담학 교수",
            subject: "목회상담학 (Pastoral Counseling)",
            category: "치유 상담 & 영혼 돌봄",
            badge: "웨스트민스터신학대학원 학부장",
            accentColor: "from-rose-500 to-red-600",
            borderColor: "border-rose-400",
            bio: "웨스트민스터신학대학원 일반학부장이자 상담심리·놀이치료학과장으로서, 사역 현장의 상처 입은 영혼과 목회자 가정을 돌보며 성경적 상담 및 정서적 치유 실무를 강의합니다.",
            image: "/images/faculty/park-eunjung.jpg",
            academics: [
                "웨스트민스터신학대학원 일반학부장 · 상담심리·놀이치료학과장",
                "한국복음주의상담학회 부회장 및 감독상담사",
                "한국정신분석심리상담학회 놀이치료 부분과장",
                "한국대학평생교육원 협의회 놀이심리상담사 자격증 출제위원"
            ],
            careers: [
                "제30대 한국실천신학회장",
                "보건복지부 아동권리보장원 아동·청소년·가족상담사례 수퍼바이저",
                "한국입양홍보회 부모교육 강사",
                "(전) 서빙고 온누리교회 로뎀상담실 팀장",
                "(전) 두란노서원 빛과소금 상담전문기자",
                "바라크아카데미 목회상담학 교수"
            ],
            books: [
                "성경적 목회상담과 가정 회복",
                "사역자의 자기돌봄과 영적 건강"
            ],
            courses: [
                "성경적 목회상담과 가족치유 (15강)",
                "위기상담과 여성사역자의 자기돌봄 (15강)",
                "전인적 영성 치유와 회복 목회"
            ]
        },
        {
            id: 6,
            name: "김종우 교수",
            title: "인공지능 시대의 기독교 신학 교수",
            subject: "인공지능 시대의 기독교 신학",
            category: "미래 목회 & AI 사역",
            badge: "스마트목회 선도자",
            accentColor: "from-cyan-600 to-blue-600",
            borderColor: "border-cyan-400",
            bio: "생성형 AI와 최첨단 IT 기술을 복음 전파와 목회 사역에 거룩하게 전용하여, 시대를 앞서가는 스마트 사역자를 양성합니다.",
            image: "/images/faculty/kim-jongwoo.jpg",
            academics: [
                "컴퓨터공학 및 기독교문화융합 전공",
                "생성형 AI 목회 콘텐츠 연구개발"
            ],
            careers: [
                "바라크아카데미 AI와 기독교 교수",
                "스마트목회지원 연구소장",
                "한국교회 AI 선교포럼 전문위원"
            ],
            books: [
                "AI 시대의 목회와 복음 콘텐츠",
                "프롬프트 엔지니어링으로 완성하는 설교 자료 구축"
            ],
            courses: [
                "생성형 AI와 스마트 목회 콘텐츠 (15강)",
                "AI를 활용한 성경 연구 및 설교 자료 구축",
                "디지털 사역과 온라인 교회 개척"
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pt-20">
            {/* 1. Hero Section */}
            <section className="relative py-28 overflow-hidden flex items-center justify-center min-h-[50vh] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-amber-500/15 blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-sm"
                    >
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase">World-Class Theological Faculty</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight"
                    >
                        바라크아카데미 교수진
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        성경의 깊이와 사역의 실전, 그리고 미래 AI 기술을 아우르는<br />
                        <span className="text-amber-300 font-semibold">6인의 교수진</span>이 여러분과 함께합니다.
                    </motion.p>
                </div>
            </section>

            {/* 2. Faculty Cards Grid */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {facultyList.map((prof, index) => (
                        <motion.div
                            key={prof.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                {/* Top Header Info */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 border-3 ${prof.borderColor} shadow-md`}>
                                        <Image
                                            src={prof.image}
                                            alt={prof.name}
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${prof.accentColor}`}>
                                                {prof.badge}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {prof.category}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                            {prof.name}
                                        </h3>
                                        <p className="text-sm font-bold text-blue-900 mt-1">
                                            {prof.title}
                                        </p>
                                        <p className="text-xs text-amber-700 font-semibold mt-0.5">
                                            담당과목: {prof.subject}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio Paragraph */}
                                <p className="text-slate-700 text-sm leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {prof.bio}
                                </p>

                                {/* Academics & Careers */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                                            <GraduationCap className="w-4 h-4 text-blue-900" />
                                            주요 학력 (Academics)
                                        </h4>
                                        <ul className="space-y-1 text-slate-600">
                                            {prof.academics.map((ac, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5">
                                                    <span className="text-amber-500 font-bold">•</span>
                                                    <span>{ac}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                                            <Award className="w-4 h-4 text-amber-600" />
                                            주요 경력 (Careers)
                                        </h4>
                                        <ul className="space-y-1 text-slate-600">
                                            {prof.careers.map((cr, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5">
                                                    <span className="text-blue-900 font-bold">•</span>
                                                    <span>{cr}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Books / Publications (저서) */}
                                {prof.books && prof.books.length > 0 && (
                                    <div className="mb-6 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs">
                                        <h4 className="font-bold text-amber-950 mb-2 flex items-center gap-1.5">
                                            <BookMarked className="w-4 h-4 text-amber-700" />
                                            대표 저서 및 연구 (Publications)
                                        </h4>
                                        <ul className="space-y-1 text-amber-900">
                                            {prof.books.map((bk, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5">
                                                    <span className="text-amber-700 font-bold">✓</span>
                                                    <span>{bk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Assigned Courses Bottom */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">
                                    바라크아카데미 정규 개설 강좌
                                </span>
                                <Link
                                    href="/curriculum"
                                    className="text-xs font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1 transition-colors"
                                >
                                    커리큘럼 보기 <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Bottom CTA Section */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">Enrollment Open</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
                        최고의 교수진과 함께 새 시대의 사역자로 거듭나십시오
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg mb-8 max-w-2xl mx-auto font-light">
                        100% 온라인 녹화 영상 강의와 평생 자율 수강, 시험 없는 소감문 중심의 실전 교육이 기다립니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/apply"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl flex items-center gap-2"
                        >
                            2027학년도 1기 입학 지원 <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/curriculum"
                            className="px-8 py-4 rounded-full border border-slate-300 text-slate-800 font-bold text-base hover:bg-slate-100 transition-all"
                        >
                            전체 교육과정 보기
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
