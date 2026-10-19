import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "갈렙 AI 튜터 로그 분석 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "갈렙 AI 멘토링 질문 로그 및 신학 키워드 분석 | 바라크아카데미 관리자 센터",
    description: "수강생들의 갈렙 AI 튜터 질의응답 통계와 주요 신학·목회 관심 주제를 분석합니다.",
    path: "/dashboard/admin/ai-logs",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminAiLogsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
