import React, { useEffect, useState } from 'react';

export const ReadingProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div
            className="reading-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 z-50 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
        />
    );
};