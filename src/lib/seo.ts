import type { Metadata } from "next";

export const SITE_URL = "https://barak.ac";
export const SITE_NAME = "바라크아카데미 (Barak Academy)";

export interface PageSeoConfig {
    title: string;
    ogTitle?: string;
    description: string;
    ogDescription?: string;
    path: string;
    ogImage: string;
    keywords?: string[];
    noIndex?: boolean;
}

export function createPageMetadata(config: PageSeoConfig): Metadata {
    const {
        title,
        ogTitle,
        description,
        ogDescription,
        path,
        ogImage,
        keywords,
        noIndex = false,
    } = config;

    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const canonicalUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
    const absoluteOgImage = ogImage.startsWith("http")
        ? ogImage
        : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

    return {
        title,
        description,
        keywords: keywords || [
            "바라크아카데미",
            "Barak Academy",
            "산해원교회",
            "이갈렙 목사",
            "이윤주 학장",
            "성경해석학",
            "온라인 신학 아카데미",
            "드보라 과정",
            "바락 부목사 과정",
            "야엘 은사사역 과정",
            "갈렙 AI",
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: finalOgTitle,
            description: finalOgDescription,
            url: canonicalUrl,
            siteName: SITE_NAME,
            locale: "ko_KR",
            type: "website",
            images: [
                {
                    url: absoluteOgImage,
                    secureUrl: absoluteOgImage,
                    width: 1200,
                    height: 630,
                    alt: finalOgTitle,
                    type: "image/png",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: finalOgTitle,
            description: finalOgDescription,
            images: [absoluteOgImage],
        },
        ...(noIndex
            ? {
                  robots: {
                      index: false,
                      follow: false,
                  },
              }
            : {}),
    };
}

export const ROUTE_SEO: Record<string, PageSeoConfig> = {
    home: {
        title: "바라크아카데미 | 무릎 꿇는 영성(ברך)으로 세우는 온라인 신학 아카데미",
        ogTitle: "바라크아카데미 — 무릎 꿇는 영성(ברך)으로 깨어나는 새 시대 사역자",
        description:
            "드보라의 영적 분별, 바락의 겸손한 동역, 야엘의 결행! 이갈렙 목사의 성경해석학부터 구약·신약·기독교교육·목회상담·AI 스마트 목회까지 2년 4학기(120강) 온라인 사역자 훈련 과정.",
        ogDescription:
            "드보라(담임목회)·바락(부목사)·야엘(은사사역) 3대 과정! 6인 석학 교수진 강의와 24시간 갈렙 AI 튜터, 제1기 최대 50% 장학 혜택을 만나보세요.",
        path: "/",
        ogImage: "/og/og-home.png",
    },
    about: {
        title: "아카데미 소개 & 설립 비전 | 하나님 앞에 무릎 꿇는 영성(ברך) — 바라크아카데미",
        ogTitle: "아카데미 소개 | 왜 지금 '바라크(ברך·무릎 꿇는 영성)'인가? — 바라크아카데미",
        description:
            "사사기 4~5장 드보라·바락·야엘의 성경적 동역 모델과 히브리서 11장 믿음의 계보를 잇는 바라크아카데미 설립 취지 및 이갈렙 목사 추천 특강 영상을 확인하세요.",
        ogDescription:
            "히브리어 '바라크(무릎 꿇다·복을 빌다)'의 신학적 비전! 담임과 부목의 성경적 동역 모델과 이갈렙 목사 추천 특강(상·하) 영상을 바로 만나보세요.",
        path: "/about",
        ogImage: "/og/og-about.png",
    },
    faculty: {
        title: "교수진 소개 | 영성과 학문적 권위를 겸비한 6인의 석학 교수진 — 바라크아카데미",
        ogTitle: "교수진 소개 | 이윤주 학장·송민원·김영희·전예령·박은정·김종우 교수 — 바라크아카데미",
        description:
            "이윤주 학장(성경해석학), 송민원 교수(구약학·성서언어), 김영희 교수(신약학), 전예령 교수(기독교교육), 박은정 교수(목회상담), 김종우 교수(AI 신학) 등 6인 전임 교수진을 소개합니다.",
        ogDescription:
            "이갈렙 목사의 성경해석학부터 히브리어 구약 원어·요한복음·기독교교육·치유상담·생성형 AI 목회까지 각 분야 최고 권위 교수진의 프로필과 담당 강좌를 확인하세요.",
        path: "/faculty",
        ogImage: "/og/og-faculty.png",
    },
    curriculum: {
        title: "교육과정 안내 | 2년 4학기(120강) 마스터 커리큘럼 & 3대 사역 트랙 — 바라크아카데미",
        ogTitle: "교육과정 안내 | 2년 4학기 총 120강 로드맵 & 드보라·바락·야엘 3대 과정",
        description:
            "1학기 6대 신학 영역 기초 확립부터 2~4학기 성경해석학·기독교교육·구약원어·목회상담·신약복음서·AI 스마트목회 심화까지 총 120강 학기별 커리큘럼 로드맵을 안내합니다.",
        ogDescription:
            "1학기 기초 확립부터 4학기 심화까지 총 120강 체계적 훈련! 전 과목 강의안 PDF 제공 및 이수 시 학장 명의 과정별 공식 수료증이 수여됩니다.",
        path: "/curriculum",
        ogImage: "/og/og-curriculum.png",
    },
    apply: {
        title: "2026 신입생 수강 신청 | 제1기 특별 장학(30~50% 감면) — 바라크아카데미",
        ogTitle: "2026학년도 신입생 모집 | 목사 사모 50% · 1기 입학생 30% 장학 혜택 — 바라크아카데미",
        description:
            "목사 사모·여성 사역자·은퇴 목회자·평신도 사명자를 위한 바라크아카데미 온라인 수강 신청! 창립 1기 30% 감면 및 목사 사모 50% 특별 장학 혜택으로 지금 지원하세요.",
        ogDescription:
            "드보라·바락·야엘 과정 2026 신입생 모집 중! 목사 사모 50%·제1기 전원 30% 교육후원금 감면 혜택과 함께 3분 온라인 원서접수로 지금 시작하세요.",
        path: "/apply",
        ogImage: "/og/og-apply.png",
    },
    chapel: {
        title: "산해원 채플 | 이갈렙 목사 구속사 강해 설교 & 예배 아카이브 — 바라크아카데미",
        ogTitle: "산해원 채플 & 설교 아카이브 | 이갈렙 목사 '최고한 법: 자유하는 율법' 강해",
        description:
            "사랑과 긍휼로 율법을 완성하는 이갈렙 목사의 구속사적 성경 강해 설교와 산해원교회 정기 채플·주일예배 말씀 영상을 언제 어디서나 온라인으로 만나보세요.",
        ogDescription:
            "'최고한 법: 자유하는 율법', '항상 들으시니 항상 기도할 것인가' 등 이갈렙 목사의 생생한 구속사 강해 설교와 산해원교회 예배 영상을 바로 시청하세요.",
        path: "/chapel",
        ogImage: "/og/og-chapel.png",
    },
    aiSystem: {
        title: "갈렙 AI 시스템 | 24시간 신학 연구·설교 준비 코파일럿 — 바라크아카데미",
        ogTitle: "갈렙 AI (Caleb AI v1.0) | 신학과 목회 지혜를 학습한 당신의 24시간 사역 코파일럿",
        description:
            "2,000년 교회사·성경 주석·구속사 신학 데이터베이스를 탑재한 갈렙 AI! 성경 본문 원어 분석부터 설교 개요 작성, 1:1 비밀 목회 상담까지 사역의 모든 과정을 돕습니다.",
        ogDescription:
            "단순한 챗봇이 아닌 전담 신학 멘토! 구속사 주석 데이터베이스 기반 본문 강해, 설교 준비 보조, 강의 학습 Q&A를 지원하는 갈렙 AI를 경험하세요.",
        path: "/ai-system",
        ogImage: "/og/og-ai-system.png",
    },
    certificate: {
        title: "과정 수료증 발급센터 | 공식 수료증 PDF 발급 및 진위 확인 — 바라크아카데미",
        ogTitle: "과정 수료증 발급센터 | 드보라·바락·야엘 과정 수료증 발급 & 실시간 진위 조회",
        description:
            "산해원교회 산하 바라크아카데미 2년 4학기(120강) 교육과정과 과목별 소감문을 이수한 수료생에게 과정별 공식 수료증을 발급하며 고유 번호로 진위를 확인합니다.",
        ogDescription:
            "120강 전 과정 이수 및 소감문 제출 수료생을 위한 공식 수료증 PDF 즉시 발급! 고유 수료번호(BARAK-2026)로 발급 진위 여부를 실시간 조회할 수 있습니다.",
        path: "/certificate",
        ogImage: "/og/og-certificate.png",
    },
    login: {
        title: "온라인 캠퍼스 로그인 | 스마트 신학 강의실 접속 — 바라크아카데미",
        ogTitle: "온라인 캠퍼스 로그인 | 성령의 기름부으심, AI와 함께하는 스마트 신학 캠퍼스",
        description:
            "바라크아카데미 수강생 전용 온라인 캠퍼스에 로그인하세요. 반응형 영상 강의실, 갈렙 AI 튜터 멘토링, 실시간 진도율 및 수료증 관리를 이용할 수 있습니다.",
        ogDescription:
            "바라크아카데미 수강생 전용 로그인 페이지입니다. 온라인 강의 수강, 아멘 출석 체크, 소감문 제출 및 갈렙 AI 1:1 멘토링을 지금 시작하세요.",
        path: "/login",
        ogImage: "/og/og-login.png",
    },
    myClassroom: {
        title: "내 강의실 | 1학기 핵심 강좌 수강 및 소감문 제출 — 바라크아카데미",
        ogTitle: "내 강의실 | 제1강 이갈렙 목사의 성경해석학 외 1학기 핵심 강좌 온라인 수강",
        description:
            "이갈렙 목사의 성경해석학, 구약의 언약과 바라크 영성, 복음서 강해, 성경적 목회상담 등 1학기 핵심 영상 강의를 수강하고 갈렙 AI 튜터와 함께 소감문을 작성하세요.",
        ogDescription:
            "고화질 영상 강의 수강부터 강의노트 PDF 다운로드, 갈렙 AI 실시간 질의응답, 수료 소감문 작성·제출까지 한곳에서 이루어지는 스마트 강의실입니다.",
        path: "/my-classroom",
        ogImage: "/og/og-classroom.png",
    },
    dashboard: {
        title: "나의 학습 대시보드 | 수강 진도율 및 학사 현황 관리 — 바라크아카데미",
        ogTitle: "나의 학습 대시보드 | 과정별 이수율·주간 학습 통계·수료 요건 통합 관리",
        description:
            "바라크아카데미 수강생의 과정별 강의 진도율, 주간 학습 리포트, 소감문 제출 현황 및 수료증 발급 자격을 한눈에 확인하고 관리하는 학습 대시보드입니다.",
        ogDescription:
            "나의 수강 진도율과 주간 학습 시간, 소감문 제출 현황을 한눈에 확인하고 이어보기 강의로 바로 이동하세요.",
        path: "/dashboard",
        ogImage: "/og/og-dashboard.png",
    },
    calebTutor: {
        title: "갈렙 AI 튜터 | 1:1 실시간 성경 주해 및 목회 멘토링 — 바라크아카데미",
        ogTitle: "갈렙 AI 튜터 | 디지털 트윈 기반 1:1 심층 신학 문답 & 설교·사역 상담",
        description:
            "강의 수강 중 궁금한 신학적 질문, 히브리어·헬라어 원어 의미, 설교 본문 강해 및 목회 현장의 고민을 갈렙 AI 튜터와 1:1로 깊이 있게 상담하세요.",
        ogDescription:
            "이갈렙 목사의 성경해석학 원리와 개혁주의 주석을 학습한 디지털 트윈 AI 튜터가 당신의 질문과 설교 준비에 실시간으로 응답합니다.",
        path: "/dashboard/caleb-ai",
        ogImage: "/og/og-caleb-tutor.png",
    },
    myPage: {
        title: "마이페이지 | 수강생 프로필 및 수료증 이력 관리 — 바라크아카데미",
        ogTitle: "마이페이지 | 소속 교회·직분 프로필 관리 및 이수 과정 수료증 다운로드",
        description:
            "바라크아카데미 수강생의 개인 프로필, 소속 교회 및 직분 정보를 관리하고 이수 완료한 교육과정의 수료증을 조회·다운로드할 수 있습니다.",
        ogDescription:
            "내 수강생 계정 정보와 사역지 프로필을 관리하고, 이수 완료한 트랙의 공식 수료증을 간편하게 발급받으세요.",
        path: "/dashboard/my-page",
        ogImage: "/og/og-mypage.png",
    },
    community: {
        title: "동역자 커뮤니티 | 말씀 묵상 나눔·중보기도·신학 Q&A — 바라크아카데미",
        ogTitle: "바라크아카데미 동역자 커뮤니티 | 원우들과 함께하는 말씀 나눔 & 중보기도 네트워크",
        description:
            "함께 배우고 사역하는 바라크아카데미 원우들과 강의 은혜와 묵상을 나누고, 사역 현장의 중보기도 제목과 신학적 질문을 교류하는 커뮤니티입니다.",
        ogDescription:
            "자유 은혜 나눔부터 사역지 중보기도 요청, 성경·신학 Q&A까지! 바라크아카데미 동역자들과 영적 교제를 나누세요.",
        path: "/dashboard/community",
        ogImage: "/og/og-community.png",
    },
    privacy: {
        title: "개인정보처리방침 | 수강생 개인정보 및 신앙정보 보호 안내 — 바라크아카데미",
        ogTitle: "바라크아카데미 개인정보처리방침 | 수강생 개인정보 및 신앙정보 보호 원칙",
        description:
            "산해원교회 산하 바라크아카데미는 개인정보 보호법 등 관련 법령을 준수하며 수강생의 개인정보와 민감 신앙 정보를 적법하고 안전하게 보호합니다.",
        ogDescription:
            "수강 신청 및 학사 운영에 필요한 최소한의 개인정보 처리 원칙, 신앙정보 별도 동의 및 안전한 보안 관리 방침을 안내합니다.",
        path: "/privacy",
        ogImage: "/og/og-privacy.png",
    },
    terms: {
        title: "이용약관 | 교육과정 학사 운영 및 수료 기준 안내 — 바라크아카데미",
        ogTitle: "바라크아카데미 교육과정 이용약관 | 2년 4학기(120강) 학사 운영 및 수료 규정",
        description:
            "산해원교회 산하 신학 아카데미 교육과정의 성격, 수강 신청 절차, 120강 수강 및 소감문 제출 수료 기준, 교육후원금 감면 및 수료증 발급 약관을 안내합니다.",
        ogDescription:
            "드보라·바락·야엘 3대 교육과정 운영 원칙과 2년 4학기(120강) 이수 요건, 수료증 발급 및 저작권 보호 규정을 확인하세요.",
        path: "/terms",
        ogImage: "/og/og-terms.png",
    },
    admin: {
        title: "학사 통합 관리 센터 | 입학·커리큘럼·수료증 관리 — 바라크아카데미",
        ogTitle: "바라크아카데미 학사 및 시스템 통합 관리자 센터 (Admin Portal)",
        description:
            "바라크아카데미 수강생 관리, 신입생 원서 접수 및 장학 승인, 커리큘럼·콘텐츠(CMS) 운영, 수료증 발급 및 AI 로그를 총괄하는 관리자 전용 시스템입니다.",
        ogDescription:
            "수강생 학사 현황, 입학 신청 심사, 전 과목 커리큘럼 및 수료증 발급을 통합 관리하는 바라크아카데미 어드민 포털입니다.",
        path: "/dashboard/admin",
        ogImage: "/og/og-admin.png",
        noIndex: true,
    },
};

export const COURSE_TRACK_SEO: Record<number, PageSeoConfig> = {
    1: {
        title: "드보라 담임목회 과정 (The Deborah Course) | 예언자적 영적 분별 — 바라크아카데미",
        ogTitle: "드보라 담임목회 과정 | 종려나무 아래의 지혜, 시대를 분별하는 말씀 리더십",
        description:
            "말씀(Logos)과 분별(Discernment)에 집중하며, 교회와 사역 현장에서 진리를 드러내는 담임목회 및 말씀 사역 리더십을 훈련하는 드보라 트랙 강의실입니다.",
        ogDescription:
            "종려나무 아래에서 이스라엘을 이끈 드보라처럼, 이갈렙 목사의 성경해석학과 구속사 강해로 강단과 교회를 세우는 담임목회 과정입니다.",
        path: "/course/1",
        ogImage: "/og/og-course-deborah.png",
    },
    2: {
        title: "바락 부목사 과정 (The Barak Course) | 거룩한 순종과 동역의 영성 — 바라크아카데미",
        ogTitle: "바락 부목사 과정 (핵심전공) | 다볼 산의 소집, 거룩한 순종과 연합의 목회 실무",
        description:
            "순종(Obedience)과 동역(Partnership)을 다루며, 담임목회를 신실하게 보좌하고 성도를 양육하며 교회를 세우는 부교역자 핵심 전공 과정입니다.",
        ogDescription:
            "자신의 영광보다 하나님의 임재를 구한 바락처럼, 겸손한 순종과 말씀·기도·디지털 목회 실무로 교회를 세우는 부목사 과정입니다.",
        path: "/course/2",
        ogImage: "/og/og-course-barak.png",
    },
    3: {
        title: "야엘 은사사역 과정 (The Jael Course) | 장막 안의 헌신과 영적 승리 — 바라크아카데미",
        ogTitle: "야엘 은사사역 과정 | 일상의 성화와 성경적 상담·중보기도로 승리하는 사역",
        description:
            "일상의 영성과 성경적 은사 활용을 통해 가정과 교회, 삶의 현장에서 영혼을 돌보고 복음을 전하는 헌신된 은사 사역자를 양성합니다.",
        ogDescription:
            "장막 안에서 결정적 승리를 거둔 야엘처럼, 성경적 치유상담과 중보기도, 실천적 복음 전도로 가정과 교회를 살리는 은사사역 과정입니다.",
        path: "/course/3",
        ogImage: "/og/og-course-jael.png",
    },
};
