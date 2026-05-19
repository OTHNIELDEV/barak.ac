"use client";

import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function PublicHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "아카데미 비전", href: "/about" },
        { name: "교육 과정", href: "/curriculum" },
        { name: "AI 시스템", href: "/ai-system" },
        // { name: "커뮤니티", href: "/dashboard/community" }, // Community is usually for logged in users, but we can link to dashboard
    ];

    const publicNavItems = [
        ...navItems,
        { name: "커뮤니티", href: "/dashboard/community" }
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
                            <Shield className="w-6 h-6 text-yellow-500 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-blue-900">BARAK Academy</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors relative group",
                                    pathname === item.href ? "text-blue-900 font-bold" : "text-slate-600 hover:text-blue-900"
                                )}
                            >
                                {item.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full",
                                    pathname === item.href && "w-full"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">
                            로그인
                        </Link>
                        <Link href="/login?mode=signup" className="px-5 py-2.5 bg-blue-900 text-white text-sm font-bold rounded-full hover:bg-blue-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            무료 수강 신청
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-4 space-y-4">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "block text-base font-medium px-2 py-1 rounded-lg",
                                    pathname === item.href ? "text-blue-900 bg-blue-50" : "text-slate-600 hover:text-blue-900 hover:bg-slate-50"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Link href="/login" className="text-center font-bold text-slate-600 py-2 hover:bg-slate-50 rounded-lg">로그인</Link>
                            <Link href="/login?mode=signup" className="block w-full px-5 py-3 bg-blue-900 text-white text-center font-bold rounded-lg hover:bg-blue-800">
                                무료 수강 신청
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
