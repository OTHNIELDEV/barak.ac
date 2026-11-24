import { NextResponse } from "next/server";

export async function GET() {
    const vcardLines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:이;윤주;;;Ph.D.",
        "FN:이윤주 학장 (바라크아카데미)",
        "ORG:바라크아카데미 (Barak Academy);산해원교회 · 제이합미션",
        "TITLE:학장 · 담임목사 · 신학박사(Ph.D.)",
        "TEL;TYPE=CELL,VOICE:+82-10-5205-6970",
        "EMAIL;TYPE=INTERNET,WORK:jhop3927@naver.com",
        "URL:https://barak.ac",
        "item1.ADR;TYPE=WORK:;;수내로 54\\, 2707호(수내동\\,삼성보보스쉐르빌);성남시 분당구;경기도;;대한민국",
        "item1.X-ABLabel:바라크아카데미 · 산해원 채플",
        "item2.URL:https://www.youtube.com/@jhoptv",
        "item2.X-ABLabel:J-HOP TV 유튜브 채널",
        "item3.URL:https://sanhaewon.com",
        "item3.X-ABLabel:산해원교회 공식 홈페이지",
        "item4.URL:https://barak.ac/c/dean",
        "item4.X-ABLabel:디지털 명함",
        "NOTE:바라크아카데미 학장 · 산해원교회 담임목사 · 제이합미션(JHOP Mission) 대표 · 한기신협 이사 | 하나님 앞에 무릎 꿇는 영성(ברך)으로 깨어나는 새 시대 사역자. Rev. Dr. Lee YoonJoo, Dean of Barak Academy",
        "END:VCARD",
    ];

    const vcardBody = vcardLines.join("\r\n") + "\r\n";

    return new NextResponse(vcardBody, {
        status: 200,
        headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": "attachment; filename=\"Lee_YoonJoo_Dean_Barak_Academy.vcf\"; filename*=UTF-8''%EC%9D%B4%EC%9C%A4%EC%A3%BC_%EB%B0%94%EB%9D%BC%ED%81%AC%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8_%ED%95%99%EC%9E%A5.vcf",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
