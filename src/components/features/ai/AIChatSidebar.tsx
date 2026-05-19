"use client";

import { useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, Plus, Star } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { CALEB_PERSONA } from "@/lib/ai/caleb-persona";
import { motion, AnimatePresence } from "framer-motion";

export function AIChatSidebar() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
        setInput
    } = useChat({
        api: "/api/chat",
        initialMessages: CALEB_PERSONA.initialMessages,
    } as any) as any;

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

    const suggestionChips = [
        { label: "💡 설교 아웃라인", prompt: "방금 들은 강의 내용을 바탕으로 주일 설교 아웃라인을 3대지로 작성해줘." },
        { label: "🙏 중보기도문", prompt: "이 강의의 핵심 메시지를 가지고 우리 교회를 위한 중보기도문을 작성해줘." },
        { label: "⛪ 청년부 적용", prompt: "이 내용을 우리 교회 청년부에 실제로 적용하려면 어떤 프로그램을 기획하면 좋을까?" },
    ];

    const handleSuggestionClick = (prompt: string) => {
        if (append) {
            append({ role: "user", content: prompt });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] border-l border-slate-200 shadow-2xl w-full lg:w-[400px] relative">
            {/* Header: Divine Gold Gradient */}
            <div className="flex-none p-5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center ring-2 ring-white/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#0f172a]" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight text-yellow-500">Caleb AI</h2>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Spiritual Mentor</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                    <Star className="w-5 h-5" />
                </button>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full justify-start"
                    >
                        <div className="flex max-w-[85%] flex-col px-5 py-3.5 shadow-sm text-sm leading-relaxed relative bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100">
                            <span className="text-[10px] font-bold mb-1 opacity-50 uppercase tracking-wider block text-left text-yellow-600">
                                Caleb
                            </span>
                            <div className="whitespace-pre-wrap">
                                {CALEB_PERSONA.initialMessages[0].content}
                            </div>
                        </div>
                    </motion.div>
                )}
                {messages.map((m: any) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={m.id}
                        className={cn(
                            "flex w-full",
                            m.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "flex max-w-[85%] flex-col px-5 py-3.5 shadow-sm text-sm leading-relaxed relative",
                                m.role === "user"
                                    ? "bg-[#0f172a] text-white rounded-2xl rounded-tr-sm"
                                    : "bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100"
                            )}
                        >
                            {/* Role Label */}
                            <span className={cn(
                                "text-[10px] font-bold mb-1 opacity-50 uppercase tracking-wider block",
                                m.role === "user" ? "text-right text-blue-200" : "text-left text-yellow-600"
                            )}>
                                {m.role === "user" ? "Me" : "Caleb"}
                            </span>

                            <div className="whitespace-pre-wrap">
                                {m.content}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (Floating) */}
            <div className="px-4 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide z-10">
                <div className="flex gap-2">
                    {suggestionChips.map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(chip.prompt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-yellow-500/20 rounded-full text-xs font-bold text-slate-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-500/50 transition-all shadow-sm"
                        >
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            {chip.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 z-20">
                <form onSubmit={handleSubmit} className="flex gap-2 relative bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
                    <input
                        value={input || ""}
                        onChange={safeHandleInputChange}
                        placeholder="Ask Caleb..."
                        className="flex-1 pl-3 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 text-slate-900"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !(input || "").trim()}
                        className="p-2 bg-[#0f172a] text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
