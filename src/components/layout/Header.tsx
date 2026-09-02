"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X, ChevronRight, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide Public Header on Dashboard routes, Login page, and Course Player
    if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/course") || pathname?.startsWith("/my-classroom") || pathname === "/login") return null;

    const routes = [
        { name: "아카데미소개", href: "/about" },
        { name: "교수진소개", href: "/faculty" },
        { name: "교육과정", href: "/curriculum" },
        { name: "모집요강", href: "/apply" },
        { name: "산해원채플", href: "/chapel" },
        { name: "갈렙AI", href: "/ai-system" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm"
                    : "bg-white border-b border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <Logo />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-blue-900",
                                pathname === route.href ? "text-blue-900 font-bold" : "text-slate-600"
                            )}
                        >
                            {route.name}
                        </Link>
                    ))}

                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link
                                    href="/dashboard/admin"
                                    className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors flex items-center gap-1"
                                >
                                    <Shield className="w-4 h-4" /> 관리자
                                </Link>
                            )}
                            <Link
                                href="/apply"
                                className="px-5 py-2.5 rounded-full bg-amber-500 text-white text-sm font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <GraduationCap className="w-4 h-4" /> 입학 신청
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-900 text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" /> 내 강의실
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" /> 로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors">
                                로그인
                            </Link>
                            <Link
                                href="/login?mode=signup"
                                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold hover:shadow-lg hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95"
                            >
                                입학 신청
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                                >
                                    {route.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/dashboard/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center justify-center p-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                관리자 페이지
                                            </Link>
                                        )}
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center p-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors"
                                        >
                                            내 강의실
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center justify-center p-3 rounded-xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors"
                                        >
                                            로그아웃
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            로그인
                                        </Link>
                                        <Link
                                            href="/login?mode=signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center p-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors"
                                        >
                                            입학 신청
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
