"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Folder, PlayCircle, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Save, X, Video } from "lucide-react";
import { Course, Module, STORAGE_KEYS, db, safeStorage } from "@/lib/storage";

// --- Module Editor Modal ---
interface ModuleModalProps {
    isOpen: boolean;
    initialData: Partial<Module> | null;
    onClose: () => void;
    onSave: (data: Partial<Module>) => void;
    courseTitle: string;
}

const ModuleModal = ({ isOpen, initialData, onClose, onSave, courseTitle }: ModuleModalProps) => {
    const [formData, setFormData] = useState<Partial<Module>>({
        title: "",
        duration: "",
        videoUrl: "",
        description: ""
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ title: "", duration: "", videoUrl: "", description: "" });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800">{initialData?.id ? "모듈 수정" : "새 모듈 추가"}</h3>
                        <p className="text-xs text-slate-500">{courseTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">모듈 제목</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="예: Lesson 1: 드보라의 영성"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">재생 시간</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="예: 15:00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> YouTube URL</span>
                            </label>
                            <input
                                type="text"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="https://youtu.be/..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                            placeholder="강의 내용을 간단히 요약해주세요"
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">
                        취소
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={!formData.title}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CurriculumManagementPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    // Module Modal State
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);

    useEffect(() => {
        refreshCourses();
    }, []);

    const refreshCourses = () => {
        if (typeof window !== "undefined") {
            setCourses(db.courses.getAll());
        }
    };

    const toggleExpand = (id: number) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    // --- CRUD Operations ---

    const handleCreateCourse = () => {
        const newCourseData = {
            title: "새 코스",
            subTitle: "부제목을 입력하세요",
            description: "코스 설명을 입력하세요.",
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
        };
        const created = db.courses.create(newCourseData);
        refreshCourses();
        setSelectedCourse(created);
        setExpandedIds(prev => new Set(prev).add(created.id));
    };

    const handleSaveCourse = () => {
        if (!selectedCourse) return;

        db.courses.update(selectedCourse.id, selectedCourse);
        refreshCourses();
        alert("코스가 저장되었습니다.");
    };

    const handleDeleteCourse = (id: number) => {
        if (confirm("정말 이 코스를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
            db.courses.delete(id);
            refreshCourses();
            if (selectedCourse?.id === id) setSelectedCourse(null);
        }
    };

    // --- Module Operations ---

    const openCreateModule = () => {
        setEditingModule(null);
        setIsModuleModalOpen(true);
    };

    const openEditModule = (module: Module) => {
        setEditingModule(module);
        setIsModuleModalOpen(true);
    };

    const handleSaveModule = (moduleData: Partial<Module>) => {
        if (!selectedCourse) return;

        if (editingModule && editingModule.id) {
            // Update
            db.courses.updateModule(selectedCourse.id, editingModule.id, moduleData);
        } else {
            // Create
            db.courses.addModule(selectedCourse.id, moduleData as Omit<Module, "id">);
        }

        // Refresh state
        refreshCourses();

        // Update selected course state to reflect changes immediately in the detail view
        // We need to fetch the updated course from the fresh list (or just reload it)
        // Since refreshCourses update state async, we might not have it yet.
        // Let's just manually update selectedCourse from the DB for safety or wait for effect?
        // Simpler: reload data and update selectedCourse from it.
        // We can access storage directly to get fresh copy or just wait.
        // Since this is sync in localStorage, it works.
        const freshList = db.courses.getAll(); // sync
        const freshCourse = freshList.find(c => c.id === selectedCourse.id);
        if (freshCourse) setSelectedCourse(freshCourse);

        setIsModuleModalOpen(false);
    };

    const handleDeleteModule = (courseId: number, moduleId: string) => {
        if (confirm("이 모듈을 삭제하시겠습니까?")) {
            db.courses.removeModule(courseId, moduleId);

            const freshList = db.courses.getAll();
            setCourses(freshList);

            const freshCourse = freshList.find(c => c.id === courseId);
            if (freshCourse) setSelectedCourse(freshCourse);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
            <div className="flex flex-1 min-h-0 flex-col lg:flex-row gap-6">
                <ModuleModal
                    isOpen={isModuleModalOpen}
                    initialData={editingModule}
                    onClose={() => setIsModuleModalOpen(false)}
                    onSave={handleSaveModule}
                    courseTitle={selectedCourse?.title || ""}
                />

                {/* Left Panel: Tree Structure */}
                <div className="bg-white w-full lg:w-1/3 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Folder className="w-4 h-4 text-indigo-500" />
                            커리큘럼 트리 ({courses.length})
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (confirm("경고: 모든 변경사항이 삭제되고 초기 공식 커리큘럼으로 초기화됩니다.\n계속하시겠습니까?")) {
                                        const { mockCourses } = require("@/lib/mockData");
                                        safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mockCourses));
                                        setCourses(mockCourses);
                                        setSelectedCourse(null);
                                        setExpandedIds(new Set());
                                        alert("공식 커리큘럼으로 초기화되었습니다.");
                                    }
                                }}
                                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 flex items-center gap-1 font-medium transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> 초기화
                            </button>
                            <button
                                onClick={handleCreateCourse}
                                className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1 font-medium transition-colors"
                            >
                                <Plus className="w-3 h-3" /> 코스 추가
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {courses.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">등록된 코스가 없습니다.</div>}
                        {courses.map(course => (
                            <div key={course.id} className="mb-2">
                                {/* Course Item */}
                                <div
                                    className={`
                                    flex items-center group cursor-pointer p-2 rounded-lg text-sm select-none transition-colors
                                    ${selectedCourse?.id === course.id ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "hover:bg-slate-50 text-slate-700"}
                                `}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <button
                                        className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded"
                                        onClick={(e) => { e.stopPropagation(); toggleExpand(course.id); }}
                                    >
                                        {expandedIds.has(course.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    </button>
                                    <BookOpen className={`w-4 h-4 mr-2 ${selectedCourse?.id === course.id ? "text-indigo-500" : "text-slate-400"}`} />
                                    <span className="flex-1 font-medium truncate">{course.title}</span>

                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id) }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modules List */}
                                {expandedIds.has(course.id) && (
                                    <div className="ml-6 pl-2 border-l border-slate-200 mt-1 space-y-1">
                                        {course.modules.length === 0 && (
                                            <div className="p-2 text-xs text-slate-400 italic">모듈 없음</div>
                                        )}
                                        {course.modules.map(module => (
                                            <div
                                                key={module.id}
                                                className="flex items-center group p-2 rounded-lg text-xs hover:bg-slate-50 text-slate-600 cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); openEditModule(module); }}
                                            >
                                                <PlayCircle className="w-3 h-3 mr-2 text-slate-400" />
                                                <span className="flex-1 truncate">{module.title}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteModule(course.id, module.id) }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Editor / Details */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-6 overflow-hidden">
                    {selectedCourse ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                                <div>
                                    <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase">과정 편집</span>
                                    <h1 className="text-2xl font-bold text-slate-900 mt-1">{selectedCourse.title}</h1>
                                </div>
                                <button
                                    onClick={handleSaveCourse}
                                    className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm transition-all hover:shadow-md active:scale-95"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    변경사항 저장
                                </button>
                            </div>

                            {/* Scrollable Form Area */}
                            <div className="flex-1 overflow-y-auto pr-2 mt-6 space-y-6">
                                {/* Course Details */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">코스 제목</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                            value={selectedCourse.title}
                                            onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                                            placeholder="코스 제목"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">부제목</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                            value={selectedCourse.subTitle}
                                            onChange={(e) => setSelectedCourse({ ...selectedCourse, subTitle: e.target.value })}
                                            placeholder="예: Vision: 말씀의 분별과 설교"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
                                        <textarea
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white h-20 resize-none"
                                            value={selectedCourse.description}
                                            onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">썸네일 URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                            value={selectedCourse.thumbnail}
                                            onChange={(e) => setSelectedCourse({ ...selectedCourse, thumbnail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Modules Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-bold text-slate-700">
                                            포함된 모듈 ({selectedCourse.modules.length})
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        {selectedCourse.modules.map((m, idx) => (
                                            <div key={m.id} className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all group">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-slate-900 truncate">{m.title}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{m.duration}</span>
                                                        <span className="truncate">{m.description}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModule(m)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteModule(selectedCourse.id, m.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={openCreateModule}
                                            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <div className="p-1 rounded bg-current/10">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            새 모듈 추가하기
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <BookOpen className="w-10 h-10 opacity-30" />
                            </div>
                            <p className="text-lg font-bold text-slate-500">편집할 코스를 선택하세요</p>
                            <p className="text-sm mt-1">좌측 메뉴에서 선택하거나 새로운 코스를 생성하세요.</p>
                            <button
                                onClick={handleCreateCourse}
                                className="mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                코스 생성하기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shrink-0">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    커리큘럼 관리 가이드
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2">
                        <strong className="text-slate-900 block flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</div>
                            코스 생성 및 관리
                        </strong>
                        <p className="text-slate-600 leading-relaxed pl-7">
                            '코스 추가' 버튼으로 새로운 대주제(트랙)를 생성하세요. 코스의 제목, 부제목, 설명을 수정하면 자동으로 반영됩니다.
                            변경 후 반드시 '저장' 버튼을 눌러야 합니다.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <strong className="text-slate-900 block flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</div>
                            모듈 및 강의 등록
                        </strong>
                        <p className="text-slate-600 leading-relaxed pl-7">
                            각 코스 내에 '새 모듈 추가하기'를 통해 강의를 등록합니다. YouTube URL을 입력하면 자동으로 플레이어에 연동됩니다.
                            재생 시간은 '15:00' 형식으로 입력하세요.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <strong className="text-slate-900 block flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</div>
                            데이터 저장 및 주의사항
                        </strong>
                        <p className="text-slate-600 leading-relaxed pl-7">
                            모든 데이터는 브라우저에 임시 저장됩니다. 캐시를 삭제하면 데이터가 유실될 수 있으니 주의하세요.
                            삭제된 코스와 모듈은 복구할 수 없습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
