"use client";

import { useState, useEffect } from "react";
import { db, Post, STORAGE_KEYS } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Heart, HelpCircle, Plus, Search, Filter, MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState<"all" | "free" | "prayer" | "qna">("all");
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "free" as const });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load initial posts
        if (typeof window !== "undefined") {
            const allPosts = db.posts.getAll();
            setPosts(allPosts);
            setIsLoading(false);
        }
    }, []);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const created = db.posts.create({
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            authorId: user.id,
            authorName: user.name,
        });

        setPosts([created, ...posts]);
        setIsWriteModalOpen(false);
        setNewPost({ title: "", content: "", category: "free" }); // Reset
    };

    const filteredPosts = filter === "all" ? posts : posts.filter(p => p.category === filter);

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "free": return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">자유</span>;
            case "prayer": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">기도제목</span>;
            case "qna": return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">질문</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">커뮤니티</h1>
                    <p className="text-slate-500">동역자들과 함께 나누고 기도하는 공간입니다.</p>
                </div>
                <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    새 글 쓰기
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: "all", label: "전체", icon: null },
                    { id: "free", label: "자유게시판", icon: MessageSquare },
                    { id: "prayer", label: "기도제목", icon: Heart },
                    { id: "qna", label: "질문있어요", icon: HelpCircle },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                            filter === tab.id
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        )}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">아직 등록된 게시글이 없습니다. 첫 글을 남겨보세요!</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {getCategoryBadge(post.category)}
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">{post.title}</h3>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                    {post.content}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-[10px]">
                                            {post.authorName[0]}
                                        </div>
                                        <span>{post.authorName}</span>
                                    </div>
                                    <div>
                                        조회 {post.views}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Write Modal */}
            <AnimatePresence>
                {isWriteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h2 className="font-bold text-lg text-slate-900">새 글 쓰기</h2>
                                <button onClick={() => setIsWriteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">카테고리</label>
                                    <select
                                        value={newPost.category}
                                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="free">자유게시판</option>
                                        <option value="prayer">기도제목</option>
                                        <option value="qna">질문있어요</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">제목</label>
                                    <input
                                        type="text"
                                        required
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        placeholder="제목을 입력하세요"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">내용</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                        placeholder="나누고 싶은 이야기를 적어주세요."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    등록하기
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
