import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.privacy);

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
