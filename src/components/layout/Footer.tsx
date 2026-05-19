import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">Barak Academy</span>
                    </div>
                </div>
                <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                    {["About", "Tracks", "Philosophy", "Contact"].map((item) => (
                        <div key={item} className="pb-6">
                            <Link href="#" className="text-sm leading-6 text-gray-600 hover:text-primary transition-colors">
                                {item}
                            </Link>
                        </div>
                    ))}
                </nav>
                <p className="mt-10 text-center text-xs leading-5 text-gray-500">
                    &copy; {new Date().getFullYear()} Barak Academy. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
