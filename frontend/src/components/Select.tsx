import React from 'react';

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    placeholder?: string;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    required = false,
    placeholder = 'Sélectionner...',
}: SelectProps) {
    return (
        <div className="space-y-2">
            <label className="block text-white font-medium">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
                <option value="" className="bg-gray-900">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
