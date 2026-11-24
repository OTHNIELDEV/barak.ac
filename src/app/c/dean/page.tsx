"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./dean-card.css";

interface VideoItem {
    id: string;
    title: string;
    duration: string;
    date: string;
    badge?: string;
    subtitle?: string;
    thumb?: string;
}

const FEATURED_VIDEO: VideoItem = {
    id: "xKZkHCtK1gk",
    title: "바라크아카데미 공식 홍보영상 — 드보라의 비전, 바락의 겸손과 실행",
    duration: "3:42",
    date: "대표 홍보영상",
    badge: "대표 영상",
    subtitle: "하나님 앞에 겸손히 무릎 꿇는 영성(ברך)과 최첨단 AI 기술로 세우는 온라인 신학 아카데미",
    thumb: "/images/promo-video-thumb.jpg",
};

const RECENT_VIDEOS: VideoItem[] = [
    {
        id: "bkDyECVeCIc",
        title: "바라크 부목사 아카데미 특별 설명 설교 (상) — 드보라와 바락, 담임과 부목의 모델",
        duration: "66:14",
        date: "사사기 4~5장 · 히 11:32",
    },
    {
        id: "R4jTPLqnchI",
        title: "바라크 부목사 아카데미 특별 설명 설교 (하) — 마지막 때, 여성 사역자를 세우라",
        duration: "52:08",
        date: "요엘 2:28 · 행 2:17",
    },
    {
        id: "T-kY9XBB8io",
        title: "제1강: 이갈렙 목사의 성경해석학 — 최고한 법: 자유하는 율법 (약 2:8-13)",
        duration: "25:00",
        date: "성경해석학 대표 강의",
    },
    {
        id: "bftZuUKSfM8",
        title: "제2강: 구약과 '바라크(ברך)'의 언약적 영성 — 자유하는 율법 강해",
        duration: "22:00",
        date: "구속사 강해",
    },
];

const NEWS_HIGHLIGHTS = [
    {
        meta: "BARAK ACADEMY · 2027 학년도 신입생 모집",
        title: "“드보라의 비전, 바락의 겸손과 실행 — 무릎 꿇는 영성(ברך)으로 깨어나는 새 시대 사역자”",
        summary:
            "이갈렙 목사의 성경해석학을 중심으로 구약·신약·기독교교육·목회상담·AI 스마트목회 등 6인 석학 교수진이 함께하는 2년 4학기(120강) 온라인 사역자 훈련 과정입니다. 창립 1기 전원 30% 및 목사 사모 50% 교육후원금 감면 혜택을 제공합니다.",
        linkText: "수강 신청 및 모집요강 보기 →",
        href: "/apply?utm_source=bizcard&utm_medium=digital_card",
    },
    {
        meta: "ACADEMIC RESEARCH · 성경해석학 & 구약신학",
        title: "“창조와 구원의 관점에서 샬롬(שָׁלוֹם)과 샤바트(שׁבת) 관계성 연구 및 이갈렙 목사의 성경해석학”",
        summary:
            "이화여대 신학대학원(Th.M)과 호서대 구약학 박사(Ph.D) 학위를 바탕으로, 암기식 시험을 배제하고 말씀 묵상과 설교·소감문 내재화를 통해 삶과 사역 현장을 변화시키는 실천 신학 교육을 이끕니다.",
        linkText: "교수진 및 전체 커리큘럼 보기 →",
        href: "/curriculum?utm_source=bizcard&utm_medium=digital_card",
    },
];

export default function DeanBusinessCardPage() {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!activeVideo) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveVideo(null);
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [activeVideo]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage((prev) => (prev === msg ? null : prev));
        }, 2800);
    };

    const handleShare = async () => {
        const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/c/dean?utm_source=kakao` : "https://barak.ac/c/dean?utm_source=kakao";
        const shareData = {
            title: "이윤주 학장 · 바라크아카데미 디지털 명함",
            text: "안녕하세요, 바라크아카데미 학장 이윤주 목사입니다. 디지털 명함 링크에서 연락처 저장과 아카데미 소개 영상, 교육과정 안내를 바로 보실 수 있습니다.",
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
        } catch (err) {
            if ((err as Error)?.name === "AbortError") return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("디지털 명함 링크가 클립보드에 복사되었습니다.");
        } catch {
            showToast("링크: https://barak.ac/c/dean");
        }
    };

    const mailtoHref =
        "mailto:jhop3927@naver.com?subject=" +
        encodeURIComponent("[바라크아카데미 문의] 이윤주 학장님께") +
        "&body=" +
        encodeURIComponent(
            "안녕하세요, 이윤주 학장님.\n디지털 명함을 보고 연락드립니다.\n\n· 성함 / 직분:\n· 소속 교회(기관):\n· 연락처:\n· 문의 내용 (입학 및 수강 상담 / 장학 혜택 / 초청·사역 문의 등):\n"
        );

    return (
        <div className="bc-page">
            <div className="bc-wrap">
                {/* 1. Top Header */}
                <header className="bc-top">
                    <Link href="/?utm_source=bizcard" className="bc-brand" aria-label="바라크아카데미 홈으로 이동">
                        <svg aria-hidden="true" className="bc-brand-mark" viewBox="0 0 64 64">
                            <path
                                d="M32 6L10 16v18c0 14.5 9.4 27.6 22 32 12.6-4.4 22-17.5 22-32V16L32 6z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4.2"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M32 17v28M21 28h22"
                                stroke="currentColor"
                                strokeWidth="4.2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="bc-brand-word">BARAK ACADEMY</span>
                    </Link>

                    <button
                        type="button"
                        className="bc-round"
                        onClick={handleShare}
                        aria-label="명함 공유하기"
                        title="명함 링크 공유 및 복사"
                    >
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                        </svg>
                    </button>
                </header>

                {/* 2. Profile Card Section */}
                <section className="bc-profile" aria-label="이윤주 학장 디지털 명함">
                    {/* Sacred Sanctuary / Orbital Golden Art SVG */}
                    <svg
                        aria-hidden="true"
                        className="bc-profile-art"
                        viewBox="0 0 358 240"
                        preserveAspectRatio="xMaxYMin meet"
                    >
                        <g fill="none" stroke="#C99A3E" strokeWidth=".8">
                            <ellipse cx="300" cy="52" rx="30" ry="17" transform="rotate(-16 300 52)" opacity=".38" />
                            <ellipse cx="300" cy="52" rx="62" ry="37" transform="rotate(-16 300 52)" opacity=".26" />
                            <ellipse cx="298" cy="54" rx="96" ry="59" transform="rotate(-14 298 54)" opacity=".17" />
                            <ellipse cx="294" cy="58" rx="134" ry="85" transform="rotate(-12 294 58)" opacity=".11" />
                        </g>
                        <path
                            d="M168 235 L208 192 L240 142 L270 98 L300 52"
                            fill="none"
                            stroke="#C99A3E"
                            strokeWidth="1.2"
                            opacity=".55"
                        />
                        <circle cx="300" cy="52" r="4" fill="#F2D58E" />
                    </svg>

                    <div className="bc-profile-header">
                        <div className="bc-profile-text">
                            <p className="bc-eyebrow">DEAN &amp; SENIOR PASTOR · PH.D.</p>
                            <h1 className="bc-name">이윤주</h1>
                            <p className="bc-name-en">
                                <span className="bc-name-latin">Rev. Dr. Lee YoonJoo</span> · 학장 / 담임목사
                            </p>
                        </div>

                        <div className="bc-portrait-wrap">
                            <Image
                                src="/images/faculty/lee-yoonju.jpg"
                                alt="이윤주 학장 프로필 사진"
                                fill
                                sizes="84px"
                                className="bc-portrait-img"
                                priority
                            />
                        </div>
                    </div>

                    <p className="bc-company">바라크아카데미 · 산해원교회 · 제이합미션</p>
                    <p className="bc-tagline">
                        하나님 앞에 겸손히 무릎 꿇는 영성(<span className="bc-hebrew">ברך</span>)으로 깨어나는 새 시대 사역자
                    </p>

                    {/* Credentials & Key Roles Pills */}
                    <div className="bc-credentials">
                        <div className="bc-cred-row">
                            <span className="bc-cred-dot" />
                            <span>이화여자대학교 신학대학원 졸업 (Th.M) · 호서대학교 구약학 박사 (Ph.D)</span>
                        </div>
                        <div className="bc-cred-row">
                            <span className="bc-cred-dot" />
                            <span>바라크아카데미 학장 · 산해원교회 담임목사 · 제이합미션(JHOP) 대표</span>
                        </div>
                        <div className="bc-cred-row">
                            <span className="bc-cred-dot" />
                            <span>한국기독교대학 신학대학원 협의회(한기신협) 이사</span>
                        </div>
                    </div>
                </section>

                {/* 3. Quick Contact 5-Grid Navigation */}
                <nav className="bc-quick" aria-label="바로 연락">
                    <a className="bc-quick-btn" href="tel:01052056970">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        전화
                    </a>
                    <a className="bc-quick-btn" href="sms:01052056970">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        문자
                    </a>
                    <a className="bc-quick-btn" href="mailto:jhop3927@naver.com">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m22 7-10 6L2 7" />
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                        이메일
                    </a>
                    <a className="bc-quick-btn" href="#tv">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10 9l5 3-5 3z" />
                            <rect x="2" y="5" width="20" height="14" rx="4" />
                        </svg>
                        영상
                    </a>
                    <Link className="bc-quick-btn" href="/?utm_source=bizcard&utm_medium=digital_card">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        웹사이트
                    </Link>
                </nav>

                {/* 4. Primary CTAs (Save Contact + Apply/Inquiry) */}
                <div className="bc-cta">
                    <a className="bc-cta-main" href="/c/dean/vcard?s=share&c=kakao">
                        <svg
                            aria-hidden="true"
                            className="bc-ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                        연락처 저장
                    </a>

                    <div className="bc-cta-row">
                        <Link
                            className="bc-cta-sub"
                            href="/apply?utm_source=bizcard&utm_medium=digital_card"
                        >
                            <svg
                                aria-hidden="true"
                                className="bc-ico"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                            </svg>
                            입학·수강 신청
                        </Link>
                        <a className="bc-cta-sub" href={mailtoHref}>
                            <svg
                                aria-hidden="true"
                                className="bc-ico"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M16 2v4M8 2v4M3 10h18" />
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                            </svg>
                            상담·사역 문의
                        </a>
                    </div>

                    <p className="bc-cta-hint">
                        「연락처 저장」을 누르면 휴대폰 연락처 앱이 열리고, 이윤주 학장의 이름·번호·이메일·웹사이트가 채워진 저장 화면이 나옵니다.
                    </p>
                </div>

                {/* 5. TV / Video Showcase Section */}
                <section id="tv" className="bc-tv" aria-label="바라크아카데미 · J-HOP TV 영상">
                    <div className="bc-tv-head">
                        <div className="bc-tv-avatar">
                            <svg aria-hidden="true" className="bc-tv-avatar-mark" viewBox="0 0 64 64">
                                <path
                                    d="M32 6L10 16v18c0 14.5 9.4 27.6 22 32 12.6-4.4 22-17.5 22-32V16L32 6z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4.2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M32 17v28M21 28h22"
                                    stroke="currentColor"
                                    strokeWidth="4.2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div className="bc-tv-meta">
                            <p className="bc-eyebrow">BARAK · J-HOP TV</p>
                            <p className="bc-tv-name">바라크아카데미 유튜브 채널</p>
                            <p className="bc-tv-handle">@jhoptv</p>
                        </div>
                        <a
                            className="bc-tv-sub"
                            href="https://www.youtube.com/@jhoptv?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                aria-hidden="true"
                                className="bc-ico"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            구독
                        </a>
                    </div>

                    {/* Featured Video */}
                    <button
                        type="button"
                        className="bc-tv-feature"
                        onClick={() => setActiveVideo(FEATURED_VIDEO)}
                        aria-label={`${FEATURED_VIDEO.title} 영상 재생`}
                    >
                        <span className="bc-tv-frame">
                            <img
                                src={FEATURED_VIDEO.thumb || `https://i.ytimg.com/vi/${FEATURED_VIDEO.id}/hqdefault.jpg`}
                                alt=""
                                loading="lazy"
                            />
                            <span className="bc-tv-badge">{FEATURED_VIDEO.badge}</span>
                            <span className="bc-tv-dur">{FEATURED_VIDEO.duration}</span>
                            <span className="bc-tv-play bc-tv-play-lg">
                                <svg aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M7 4.5v15l13-7.5z" />
                                </svg>
                            </span>
                        </span>
                        <span className="bc-tv-title">{FEATURED_VIDEO.title}</span>
                        {FEATURED_VIDEO.subtitle && (
                            <span className="bc-tv-subdesc">{FEATURED_VIDEO.subtitle}</span>
                        )}
                    </button>

                    {/* Recent / Special Sermon Videos */}
                    <div className="bc-tv-row-head">
                        <h2 className="bc-tv-row-title">설립 취지 특강 &amp; 대표 강의</h2>
                        <a
                            href="https://www.youtube.com/@jhoptv/videos"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            채널 전체 보기 →
                        </a>
                    </div>
                    <ul className="bc-tv-row">
                        {RECENT_VIDEOS.map((video) => (
                            <li key={video.id}>
                                <button
                                    type="button"
                                    className="bc-tv-item"
                                    onClick={() => setActiveVideo(video)}
                                    aria-label={`${video.title} 영상 재생`}
                                >
                                    <span className="bc-tv-frame">
                                        <img
                                            src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                                            alt=""
                                            loading="lazy"
                                        />
                                        <span className="bc-tv-dur">{video.duration}</span>
                                        <span className="bc-tv-play">
                                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M7 4.5v15l13-7.5z" />
                                            </svg>
                                        </span>
                                    </span>
                                    <span className="bc-tv-item-title">{video.title}</span>
                                    <span className="bc-tv-item-date">{video.date}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 6. Academy Vision & Highlights (Press / Featured Info equivalent) */}
                <section className="bc-press" aria-label="아카데미 주요 소식 및 연구">
                    <h2 className="bc-section-label">ACADEMY HIGHLIGHTS &amp; VISION</h2>
                    {NEWS_HIGHLIGHTS.map((item, idx) => (
                        <Link key={idx} className="bc-press-item" href={item.href}>
                            <p className="bc-press-meta">{item.meta}</p>
                            <p className="bc-press-title">{item.title}</p>
                            <p className="bc-press-sum">{item.summary}</p>
                            <p className="bc-press-more">{item.linkText}</p>
                        </Link>
                    ))}
                </section>

                {/* 7. Locations & Websites */}
                <section className="bc-offices" aria-label="오시는 길 및 공식 채널">
                    <h2 className="bc-section-label">LOCATIONS &amp; CHANNELS</h2>

                    <div className="bc-office">
                        <div className="bc-office-text">
                            <p className="bc-office-label">바라크아카데미 · 산해원 채플</p>
                            <p className="bc-office-addr">경기도 성남시 분당구 수내로 54, 2707호(수내동,삼성보보스쉐르빌)</p>
                        </div>
                        <a
                            className="bc-round"
                            href="https://map.kakao.com/?q=%EA%B2%BD%EA%B8%B0%20%EC%84%B1%EB%82%A8%EC%8B%9C%20%EB%B6%84%EB%8B%B9%EA%B5%AC%20%EC%88%98%EB%82%B4%EB%A1%9C%2054"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="바라크아카데미 지도 보기"
                        >
                            <svg
                                aria-hidden="true"
                                className="bc-ico"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </a>
                    </div>

                    <div className="bc-office">
                        <div className="bc-office-text">
                            <p className="bc-office-label">산해원교회 · 제이합미션 (JHOP Mission)</p>
                            <p className="bc-office-addr">주일예배 매주 오전 11:00 · 온라인 캠퍼스 상시 개방 (sanhaewon.com)</p>
                        </div>
                        <a
                            className="bc-round"
                            href="https://sanhaewon.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="산해원교회 홈페이지 바로가기"
                        >
                            <svg
                                aria-hidden="true"
                                className="bc-ico"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </a>
                    </div>
                </section>

                {/* 8. Footer */}
                <footer className="bc-foot">
                    <p>“이 부르심은 하나님께서 주신 마지막 거룩한 사명입니다”</p>
                    <p className="bc-foot-site">WWW.BARAK.AC</p>
                </footer>
            </div>

            {/* Video Lightbox Modal */}
            {activeVideo && (
                <div
                    className="bc-modal-backdrop"
                    onClick={() => setActiveVideo(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeVideo.title}
                >
                    <div className="bc-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="bc-modal-frame">
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                title={activeVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <div className="bc-modal-bar">
                            <div className="bc-modal-title">
                                {activeVideo.title}
                                <small>{activeVideo.date}</small>
                            </div>
                            <a
                                className="bc-modal-yt"
                                href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube에서 열기 ↗
                            </a>
                            <button
                                type="button"
                                className="bc-modal-close"
                                onClick={() => setActiveVideo(null)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Copy Toast */}
            {toastMessage && (
                <div className="bc-toast" role="status" aria-live="polite">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
