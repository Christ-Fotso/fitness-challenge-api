import React from 'react';

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
}: InputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-white font-medium">
                {label} {required && <span className="text-pink-400">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-3 rounded-lg bg-white/20 border ${error ? 'border-red-500' : 'border-white/30'
                    } text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
}
