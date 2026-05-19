"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, Users, Plus, Edit2, Trash2, CheckCircle, XCircle, X, Save, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Banner, Faculty, db, STORAGE_KEYS } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";

// --- Modals ---

interface BannerModalProps {
    isOpen: boolean;
    initialData: Partial<Banner> | null;
    onClose: () => void;
    onSave: (data: Partial<Banner>) => void;
}

const BannerModal = ({ isOpen, initialData, onClose, onSave }: BannerModalProps) => {
    const [formData, setFormData] = useState<Partial<Banner>>({ title: "", imageUrl: "", link: "", isActive: true });

    useEffect(() => {
        if (isOpen && initialData) setFormData(initialData);
        else setFormData({ title: "", imageUrl: "", link: "", isActive: true });
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-800">{initialData?.id ? "배너 수정" : "새 배너 추가"}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="배너 제목" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">이미지 URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="http://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">링크 URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/admissions 등" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="isActive" className="text-sm font-medium text-slate-700">활성화 상태 (게시)</label>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">취소</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">저장</button>
                </div>
            </div>
        </div>
    );
};

interface FacultyModalProps {
    isOpen: boolean;
    initialData: Partial<Faculty> | null;
    onClose: () => void;
    onSave: (data: Partial<Faculty>) => void;
}

const FacultyModal = ({ isOpen, initialData, onClose, onSave }: FacultyModalProps) => {
    const [formData, setFormData] = useState<Partial<Faculty>>({ name: "", title: "", bio: "", photoUrl: "" });

    useEffect(() => {
        if (isOpen && initialData) setFormData(initialData);
        else setFormData({ name: "", title: "", bio: "", photoUrl: "" });
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-800">{initialData?.id ? "교수진 수정" : "새 교수 추가"}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="홍길동 교수" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">직함/타이틀</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="조직신학 교수" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">소개 (Bio)</label>
                        <textarea className="w-full px-3 py-2 border rounded-lg h-24 resize-none" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="간단한 소개 약력" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">사진 URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.photoUrl} onChange={e => setFormData({ ...formData, photoUrl: e.target.value })} placeholder="http://..." />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">취소</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">저장</button>
                </div>
            </div>
        </div>
    );
};


export default function CMSPage() {
    const [activeTab, setActiveTab] = useState<"banners" | "faculty">("banners");
    const [banners, setBanners] = useState<Banner[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);

    // Modals
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState<Partial<Faculty> | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (typeof window !== "undefined") {
            setBanners(db.admin.banners.getAll());
            setFaculty(db.admin.faculty.getAll());
        }
    };

    // --- Banner Logic ---
    const handleSaveBanner = (data: Partial<Banner>) => {
        let updatedBanners = [...banners];
        if (editingBanner && editingBanner.id) {
            updatedBanners = updatedBanners.map(b => b.id === editingBanner.id ? { ...b, ...data } as Banner : b);
        } else {
            updatedBanners.push({ ...data, id: `bn_${Date.now()}` } as Banner);
        }
        setBanners(updatedBanners);
        db.admin.banners.save(updatedBanners);
        setIsBannerModalOpen(false);
    };

    const handleDeleteBanner = (id: string) => {
        if (confirm("이 배너를 삭제하시겠습니까?")) {
            const updated = banners.filter(b => b.id !== id);
            setBanners(updated);
            db.admin.banners.save(updated);
        }
    };

    const handleToggleBanner = (id: string) => {
        const updated = banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
        setBanners(updated);
        db.admin.banners.save(updated);
    };

    // --- Faculty Logic ---
    const handleSaveFaculty = (data: Partial<Faculty>) => {
        if (editingFaculty && editingFaculty.id) {
            // Update
            db.admin.faculty.update(editingFaculty.id, data);
        } else {
            // Create
            db.admin.faculty.add({ ...data, id: `fac_${Date.now()}` } as Faculty);
        }
        loadData(); // Reload from storage
        setIsFacultyModalOpen(false);
    };

    const handleDeleteFaculty = (id: string) => {
        if (confirm("이 교수진 프로필을 삭제하시겠습니까?")) {
            db.admin.faculty.remove(id);
            loadData();
        }
    };

    return (
        <div className="space-y-6">
            <BannerModal isOpen={isBannerModalOpen} initialData={editingBanner} onClose={() => setIsBannerModalOpen(false)} onSave={handleSaveBanner} />
            <FacultyModal isOpen={isFacultyModalOpen} initialData={editingFaculty} onClose={() => setIsFacultyModalOpen(false)} onSave={handleSaveFaculty} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">콘텐츠 관리 (CMS)</h1>
                <p className="text-slate-500">홈페이지 배너 및 교수진 프로필을 관리합니다.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("banners")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${activeTab === "banners" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
                        `}
                    >
                        <Megaphone className="w-4 h-4" /> 배너 관리
                    </button>
                    <button
                        onClick={() => setActiveTab("faculty")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${activeTab === "faculty" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
                        `}
                    >
                        <Users className="w-4 h-4" /> 교수진 관리
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
                {activeTab === "banners" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-slate-800">홈페이지 메인 배너</h3>
                            <button
                                onClick={() => { setEditingBanner(null); setIsBannerModalOpen(true); }}
                                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-1 font-medium"
                            >
                                <Plus className="w-3 h-3" /> 배너 추가
                            </button>
                        </div>

                        <div className="space-y-4">
                            {banners.map(banner => (
                                <div key={banner.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                                    {/* Thumbnail */}
                                    <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative group">
                                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                        <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ring-2 ring-white ${banner.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{banner.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <LinkIcon className="w-3 h-3" />
                                            <span className="truncate">{banner.link}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleBanner(banner.id)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors ${banner.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                                        >
                                            {banner.isActive ? "게시 중" : "비활성"}
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                        <button onClick={() => { setEditingBanner(banner); setIsBannerModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "faculty" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-slate-800">교수진 목록</h3>
                            <button
                                onClick={() => { setEditingFaculty(null); setIsFacultyModalOpen(true); }}
                                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-1 font-medium"
                            >
                                <Plus className="w-3 h-3" /> 교수 추가
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {faculty.map(fac => (
                                <div key={fac.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all bg-white group">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-slate-50">
                                        <img src={fac.photoUrl} alt={fac.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900">{fac.name}</h4>
                                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">{fac.title}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{fac.bio}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingFaculty(fac); setIsFacultyModalOpen(true); }}
                                            className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFaculty(fac.id)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
