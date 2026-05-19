"use client";

import { Shield } from "lucide-react";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

interface LogoProps {
    className?: string;
    variant?: "default" | "white" | "monochrome";
    textVariant?: "default" | "white" | "dark";
    size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "default", textVariant = "default", size = "sm" }: LogoProps) {
    const isSm = size === "sm";
    const isMd = size === "md";
    const isLg = size === "lg";

    // Icon Styles
    const iconContainerClass = cn(
        "relative rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 flex items-center justify-center",
        {
            "p-2.5": isSm,
            "p-3.5": isMd,
            "p-5": isLg,
            "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40": variant === "default",
            "bg-white/10 backdrop-blur-sm border border-white/20 text-white": variant === "white",
            "bg-slate-100 text-slate-900 border border-slate-200": variant === "monochrome",
        }
    );

    const glowClass = cn(
        "absolute inset-0 blur-md transition-opacity rounded-xl",
        {
            "bg-blue-400 opacity-30 group-hover:opacity-60": variant === "default",
            "bg-white opacity-10 group-hover:opacity-20": variant === "white",
            "hidden": variant === "monochrome",
        }
    );

    // Text Styles
    const barakTextClass = cn(
        "font-black tracking-tight leading-none transition-all duration-300",
        outfit.className,
        {
            "text-2xl": isSm,
            "text-3xl": isMd,
            "text-5xl": isLg,
            "text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-violet-600": textVariant === "default",
            "text-white": textVariant === "white",
            "text-slate-900": textVariant === "dark",
        }
    );

    const academyTextClass = cn(
        "font-bold uppercase pl-0.5 transition-colors",
        {
            "text-[0.7rem] tracking-[0.34em] font-extrabold": isSm, // Aligned with BARAK
            "text-xs tracking-[0.38em] mt-0.5 font-extrabold": isMd, // Aligned with BARAK
            "text-sm tracking-[0.42em] mt-1 font-extrabold": isLg, // Aligned with BARAK
            "text-blue-600 group-hover:text-violet-600": textVariant === "default",
            "text-blue-200 group-hover:text-white": textVariant === "white",
            "text-slate-500 group-hover:text-slate-800": textVariant === "dark",
        }
    );

    const iconSize = isLg ? "w-10 h-10" : isMd ? "w-8 h-8" : "w-6 h-6";

    return (
        <div className={cn("flex items-center gap-3 group select-none", className)}>
            <div className="relative">
                <div className={glowClass} />
                <div className={iconContainerClass}>
                    <Shield className={cn(iconSize, { "fill-white/20": variant === "default" || variant === "white" })} />
                </div>
            </div>
            <div className="flex flex-col justify-center -space-y-1">
                <span className={barakTextClass}>
                    BARAK
                </span>
                <span className={academyTextClass}>
                    Academy
                </span>
            </div>
        </div>
    );
}
