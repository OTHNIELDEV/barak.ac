import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.terms);

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
