import React from 'react';
import { motion } from 'framer-motion';
import { AUDIENCE_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';

const WhoItsFor: React.FC = () => {
    // Since we only have one persona now ("Pilot Partners"), simplify the UI
    const persona = AUDIENCE_B2B[0];

    return (
        <section className="py-40 bg-cool-gray overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="text-center mb-20">
                    <FadeIn>
                        <span className="text-hana-primary font-bold tracking-widest uppercase text-sm mb-6 block">Partnership</span>
                        <h2 className="text-4xl lg:text-6xl font-bold text-hana-accent mb-6 font-sans tracking-tight">
                            What We're Looking For
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-500 font-light max-w-3xl mx-auto">
                            We're building with visionary healthcare leaders who see the problem and want to solve it.
                        </p>
                    </FadeIn>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Left: The Problem */}
                            <div className="p-12 md:p-16 bg-gradient-to-br from-slate-50 to-white border-r border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        {React.cloneElement(persona.icon as React.ReactElement, {
                                            className: 'w-6 h-6 text-red-600'
                                        })}
                                    </div>
                                    <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Current State</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-hana-accent mb-6 font-sans leading-tight">
                                    {persona.challenge}
                                </h3>
                            </div>

                            {/* Right: What We Need */}
                            <div className="p-12 md:p-16 bg-white">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-green-600 font-bold text-sm uppercase tracking-widest">What We Need</span>
                                </div>
                                <p className="text-xl text-slate-600 font-body leading-relaxed mb-8">
                                    {persona.solution}
                                </p>

                                <div className="bg-hana-accent/5 p-6 rounded-2xl border border-hana-accent/10">
                                    <span className="text-xs font-bold text-hana-primary uppercase block mb-2 font-sans tracking-wider">Ideal Fit</span>
                                    <p className="text-lg text-hana-accent font-semibold font-body">{persona.fit}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA Bar */}
                        <div className="bg-hana-accent text-white p-10 text-center">
                            <p className="text-2xl font-bold mb-2 font-sans">This is early. It's real. It matters.</p>
                            <p className="text-slate-300 font-body">Let's build something that actually works.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhoItsFor;
