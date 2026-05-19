"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { Send, Mic, User, Sparkles, MoreVertical, Maximize2, Video, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALEB_PERSONA } from "@/lib/ai/caleb-persona";
import { motion } from "framer-motion";

export default function CalebTutorPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat() as any;

    const safeHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (handleInputChange) {
            handleInputChange(e);
        } else if (setInput) {
            setInput(e.target.value);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0f172a] text-slate-100 overflow-hidden relative">

            {/* 1. Video Call Interface (Top Half) */}
            <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                {/* Background Blur */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/caleb-real-v2.png"
                        alt="Caleb Background"
                        fill
                        className="object-cover opacity-30 blur-2xl scale-110"
                    />
                </div>

                {/* Main Avatar (Digital Twin) */}
                <div className="relative z-10 w-full h-full max-w-4xl mx-auto flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5"
                    >
                        <Image
                            src="/images/caleb-real-v2.png"
                            alt="Caleb AI Twin"
                            fill
                            className="object-contain bg-black"
                        />
                        {/* Status Overlay */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-white tracking-wide">실시간 세션</span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors">
                                <Maximize2 className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* AI Audio Visualizer (Fake) */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 h-8">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 20, 10] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, repeatType: "reverse" }}
                                    className="w-1 bg-white/80 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. Chat Interface (Bottom Split) */}
            <div className="flex-none h-[400px] bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col relative z-20">

                {/* Drag Handle */}
                <div className="w-full h-6 flex items-center justify-center">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6">
                    {messages.map((m: any) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex w-full mb-4",
                                m.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "flex max-w-[80%] flex-col px-5 py-3.5 shadow-sm text-sm leading-relaxed",
                                m.role === "user"
                                    ? "bg-blue-900 text-white rounded-2xl rounded-tr-none"
                                    : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none border border-slate-200"
                            )}>
                                <span className={cn(
                                    "text-[10px] font-bold mb-1 opacity-70 uppercase tracking-wider block",
                                    m.role === "user" ? "text-blue-200" : "text-slate-500"
                                )}>
                                    {m.role === "user" ? "나" : "갈렙 AI"}
                                </span>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">갈렙이 답변을 생성하고 있습니다...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-slate-100 bg-white pb-8">
                    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 max-w-4xl mx-auto">
                        <button type="button" className="p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <Mic className="w-5 h-5" />
                        </button>
                        <input
                            value={input || ''}
                            onChange={safeHandleInputChange}
                            placeholder="무엇이든 물어보세요..."
                            className="flex-1 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-full py-3.5 px-6 border-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input?.trim()}
                            className="p-3.5 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-[420px] left-1/2 -translate-x-1/2 flex gap-4">
                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 border border-white/20 transition-all">
                    <Video className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-red-500/90 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 border border-white/10 transition-all shadow-lg animate-pulse">
                    <PhoneOff className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 border border-white/20 transition-all">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
