import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "콘텐츠 관리 (CMS) | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "홈페이지 및 교수진 콘텐츠 관리 (CMS) | 바라크아카데미 관리자 센터",
    description: "바라크아카데미 메인 배너, 교수진 소개, 채플 설교 영상 및 공지사항 콘텐츠를 관리합니다.",
    path: "/dashboard/admin/cms",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminCmsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
