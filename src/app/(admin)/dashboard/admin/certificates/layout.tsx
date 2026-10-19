import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "수료증 발급 및 소감문 심사 관리 | 학사 통합 관리 센터 — 바라크아카데미",
    ogTitle: "과정별 수료증 발급 대장 및 소감문 관리 | 바라크아카데미 관리자 센터",
    description: "전 과정 수강 완료 및 소감문 제출 현황을 확인하고 학장 명의의 과정별 공식 수료증 발급을 관리합니다.",
    path: "/dashboard/admin/certificates",
    ogImage: "/og/og-admin.png",
    noIndex: true,
});

export default function AdminCertificatesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
