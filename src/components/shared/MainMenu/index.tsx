"use client";

import { useState } from "react";
import Link from "next/link";
import { pagesData } from "@/shared/pagesData";

export const MainNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-full hover:bg-[#1a1a1c] transition-colors"
                aria-label="Toggle menu"
            >
                <span className="block w-6 h-0.5 bg-gray-300 mb-1.5"></span>
                <span className="block w-6 h-0.5 bg-gray-300 mb-1.5"></span>
                <span className="block w-6 h-0.5 bg-gray-300"></span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed left-0 top-0 h-full w-64 bg-[#0e0e10] shadow-lg z-50 animate-in slide-in-from-left">
                        <div className="pt-16 px-4">
                            <nav className="space-y-4">
                                <Link
                                    className="block px-4 py-2 text-gray-300 hover:bg-[#1a1a1c] rounded-lg transition-colors"
                                    href={"/"}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Inicio
                                </Link>
                                {
                                    pagesData.map((page) => (
                                        <Link
                                            key={page.title}
                                            href={page.href}
                                            className="block px-4 py-2 text-gray-300 hover:bg-[#1a1a1c] rounded-lg transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {page.title}
                                        </Link>
                                    ))
                                }
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};