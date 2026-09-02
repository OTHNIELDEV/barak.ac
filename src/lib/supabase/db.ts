import { createClient } from "./client";
import { Course, Post, Application, Progress, Banner, Faculty, CertificateIssued, AILog, User, Module } from "@/lib/storage";

export const supabaseDb = {
    // 1. Courses & Modules
    courses: {
        getAll: async (): Promise<Course[]> => {
            const supabase = createClient();
            const { data: courses, error } = await supabase
                .from("courses")
                .select("*, modules(*)")
                .order("id", { ascending: true });

            if (error || !courses || courses.length === 0) {
                return [];
            }

            return courses.map(c => ({
                id: c.id,
                title: c.title,
                subTitle: c.sub_title,
                description: c.description,
                totalModules: c.total_modules || (c.modules?.length || 0),
                thumbnail: c.thumbnail || "",
                modules: (c.modules || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    duration: m.duration,
                    videoUrl: m.video_url,
                    description: m.description,
                }))
            }));
        },

        get: async (id: number): Promise<Course | null> => {
            const supabase = createClient();
            const { data: c, error } = await supabase
                .from("courses")
                .select("*, modules(*)")
                .eq("id", id)
                .single();

            if (error || !c) return null;

            return {
                id: c.id,
                title: c.title,
                subTitle: c.sub_title,
                description: c.description,
                totalModules: c.total_modules || (c.modules?.length || 0),
                thumbnail: c.thumbnail || "",
                modules: (c.modules || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    duration: m.duration,
                    videoUrl: m.video_url,
                    description: m.description,
                }))
            };
        },

        create: async (courseData: Omit<Course, "id" | "totalModules" | "modules">): Promise<Course | null> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("courses")
                .insert({
                    title: courseData.title,
                    sub_title: courseData.subTitle,
                    description: courseData.description,
                    thumbnail: courseData.thumbnail,
                    total_modules: 0,
                })
                .select()
                .single();

            if (error || !data) return null;
            return {
                id: data.id,
                title: data.title,
                subTitle: data.sub_title,
                description: data.description,
                thumbnail: data.thumbnail,
                totalModules: 0,
                modules: []
            };
        },

        update: async (id: number, data: Partial<Course>) => {
            const supabase = createClient();
            await supabase.from("courses").update({
                title: data.title,
                sub_title: data.subTitle,
                description: data.description,
                thumbnail: data.thumbnail,
            }).eq("id", id);
        },

        delete: async (id: number) => {
            const supabase = createClient();
            await supabase.from("courses").delete().eq("id", id);
        },

        addModule: async (courseId: number, mod: Omit<Module, "id">) => {
            const supabase = createClient();
            const newId = `mod_${Date.now()}`;
            await supabase.from("modules").insert({
                id: newId,
                course_id: courseId,
                title: mod.title,
                duration: mod.duration,
                video_url: mod.videoUrl,
                description: mod.description,
            });
        },

        removeModule: async (moduleId: string) => {
            const supabase = createClient();
            await supabase.from("modules").delete().eq("id", moduleId);
        }
    },

    // 2. Posts (Community)
    posts: {
        getAll: async (): Promise<Post[]> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error || !data) return [];

            return data.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                authorId: p.author_id,
                authorName: p.author_name,
                createdAt: p.created_at,
                category: p.category,
                views: p.views || 0,
            }));
        },

        create: async (postData: Omit<Post, "id" | "createdAt" | "views">): Promise<Post | null> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("posts")
                .insert({
                    title: postData.title,
                    content: postData.content,
                    author_id: postData.authorId,
                    author_name: postData.authorName,
                    category: postData.category,
                })
                .select()
                .single();

            if (error || !data) return null;

            return {
                id: data.id,
                title: data.title,
                content: data.content,
                authorId: data.author_id,
                authorName: data.author_name,
                createdAt: data.created_at,
                category: data.category,
                views: data.views || 0,
            };
        },

        delete: async (id: string) => {
            const supabase = createClient();
            await supabase.from("posts").delete().eq("id", id);
        }
    },

    // 3. User Progress & Logs
    progress: {
        get: async (userId: string, courseId: number): Promise<Progress | null> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("user_progress")
                .select("*")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .single();

            if (error || !data) return null;

            return {
                userId: data.user_id,
                courseId: data.course_id,
                completedLessons: data.completed_lessons || [],
                lastAccess: data.last_access,
            };
        },

        getAll: async (userId: string): Promise<Progress[]> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("user_progress")
                .select("*")
                .eq("user_id", userId);

            if (error || !data) return [];

            return data.map(p => ({
                userId: p.user_id,
                courseId: p.course_id,
                completedLessons: p.completed_lessons || [],
                lastAccess: p.last_access,
            }));
        },

        completeLesson: async (userId: string, courseId: number, lessonId: string) => {
            const supabase = createClient();
            const existing = await supabaseDb.progress.get(userId, courseId);
            const now = new Date().toISOString();

            if (existing) {
                const updatedLessons = Array.from(new Set([...existing.completedLessons, lessonId]));
                await supabase
                    .from("user_progress")
                    .update({
                        completed_lessons: updatedLessons,
                        last_access: now,
                    })
                    .eq("user_id", userId)
                    .eq("course_id", courseId);
            } else {
                await supabase
                    .from("user_progress")
                    .insert({
                        user_id: userId,
                        course_id: courseId,
                        completed_lessons: [lessonId],
                        last_access: now,
                    });
            }

            // Log access count
            await supabaseDb.progress.logAccess(userId);
        },

        logAccess: async (userId: string) => {
            const supabase = createClient();
            const today = new Date().toISOString().split("T")[0];

            const { data } = await supabase
                .from("access_logs")
                .select("*")
                .eq("user_id", userId)
                .eq("log_date", today)
                .single();

            if (data) {
                await supabase
                    .from("access_logs")
                    .update({ count: (data.count || 1) + 1 })
                    .eq("id", data.id);
            } else {
                await supabase
                    .from("access_logs")
                    .insert({ user_id: userId, log_date: today, count: 1 });
            }
        },

        getWeeklyStats: async (userId: string) => {
            const supabase = createClient();
            const today = new Date();
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weekData: { day: string; value: number }[] = [];
            const dailyCounts = new Map<string, number>();

            for (let i = 6; i >= 0; i--) {
                const day = new Date(today);
                day.setDate(today.getDate() - i);
                const dayStr = day.toISOString().split("T")[0];
                const dayName = i === 0 ? "Today" : days[day.getDay()];
                dailyCounts.set(dayStr, 0);
                weekData.push({ day: dayName, value: 0 });
            }

            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);

            const { data } = await supabase
                .from("access_logs")
                .select("log_date, count")
                .eq("user_id", userId)
                .gte("log_date", sevenDaysAgo.toISOString().split("T")[0]);

            if (data) {
                data.forEach(row => {
                    if (dailyCounts.has(row.log_date)) {
                        dailyCounts.set(row.log_date, (dailyCounts.get(row.log_date) || 0) + row.count);
                    }
                });
            }

            return weekData.map((d, index) => {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() - (6 - index));
                const dateStr = targetDate.toISOString().split("T")[0];
                return {
                    day: d.day,
                    value: dailyCounts.get(dateStr) || 0
                };
            });
        }
    },

    // 4. Applications
    applications: {
        create: async (appData: Omit<Application, "id" | "status" | "submittedAt">) => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("applications")
                .insert({
                    user_id: appData.userId || null,
                    name: appData.name,
                    email: appData.email,
                    phone: appData.phone,
                    church: appData.church,
                    position: appData.position,
                    department: appData.department,
                    track: appData.track,
                    motivation: appData.motivation,
                    status: "pending",
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        getAll: async (): Promise<Application[]> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("applications")
                .select("*")
                .order("submitted_at", { ascending: false });

            if (error || !data) return [];
            return data.map(a => ({
                id: a.id,
                userId: a.user_id,
                name: a.name,
                email: a.email,
                phone: a.phone,
                church: a.church,
                position: a.position,
                department: a.department,
                track: a.track,
                motivation: a.motivation,
                status: a.status,
                submittedAt: a.submitted_at,
            }));
        },

        updateStatus: async (id: string, status: "approved" | "rejected") => {
            const supabase = createClient();
            await supabase.from("applications").update({ status }).eq("id", id);
        }
    },

    // 5. Admin Data
    admin: {
        users: {
            getAll: async (): Promise<User[]> => {
                const supabase = createClient();
                const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
                if (error || !data) return [];
                return data.map(u => ({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    church: u.church,
                    profileImage: u.profile_image,
                    level: u.level,
                }));
            },
            updateRole: async (id: string, role: "student" | "pastor" | "admin", level?: string) => {
                const supabase = createClient();
                await supabase.from("profiles").update({ role, level }).eq("id", id);
            }
        },

        banners: {
            getAll: async (): Promise<Banner[]> => {
                const supabase = createClient();
                const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
                if (error || !data) return [];
                return data.map(b => ({
                    id: b.id,
                    title: b.title,
                    imageUrl: b.image_url,
                    link: b.link,
                    isActive: b.is_active,
                }));
            },
            save: async (banners: Banner[]) => {
                const supabase = createClient();
                for (const b of banners) {
                    await supabase.from("banners").upsert({
                        id: b.id.startsWith("ban_") ? undefined : b.id,
                        title: b.title,
                        image_url: b.imageUrl,
                        link: b.link,
                        is_active: b.isActive,
                    });
                }
            }
        },

        faculty: {
            getAll: async (): Promise<Faculty[]> => {
                const supabase = createClient();
                const { data, error } = await supabase.from("faculty").select("*").order("created_at", { ascending: false });
                if (error || !data) return [];
                return data.map(f => ({
                    id: f.id,
                    name: f.name,
                    title: f.title,
                    bio: f.bio,
                    photoUrl: f.photo_url,
                }));
            },
            add: async (faculty: Faculty) => {
                const supabase = createClient();
                await supabase.from("faculty").insert({
                    name: faculty.name,
                    title: faculty.title,
                    bio: faculty.bio,
                    photo_url: faculty.photoUrl,
                });
            },
            remove: async (id: string) => {
                const supabase = createClient();
                await supabase.from("faculty").delete().eq("id", id);
            }
        },

        certificates: {
            getAll: async (): Promise<CertificateIssued[]> => {
                const supabase = createClient();
                const { data, error } = await supabase.from("certificates").select("*").order("issued_at", { ascending: false });
                if (error || !data) return [];
                return data.map(c => ({
                    id: c.id,
                    studentId: c.student_id,
                    studentName: c.student_name,
                    trackId: c.track_id,
                    trackTitle: c.track_title,
                    issuedAt: c.issued_at,
                    licenseKey: c.license_key || `BA-2026-${c.id}`,
                    status: c.status,
                }));
            },
            getByUser: async (userId: string): Promise<CertificateIssued[]> => {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("certificates")
                    .select("*")
                    .eq("student_id", userId)
                    .order("issued_at", { ascending: false });
                if (error || !data) return [];
                return data.map(c => ({
                    id: c.id,
                    studentId: c.student_id,
                    studentName: c.student_name,
                    trackId: c.track_id,
                    trackTitle: c.track_title,
                    issuedAt: c.issued_at,
                    licenseKey: c.license_key || `BA-2026-${c.id}`,
                    status: c.status,
                }));
            },
            issue: async (cert: Omit<CertificateIssued, "id" | "issuedAt" | "status">) => {
                const supabase = createClient();
                const { data } = await supabase.from("certificates").insert({
                    student_id: cert.studentId,
                    student_name: cert.studentName,
                    track_id: cert.trackId,
                    track_title: cert.trackTitle,
                    license_key: cert.licenseKey,
                    status: "active",
                }).select().single();
                return data;
            },
            revoke: async (id: string) => {
                const supabase = createClient();
                await supabase.from("certificates").update({ status: "revoked" }).eq("id", id);
            }
        },

        reflections: {
            getAll: async () => {
                const supabase = createClient();
                const { data, error } = await supabase.from("reflections").select("*").order("submitted_at", { ascending: false });
                if (error || !data) return [];
                return data;
            },
            get: async (userId: string, courseId: number) => {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("reflections")
                    .select("*")
                    .eq("user_id", userId)
                    .eq("course_id", courseId)
                    .single();
                if (error || !data) return null;
                return data;
            },
            submit: async (reflection: { userId: string; userName: string; courseId: number; courseTitle: string; content: string }) => {
                const supabase = createClient();
                const { data } = await supabase.from("reflections").upsert({
                    user_id: reflection.userId,
                    user_name: reflection.userName,
                    course_id: reflection.courseId,
                    course_title: reflection.courseTitle,
                    content: reflection.content,
                    status: "approved",
                    submitted_at: new Date().toISOString()
                }).select().single();
                return data;
            }
        },

        aiLogs: {
            getAll: async (): Promise<AILog[]> => {
                const supabase = createClient();
                const { data, error } = await supabase.from("ai_logs").select("*").order("created_at", { ascending: false });
                if (error || !data) return [];
                return data.map(l => ({
                    id: l.id,
                    studentId: l.student_id,
                    studentName: l.student_name,
                    query: l.query,
                    responseSummary: l.response_summary,
                    category: l.category,
                    timestamp: l.created_at,
                }));
            },
            log: async (logData: Omit<AILog, "id" | "timestamp">) => {
                const supabase = createClient();
                await supabase.from("ai_logs").insert({
                    student_id: logData.studentId || null,
                    student_name: logData.studentName,
                    query: logData.query,
                    response_summary: logData.responseSummary,
                    category: logData.category,
                });
            }
        }
    }
};
