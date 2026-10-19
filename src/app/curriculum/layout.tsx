import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.curriculum);

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
