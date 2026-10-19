import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "사용자 및 수강생 관리 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "수강생 및 회원 통합 관리 | 바라크아카데미 관리자 센터",
    description: "바라크아카데미 전체 수강생 계정, 소속 교회, 직분 권한 및 과정별 수강 현황을 통합 관리합니다.",
    path: "/dashboard/admin/users",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminUsersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
