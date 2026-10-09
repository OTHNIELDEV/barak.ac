"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  title?: string;
}

export function PromoVideoModal({
  isOpen,
  onClose,
  videoId = "tGMVYSRAVP8",
  title = "바라크아카데미 공식 홍보영상",
}: PromoVideoModalProps) {
  // ESC 키로 닫기 지원 & 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* 어두운 배경 오버레이 (블러 효과) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* 중앙 모달 다이얼로그 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/30 rounded-2xl md:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden z-10 flex flex-col"
          >
            {/* 모달 상단 헤더 */}
            <div className="flex items-center justify-between px-5 py-3.5 md:px-6 md:py-4 border-b border-slate-800/80 bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  공식 영상
                </span>
                <h3 className="text-white font-bold text-sm md:text-base tracking-tight truncate max-w-[200px] sm:max-w-md">
                  {title}
                </h3>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                aria-label="홍보영상 닫기"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:rotate-90 group focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* 유튜브 비디오 컨테이너 (16:9 비율 유지) */}
            <div className="relative w-full aspect-video bg-black overflow-hidden shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* 모달 하단 푸터 및 CTA */}
            <div className="px-5 py-4 md:px-6 md:py-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
              <p className="text-slate-300 font-light text-center sm:text-left">
                드보라의 비전, 바락의 겸손과 실행 &bull;{" "}
                <span className="text-amber-300 font-medium">새 시대 온누리의 영적 리더를 세웁니다</span>
              </p>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Link
                  href="/apply"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  입학 원서 접수 <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
