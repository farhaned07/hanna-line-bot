import React from 'react';
import { ONE_BRAIN_B2B } from '../constants-b2b';
import { Brain, Shield, Sparkles, Lock } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const OneBrainB2B: React.FC = () => {
    return (
        <section className="py-24 bg-white" id="onebrain">
            <div className="container mx-auto px-6 max-w-[1280px]">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn>
                        <span className="text-hana-primary font-bold tracking-widest uppercase text-xs font-mono mb-4 block">
                            Intelligence Layer
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                            {ONE_BRAIN_B2B.headline}
                        </h2>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            {ONE_BRAIN_B2B.subheadline}
                        </p>
                    </FadeIn>
                </div>

                {/* 3-Column Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Card 1: Contextual Awareness */}
                    <FadeIn delay={0.1} className="h-full">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Memory Nodes */}
                            <div className="mb-8 w-full max-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[120px]">
                                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.3]"></div>
                                <div className="relative z-10 flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-hana-primary text-white flex items-center justify-center shadow-lg transform -translate-y-2">
                                        <Brain className="w-5 h-5" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 rounded-full">
                                    Memory
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {ONE_BRAIN_B2B.features[0].title}
                            </h3>
                            <p className="text-slate-500 font-medium">
                                {ONE_BRAIN_B2B.features[0].description}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 2: Clinical Guardrails */}
                    <FadeIn delay={0.2} className="h-full">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Shield/Safety */}
                            <div className="mb-8 w-full max-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[120px]">
                                <div className="relative z-10">
                                    <Shield className="w-12 h-12 text-green-500 drop-shadow-sm" />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Lock className="w-3 h-3 text-slate-400" />
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3 w-full h-full border-2 border-dashed border-slate-100 rounded-xl pointer-events-none"></div>
                                <div className="absolute bottom-3 text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    Safe
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {ONE_BRAIN_B2B.features[1].title}
                            </h3>
                            <p className="text-slate-500 font-medium">
                                {ONE_BRAIN_B2B.features[1].description}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 3: Adaptive Learning */}
                    <FadeIn delay={0.3} className="h-full">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual: Learning Loop */}
                            <div className="mb-8 w-full max-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[120px]">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-8 bg-slate-100 rounded-full"></div>
                                    <div className="w-2 h-5 bg-slate-200 rounded-full"></div>
                                    <div className="w-2 h-10 bg-hana-primary rounded-full shadow-sm"></div>
                                    <div className="w-2 h-6 bg-hana-primary/60 rounded-full"></div>
                                    <div className="w-2 h-9 bg-hana-primary/40 rounded-full"></div>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="absolute bottom-3 text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                    Improving
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {ONE_BRAIN_B2B.features[2].title}
                            </h3>
                            <p className="text-slate-500 font-medium">
                                {ONE_BRAIN_B2B.features[2].description}
                            </p>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
};

export default OneBrainB2B;
