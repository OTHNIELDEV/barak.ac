import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const notoSerifKr = Noto_Serif_KR({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-noto-serif-kr",
});

const dmSerif = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-dm-serif",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-jetbrains",
});

export const viewport: Viewport = {
    themeColor: "#0A1424",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

const OG_IMAGE_URL = `${SITE_URL}/og/og-dean-card.png`;

export const metadata: Metadata = {
    title: "이윤주 학장 · 바라크아카데미 (Barak Academy)",
    description: "산해원교회 산하 바라크아카데미 학장 이윤주 목사(Ph.D.) — 무릎 꿇는 영성(ברך)으로 깨어나는 새 시대 온라인 신학 아카데미",
    authors: [{ name: "바라크아카데미 (Barak Academy)" }],
    keywords: [
        "바라크아카데미",
        "Barak Academy",
        "이윤주 학장",
        "이윤주 목사",
        "산해원교회",
        "이갈렙 목사",
        "제이합미션",
        "성경해석학",
        "온라인 신학 아카데미",
        "디지털 명함",
    ],
    alternates: {
        canonical: `${SITE_URL}/c/dean`,
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "이윤주 학장 · 바라크아카데미",
        description: "산해원교회 · 바라크아카데미 — 무릎 꿇는 영성(ברך)과 최첨단 AI로 세우는 온라인 신학 아카데미",
        url: `${SITE_URL}/c/dean`,
        siteName: SITE_NAME,
        type: "profile",
        locale: "ko_KR",
        images: [
            {
                url: OG_IMAGE_URL,
                secureUrl: OG_IMAGE_URL,
                width: 1200,
                height: 630,
                alt: "이윤주 학장 · 바라크아카데미 디지털 명함",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "이윤주 학장 · 바라크아카데미 (Barak Academy)",
        description: "드보라의 비전, 바락의 겸손과 실행 — 2년 4학기(120강) 성경 중심 온라인 신학 아카데미.",
        images: [OG_IMAGE_URL],
    },
};

export default function DeanCardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${notoSerifKr.variable} ${dmSerif.variable} ${jetbrainsMono.variable}`}>
            {children}
        </div>
    );
}
