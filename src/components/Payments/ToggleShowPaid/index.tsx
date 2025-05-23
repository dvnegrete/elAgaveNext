"use client";

interface ToggleShowPaidProps {
    showPaid: boolean;
    onToggle: () => void;
}

export const ToggleShowPaid = ({ showPaid, onToggle }: ToggleShowPaidProps) => {
    return (
        <div className="flex items-center justify-between py-4">
            <label
                htmlFor="show-paid"
                className="text-sm text-gray-400 cursor-pointer"
            >
                Mostrar cuotas pagadas
            </label>
            <button
                id="show-paid"
                onClick={onToggle}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${showPaid ? 'bg-violet-600' : 'bg-gray-600'
                    }`}
                aria-checked={showPaid}
                role="switch"
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${showPaid ? 'translate-x-6' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
};