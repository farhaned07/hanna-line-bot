import React from 'react';
import { FOOTER_B2B } from '../constants-b2b';
import { Mail, ArrowUpRight } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const FooterB2B: React.FC = () => {
    return (
        <footer className="pb-8 px-4 md:px-6 bg-surface">
            <div className="container mx-auto max-w-[1280px]">
                <FadeIn>
                    <div className="bg-gradient-to-br from-hana-dark via-hana-accent to-hana-primary/80 rounded-[2.5rem] p-10 md:p-16 lg:p-20 overflow-hidden relative">

                        {/* Subtle Gradient Orbs */}
                        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-hana-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-16">

                                {/* Brand Column */}
                                <div className="lg:col-span-6 space-y-6">
                                    <FadeIn delay={0.1}>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-4">
                                            <span className="w-2 h-2 rounded-full bg-white/80"></span>
                                            AI Nurse Co-Pilot
                                        </div>
                                    </FadeIn>

                                    <FadeIn delay={0.2}>
                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                            hanna<span className="text-white/60">.</span>
                                        </h2>
                                    </FadeIn>

                                    <FadeIn delay={0.3}>
                                        <p className="text-lg md:text-xl text-white/70 max-w-md font-medium leading-relaxed">
                                            10x nurse capacity through supervised AI. Your nurses focus on exceptions. Hanna handles the rest.
                                        </p>
                                    </FadeIn>

                                    <FadeIn delay={0.4}>
                                        <button
                                            onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                                            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-hana-accent rounded-full font-bold hover:bg-white/90 hover:scale-105 transition-all group"
                                        >
                                            Book a Demo
                                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </FadeIn>
                                </div>

                                {/* Links Columns */}
                                <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10 lg:pt-16">
                                    <FadeIn delay={0.2}>
                                        <div>
                                            <h4 className="text-white/50 font-bold mb-6 text-xs uppercase tracking-widest">Product</h4>
                                            <ul className="space-y-4">
                                                <li><a href="#solution" className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-1 group">
                                                    Solution
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a></li>
                                                <li><a href="#impact" className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-1 group">
                                                    Impact
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a></li>
                                                <li><a href="#technology" className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-1 group">
                                                    Technology
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a></li>
                                            </ul>
                                        </div>
                                    </FadeIn>

                                    <FadeIn delay={0.3}>
                                        <div>
                                            <h4 className="text-white/50 font-bold mb-6 text-xs uppercase tracking-widest">Company</h4>
                                            <ul className="space-y-4">
                                                <li><a href="#" className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-1 group">
                                                    About
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a></li>
                                                <li><a href={`mailto:${FOOTER_B2B.social.email}`} className="text-white/80 font-medium hover:text-white transition-colors flex items-center gap-1 group">
                                                    Contact
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a></li>
                                            </ul>
                                        </div>
                                    </FadeIn>

                                    <FadeIn delay={0.4}>
                                        <div>
                                            <h4 className="text-white/50 font-bold mb-6 text-xs uppercase tracking-widest">Connect</h4>
                                            <a
                                                href={`mailto:${FOOTER_B2B.social.email}`}
                                                className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </FadeIn>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <FadeIn delay={0.5}>
                                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
                                    <p className="text-sm font-medium text-white/50">
                                        © {new Date().getFullYear()} Hanna AI. All rights reserved.
                                    </p>
                                    <div className="flex gap-6 text-sm font-medium text-white/60">
                                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </footer>
    );
};

export default FooterB2B;
