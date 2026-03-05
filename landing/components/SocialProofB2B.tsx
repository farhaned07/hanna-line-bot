import React from 'react';
import { CheckCircle, Beaker, Building2 } from 'lucide-react';

const SocialProofB2B: React.FC = () => {
    // DLS: Monochrome logos or value props. Icons + Text.
    // Wireframe: CheckBadge "PDPA Compliant", Beaker "Clinical Research Backed", Building "Built for Thai Insurers"

    // Strict 5-color palette:
    // Text: Slate Body (#334155)
    // Icon: Navy (#0F172A)
    // Background: Cool Gray (#F8FAFC)

    const items = [
        { icon: CheckCircle, text: "Production-ready safety net" },
        { icon: Building2, text: "Built for Thai Medical Council compliance" },
        { icon: Beaker, text: "Deterministic risk protocols" },
    ];

    return (
        <section className="py-12 bg-cool-gray border-y border-slate-200/60">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                            <item.icon className="w-6 h-6 text-hana-accent stroke-2" />
                            <span className="text-base font-medium text-slate-body font-body group-hover:text-hana-accent transition-colors">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProofB2B;
