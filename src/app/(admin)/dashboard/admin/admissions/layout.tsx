import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "수강 신청 및 장학 심사 관리 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "신입생 수강 신청 심사 및 장학 승인 관리 | 바라크아카데미 관리자 센터",
    description: "2026학년도 바라크아카데미 온라인 수강 신청서 조회, 트랙 배정, 장학 감면 확인 및 입학 승인을 관리합니다.",
    path: "/dashboard/admin/admissions",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminAdmissionsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
