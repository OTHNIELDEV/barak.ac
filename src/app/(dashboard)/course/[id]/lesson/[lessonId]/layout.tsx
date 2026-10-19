import type { Metadata } from "next";
import { COURSE_TRACK_SEO, createPageMetadata } from "@/lib/seo";
import { mockCourses } from "@/lib/mockData";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string; lessonId: string }>;
}): Promise<Metadata> {
    const { id, lessonId } = await params;
    const courseId = parseInt(id, 10) || 1;
    const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
    const lesson = course.modules.find((m) => m.id === lessonId) || course.modules[0];
    const trackSeo = COURSE_TRACK_SEO[courseId] || COURSE_TRACK_SEO[1];

    const title = `${lesson.title} | ${course.title} — 바라크아카데미`;
    const ogTitle = `[${course.title.split(" (")[0]}] ${lesson.title}`;
    const description = `${lesson.description} (${course.subTitle || course.title})`;

    return createPageMetadata({
        title,
        ogTitle,
        description,
        ogDescription: description,
        path: `/course/${id}/lesson/${lessonId}`,
        ogImage: trackSeo.ogImage,
    });
}

export default function LessonDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
