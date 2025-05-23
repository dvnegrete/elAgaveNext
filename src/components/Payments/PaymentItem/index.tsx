"use client";

import { useState } from "react";
import { cn } from "@/libs/utils";
import { Payment } from "@/shared/interfaces/Payment.interface";

interface PaymentItemProps {
    payment: Payment;
}

export const PaymentItem = ({ payment }: PaymentItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "vencido":
                return "text-red-400 bg-red-950";
            case "pendiente":
                return "text-orange-400 bg-orange-950";
            case "pagado":
                return "text-green-400 bg-green-950";
            default:
                return "text-gray-400 bg-gray-900";
        }
    };

    return (
        <div className="border-b border-[#1a1a1c] py-3">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 border border-gray-700 rounded-md"></div>
                    <div>
                        <p className="font-medium text-gray-200">{payment.type}</p>
                        <p className="text-sm text-gray-400">{payment.period}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            getStatusColor(payment.status)
                        )}
                    >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    <span className="font-medium">{formatter.format(payment.amount)}</span>
                    <button className="text-gray-400 p-1">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-3 ml-8 text-sm text-gray-400 animate-accordion-down">
                    <div className="bg-[#1a1a1c] p-3 rounded-lg">
                        <p>Fecha de vencimiento: {payment.dueDate}</p>
                        <p className="mt-1">
                            Estado:{" "}
                            <span
                                className={cn(
                                    "font-medium",
                                    payment.status === "vencido"
                                        ? "text-red-400"
                                        : payment.status === "pendiente"
                                            ? "text-orange-400"
                                            : "text-green-400"
                                )}
                            >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};