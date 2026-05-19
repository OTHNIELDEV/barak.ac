import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export function PublicFooter() {
    return (
        <footer className="bg-slate-900 py-12 md:py-20 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Balanced 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 border-b border-slate-800 pb-12 mb-12">

                    {/* 1. Brand Identity (Left) */}
                    <div className="col-span-1 flex flex-col items-start">
                        <Link href="/" className="inline-block mb-6">
                            <Logo variant="white" textVariant="white" />
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            하나님의 말씀을 바르게 배우고,<br />
                            사역의 현장에서 능력 있게 쓰임 받는 리더를 양성합니다.
                        </p>
                    </div>

                    {/* 2. Menu 1: Academy (Center Left) */}
                    <div className="col-span-1 flex flex-col items-start md:items-center">
                        <h4 className="text-white font-bold mb-6">아카데미</h4>
                        <div className="flex flex-col space-y-4 text-sm font-medium md:text-center">
                            <Link href="/about" className="hover:text-amber-400 transition-colors">아카데미 비전</Link>
                            <Link href="/curriculum" className="hover:text-amber-400 transition-colors">교육 과정</Link>
                            <Link href="/faculty" className="hover:text-amber-400 transition-colors">교수진 소개</Link>
                        </div>
                    </div>

                    {/* 3. Menu 2: Community (Center Right) */}
                    <div className="col-span-1 flex flex-col items-start md:items-center">
                        <h4 className="text-white font-bold mb-6">커뮤니티</h4>
                        <div className="flex flex-col space-y-4 text-sm font-medium md:text-center">
                            <Link href="/ai-system" className="hover:text-amber-400 transition-colors">갈렙 AI</Link>
                            <Link href="/chapel" className="hover:text-amber-400 transition-colors">산해원 채플</Link>
                            <Link href="/dashboard/community" className="hover:text-amber-400 transition-colors">커뮤니티</Link>
                            <Link href="http://localhost:5173" target="_blank" className="hover:text-amber-400 transition-colors">산해원교회</Link>
                        </div>
                    </div>

                    {/* 4. Contact (Right) */}
                    <div className="col-span-1 flex flex-col items-start md:items-end">
                        <h4 className="text-white font-bold mb-6">문의처</h4>
                        <ul className="space-y-4 text-sm text-slate-400 md:text-right">
                            <li>설립자: 이갈렙 목사</li>
                            <li>Email: contact@barak.ac</li>
                            <li>Tel: 02-1234-5678</li>
                            <li className="pt-2 text-xs text-slate-600 leading-relaxed">
                                서울특별시 강남구 테헤란로 123<br />
                                바라크 아카데미 본부
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <span>&copy; {new Date().getFullYear()} Barak Academy. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-slate-400 transition-colors">이용약관</Link>
                        <Link href="#" className="hover:text-slate-400 transition-colors">개인정보처리방침</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
