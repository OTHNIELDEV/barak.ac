import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.login);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
