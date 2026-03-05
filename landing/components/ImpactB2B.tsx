import React from 'react';
import { IMPACT_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';

const ImpactB2B: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 bg-surface text-text-primary relative overflow-hidden" id="impact">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <span className="text-hana-primary font-bold tracking-widest uppercase text-sm font-mono mb-6 block">
                            THE IMPACT
                        </span>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight mb-8 leading-[1.1]">
                            {IMPACT_B2B.headline}
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                            {IMPACT_B2B.subheadline}
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default ImpactB2B;
