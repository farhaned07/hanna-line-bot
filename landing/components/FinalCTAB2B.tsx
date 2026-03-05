import React from 'react';
import { FINAL_CTA_B2B } from '../constants-b2b';
import { ArrowRight } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const FinalCTAB2B: React.FC = () => {
    return (
        <section className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <FadeIn direction="up">
                    <h2 className="text-5xl lg:text-7xl font-bold text-hana-accent tracking-tight mb-6 font-sans">
                        {FINAL_CTA_B2B.headline}
                    </h2>
                    <p className="text-xl text-slate-500 font-body mb-10 max-w-2xl mx-auto">
                        {FINAL_CTA_B2B.subheadline}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                        <button
                            onClick={() => window.location.href = 'mailto:farhan@hanna.care'}
                            className="bg-hana-primary text-white px-10 py-5 rounded-lg text-xl font-bold shadow-lg hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 font-sans"
                        >
                            {FINAL_CTA_B2B.ctaPrimary}
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-xs font-bold uppercase tracking-widest font-sans">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-hana-primary"></span>
                            PDPA Compliant
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-hana-primary"></span>
                            Thai Medical Council
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-hana-primary"></span>
                            LINE Partner
                        </span>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default FinalCTAB2B;
