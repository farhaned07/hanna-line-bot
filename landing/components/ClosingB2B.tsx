import React from 'react';
import { CLOSING_B2B } from '../constants-b2b';
import { ArrowRight } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const ClosingB2B: React.FC = () => {
    return (
        <section className="py-12 px-4 md:px-6 bg-surface pb-32" id="closing">
            <div className="container mx-auto max-w-[1280px]">
                <FadeIn>
                    <div className="relative bg-gradient-to-br from-hana-dark via-hana-accent to-hana-primary/80 rounded-[2.5rem] px-8 py-24 md:py-32 overflow-hidden text-center shadow-2xl">

                        {/* Subtle Gradient Orbs */}
                        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-hana-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                            <FadeIn delay={0.2}>
                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-sans tracking-tight leading-[1.1] drop-shadow-sm">
                                    {CLOSING_B2B.headline}
                                </h2>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
                                    {CLOSING_B2B.subheadline}
                                </p>
                            </FadeIn>

                            <div className="pt-6">
                                <FadeIn delay={0.4}>
                                    <button
                                        onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                                        className="bg-white text-hana-accent px-8 py-4 rounded-full text-base font-bold hover:bg-hana-light hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2 group"
                                    >
                                        Book a Demo
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default ClosingB2B;
