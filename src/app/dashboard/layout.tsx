"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    MessageCircle,
    Award,
    Users,
    Settings,
    Shield,
    Bell,
    Menu,
    X,
    Search,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mockData";
import { Logo } from "@/components/ui/Logo";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
        { name: "내 강의실", href: "/my-classroom", icon: BookOpen },
        { name: "갈렙 AI 튜터", href: "/dashboard/caleb-ai", icon: MessageCircle },
        { name: "마이 페이지", href: "/dashboard/my-page", icon: Users },
        // { name: "커뮤니티", href: "/dashboard/community", icon: Users }, // Disabled for MVP
        // { name: "설정", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="flex flex-1">
                {/* Sidebar (Desktop) - Changed from fixed to flex item */}
                <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 z-30">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <Link href="/" className="block">
                            <Logo size="sm" />
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                                        isActive
                                            ? "bg-blue-50 text-blue-900"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <img src={mockUser.profileImage} alt={mockUser.name} className="w-10 h-10 rounded-full bg-slate-100" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{mockUser.name}</p>
                                <p className="text-xs text-slate-500 truncate">{mockUser.role}</p>
                            </div>
                        </div>
                        <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <LogOut className="w-5 h-5" />
                            로그아웃
                        </Link>
                    </div>
                </aside>

                {/* Main Content Wrapper - Removed margin-left */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Top Bar */}
                    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Breadcrumbs (Simplified) */}
                            <nav className="hidden sm:flex text-sm font-medium text-slate-500">
                                <span className="hover:text-slate-900">홈</span>
                                <span className="mx-2">/</span>
                                <span className="text-slate-900">{navItems.find(i => i.href === pathname)?.name || "대시보드"}</span>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Search (Optional) */}
                            <div className="hidden md:flex relative">
                                <input
                                    type="text"
                                    placeholder="강의 검색..."
                                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-48 focus:w-64 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>

                            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            <Link href="/dashboard/caleb-ai" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-blue-800 transition-all hover:shadow-lg">
                                <MessageCircle className="w-4 h-4" />
                                <span className="hidden md:inline">AI 질문하기</span>
                            </Link>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>

            {/* Footer - Full Width */}
            <PublicFooter />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-left duration-300">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                            <span className="text-lg font-bold text-blue-900">메뉴</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 py-6 px-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                                        pathname === item.href
                                            ? "bg-blue-50 text-blue-900"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}
        </div>
    );
}
