import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    return createPageMetadata({
        title: `특강 제${id}강: 성령의 기름부으심과 사역의 원리 — 바라크아카데미`,
        ogTitle: `[바라크아카데미 특강] 성령의 기름부으심: 기초와 사역 적용 (제${id}강)`,
        description:
            "성령의 기름부으심이 개인의 삶과 목회 사역에 임하는 성경적 기초와 구속사적 원리를 배우고 갈렙 AI와 함께 묵상을 심화합니다.",
        ogDescription:
            "구약과 신약에 나타난 성령의 기름부으심과 말씀 사역의 실제! 영상 강의와 갈렙 AI 실시간 멘토링으로 함께 학습하세요.",
        path: `/lecture/${id}`,
        ogImage: "/og/og-classroom.png",
    });
}

export default function LectureLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
