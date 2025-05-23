"use client";

import { useState } from "react";
import { cn } from "@/libs/utils";

interface TabNavigationProps {
    onTabChange: (activeTab: "cuotas" | "pagos") => void;
}

export const TabNavigation = ({ onTabChange }: TabNavigationProps) => {
    const [activeTab, setActiveTab] = useState<"cuotas" | "pagos">("cuotas");

    const handleTabChange = (tab: "cuotas" | "pagos") => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <div className="flex bg-[#1a1a1c] p-1 rounded-full w-full max-w-xs mx-auto mb-6">
            <button
                onClick={() => handleTabChange("cuotas")}
                className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === "cuotas"
                        ? "bg-[#2a2a2c] text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-300"
                )}
            >
                Mis cuotas
            </button>
            <button
                onClick={() => handleTabChange("pagos")}
                className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === "pagos"
                        ? "bg-[#2a2a2c] text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-300"
                )}
            >
                Mis pagos
            </button>
        </div>
    );
};