"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionCardProps {
    isCompleted: boolean;
    onConfirm: () => void;
}

export function CompletionCard({ isCompleted, onConfirm }: CompletionCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-secondary/10 text-secondary p-1.5 rounded-md">
                    <Check className="w-4 h-4" />
                </span>
                Key Takeaway (핵심 요약)
            </h3>

            <div className="prose prose-sm prose-blue text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <ul className="list-disc pl-4 space-y-2">
                    <li>기름부으심은 개인의 능력이 아닌 성령의 주권적인 선물입니다.</li>
                    <li>AI 기술은 현대 사역에서 복음을 전하는 강력한 도구가 될 수 있습니다.</li>
                    <li>지속적인 경건 훈련만이 영적 권위를 유지하는 비결입니다.</li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                <div className="text-sm text-gray-500">
                    {isCompleted ? (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                            <Check className="w-4 h-4" /> 강의 시청 완료
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> 영상을 끝까지 시청해야 완료할 수 있습니다.
                        </span>
                    )}
                </div>

                <button
                    onClick={onConfirm}
                    disabled={!isCompleted}
                    className={cn(
                        "w-full sm:w-auto px-8 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                        isCompleted
                            ? "bg-primary text-white hover:bg-primary/90 hover:shadow-md cursor-pointer animate-pulse-subtle"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    아멘 / 강의 완료
                </button>
            </div>
        </div>
    );
}
