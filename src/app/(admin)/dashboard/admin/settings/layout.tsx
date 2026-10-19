import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "시스템 환경 설정 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "바라크아카데미 학사 시스템 환경 설정 | 관리자 센터",
    description: "바라크아카데미 플랫폼 운영 정책, 알림, 보안 및 AI 엔진 설정을 관리합니다.",
    path: "/dashboard/admin/settings",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
