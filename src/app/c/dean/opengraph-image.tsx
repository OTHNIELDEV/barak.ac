import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "이윤주 학장 · 바라크아카데미 디지털 명함";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "64px 72px",
                    background: "radial-gradient(120% 90% at 85% 15%, #193152 0%, #0b1628 55%, #060b14 100%)",
                    color: "#f6eed7",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative Gold Border */}
                <div
                    style={{
                        position: "absolute",
                        inset: "24px",
                        border: "1.5px solid rgba(216, 180, 100, 0.35)",
                        borderRadius: "28px",
                        display: "flex",
                    }}
                />

                {/* Top Brand Bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #e9c878 0%, #b8862f 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0b1628",
                                fontSize: "24px",
                                fontWeight: 900,
                            }}
                        >
                            B
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    letterSpacing: "0.24em",
                                    color: "#e8c87a",
                                }}
                            >
                                BARAK ACADEMY
                            </span>
                            <span
                                style={{
                                    fontSize: "13px",
                                    letterSpacing: "0.1em",
                                    color: "#94a3b8",
                                }}
                            >
                                산해원교회 산하 온라인 신학 아카데미
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "10px 22px",
                            borderRadius: "999px",
                            background: "rgba(216, 180, 100, 0.14)",
                            border: "1px solid rgba(216, 180, 100, 0.45)",
                            color: "#e8c87a",
                            fontSize: "16px",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            display: "flex",
                        }}
                    >
                        DIGITAL BUSINESS CARD
                    </div>
                </div>

                {/* Middle Profile Info */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        zIndex: 2,
                        marginTop: "12px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            letterSpacing: "0.24em",
                            color: "#c9a458",
                            display: "flex",
                        }}
                    >
                        DEAN &amp; SENIOR PASTOR · PH.D.
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "24px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "74px",
                                fontWeight: 800,
                                color: "#fbf5e6",
                                letterSpacing: "0.08em",
                            }}
                        >
                            이윤주
                        </span>
                        <span
                            style={{
                                fontSize: "30px",
                                fontWeight: 500,
                                color: "#e8c87a",
                            }}
                        >
                            Rev. Dr. Lee Yoonju · 학장 / 담임목사
                        </span>
                    </div>
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#cbd5e1",
                            marginTop: "6px",
                            display: "flex",
                        }}
                    >
                        바라크아카데미 학장 · 산해원교회 담임목사 · 제이합미션 대표
                    </div>
                </div>

                {/* Bottom Contact & Tagline */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(216, 180, 100, 0.25)",
                        paddingTop: "24px",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#e8c87a",
                                fontWeight: 600,
                            }}
                        >
                            “하나님 앞에 겸손히 무릎 꿇는 영성(ברך)으로 새 시대 사역자를 세웁니다”
                        </span>
                        <span
                            style={{
                                fontSize: "17px",
                                color: "#94a3b8",
                            }}
                        >
                            010-5205-6970  |  jhop3927@naver.com  |  www.barak.ac
                        </span>
                    </div>

                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            color: "#c9a458",
                            display: "flex",
                        }}
                    >
                        BARAK.AC/C/DEAN
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
