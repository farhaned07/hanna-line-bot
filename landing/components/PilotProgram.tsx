import React from 'react';
import { PILOT_B2B } from '../constants-b2b';
import { Check, ArrowRight, Rocket } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const PilotProgram: React.FC = () => {
    return (
        <section className="py-24 bg-white text-hana-accent">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="flex flex-col lg:flex-row gap-20 items-center justify-center">

                    {/* Left: Offer Card */}
                    <FadeIn className="lg:w-1/2 w-full">
                        <div className="bg-white border-2 border-hana-primary rounded-[32px] p-10 shadow-hover relative overflow-hidden group">
                            {/* Badger */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-hana-primary text-white font-bold rounded-full mb-8 text-sm uppercase tracking-wide shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Q1 2026 Cohort
                            </div>

                            <h2 className="text-4xl font-bold mb-6 text-hana-accent font-sans tracking-tight leading-tight">
                                {PILOT_B2B.headline}
                            </h2>

                            <ul className="grid sm:grid-cols-1 gap-y-4 mb-10">
                                {PILOT_B2B.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="bg-hana-primary/10 p-1.5 rounded-full text-hana-primary shrink-0">
                                            <Check className="w-5 h-5 stroke-3" />
                                        </div>
                                        <span className="text-slate-body font-medium font-body leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-cool-gray rounded-2xl p-8 border border-slate-200">
                                <h3 className="text-xl font-bold mb-2 text-hana-accent font-sans">{PILOT_B2B.pricing.title}</h3>
                                <p className="text-slate-500 font-body text-sm leading-relaxed">{PILOT_B2B.pricing.description}</p>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right: Timeline / Action */}
                    <FadeIn className="lg:w-1/2 w-full" delay={0.2} direction="left">
                        <div className="pl-4 lg:pl-12">
                            <h3 className="text-3xl font-bold text-hana-accent mb-10 font-sans tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-hana-accent rounded-lg text-white"><Rocket className="w-6 h-6" /></div>
                                Launch Sequence
                            </h3>

                            <div className="space-y-0 relative z-10 border-l-2 border-slate-200 ml-4 pl-12 pb-4">
                                {PILOT_B2B.timeline.map((item, index) => (
                                    <div key={index} className="relative pb-12 last:pb-0">
                                        {/* Dot */}
                                        <div className="absolute -left-[57px] top-1 w-6 h-6 rounded-full bg-white border-4 border-hana-primary shadow-sm z-10"></div>

                                        <p className="font-bold text-hana-accent text-xl mb-1 font-sans">{item.month}</p>
                                        <p className="text-slate-body font-body">{item.event}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 space-y-6">
                                <button className="w-full bg-hana-primary text-white hover:bg-hana-accent py-5 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 font-sans">
                                    {PILOT_B2B.cta}
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                                <p className="text-center text-rose-500 text-sm font-bold tracking-wide font-sans">
                                    🔥 {PILOT_B2B.scarcity}
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
};

export default PilotProgram;
