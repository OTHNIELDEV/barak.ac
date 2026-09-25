"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ChevronRight, PlayCircle, Shield, Award, Users, BookOpen, ArrowRight, Star, Sparkles, Heart, Globe, Gift, Clock, FileText, CheckCircle2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Course, db } from "@/lib/storage";
import { supabaseDb } from "@/lib/supabase/db";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchCourses = async () => {
      try {
        const remoteCourses = await supabaseDb.courses.getAll();
        if (remoteCourses && remoteCourses.length > 0) {
          setCourses(remoteCourses);
        } else {
          const allCourses = db.courses.getAll();
          if (allCourses && allCourses.length > 0) {
            setCourses(allCourses);
          }
        }
      } catch (error) {
        console.warn("Failed to load remote courses:", error);
        setCourses(db.courses.getAll());
      }
    };
    fetchCourses();
  }, []);

  const getTrackStyle = (index: number) => {
    const styles = [
      {
        image: "/images/track-deborah.png",
        icon: Star,
        color: "text-white",
        bgIcon: "bg-amber-500",
        shadow: "shadow-amber-500/30",
        subColor: "text-amber-200",
        gradient: "from-black/80 via-black/20 to-transparent",
        badge: "영적 분별",
        translate: ""
      },
      {
        image: "/images/track-barak.png",
        icon: Shield,
        color: "text-white",
        bgIcon: "bg-blue-600",
        shadow: "shadow-blue-600/30",
        subColor: "text-blue-200",
        gradient: "from-blue-900/80 via-blue-900/20 to-transparent",
        badge: "핵심 전공",
        translate: "md:-translate-y-4"
      },
      {
        image: "/images/track-jael.png",
        icon: ChevronRight,
        color: "text-white",
        bgIcon: "bg-purple-600",
        shadow: "shadow-purple-600/30",
        subColor: "text-purple-200",
        gradient: "from-purple-900/80 via-purple-900/20 to-transparent",
        badge: "위기 승부수",
        translate: ""
      }
    ];
    return styles[index % styles.length];
  };

  const facultyPreview = [
    { name: "이윤주 학장 (Ph.D)", field: "이갈렙 목사의 성경해석학", role: "학장 / 총괄교수", image: "/images/faculty/lee-yoonju.jpg" },
    { name: "송민원 교수", field: "구약학", role: "더바이블 무브먼트 대표", image: "/images/faculty/song-minwon.jpg" },
    { name: "김영희 교수", field: "신약학", role: "신약성경연구소 전문위원", image: "/images/faculty/kim-younghee.jpg" },
    { name: "전예령 교수 (Ph.D)", field: "기독교교육학", role: "토론토대 교육철학 박사", image: "/images/faculty/jeon-yeryeong.jpg" },
    { name: "박은정 교수", field: "목회상담학", role: "웨스트민스터신학대학원 일반학부장", image: "/images/faculty/park-eunjung.jpg" },
    { name: "김종우 교수", field: "AI와 기독교", role: "스마트목회지원 연구소장", image: "/images/faculty/kim-jongwoo.jpg" },
  ];

  if (!mounted) return null;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 pt-16">

      {/* 1. Hero Section (Grand Full-Width) */}
      <section className="relative min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_future_library.png"
            alt="Barak Academy Future Library"
            fill
            className="object-cover w-full h-full brightness-[0.45]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-500/10 backdrop-blur-md text-amber-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 shadow-2xl">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              새 시대에 요구되는 성경 중심의 온라인 신학교
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.15] drop-shadow-2xl">
              <span className="block text-slate-200 text-2xl sm:text-4xl font-extrabold mb-2">
                드보라의 비전, 바락의 겸손과 실행
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                바라크아카데미
              </span>
            </h1>

            {/* Sub Paragraph */}
            <p className="text-base sm:text-xl text-slate-200 leading-relaxed mb-8 max-w-3xl mx-auto font-light drop-shadow-lg">
              하나님 앞에 겸손히 무릎 꿇는 영성(<span className="text-amber-300 font-semibold">ברך</span>)과 최첨단 AI 기술을 융합하여,
              마지막 때 <span className="text-white font-bold">부목사, 선교사, 전도사, 특히 여성 사역자</span>를 온누리의 영적 리더로 세웁니다.
            </p>

            {/* Scholarship & Accreditation Badge in Hero */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 text-xs md:text-sm">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold shadow-lg">
                🌟 1기 개교 등록 장학금 30% 지급
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-600/90 text-white font-bold border border-blue-400/40 backdrop-blur-sm">
                💖 목사 사모 특별 장학금 50% 할인
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-purple-600/80 text-white font-bold border border-purple-400/40 backdrop-blur-sm">
                📜 목사,선교사,전도사 자격증 발급
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-slate-200 border border-white/20">
                🏛️ 2년제(120강) 영상강의
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link
                href="/apply"
                className="px-9 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold shadow-[0_15px_40px_rgba(245,158,11,0.35)] hover:shadow-orange-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                2027학년도 1기 입학 신청 <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-full border border-white/30 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
              >
                설립 취지 & 비전 보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Meaning of "BARAK" - Essence Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 font-bold text-xs md:text-sm tracking-widest uppercase">The Spiritual Foundation</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
              「바라크(Barak)」에 담긴 두 가지 거룩한 의미
            </h2>
            <p className="text-slate-600 mt-3 text-base md:text-lg">
              자신의 영광보다 드보라 선지자의 동행을 구했던 바락 장군의 겸손과, 하나님 앞에 엎드리는 축복의 태도
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Meaning 1 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-blue-900 bg-blue-100/80 px-3 py-1 rounded-full uppercase">
                  성경 속 인물 • 사사기 4~5장 & 히브리서 11장
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">
                  바락(Barak)의 겸손: “드보라 여선지자의 동행을 구하다”
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                  드보라 선지자가 가나안 군대와 싸우러 나가라 했을 때, 바락은 자신의 영광이나 명예보다 <strong>드보라와 함께 가기</strong>를 구했습니다(삿 4:8).
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-xs md:text-sm text-slate-700 border border-slate-100">
                  성경은 바락을 주저한 자가 아닌, 당당한 <strong>“믿음의 사람”</strong>으로 증언합니다 (히 11:32-33).
                </div>
              </div>
            </div>

            {/* Meaning 2 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <span className="text-3xl font-serif font-bold">ברך</span>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full uppercase">
                  히브리어 원어 어원
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-3">
                  바라크(ברך): “하나님 앞에 무릎을 꿇는 삶”
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                  ‘바라크(Barak)’는 히브리어로 <strong>“축복하다”</strong>이며, 어원적으로는 <strong>‘무릎을 꿇다’</strong>입니다. 축복하는 행위보다 하나님 앞에 복을 받는 사람의 겸손한 자세를 기준합니다.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-xs md:text-sm text-slate-700 border border-slate-100">
                  겸손히 하나님 앞에 엎드리는 영적 태도 자체가 바로 <strong>복을 받는 참된 모습</strong>입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3 Core Establishment Visions */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-amber-400 font-bold text-xs md:text-sm tracking-widest uppercase">Academy Mission</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
              바라크아카데미 3대 설립 비전
            </h2>
            <p className="text-slate-300 mt-4 text-base md:text-lg font-light">
              기존의 틀을 깨고 사역 현장에 가장 필요한 영적 리더를 양성합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 hover:border-amber-400/50 transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                1. 바락과 같은 부목사 집중 양성
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                신학교 졸업 후 교회 담임목사를 지향하는 정형화된 고정관념에서 탈피하여, 담임목회와 교회를 충성되게 세우는 부목사와 핵심 동역자를 집중 양성합니다.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 hover:border-blue-400/50 transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                2. 여성 사역자 발굴
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                “내가 또 내 영을 남종과 여종에게 부어줄 것이며”(욜 2:29). 마지막 때 성령의 기름부으심을 받은 여성 사역자와 목사 사모의 은사를 극대화합니다.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 hover:border-purple-400/50 transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                3. 온누리에 말씀 전파 사명
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                드보라, 바락, 야엘과 같은 자격을 갖춘 사역자를 산과 바다와 들, 곧 온누리에 파송하여 하나님의 진리를 전파합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Academic System & Certification (No Exams, 4 Semesters, 120 Lectures) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            {/* Left Image & Stats */}
            <div className="lg:col-span-5 mb-12 lg:mb-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <Image
                  src="/images/philosophy-bible.png"
                  alt="Bible and Learning"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">Barak Academic Standards</div>
                  <div className="text-2xl font-bold">총 4학기 120강 자율 이수제</div>
                </div>
              </div>
            </div>

            {/* Right Academic Principles */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">Academic Revolution</span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                암기식 시험은 없습니다.<br />
                <span className="text-blue-900">삶과 사역의 변화</span>에 집중합니다.
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light">
                바라크아카데미는 시험 점수로 사역자를 평가하지 않습니다. 각 강의당 A4 1장 소감문을 통해 말씀을 삶에 적용하며, 바쁜 목회와 일상 속에서도 자율적으로 수강할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    총 4학기 • 120강
                  </div>
                  <p className="text-xs text-slate-500">한 학기당 30강, 총 120강 정규 커리큘럼</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    시험 무 (No Exam)
                  </div>
                  <p className="text-xs text-slate-500">시험 스트레스 없이 현장 중심의 실전 역량 강화</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    A4용지 소감문 작성
                  </div>
                  <p className="text-xs text-slate-500">각 강의별 A4 1장 소감문으로 삶에 내재화</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    졸업 기한 제한 없음
                  </div>
                  <p className="text-xs text-slate-500">시간에 쫓기지 않고 자율 이수 및 복습 가능</p>
                </div>
              </div>

              {/* Live Interactive Simulator Callout */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">완전 자동화 자격증 발급 시스템 가동</h4>
                    <p className="text-xs text-blue-200">강의 100% 수강 + A4 소감문 제출 시 Supabase DB에서 즉시 자동 발급</p>
                  </div>
                </div>
                <Link
                  href="/ai-system#automation-demo"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  실시간 구동 목업 체험하기 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 2026 Admissions & Tuition/Scholarship (Brochure Section 2 & 5 & Attachments) */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 font-bold text-xs md:text-sm tracking-widest uppercase">2027 Admissions & Tuition</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
              입학 요건 · 학생모집 요강 · 장학 혜택
            </h2>
            <p className="text-slate-300 mt-4 text-base md:text-lg font-light">
              누구나 제약 없이 입학 가능하며, 성령의 권능을 받은 자에 한해 졸업시 공인 사역자 자격증서를 수여받습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Admissions Criteria (5 cols) */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="w-7 h-7 text-amber-400" />
                  학생 모집 대상 & 추천
                </h3>
                <ul className="space-y-3.5 text-xs md:text-sm text-slate-200">
                  <li className="flex items-start gap-3 p-3 bg-black/20 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                    <span><strong>교회 실제 목회 현장에 필요한 여성 사역자 및 평신도</strong></span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-black/20 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                    <span><strong>목사 사모로서 교회 사역에 동역하기를 희망하는 자</strong> (50% 장학)</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-black/20 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                    <span><strong>은퇴·원로 목회자(65세 이상)</strong> 중 '바락'과 같은 충성된 전문 부목자로 헌신할 분</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-black/20 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                    <span><strong>성경과 신학을 깊이 탐구</strong>하여 영성과 지식을 겸비하고자 하는 은사자</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-amber-200 leading-relaxed">
                * 누구나 제약 없이 입학/수강 가능하며, 졸업시 공식 자격증서를 수여합니다.
              </div>
            </div>

            {/* Tuition & Scholarship Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Regular & Batch 1 Scholarship */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold mb-4">
                    1기 개교 장학
                  </div>
                  <h4 className="text-xl font-bold mb-2">1기 등록 장학금</h4>
                  <div className="text-3xl font-black mb-4">전체 30% 지급</div>
                  <p className="text-amber-100 text-xs leading-relaxed mb-6">
                    정규 수강료 100만원 중 1기 신입생 전원에게 30% 장학금을 지원하여 <strong>70만원</strong>으로 등록 가능합니다.
                  </p>
                </div>
                <Link
                  href="/apply?scholarship=first_batch_30"
                  className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl text-center text-sm hover:bg-amber-50 transition-colors"
                >
                  1기 장학 신청하기
                </Link>
              </div>

              {/* Pastor Wife 50% Scholarship */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between border border-blue-400/30">
                <div>
                  <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 text-yellow-300">
                    목사 사모 특별 지원
                  </div>
                  <h4 className="text-xl font-bold mb-2">목사 사모 장학 혜택</h4>
                  <div className="text-3xl font-black mb-4 text-yellow-300">50% 특별 할인</div>
                  <p className="text-blue-100 text-xs leading-relaxed mb-6">
                    목회 현장에서 묵묵히 헌신하는 목사 사모님들의 동역을 위해 50% 감면 혜택을 제공합니다 (<strong>50만원</strong>).
                  </p>
                </div>
                <Link
                  href="/apply?applicantType=pastor_wife"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold rounded-xl text-center text-sm hover:from-amber-300 hover:to-yellow-300 transition-colors shadow-md"
                >
                  사모 장학 신청하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Faculty Preview Section (6 Professors) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-900 font-bold text-xs md:text-sm tracking-widest uppercase">World-Class Faculty</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
              바라크아카데미 6인 전임 교수진
            </h2>
            <p className="text-slate-600 mt-3 text-base md:text-lg">
              신학의 깊이와 사역의 실천성을 겸비한 교수진의 직강을 온라인으로 수강하세요.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {facultyPreview.map((faculty, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-200 text-center flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-slate-200">
                  <Image
                    src={faculty.image}
                    alt={faculty.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-0.5">{faculty.name}</h4>
                <p className="text-amber-600 font-semibold text-xs mb-1">{faculty.field}</p>
                <p className="text-slate-400 text-[10px] line-clamp-1">{faculty.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/faculty"
              className="inline-flex items-center gap-2 text-blue-900 font-bold hover:text-blue-700 text-sm md:text-base"
            >
              교수진 상세 프로필 및 강의 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Specialization Tracks Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3">Triple Anointing Tracks</h2>
            <p className="text-slate-500 text-base md:text-lg">
              드보라, 바라크, 야엘 3대 영적 모델을 통해 사역자별 맞춤 역량을 완성합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course, idx) => {
              const style = getTrackStyle(idx);
              return (
                <div key={course.id} className={cn("group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-slate-900", style.translate)}>
                  <div className="relative h-96 w-full">
                    <Image
                      src={
                        course.id === 1 ? "/images/track-deborah-biblical.png" :
                          course.id === 2 ? "/images/track-barak-biblical.png" :
                            "/images/track-jael-biblical.png"
                      }
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase">
                          {style.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                        <p className="text-slate-300 text-xs line-clamp-2 mb-4 font-light">
                          {course.description}
                        </p>
                        <Link
                          href={`/apply?track=${course.id === 1 ? 'deborah' : course.id === 2 ? 'barak' : 'jael'}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200"
                        >
                          이 트랙으로 지원하기 <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase mb-6">
            <Sparkles className="w-4 h-4" /> 지금 1기 등록 시 30% 장학금 즉시 지급
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            하나님의 손에 붙들려 쓰임 받는<br />
            <span className="text-amber-400">새 시대의 거룩한 사역자</span>로 서십시오.
          </h2>
          <p className="text-slate-300 text-base md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            바라크아카데미가 여러분의 든든한 영적 동역자가 되어 드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold shadow-2xl hover:from-amber-400 hover:to-orange-400 hover:scale-105 transition-all"
            >
              2026학년도 1기 입학 원서 접수
            </Link>
            <Link
              href="/curriculum"
              className="px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all"
            >
              교육과정 자세히 보기
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
