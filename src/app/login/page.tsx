"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/storage";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        church: "",
        level: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                // Signup
                await db.auth.signup({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    role: "student",
                    church: formData.church,
                    level: formData.level,
                    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.name
                });
                await login(formData.email, formData.password);
            }
        } catch (err: any) {
            setError(err.message || "오류가 발생했습니다.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side: Divine Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex flex-1 relative bg-[#0f172a] overflow-hidden items-center justify-center">
                {/* Abstract 3D Shapes via CSS Gradients */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f172a] to-[#0f172a] animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[80px]" />

                {/* Glass Overlay Content */}
                <div className="relative z-10 p-16 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                            </div>
                            <span className="text-yellow-500 font-medium tracking-wide uppercase text-sm">Spiritual Tech</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            성령의 기름부으심,<br />
                            <span className="text-yellow-500">AI와 함께하는 사역.</span>
                        </h1>

                        <p className="text-lg text-slate-400 mb-10 leading-relaxed border-l-2 border-slate-700 pl-6">
                            BARAK Academy는 영성과 기술의 조화를 통해<br />
                            다음 세대 리더를 위한 실제적인 훈련을 제공합니다.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-white font-bold mb-1">Interactive Lesson</h3>
                                <p className="text-xs text-slate-400">실시간 반응형 강의 시스템</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-white font-bold mb-1">AI Mentoring</h3>
                                <p className="text-xs text-slate-400">갈렙 AI와의 심층 대화</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Minimalist Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[600px] bg-white relative overflow-y-auto py-10">
                <div className="mx-auto w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-10">
                            <Link href="/">
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-8 inline-block animate-bounce-slow">
                                    <Logo size="md" className="scale-100 origin-center" />
                                </div>
                            </Link>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                {isLogin ? "환영합니다" : "사역에 동참하세요"}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                {isLogin ? "사역의 여정을 이어가세요." : "새로운 리더십의 시작을 환영합니다."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">이름</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                                        placeholder="홍길동"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">이메일</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">교회</label>
                                        <input
                                            name="church"
                                            type="text"
                                            required
                                            value={formData.church}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                                            placeholder="출석 교회"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">직분</label>
                                        <input
                                            name="level"
                                            type="text"
                                            required
                                            value={formData.level}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                                            placeholder="예: 목사, 전도사"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0f172a] bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <span className="flex items-center gap-2">
                                        {isLogin ? "로그인하기" : "계정 생성하기"} <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-bold text-[#0f172a] hover:text-blue-900 hover:underline transition-all"
                                >
                                    {isLogin ? "회원가입" : "로그인"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
