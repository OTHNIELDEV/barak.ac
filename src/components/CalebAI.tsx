"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function CalebAI() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="mb-4 w-72 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in">
                    <div className="bg-primary p-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold">Caleb AI</h3>
                            <p className="text-blue-200 text-xs">Always here to help</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center text-gray-500 text-sm text-center">
                        안녕하세요! 무엇을 도와드릴까요?
                        <br />(AI Chat Feature Coming Soon)
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <input type="text" placeholder="Type a message..." className="w-full text-sm border-none focus:ring-0 text-gray-900 placeholder:text-gray-400" disabled />
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Open Caleb AI Chat"
            >
                <MessageCircle className="w-7 h-7" />
                <span className="absolute right-0 top-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
            </button>
        </div>
    );
}
