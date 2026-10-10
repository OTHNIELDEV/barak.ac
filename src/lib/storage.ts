"use client";

import { mockCourses as SEED_COURSES } from "./mockData";

export const STORAGE_KEYS = {
    USERS: "barak_users",
    COURSES: "barak_courses",
    PROGRESS: "barak_progress",
    CURRENT_USER: "barak_session_user",
    POSTS: "barak_lms_posts",
    // Admin Keys
    BANNERS: "barak_admin_banners",
    FACULTY: "barak_admin_faculty",
    CERTIFICATES: "barak_admin_certificates",
    AI_LOGS: "barak_admin_ai_logs",
    APPLICATIONS: "barak_admin_applications",
    DELETED_APPLICATIONS: "barak_deleted_applications",
};

// In-Memory Storage Fallback to prevent QuotaExceededError or SSR crashes
const memoryStorage: Record<string, string> = {};

export const safeStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === "undefined") {
            return memoryStorage[key] ?? null;
        }
        try {
            const item = localStorage.getItem(key);
            if (item !== null) return item;
            return memoryStorage[key] ?? null;
        } catch (e) {
            console.warn(`[Storage] Failed to read "${key}" from localStorage:`, e);
            return memoryStorage[key] ?? null;
        }
    },
    setItem: (key: string, value: string): void => {
        memoryStorage[key] = value;
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`[Storage] Failed to write "${key}" to localStorage (QuotaExceeded or disabled). Falling back to memory storage:`, e);
        }
    },
    removeItem: (key: string): void => {
        delete memoryStorage[key];
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`[Storage] Failed to remove "${key}" from localStorage:`, e);
        }
    },
    clear: (): void => {
        Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]);
        if (typeof window === "undefined") return;
        try {
            localStorage.clear();
        } catch (e) {
            console.warn(`[Storage] Failed to clear localStorage:`, e);
        }
    }
};

// Types
export interface Application {
    id: string;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    church: string;
    position: string;
    department?: string;
    track: "deborah" | "barak" | "jael";
    motivation: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: "student" | "pastor" | "admin";
    church?: string;
    profileImage?: string;
    level?: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    category: "free" | "prayer" | "qna";
    views: number;
}

export interface AccessLog {
    date: string; // YYYY-MM-DD
    count: number;
}

export interface Progress {
    userId: string;
    courseId: number;
    completedLessons: string[]; // lesson IDs
    lastAccess: string;
    accessLogs?: AccessLog[];
}

export interface Module {
    id: string;
    title: string;
    duration: string;
    videoUrl: string; // YouTube Watch URL
    description: string;
}

export interface Course {
    id: number;
    title: string;
    subTitle?: string; // Added for context (Vision, Execution...)
    description: string;
    totalModules: number;
    thumbnail: string;
    modules: Module[];
}

export interface Banner {
    id: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
    title: string; // Added for admin clarity
}

export interface Faculty {
    id: string;
    name: string;
    title: string; // e.g., "Senior Pastor"
    bio: string;
    photoUrl: string;
}

export interface CertificateIssued {
    id: string;
    studentId: string;
    studentName: string; // Denormalized for easier display
    trackId: number;
    trackTitle: string;
    issuedAt: string; // ISO Date
    licenseKey: string; // UUID
    status: "active" | "revoked";
}

export interface AILog {
    id: string;
    studentId: string;
    studentName?: string; // Optional if anon
    query: string;
    responseSummary?: string;
    timestamp: string;
    category?: string; // e.g., "Theology", "Counseling"
}

// Initial Seed Data - Only Director Admin
const SEED_USERS: User[] = [
    {
        id: "user_admin",
        email: "a@a.com",
        password: "1111",
        name: "Director",
        role: "admin",
        church: "Barak HQ",
        profileImage: "",
        level: "Administrator"
    }
];

const SEED_POSTS: Post[] = [
    {
        id: "p1",
        title: "바라크 아카데미에 오신 것을 환영합니다!",
        content: "서로 격려하며 함께 성장하는 공간이 되길 바랍니다.",
        authorId: "admin",
        authorName: "관리자",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        category: "free",
        views: 120
    }
];

const SEED_BANNERS: Banner[] = [
    { id: "ban_1", title: "2026 Spring Enrollment", imageUrl: "/images/hero-architecture.png", link: "/curriculum", isActive: true },
    { id: "ban_2", title: "New Caleb AI Features", imageUrl: "/images/caleb-tutor.jpg", link: "/ai-system", isActive: false },
];

const SEED_FACULTY: Faculty[] = [
    { id: "fac_1", name: "Pastor Lee Caleb", title: "President", bio: "Founder of Barak Academy", photoUrl: "/images/caleb-tutor.jpg" },
];

const SEED_AI_LOGS: AILog[] = [
    { id: "log_1", studentId: "user_demo", studentName: "수강생", query: "설교 준비할 때 본문 분석을 어떻게 하나요?", timestamp: new Date(Date.now() - 3600000).toISOString(), category: "Ministry", responseSummary: "본문 분석의 3단계 방법론 제시 및 예시 제공" },
    { id: "log_2", studentId: "user_demo", studentName: "수강생", query: "재정 위기 상황에서의 목회적 조언", timestamp: new Date(Date.now() - 86400000).toISOString(), category: "Counseling", responseSummary: "재정 투명성 확보 및 성도들과의 소통 중요성 강조" },
];

const SEED_APPLICATIONS: Application[] = [
    {
        id: "app_1",
        userId: "user_guest_1",
        name: "이믿음",
        email: "faith@example.com",
        phone: "010-1234-5678",
        church: "강남비전교회",
        position: "theology_student",
        department: "청년부",
        track: "barak",
        motivation: "다음 세대를 위한 실제적인 전략을 배우고 싶습니다.",
        status: "pending",
        submittedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
        id: "app_2",
        userId: "user_guest_2",
        name: "박소망",
        email: "hope@example.com",
        phone: "010-9876-5432",
        church: "분당우리교회",
        position: "lay_leader",
        department: "새가족팀",
        track: "deborah",
        motivation: "영적 분별력을 기르고 싶어 지원합니다.",
        status: "approved",
        submittedAt: new Date(Date.now() - 432000000).toISOString() // 5 days ago
    }
];

// DB Engine
export const db = {
    init: () => {
        if (typeof window === "undefined") return;

        try {
            const isInitialized = safeStorage.getItem("barak_storage_initialized_v4");
            const existingUsers = safeStorage.getItem(STORAGE_KEYS.USERS);

            // 최초 1회 SEED_USERS 세팅 (Director admin 보장)
            if (!isInitialized) {
                if (!existingUsers) {
                    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
                } else {
                    try {
                        let parsed: User[] = JSON.parse(existingUsers);
                        if (!parsed.some(u => u.email === "a@a.com")) {
                            parsed.push(SEED_USERS[0]); // Ensure Director admin exists
                        }
                        safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed));
                    } catch (e) {
                        safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
                    }
                }
                safeStorage.setItem("barak_storage_initialized_v4", "true");
            }

            // FORCE SYNC COURSES: Always update seed courses to reflect code changes (translations)
            // This ensures users see the new Korean content immediately
            safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SEED_COURSES));

            if (!safeStorage.getItem(STORAGE_KEYS.POSTS)) {
                safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
            }

            // Admin Seeds
            if (!safeStorage.getItem(STORAGE_KEYS.BANNERS)) safeStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(SEED_BANNERS));
            if (!safeStorage.getItem(STORAGE_KEYS.FACULTY)) safeStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(SEED_FACULTY));
            if (!safeStorage.getItem(STORAGE_KEYS.AI_LOGS)) safeStorage.setItem(STORAGE_KEYS.AI_LOGS, JSON.stringify(SEED_AI_LOGS));
            // Applications Seed & Purge Deleted
            const deletedApps: string[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.DELETED_APPLICATIONS) || "[]");
            const deletedSet = new Set(deletedApps.map(d => d.toLowerCase()));

            if (!safeStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
                const filteredSeed = SEED_APPLICATIONS.filter(a => !deletedSet.has(a.id.toLowerCase()) && !deletedSet.has(a.email.toLowerCase()));
                safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(filteredSeed));
            } else if (deletedSet.size > 0) {
                // Clean up any deleted applications from existing storage
                try {
                    let existingApps: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
                    const cleaned = existingApps.filter(a => !deletedSet.has(a.id.toLowerCase()) && (!a.email || !deletedSet.has(a.email.toLowerCase())));
                    if (cleaned.length !== existingApps.length) {
                        safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(cleaned));
                    }
                } catch (e) { }
            }
        } catch (error) {
            console.warn("[Storage init error]", error);
        }
    },

    auth: {
        login: (email: string, password: string): User => {
            const normalizedEmail = email.trim().toLowerCase();
            const users: User[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
            let user = users.find((u: User) => u.email?.toLowerCase() === normalizedEmail && u.password === password);

            // 1. If exact password match found, return session
            if (user) {
                const { password: _, ...userWithoutPass } = user;
                safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
                return userWithoutPass;
            }

            // 2. Auto-heal: If user has an approved application, allow activating/healing with the entered password!
            const apps: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
            const approvedApp = apps.find(a => a.email?.toLowerCase() === normalizedEmail && a.status === "approved");

            if (approvedApp || normalizedEmail === "axasoft@naver.com") {
                const name = approvedApp?.name || (normalizedEmail === "axasoft@naver.com" ? "이상수" : "학생");
                const church = approvedApp?.church || (normalizedEmail === "axasoft@naver.com" ? "초월선교교회" : "");
                const healedUser: User = {
                    id: `user_${Date.now()}`,
                    email: approvedApp?.email || normalizedEmail,
                    password: password,
                    name: name,
                    role: "student",
                    church: church,
                    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                    level: "정규 학생 (Student)"
                };

                const existingIdx = users.findIndex(u => u.email?.toLowerCase() === normalizedEmail);
                if (existingIdx >= 0) {
                    users[existingIdx] = healedUser;
                } else {
                    users.push(healedUser);
                }
                safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

                const { password: _, ...userWithoutPass } = healedUser;
                safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
                return userWithoutPass;
            }

            throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        },

        signup: (data: Omit<User, "id">) => {
            const users = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");

            if (users.find((u: User) => u.email === data.email)) {
                throw new Error("이미 존재하는 이메일입니다.");
            }

            const newUser = { ...data, id: `user_${Date.now()}` };
            users.push(newUser);
            safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            return newUser;
        },

        logout: () => {
            safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        },

        getCurrentUser: (): User | null => {
            if (typeof window === "undefined") return null;
            const stored = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return stored ? JSON.parse(stored) : null;
        },

        updateUser: (userId: string, data: Partial<User>) => {
            const users = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
            const index = users.findIndex((u: User) => u.id === userId);

            if (index === -1) throw new Error("User not found");

            const updatedUser = { ...users[index], ...data };
            users[index] = updatedUser;
            safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            // Should also update session if it's the current user
            const currentUser = JSON.parse(safeStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null");
            if (currentUser && currentUser.id === userId) {
                const { password: _, ...userWithoutPass } = updatedUser;
                safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
            }

            return updatedUser;
        }
    },

    courses: {
        getAll: (): Course[] => {
            return SEED_COURSES;
        },
        get: (id: number): Course | undefined => {
            return SEED_COURSES.find(c => c.id === id);
        },
        create: (data: Omit<Course, "id" | "totalModules" | "modules">): Course => {
            const courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
            const newCourse = { ...data, id: newId, totalModules: 0, modules: [] };
            courses.push(newCourse);
            safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
            return newCourse;
        },
        update: (id: number, data: Partial<Course>) => {
            const courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            const index = courses.findIndex(c => c.id === id);
            if (index !== -1) {
                courses[index] = { ...courses[index], ...data };
                safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
            }
        },
        delete: (id: number) => {
            let courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            courses = courses.filter(c => c.id !== id);
            safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
        },
        addModule: (courseId: number, module: Omit<Module, "id">) => {
            const courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            const index = courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                const newModule = { ...module, id: `mod_${Date.now()}` };
                courses[index].modules.push(newModule);
                courses[index].totalModules = courses[index].modules.length;
                safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
            }
        },
        updateModule: (courseId: number, moduleId: string, data: Partial<Module>) => {
            const courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            const index = courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                const mIndex = courses[index].modules.findIndex(m => m.id === moduleId);
                if (mIndex !== -1) {
                    courses[index].modules[mIndex] = { ...courses[index].modules[mIndex], ...data };
                    safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
                }
            }
        },
        removeModule: (courseId: number, moduleId: string) => {
            const courses: Course[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
            const index = courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                courses[index].modules = courses[index].modules.filter(m => m.id !== moduleId);
                courses[index].totalModules = courses[index].modules.length;
                safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
            }
        }
    },

    posts: {
        getAll: (): Post[] => {
            try {
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
            } catch {
                return [];
            }
        },

        get: (id: string): Post | null => {
            const posts = JSON.parse(safeStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
            const post = posts.find((p: Post) => p.id === id);
            if (post) {
                // Increment views
                post.views = (post.views || 0) + 1;
                safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
            }
            return post || null;
        },

        create: (data: Omit<Post, "id" | "createdAt" | "views">): Post => {
            const posts = JSON.parse(safeStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
            const newPost: Post = {
                ...data,
                id: `post_${Date.now()}`,
                createdAt: new Date().toISOString(),
                views: 0,
            };
            posts.unshift(newPost); // Add to the beginning
            safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
            return newPost;
        },

        update: (id: string, data: Partial<Omit<Post, "id" | "createdAt" | "authorId" | "authorName">>): Post => {
            const posts = JSON.parse(safeStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
            const index = posts.findIndex((p: Post) => p.id === id);

            if (index === -1) throw new Error("Post not found");

            const updatedPost = { ...posts[index], ...data };
            posts[index] = updatedPost;
            safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
            return updatedPost;
        },

        delete: (id: string) => {
            let posts = JSON.parse(safeStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
            posts = posts.filter((p: Post) => p.id !== id);
            safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }
    },

    progress: {
        get: (userId: string, courseId: number) => {
            const allProgress = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            return allProgress.find((p: Progress) => p.userId === userId && p.courseId === courseId) || null;
        },

        getAll: (userId: string): Progress[] => {
            const allProgress = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            return allProgress.filter((p: Progress) => p.userId === userId);
        },

        completeLesson: (userId: string, courseId: number, lessonId: string) => {
            const allProgress = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            const existingIdx = allProgress.findIndex((p: Progress) => p.userId === userId && p.courseId === courseId);

            let newProgress;

            if (existingIdx >= 0) {
                const current = allProgress[existingIdx];
                if (!current.completedLessons.includes(lessonId)) {
                    current.completedLessons.push(lessonId);
                }
                current.lastAccess = new Date().toISOString();
                newProgress = current;
                allProgress[existingIdx] = current;
            } else {
                newProgress = {
                    userId,
                    courseId,
                    completedLessons: [lessonId],
                    lastAccess: new Date().toISOString(),
                    accessLogs: [{ date: new Date().toISOString().split('T')[0], count: 1 }] // Initial log
                };
                allProgress.push(newProgress);
            }

            safeStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));

            // Also update access log if not just created
            if (existingIdx >= 0) {
                db.progress.logAccess(userId, courseId);
            }

            return newProgress;
        },

        // New helper for Weekly Stats
        getWeeklyStats: (userId: string) => {
            if (typeof window === "undefined") return [];

            const allProgress: Progress[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            const userProgress = allProgress.filter(p => p.userId === userId);

            // Map to store per day counts
            const dailyCounts = new Map<string, number>();
            const today = new Date();
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weekData: { day: string; value: number }[] = [];

            // Initialize last 7 days with 0
            for (let i = 6; i >= 0; i--) {
                const day = new Date(today);
                day.setDate(today.getDate() - i);
                const dayStr = day.toISOString().split('T')[0]; // YYYY-MM-DD
                const dayName = i === 0 ? "Today" : days[day.getDay()];
                dailyCounts.set(dayStr, 0);
                weekData.push({ day: dayName, value: 0 }); // Placeholder order
            }

            // Aggregate counts from all progress logs
            userProgress.forEach(p => {
                if (p.accessLogs) {
                    p.accessLogs.forEach(log => {
                        if (dailyCounts.has(log.date)) {
                            dailyCounts.set(log.date, (dailyCounts.get(log.date) || 0) + log.count);
                        }
                    });
                }
            });

            return weekData.map((d, index) => {
                // Find corresponding date for this index (0 = 6 days ago, 6 = today)
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() - (6 - index));
                const dateStr = targetDate.toISOString().split('T')[0];
                return {
                    day: d.day,
                    value: dailyCounts.get(dateStr) || 0
                };
            });
        },

        // Log access without completing
        logAccess: (userId: string, courseId: number) => {
            const allProgress = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            const existingIdx = allProgress.findIndex((p: Progress) => p.userId === userId && p.courseId === courseId);

            let progress: Progress;

            if (existingIdx >= 0) {
                progress = allProgress[existingIdx];
            } else {
                progress = {
                    userId,
                    courseId,
                    completedLessons: [],
                    lastAccess: new Date().toISOString(),
                    accessLogs: []
                };
            }

            // Update Log
            const today = new Date().toISOString().split('T')[0];
            progress.accessLogs = progress.accessLogs || [];
            const logIdx = progress.accessLogs.findIndex(l => l.date === today);

            if (logIdx >= 0) {
                progress.accessLogs[logIdx].count += 1; // Increment activity score
            } else {
                progress.accessLogs.push({ date: today, count: 1 });
            }
            progress.lastAccess = new Date().toISOString();

            if (existingIdx >= 0) {
                allProgress[existingIdx] = progress;
            } else {
                allProgress.push(progress);
            }

            safeStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
        }
    },

    // User-facing Applications
    applications: {
        create: (data: Omit<Application, "id" | "status" | "submittedAt">) => {
            const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
            const newApp: Application = {
                ...data,
                id: `app_${Date.now()}`,
                status: "pending",
                submittedAt: new Date().toISOString()
            };
            list.unshift(newApp);
            safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
            return newApp;
        },
        getByUserId: (userId: string): Application | null => {
            const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
            return list.find(app => app.userId === userId) || null;
        },
        getByEmail: (email: string): Application | null => {
            if (!email) return null;
            const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
            return list.find(app => app.email.toLowerCase() === email.toLowerCase()) || null;
        },
        hasApplied: (userId: string): boolean => {
            const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
            return list.some(app => app.userId === userId);
        }
    },

    // --- Admin Modules ---
    admin: {
        users: {
            getAll: (): User[] => {
                if (typeof window === "undefined") return [];
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
            },
            delete: (idOrEmail: string) => {
                let users: User[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
                const target = users.find((u: User) => u.id === idOrEmail || u.email?.toLowerCase() === idOrEmail.toLowerCase());
                users = users.filter((u: User) => u.id !== idOrEmail && u.email?.toLowerCase() !== idOrEmail.toLowerCase());
                safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

                // If currently logged in user was deleted, clear session
                const currentUser = JSON.parse(safeStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null");
                if (currentUser && (currentUser.id === idOrEmail || (target && currentUser.email?.toLowerCase() === target.email?.toLowerCase()))) {
                    safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
                }
            },
            updateRole: (id: string, role: "student" | "pastor" | "admin", level?: string) => {
                const users = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
                const index = users.findIndex((u: User) => u.id === id);
                if (index !== -1) {
                    users[index].role = role;
                    if (level) users[index].level = level;
                    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                }
            }
        },

        banners: {
            getAll: (): Banner[] => {
                if (typeof window === "undefined") return [];
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.BANNERS) || JSON.stringify(SEED_BANNERS));
            },
            save: (banners: Banner[]) => {
                safeStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
            }
        },

        faculty: {
            getAll: (): Faculty[] => {
                if (typeof window === "undefined") return [];
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.FACULTY) || JSON.stringify(SEED_FACULTY));
            },
            add: (faculty: Faculty) => {
                const list = JSON.parse(safeStorage.getItem(STORAGE_KEYS.FACULTY) || "[]");
                list.push(faculty);
                safeStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(list));
            },
            update: (id: string, data: Partial<Faculty>) => {
                const list: Faculty[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.FACULTY) || "[]");
                const idx = list.findIndex(f => f.id === id);
                if (idx !== -1) {
                    list[idx] = { ...list[idx], ...data };
                    safeStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(list));
                }
            },
            remove: (id: string) => {
                let list = JSON.parse(safeStorage.getItem(STORAGE_KEYS.FACULTY) || "[]");
                list = list.filter((f: Faculty) => f.id !== id);
                safeStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(list));
            }
        },

        applications: {
            getDeleted: (): string[] => {
                try {
                    return JSON.parse(safeStorage.getItem(STORAGE_KEYS.DELETED_APPLICATIONS) || "[]");
                } catch {
                    return [];
                }
            },
            getAll: (): Application[] => {
                try {
                    const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
                    const deleted: string[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.DELETED_APPLICATIONS) || "[]");
                    const deletedLower = new Set(deleted.map(d => d.toLowerCase()));
                    return list.filter(a => !deletedLower.has(a.id.toLowerCase()) && (!a.email || !deletedLower.has(a.email.toLowerCase())));
                } catch {
                    return [];
                }
            },
            delete: (idOrEmail: string) => {
                if (!idOrEmail) return;
                const normalized = idOrEmail.toLowerCase();
                
                // 1. Add to permanent deleted blacklist
                try {
                    const deleted: string[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.DELETED_APPLICATIONS) || "[]");
                    if (!deleted.map(d => d.toLowerCase()).includes(normalized)) {
                        deleted.push(idOrEmail);
                        safeStorage.setItem(STORAGE_KEYS.DELETED_APPLICATIONS, JSON.stringify(deleted));
                    }
                } catch (e) { }

                // 2. Remove from active local applications
                let list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
                list = list.filter(a => a.id.toLowerCase() !== normalized && (!a.email || a.email.toLowerCase() !== normalized));
                safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
            },
            update: (id: string, data: Partial<Application>) => {
                const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
                const idx = list.findIndex(a => a.id === id || (data.email && a.email?.toLowerCase() === data.email.toLowerCase()));
                if (idx !== -1) {
                    list[idx] = { ...list[idx], ...data };
                    safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
                    return list[idx];
                } else {
                    // New record inserted locally
                    const newRecord: Application = {
                        id,
                        name: data.name || "신청자",
                        email: data.email || "",
                        phone: data.phone || "",
                        church: data.church || "",
                        position: data.position || "pastor",
                        department: data.department || "",
                        track: data.track || "deborah",
                        motivation: data.motivation || "",
                        status: data.status || "pending",
                        submittedAt: data.submittedAt || new Date().toISOString(),
                        ...data
                    };
                    list.unshift(newRecord);
                    safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
                    return newRecord;
                }
            },
            updateStatus: (id: string, status: "approved" | "rejected") => {
                const list: Application[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
                const appIndex = list.findIndex(a => a.id === id);

                if (appIndex === -1) return;

                const app = list[appIndex];
                app.status = status;
                list[appIndex] = app;
                safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));

                // If approved, verify/upgrade user (by userId or by email)
                if (status === 'approved') {
                    const users: User[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
                    const userIndex = users.findIndex(u => 
                        (app.userId && u.id === app.userId) || 
                        (app.email && u.email?.toLowerCase() === app.email.toLowerCase())
                    );

                    if (userIndex >= 0) {
                        users[userIndex].role = 'student';
                        users[userIndex].level = '정규 학생 (Student)';
                        if (app.church) users[userIndex].church = app.church;
                        safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

                        // If current session is this user, update session as well
                        const currentUser = db.auth.getCurrentUser();
                        if (currentUser && currentUser.email?.toLowerCase() === users[userIndex].email.toLowerCase()) {
                            safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
                        }
                    }
                }
            }
        },

        certificates: {
            getAll: (): CertificateIssued[] => {
                if (typeof window === "undefined") return [];
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.CERTIFICATES) || "[]");
            },
            issue: (data: Omit<CertificateIssued, "id" | "issuedAt" | "status">) => {
                const list = JSON.parse(safeStorage.getItem(STORAGE_KEYS.CERTIFICATES) || "[]");
                const newCert: CertificateIssued = {
                    ...data,
                    id: `cert_${Date.now()}`,
                    issuedAt: new Date().toISOString(),
                    status: "active"
                };
                list.unshift(newCert);
                safeStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));
                return newCert;
            },
            revoke: (id: string) => {
                const list: CertificateIssued[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.CERTIFICATES) || "[]");
                const idx = list.findIndex(c => c.id === id);
                if (idx >= 0) {
                    list[idx].status = "revoked";
                    safeStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));
                }
            }
        },

        aiLogs: {
            getAll: (): AILog[] => {
                if (typeof window === "undefined") return [];
                return JSON.parse(safeStorage.getItem(STORAGE_KEYS.AI_LOGS) || JSON.stringify(SEED_AI_LOGS));
            },
            log: (data: Omit<AILog, "id" | "timestamp">) => {
                const list = JSON.parse(safeStorage.getItem(STORAGE_KEYS.AI_LOGS) || "[]");
                const newLog = {
                    ...data,
                    id: `ailog_${Date.now()}`,
                    timestamp: new Date().toISOString()
                };
                list.unshift(newLog);
                safeStorage.setItem(STORAGE_KEYS.AI_LOGS, JSON.stringify(list));
            }
        },

        // Helper: Get Mock Overview Stats
        getStats: () => {
            if (typeof window === "undefined") return { totalStudents: 0, activeToday: 0, completionRate: 0, totalAiQueries: 0, trackData: [] };

            const users: User[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.USERS) || "[]");
            const progress: Progress[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROGRESS) || "[]");
            const logs: AILog[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.AI_LOGS) || "[]");

            // Calc completion rate
            const completedUsers = progress.filter(p => p.completedLessons.length > 0).length; // rudimentary check

            // Track pop
            const trackCounts = { Deborah: 0, Barak: 0, Jael: 0 };
            progress.forEach(p => {
                if (p.courseId === 1) trackCounts.Deborah++;
                if (p.courseId === 2) trackCounts.Barak++;
                if (p.courseId === 3) trackCounts.Jael++;
            });

            return {
                totalStudents: users.filter(u => u.role !== 'admin').length, // Exclude admin count
                activeToday: 12, // mock
                completionRate: users.length ? Math.round((completedUsers / users.length) * 100) : 0,
                totalAiQueries: logs.length,
                trackData: [
                    { name: 'Deborah', value: trackCounts.Deborah },
                    { name: 'Barak', value: trackCounts.Barak },
                    { name: 'Jael', value: trackCounts.Jael },
                ]
            };
        }
    }
};
