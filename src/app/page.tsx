"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ChevronRight, PlayCircle, Shield, Award, Users, BookOpen, ArrowRight, Star } from "lucide-react";
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
        badge: null,
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
        badge: "Most Popular",
        translate: "md:-translate-y-8"
      },
      {
        image: "/images/track-jael.png",
        icon: ChevronRight,
        color: "text-white",
        bgIcon: "bg-purple-600",
        shadow: "shadow-purple-600/30",
        subColor: "text-purple-200",
        gradient: "from-purple-900/80 via-purple-900/20 to-transparent",
        badge: null,
        translate: ""
      }
    ];
    return styles[index % styles.length];
  };

  if (!mounted) return null;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">

      {/* 2. Hero Section (Grand Full-Width) */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">

        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_future_library.png"
            alt="Future Theological Library"
            fill
            className="object-cover w-full h-full brightness-[0.55]"
            priority
          />
          {/* Gradient Overlay - Lightened for brighter feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-slate-900/20" />
        </div>

        {/* Content Container - MAXIMIZED WIDTH */}
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-6 text-center pt-16">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-amber-300 text-sm font-bold uppercase tracking-widest mb-8 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              AI-Powered Theological Innovation
            </div>

            {/* Smaller Headline - WIDER */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] drop-shadow-2xl w-full max-w-[90%] mx-auto">
              <span className="block mb-1">드보라의 <span className="text-blue-200">비전</span>,</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">바라크의 실행.</span>
            </h1>

            {/* Wider Paragraph */}
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 w-full max-w-[80%] mx-auto font-light drop-shadow-lg">
              성령의 기름부으심이 <span className="font-bold text-white">최첨단 AI 기술</span>을 만나 사역의 새 지평을 엽니다.
              전통적인 신학 교육을 넘어, 실무 중심의 <span className="text-amber-300">미래형 리더십</span>을 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <Link
                href="/apply"
                className="px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-bold shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:shadow-orange-500/50 hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto ring-4 ring-orange-500/20"
              >
                입학 신청 <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/curriculum"
                className="px-10 py-5 rounded-full border-2 border-white/30 text-white text-xl font-bold hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center w-full sm:w-auto backdrop-blur-sm"
              >
                커리큘럼 보기
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Community Card (Subtle & Stylish) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            x: { duration: 1, delay: 1 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="hidden lg:flex absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl items-center gap-5 max-w-sm z-20 group hover:bg-white/20 transition-all"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white shadow-inner relative z-10">
              <Users className="w-7 h-7" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Active Community</p>
            <p className="text-lg font-bold text-white leading-tight">500+ Pastors</p>
            <p className="text-xs text-slate-300 mt-1">Join the revolution</p>
          </div>
        </motion.div>

      </section>

      {/* 3. Philosophy Section (Why) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Adjusted Grid Ratio: Image (40%) - Text (60%) */}
          <div className="lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 items-center">

            {/* Image (Bible + Tech) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-12 lg:mb-0"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                <Image
                  src="/images/philosophy-bible.png"
                  alt="Bible and Tablet"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Decorative Pattern */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-4">Our Philosophy</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                No Exams. <span className="text-blue-900">Just Growth.</span><br />
                100% Practical Ministry.
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                우리는 암기 위주의 시험을 거부합니다. 사역은 시험이 아니라 현장이기 때문입니다.
                바라크 아카데미는 성경적 지식을 실제 사역에 즉시 적용할 수 있도록 돕는
                <span className="font-bold text-slate-800"> 프로젝트 기반 학습(PBL)</span>을 지향합니다.
              </p>

              <ul className="space-y-6">
                {[
                  { icon: Shield, title: "Verified Certification", desc: "모든 과정 수료 시 블록체인 기반 인증서가 발급됩니다." },
                  { icon: BookOpen, title: "Biblical Integrity", desc: "변하지 않는 말씀의 진리 위에 최신 기술을 더합니다." },
                  { icon: Award, title: "Immediate Application", desc: "배운 것을 이번 주 주일 사역에 바로 적용해보세요." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-none w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-900">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Tracks Section (Cards) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Triple Anointing Tracks</h2>
            <p className="text-lg text-slate-500">
              성경적 리더십의 세 가지 원형을 통해 당신의 사역 스타일을 발견하고 발전시키세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course, idx) => {
              const style = getTrackStyle(idx);
              return (
                <div key={course.id} className={cn("group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300", style.translate)}>
                  <div className="absolute inset-0">
                    <Image src={style.image} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className={cn("absolute inset-0 bg-gradient-to-t", style.gradient)} />
                  </div>
                  <div className="relative h-[400px] flex flex-col justify-end p-8 text-white">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg", style.bgIcon, style.shadow)}>
                      <style.icon className="w-6 h-6 fill-white text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    <p className={cn("font-medium mb-4", style.subColor)}>{course.subTitle}</p>
                    <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                      {course.description}
                    </p>
                  </div>
                  {style.badge && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                      {style.badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Caleb AI Showcase */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-amber-200 blur-3xl opacity-30 transform -rotate-6 scale-90" />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-xl shadow-2xl overflow-hidden border-8 border-white bg-white"
              >
                <Image
                  src="/images/caleb-real-v2.png"
                  alt="Caleb AI Digital Twin"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 mb-12 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6">
                Personal Spiritual Mentor
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                나만의 AI 영적 멘토,<br />
                <span className="text-blue-900">갈렙 (Caleb)</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                설교 준비가 막막하신가요? 성경 본문에 대한 깊이 있는 통찰이 필요하신가요?
                24시간 깨어있는 당신의 동역자, 갈렙 AI가 곁에 있습니다.
                단순한 챗봇이 아닌, 신학적 검증을 거친 믿을 수 있는 멘토입니다.
              </p>
              <div className="flex gap-4">
                <div className="pl-4 border-l-4 border-amber-400">
                  <p className="font-bold text-slate-900">설교 아웃라인 자동 생성</p>
                </div>
                <div className="pl-4 border-l-4 border-blue-400">
                  <p className="font-bold text-slate-900">본문 주해 및 적용점 제안</p>
                </div>
              </div>
              <div className="mt-10">
                <Link href="/dashboard/caleb-ai" className="text-blue-900 font-bold hover:underline flex items-center gap-2 group">
                  Caleb AI와 대화하기 (Demo) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer (Global Component) */}
      <PublicFooter />

    </div>
  );
}
