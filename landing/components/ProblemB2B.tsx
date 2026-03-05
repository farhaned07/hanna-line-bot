import React from 'react';
import { PROBLEM_B2B } from '../constants-b2b';
import { Clock, AlertTriangle, Users } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const ProblemB2B: React.FC = () => {
    return (
        <section className="py-24 bg-white" id="problem">
            <div className="container mx-auto px-6 max-w-[1280px]">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <FadeIn>
                        <span className="text-hana-primary font-bold tracking-widest uppercase text-xs font-mono mb-4 block">
                            The Reality
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight mb-6 leading-tight">
                            {PROBLEM_B2B.headline}
                        </h2>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            {PROBLEM_B2B.subheadline}
                        </p>
                    </FadeIn>
                </div>

                {/* 3-Column Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">

                    {/* Card 1: Overworked */}
                    <FadeIn delay={0.1}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Time clock overflowing */}
                            <div className="mb-8 w-full aspect-square max-w-[180px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center">
                                <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent -rotate-45"></div>
                                    <Clock className="w-8 h-8 text-red-500" />
                                    <div className="absolute -right-2 -top-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                                        14h
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Nurses are overworked
                            </h3>
                        </div>
                    </FadeIn>

                    {/* Card 2: Cracks */}
                    <FadeIn delay={0.2}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Missed alerts */}
                            <div className="mb-8 w-full aspect-square max-w-[180px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center gap-2">
                                <div className="w-full bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-2 opacity-50 scale-90">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    <div className="h-1.5 w-16 bg-red-200 rounded-full"></div>
                                </div>
                                <div className="w-full bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-2 relative z-10 shadow-sm">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <div className="h-1.5 w-20 bg-red-300 rounded-full"></div>
                                </div>
                                <div className="w-full bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-2 opacity-50 scale-90">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    <div className="h-1.5 w-12 bg-red-200 rounded-full"></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Patients fall through cracks
                            </h3>
                        </div>
                    </FadeIn>

                    {/* Card 3: Scale */}
                    <FadeIn delay={0.3}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Hiring vs Demand */}
                            <div className="mb-8 w-full aspect-square max-w-[180px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex items-end justify-center gap-3">
                                <div className="w-6 bg-slate-200 rounded-t-lg h-[40%] relative group-hover:h-[40%] transition-all"></div>
                                <div className="w-6 bg-slate-200 rounded-t-lg h-[45%] relative group-hover:h-[45%] transition-all"></div>
                                <div className="w-6 bg-red-500 rounded-t-lg h-[90%] relative shadow-lg shadow-red-500/30 group-hover:h-[95%] transition-all duration-500"></div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Can't scale fast enough
                            </h3>
                        </div>
                    </FadeIn>

                </div>

                {/* Punchline */}
                <FadeIn delay={0.4}>
                    <div className="text-center">
                        <div className="inline-block bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold text-lg md:text-xl border border-slate-200 shadow-sm">
                            {PROBLEM_B2B.summary}
                        </div>
                    </div>
                </FadeIn>

            </div>
        </section>
    );
};

export default ProblemB2B;
