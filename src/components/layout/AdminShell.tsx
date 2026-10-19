"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Award,
    Mic2,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    GraduationCap
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { db } from "@/lib/storage";
import { Logo } from "@/components/ui/Logo";

const ADMIN_NAV_ITEMS = [
    { name: "대시보드 개요", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "사용자 관리", href: "/dashboard/admin/users", icon: Users },
    { name: "수강 신청 관리", href: "/dashboard/admin/admissions", icon: GraduationCap },
    { name: "커리큘럼 관리", href: "/dashboard/admin/curriculum", icon: BookOpen },
    { name: "콘텐츠 관리 (CMS)", href: "/dashboard/admin/cms", icon: Mic2 },
    { name: "수료증 관리", href: "/dashboard/admin/certificates", icon: Award },
    { name: "AI 로그 분석", href: "/dashboard/admin/ai-logs", icon: MessageSquare },
    { name: "설정", href: "/dashboard/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const user = db.auth.getCurrentUser();
            if (!user || user.role !== "admin") {
                // Demo / Admin access
            }
            setIsLoading(false);
        };
        checkAuth();

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
                setIsSidebarOpen(false);
            } else {
                setIsMobile(false);
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [router]);

    const handleLogout = () => {
        db.auth.logout();
        router.replace("/");
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <div className="flex-1 flex overflow-hidden relative">
                <AnimatePresence>
                    {isMobile && isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 280 : (isMobile ? 0 : 80),
                        x: isMobile && !isSidebarOpen ? -280 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`
                        fixed lg:static inset-y-0 left-0 z-50
                        bg-[#0a0f1d] border-r border-[#1a1f2d]
                        flex flex-col h-full overflow-hidden
                        shadow-xl
                    `}
                >
                    <div className="h-20 flex items-center px-6 border-b border-[#1a1f2d] relative">
                        <Link href="/" className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && !isMobile ? "justify-center w-full" : ""}`}>
                            {(!isSidebarOpen && !isMobile) ? (
                                <Logo variant="white" className="[&_span]:hidden" />
                            ) : (
                                <Logo variant="white" textVariant="white" />
                            )}
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {ADMIN_NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    className="block"
                                >
                                    <div className={`
                                        relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "text-slate-400 hover:text-white hover:bg-[#1a1f2d]"
                                        }
                                        ${!isSidebarOpen && !isMobile ? "justify-center" : ""}
                                    `}>
                                        <item.icon className={`
                                            w-5 h-5 shrink-0 transition-colors
                                            ${isActive ? "text-amber-400" : "text-slate-500 group-hover:text-white"}
                                        `} />

                                        {(isSidebarOpen || isMobile) && (
                                            <>
                                                <span className="ml-3 text-sm font-medium truncate">{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="absolute w-1 h-6 bg-amber-400 rounded-full left-0 top-1/2 -translate-y-1/2"
                                                    />
                                                )}
                                            </>
                                        )}

                                        {!isSidebarOpen && !isMobile && (
                                            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-[#1a1f2d]">
                        <button
                            onClick={handleLogout}
                            className={`
                                w-full flex items-center px-3 py-3 rounded-xl transition-colors
                                text-slate-400 hover:text-red-400 hover:bg-red-900/10
                                ${!isSidebarOpen && !isMobile ? "justify-center" : ""}
                            `}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {(isSidebarOpen || isMobile) && <span className="ml-3 text-sm font-medium">Log Out</span>}
                        </button>
                    </div>
                </motion.aside>

                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center text-sm text-slate-500">
                                <span className="font-medium text-slate-900">Dashboard</span>
                                {pathname !== "/dashboard/admin" && (
                                    <>
                                        <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                                        <span className="capitalize">{pathname.split("/").pop()}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-medium text-amber-700">Admin Mode Active</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300">
                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white text-xs font-bold">A</div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10">
                        <div className={`max-w-7xl mx-auto transition-all duration-300 w-full ${!isSidebarOpen ? "max-w-full" : ""}`}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            <div className="shrink-0 z-50 relative">
                <PublicFooter />
            </div>
        </div>
    );
}
