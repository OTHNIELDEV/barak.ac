import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "커리큘럼 및 강의 모듈 관리 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "교육과정 커리큘럼 및 영상 강의 관리 | 바라크아카데미 관리자 센터",
    description: "드보라·바락·야엘 3대 트랙과 2년 4학기(120강) 강의 영상, 강의노트 PDF 및 모듈 구성을 관리합니다.",
    path: "/dashboard/admin/curriculum",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminCurriculumLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
