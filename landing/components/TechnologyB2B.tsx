import React from 'react';
import { TECHNOLOGY_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';
import { ShieldCheck, Activity, UserCheck, CheckCircle, FileText, Filter, Eye } from 'lucide-react';

const TechnologyB2B: React.FC = () => {
    return (
        <section className="py-24 bg-white" id="technology">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                            {TECHNOLOGY_B2B.headline}
                        </h2>
                    </FadeIn>
                </div>

                {/* 2x2 Grid for 4 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: Supervised AI Governance */}
                    <FadeIn delay={0.1}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual Container */}
                            <div className="mb-10 w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                                <div className="absolute inset-0 bg-slate-50/50"></div>
                                {/* Abstract UI: Rule Engine / Shield */}
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-8 bg-slate-100 rounded-lg flex items-center px-2 border border-slate-200">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                            <div className="w-8 h-1 bg-slate-200 ml-2 rounded-full"></div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50">
                                        <div className="w-16 h-8 bg-slate-100 rounded-lg flex items-center px-2 border border-slate-200">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                            <div className="w-8 h-1 bg-slate-200 ml-2 rounded-full"></div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-4">
                                        <ShieldCheck className="w-10 h-10 text-hana-primary drop-shadow-md" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                {TECHNOLOGY_B2B.pillars[0].title}
                            </h3>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {TECHNOLOGY_B2B.pillars[0].items[0]}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 2: Continuous Visibility */}
                    <FadeIn delay={0.2}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual Container */}
                            <div className="mb-10 w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                                <div className="absolute inset-0 bg-slate-50/50"></div>
                                {/* Abstract UI: Pulse/Timeline */}
                                <div className="relative z-10 w-full px-4">
                                    <div className="flex items-end justify-between gap-1 h-12 mb-2">
                                        <div className="w-2 bg-slate-200 h-4 rounded-t-sm"></div>
                                        <div className="w-2 bg-slate-200 h-6 rounded-t-sm"></div>
                                        <div className="w-2 bg-hana-primary h-10 rounded-t-sm shadow-sm relative">
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
                                        </div>
                                        <div className="w-2 bg-slate-200 h-5 rounded-t-sm"></div>
                                        <div className="w-2 bg-slate-200 h-3 rounded-t-sm"></div>
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full flex items-center justify-between px-1">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    </div>
                                    <div className="absolute top-2 right-4 bg-blue-50 text-hana-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                                        Live
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                {TECHNOLOGY_B2B.pillars[1].title}
                            </h3>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {TECHNOLOGY_B2B.pillars[1].items[0]}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 3: Exception-Only */}
                    <FadeIn delay={0.3}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual Container */}
                            <div className="mb-10 w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                                <div className="absolute inset-0 bg-slate-50/50"></div>
                                {/* Abstract UI: Funnel/Filter */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-32 h-1 bg-slate-200 rounded-full mb-2"></div>
                                    <div className="w-24 h-1 bg-slate-200 rounded-full mb-2"></div>
                                    <div className="w-16 h-1 bg-slate-200 rounded-full mb-2"></div>
                                    <div className="w-8 h-8 rounded-full bg-hana-primary text-white flex items-center justify-center shadow-lg mt-1 relative">
                                        <UserCheck className="w-4 h-4" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-400 uppercase">
                                    Filter Mode
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                {TECHNOLOGY_B2B.pillars[2].title}
                            </h3>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {TECHNOLOGY_B2B.pillars[2].items[0]}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 4: Reporting */}
                    <FadeIn delay={0.4}>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col items-center text-center group hover:bg-slate-100 transition-colors duration-500">
                            {/* Visual Container */}
                            <div className="mb-10 w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                                <div className="absolute inset-0 bg-slate-50/50"></div>
                                {/* Abstract UI: Report Document */}
                                <div className="relative z-10 w-20 h-24 bg-white border border-slate-200 rounded-lg shadow-sm p-3 flex flex-col gap-2 transform rotate-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-full mb-1 flex items-center justify-center text-hana-accent">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                                    <div className="w-2/3 h-1 bg-slate-100 rounded-full"></div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                                    <div className="absolute bottom-2 right-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                                <div className="absolute -z-10 top-4 right-16 w-16 h-16 bg-blue-50 rounded-full blur-xl"></div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                {TECHNOLOGY_B2B.pillars[3].title}
                            </h3>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {TECHNOLOGY_B2B.pillars[3].items[0]}
                            </p>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
};

export default TechnologyB2B;
