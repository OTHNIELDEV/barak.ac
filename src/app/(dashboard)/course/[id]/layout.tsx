import type { Metadata } from "next";
import { COURSE_TRACK_SEO, ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const courseId = parseInt(id, 10) || 1;
    const seoConfig = COURSE_TRACK_SEO[courseId] || {
        ...ROUTE_SEO.myClassroom,
        path: `/course/${id}`,
    };
    return createPageMetadata(seoConfig);
}

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
