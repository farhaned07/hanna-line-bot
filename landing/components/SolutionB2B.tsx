import React from 'react';
import { SOLUTION_B2B } from '../constants-b2b';
import { MessageCircle, Activity, Bell, Zap, CheckCircle2 } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const SolutionB2B: React.FC = () => {
    return (
        <section className="py-24 bg-white" id="solution">
            <div className="container mx-auto px-6 max-w-[1280px]">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight">
                            {SOLUTION_B2B.headline}
                        </h2>
                    </FadeIn>
                </div>

                {/* 2x2 Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: Check-ins */}
                    <FadeIn delay={0.1}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            <div className="mb-8 w-full max-w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <div className="bg-slate-100 h-2 w-20 rounded-full"></div>
                                </div>
                                <div className="space-y-2 pl-10">
                                    <div className="bg-slate-50 h-2 w-full rounded-full"></div>
                                    <div className="bg-slate-50 h-2 w-2/3 rounded-full"></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Daily patient check-ins
                            </h3>
                            <p className="text-slate-500 font-medium">
                                (LINE, no app)
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 2: Vitals */}
                    <FadeIn delay={0.2}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            <div className="mb-8 w-full max-w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="flex items-end justify-between gap-1 h-12">
                                    <div className="w-full bg-slate-100 rounded-t-md h-[40%]"></div>
                                    <div className="w-full bg-hana-primary/20 rounded-t-md h-[70%]"></div>
                                    <div className="w-full bg-slate-100 rounded-t-md h-[50%]"></div>
                                    <div className="w-full bg-slate-100 rounded-t-md h-[60%]"></div>
                                    <div className="w-full bg-hana-primary rounded-t-md h-[80%] shadow-lg shadow-hana-primary/30"></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Collects self-reported data
                            </h3>
                            <p className="text-slate-500 font-medium">
                                Vitals, meds, and symptoms
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 3: Alerts */}
                    <FadeIn delay={0.3}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            <div className="mb-8 w-full max-w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 animate-pulse">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="h-2 w-24 bg-slate-900 rounded-full mb-1.5"></div>
                                    <div className="h-1.5 w-16 bg-slate-200 rounded-full"></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Alerts nurses only when needed
                            </h3>
                            <p className="text-slate-500 font-medium">
                                Filters out the noise
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 4: Context */}
                    <FadeIn delay={0.4}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            <div className="mb-8 w-full max-w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                    <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex gap-1 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
                                    </div>
                                    <div className="h-1.5 w-2/3 bg-slate-200 rounded-full"></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Gives nurses full context
                            </h3>
                            <p className="text-slate-500 font-medium">
                                Ready to act fast
                            </p>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
};

export default SolutionB2B;


