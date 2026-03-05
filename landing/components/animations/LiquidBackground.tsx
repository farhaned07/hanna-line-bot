import React from 'react';

const LiquidBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-white/50 opacity-80 z-10"></div>

            {/* Animated Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 opacity-40">
                {/* Blob 1: Hana Primary (Teal) */}
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-hana-primary/30 rounded-full blur-[100px] mix-blend-multiply filter animate-blob"></div>

                {/* Blob 2: Hana Accent (Deep Teal) */}
                <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-hana-accent/20 rounded-full blur-[100px] mix-blend-multiply filter animate-blob section-delay-2000"></div>

                {/* Blob 3: Pink/Purple Accent (Subtle contrast) */}
                <div className="absolute bottom-[-20%] left-[30%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply filter animate-blob section-delay-4000"></div>

                {/* Blob 4: Moving highlight */}
                <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-100/40 rounded-full blur-[80px] mix-blend-overlay filter animate-blob section-delay-1000"></div>
            </div>

            {/* Grain/Noise Overlay integration if desired - using global noise class instead */}
        </div>
    );
};

export default LiquidBackground;
