import React from 'react';
import { ECONOMICS_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';

const EconomicsB2B: React.FC = () => {
    return (
        <section className="py-24 bg-surface text-center" id="economics">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <span className="text-hana-primary font-bold tracking-widest uppercase text-xs font-mono mb-6 block">
                            The Outcome
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight leading-tight">
                            {ECONOMICS_B2B.headline}
                        </h2>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default EconomicsB2B;
