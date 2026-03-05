import React, { useState } from 'react';
import FadeIn from './animations/FadeIn';

const RoiCalculator: React.FC = () => {
    // Inputs
    const [patientCount, setPatientCount] = useState(1000);
    const [hospitalizationRate, setHospitalizationRate] = useState(25); // % (High Risk focus)
    const [avgCost, setAvgCost] = useState(250000); // THB

    // Constants
    const REDUCTION_RATE = 0.45; // 45% (Higher efficacy with nurse loop)
    const HANNA_PRICE_PER_MONTH = 599;

    // Derived Values
    const annualHannaCost = patientCount * HANNA_PRICE_PER_MONTH * 12;
    const currentHospitalizations = Math.round(patientCount * (hospitalizationRate / 100));
    const preventableHospitalizations = Math.round(currentHospitalizations * REDUCTION_RATE);
    const grossSavings = preventableHospitalizations * avgCost;
    const netSavings = grossSavings - annualHannaCost;
    const roi = annualHannaCost > 0 ? (netSavings / annualHannaCost).toFixed(1) : "0.0";

    // Formatters
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'THB',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(val).replace('THB', '฿');
    };

    const formatMillions = (val: number) => {
        const millions = val / 1000000;
        return `฿${millions.toFixed(1)}M`;
    };

    return (
        <section className="py-24 bg-hana-accent text-white relative overflow-hidden" id="roi">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white mb-4 font-sans tracking-tight">
                            Interactive Saving Model
                        </h2>
                        <p className="text-lg text-slate-300 font-body">
                            Model the impact of Hanna's claim prevention infrastructure on your high-risk population.
                        </p>
                    </FadeIn>
                </div>

                {/* Main Content Centered */}
                <div className="max-w-4xl mx-auto">
                    <FadeIn delay={0.1}>
                        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl text-hana-accent relative overflow-hidden text-center">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-hana-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-hana-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

                            {/* Slider Section */}
                            <div className="relative z-10 mb-12 max-w-xl mx-auto">
                                <div className="flex flex-col items-center gap-2 mb-6">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Number of High-Risk Patients</label>
                                    <span className="text-5xl md:text-6xl font-bold text-hana-accent tabular-nums tracking-tight">
                                        {patientCount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="relative h-12 flex items-center">
                                    <input
                                        type="range"
                                        min="100"
                                        max="10000"
                                        step="100"
                                        value={patientCount}
                                        onChange={(e) => setPatientCount(parseInt(e.target.value))}
                                        className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-hana-primary hover:accent-hana-accent transition-colors"
                                    />
                                </div>
                                <div className="flex justify-between px-1 text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">
                                    <span>100</span>
                                    <span>10,000</span>
                                </div>
                            </div>

                            {/* Results Grid */}
                            <div className="grid md:grid-cols-3 gap-8 relative z-10 border-t border-slate-100 pt-10">
                                {/* Hanna Cost */}
                                <div className="space-y-1 group">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Investment</p>
                                    <p className="text-2xl font-bold text-slate-600 transition-colors group-hover:text-hana-accent">
                                        {formatCurrency(annualHannaCost)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        @{formatCurrency(HANNA_PRICE_PER_MONTH)}/patient/mo
                                    </p>
                                </div>

                                {/* Gross Savings */}
                                <div className="space-y-1 group relative">
                                    {/* Divider for Desktop */}
                                    <div className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    <div className="hidden md:block absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>

                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Admissions Prevented</p>
                                    <p className="text-4xl text-hana-primary font-bold">
                                        {preventableHospitalizations}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        ~45% reduction rate
                                    </p>
                                </div>

                                {/* Net Savings */}
                                <div className="space-y-1 group">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Annual Savings</p>
                                    <p className="text-3xl md:text-4xl font-bold text-hana-accent text-gradient-primary">
                                        {formatMillions(netSavings)}
                                    </p>
                                    <p className="text-xs font-bold text-hana-primary bg-hana-primary/10 inline-block px-2 py-0.5 rounded-full mt-1">
                                        {roi}x ROI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

            </div>

            <div className="text-center mt-8 px-6 text-white/60 text-xs font-body max-w-2xl mx-auto italic">
                Based on published clinical literature and early pilot benchmarks. Results vary by population and condition.
            </div>

        </section >
    );
};

export default RoiCalculator;
