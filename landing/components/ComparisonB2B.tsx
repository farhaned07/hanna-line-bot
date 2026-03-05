import React from 'react';
import { COMPARISON_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';

const ComparisonB2B: React.FC = () => {
    // Filter out the "Goal" row (it's a sales message, not a timeline step)
    const timelineRows = COMPARISON_B2B.rows.filter(row => row.time !== "Goal");

    return (
        <section className="py-32 bg-surface relative">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <FadeIn>
                            <span className="text-hana-primary font-bold tracking-widest uppercase text-xs font-mono mb-4 block">Implementation</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-sans tracking-tight">
                                {COMPARISON_B2B.headline}
                            </h2>
                        </FadeIn>
                    </div>

                    {/* Timeline Table */}
                    <FadeIn delay={0.2}>
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface-subtle shadow-lg">
                            {/* Header Row */}
                            <div className="grid grid-cols-12 bg-surface border-b border-border">
                                <div className="col-span-3 p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest font-mono">
                                    Timeline
                                </div>
                                <div className="col-span-9 p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest font-mono">
                                    Activity
                                </div>
                            </div>

                            {/* Data Rows */}
                            <div className="divide-y divide-border">
                                {timelineRows.map((row, i) => (
                                    <div key={i} className="grid grid-cols-12 group hover:bg-hana-light transition-colors">
                                        <div className="col-span-3 p-6 flex items-center">
                                            <span className="text-lg font-bold text-text-primary font-sans">
                                                {row.time}
                                            </span>
                                        </div>
                                        <div className="col-span-9 p-6 flex items-center border-l border-border bg-hana-primary/5 group-hover:bg-hana-primary/10 transition-colors">
                                            <p className="text-base text-text-secondary font-body leading-relaxed">
                                                {row.activity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Partnership Note */}
                    <FadeIn delay={0.4}>
                        <div className="mt-8 text-center">
                            <p className="text-text-secondary font-medium font-body">
                                This is a partnership, not a sale.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default ComparisonB2B;
