import React from 'react';
import { motion, useInView } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    fullWidth?: boolean;
}

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    className = "",
    direction = 'up',
    fullWidth = false
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    const getDirectionOffset = () => {
        switch (direction) {
            case 'up': return { y: 40, x: 0 };
            case 'down': return { y: -40, x: 0 };
            case 'left': return { x: 40, y: 0 };
            case 'right': return { x: -40, y: 0 };
            default: return { y: 0, x: 0 };
        }
    };

    const initial = {
        opacity: 0,
        ...getDirectionOffset()
    };

    return (
        <div ref={ref} className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            <motion.div
                initial={initial}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    type: "spring",
                    stiffness: 50
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default FadeIn;
