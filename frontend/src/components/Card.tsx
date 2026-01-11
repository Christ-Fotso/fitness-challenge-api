import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
    const hoverClass = hover ? 'hover:bg-white/15 hover:shadow-2xl hover:-translate-y-1' : '';

    return (
        <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl transition-all ${hoverClass} ${className}`}>
            {children}
        </div>
    );
}
