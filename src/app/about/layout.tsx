import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.about);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
