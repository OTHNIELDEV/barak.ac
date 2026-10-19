import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";
import { AdminShell } from "@/components/layout/AdminShell";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.admin);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>;
}
