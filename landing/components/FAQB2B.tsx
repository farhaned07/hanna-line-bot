import React, { useState } from 'react';
import { FAQ_B2B } from '../constants-b2b';
import { ChevronDown, HelpCircle } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const FAQB2B: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl font-bold text-hana-accent tracking-tight mb-4 font-sans">Common Questions</h2>
                    </FadeIn>
                </div>

                <div className="space-y-4">
                    {[...FAQ_B2B.insurers, ...FAQ_B2B.clinics].map((item, index) => (
                        <FadeIn key={index} delay={index * 0.05}>
                            <div className="border-b border-slate-200 pb-4">
                                <button
                                    className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
                                    onClick={() => setOpenIndex(index === openIndex ? null : index)}
                                >
                                    <span className={`text-lg font-bold transition-colors font-sans pr-8 ${openIndex === index ? 'text-hana-primary' : 'text-hana-accent group-hover:text-hana-primary'}`}>
                                        {item.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-hana-accent transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-hana-primary' : ''}`} />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="pb-6 text-slate-body leading-relaxed font-body text-base">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQB2B;
