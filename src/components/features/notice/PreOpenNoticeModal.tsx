"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sparkles, X, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "barak_hide_open_notice_until";

export function PreOpenNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hideUntil = localStorage.getItem(STORAGE_KEY);
      if (hideUntil) {
        const expiry = parseInt(hideUntil, 10);
        if (Date.now() < expiry) {
          return;
        }
      }
      // 마운트 직후 자연스럽게 표시되도록 약간의 딜레이
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleHideForDay = () => {
    try {
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24시간
      localStorage.setItem(STORAGE_KEY, expiresAt.toString());
    } catch {
      // ignore storage error
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* 어두운 백드롭 블러 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* 중앙 세련된 팝업 카드 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="바라크아카데미 정식 오픈 준비 안내"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-[430px] bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/35 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.22)] overflow-hidden z-10 flex flex-col text-slate-100"
          >
            {/* 상단 액센트 라인 */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

            {/* 카드 본문 헤더 */}
            <div className="p-5 sm:p-6 pb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  공지사항
                </div>
                <button
                  onClick={handleClose}
                  aria-label="안내 팝업 닫기"
                  className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 제목 */}
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                바라크아카데미<br />
                <span className="text-amber-300">정식 오픈 준비 안내</span>
              </h3>

              {/* 안내 문구 */}
              <div className="mt-3.5 space-y-2.5 text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                <p>
                  현재 바라크아카데미 온라인 교육원 정식 오픈을 준비하고 있습니다.
                </p>
                <p className="text-slate-400">
                  더욱 알차고 은혜로운 강의 및 편리한 학습 시스템으로 찾아뵙기 위해 최종 정비 중입니다. 오픈 일정이 확정되는 대로 사전 등록자분들과 홈페이지를 통해 정식으로 안내해 드리겠습니다.
                </p>
              </div>

              {/* 사전 접수 가능 안내 박스 */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white mb-0.5">2027학년도 1기 사전 접수 진행 중</p>
                  <p className="text-slate-400 leading-normal">
                    1기 등록 장학금 30% 및 사모 장학 혜택이 적용되는 사전 원서 접수는 지금도 가능합니다.
                  </p>
                </div>
              </div>

              {/* 원서 접수 링크 바로가기 */}
              <div className="mt-4">
                <Link
                  href="/apply"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  사전 입학 원서 접수하기 <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 하단 작고 세련된 바 (오늘 하루 보지 않기 & 닫기) */}
            <div className="px-5 py-3 border-t border-slate-800/90 bg-slate-950/90 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
              <button
                type="button"
                onClick={handleHideForDay}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 py-0.5 group focus:outline-none"
              >
                <span className="w-3 h-3 rounded-sm border border-slate-600 group-hover:border-amber-400 flex items-center justify-center transition-colors">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span>오늘 하루 보지 않기</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors focus:outline-none"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
