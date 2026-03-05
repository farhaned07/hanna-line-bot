import React from 'react';
import { HERO_B2B } from '../constants-b2b';
import { ArrowRight, Activity, MessageCircle, AlertTriangle } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const HeroB2B: React.FC = () => {
    return (
        <section className="relative pt-32 pb-48 lg:pt-48 overflow-hidden bg-gradient-to-br from-hana-dark via-hana-accent to-hana-primary/80 selection:bg-hana-primary/30">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Spotlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>
                {/* Secondary glow */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-hana-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-6 max-w-[1280px] relative z-10">

                {/* Centered Content */}
                <div className="text-center max-w-6xl mx-auto px-2 mb-20">
                    <FadeIn delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse relative">
                                <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75"></span>
                            </span>
                            AI Nurse Co-Pilot
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="mb-16">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.15] tracking-tight text-white font-sans drop-shadow-2xl">
                                10x Nurse Capacity <span className="text-transparent bg-clip-text bg-gradient-to-r from-hana-light via-white to-hana-light">Through Supervised AI.</span>
                            </h1>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mx-auto font-body font-medium mb-10 antialiased">
                            {HERO_B2B.subheadline}
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.7}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                                className="bg-white text-slate-900 px-8 py-4 rounded-full text-base font-bold hover:bg-hana-light transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 min-w-[200px] justify-center"
                            >
                                Book a Demo
                            </button>
                            <button
                                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-full text-base font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 min-w-[200px] justify-center group shadow-lg ring-1 ring-white/5"
                            >
                                Learn More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </FadeIn>
                </div>

                {/* Dashboard Image with Floating UI Elements */}
                <FadeIn delay={0.5} direction="up">
                    <div className="relative max-w-5xl mx-auto mt-8 perspective-[2000px]">

                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-800 transform rotate-x-12 transition-transform duration-700 hover:rotate-0 ring-1 ring-white/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-hana-primary/10 to-transparent pointer-events-none z-20"></div>
                            <img
                                src="/nurse-dashboard-hero.png"
                                alt="Hanna Nurse Mission Control"
                                className="w-full h-auto object-cover opacity-90"
                            />
                        </div>

                        {/* Floating Element 1: Vitals Alert (Left) */}
                        <div className="absolute -left-4 md:-left-12 top-1/3 z-30 animate-[float_4s_ease-in-out_infinite]">
                            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[200px]">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">Alert</div>
                                    <div className="text-sm text-white font-bold">BP Spike Detected</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element 2: Vitals Analysis (Right) */}
                        <div className="absolute -right-4 md:-right-12 bottom-1/4 z-30 animate-[float_5s_ease-in-out_infinite_1s]">
                            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[220px]">
                                <div className="w-10 h-10 rounded-full bg-hana-primary/20 flex items-center justify-center text-hana-primary">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">Analysis</div>
                                    <div className="text-sm text-white font-bold">Trending Normal</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element 3: Patient Chat (Top Right) */}
                        <div className="absolute right-0 md:right-20 -top-12 z-20 animate-[float_6s_ease-in-out_infinite_0.5s]">
                            <div className="bg-white text-slate-900 p-3 rounded-2xl rounded-bl-sm shadow-xl max-w-[180px] text-xs font-medium border border-slate-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageCircle className="w-3 h-3 text-hana-accent" />
                                    <span className="font-bold text-[10px] text-slate-400">PATIENT REPLY</span>
                                </div>
                                "Feeling much better today, thanks!"
                            </div>
                        </div>

                    </div>
                </FadeIn>

            </div>
        </section>
    );
};

export default HeroB2B;
