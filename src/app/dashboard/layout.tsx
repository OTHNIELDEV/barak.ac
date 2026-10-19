import type { Metadata } from "next";
import { ROUTE_SEO, createPageMetadata } from "@/lib/seo";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata: Metadata = createPageMetadata(ROUTE_SEO.dashboard);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
