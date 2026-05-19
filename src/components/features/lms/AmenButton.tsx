"use client";

import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AmenButtonProps {
    isCompleted: boolean;
    isAlreadyCompleted?: boolean;
    onAmen: () => void;
}

export function AmenButton({ isCompleted, isAlreadyCompleted, onAmen }: AmenButtonProps) {
    const isUnlocked = isCompleted && !isAlreadyCompleted;

    return (
        <div className="relative group">
            {/* Ambient Glow for Unlocked State */}
            {isUnlocked && (
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            )}

            <button
                onClick={onAmen}
                disabled={!isCompleted}
                className={cn(
                    "relative w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden",
                    // Unlocked State (Ready to Amen)
                    isUnlocked && "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:scale-105 active:scale-95",
                    // Already Amen-ed
                    isAlreadyCompleted && "bg-slate-100 text-slate-500 border border-slate-200 cursor-default",
                    // Locked
                    !isCompleted && !isAlreadyCompleted && "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                )}
            >
                {/* Shine Effect */}
                {isUnlocked && (
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                )}

                {isAlreadyCompleted ? (
                    <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <span className="font-medium">수료 완료 (Amened)</span>
                    </>
                ) : isUnlocked ? (
                    <>
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <span className="font-bold tracking-wide">AMEN / 묵상 완료</span>
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        <span className="font-medium text-sm">강의 시청 후 활성화됩니다</span>
                    </>
                )}
            </button>
        </div>
    );
}
