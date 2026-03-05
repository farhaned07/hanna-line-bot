import React from 'react';
import HeroB2B from './HeroB2B';
import ProblemB2B from './ProblemB2B';
import SolutionB2B from './SolutionB2B';
import ImpactB2B from './ImpactB2B';
import OneBrainB2B from './OneBrainB2B';
import TechnologyB2B from './TechnologyB2B';
import EconomicsB2B from './EconomicsB2B';
import ClosingB2B from './ClosingB2B';
import FooterB2B from './FooterB2B';

const LandingPageB2B: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface font-body text-text-primary selection:bg-hana-primary/30 selection:text-white">
            {/* Floating Navbar - Light Glass */}
            <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-3xl border border-white/60 rounded-full shadow-xl shadow-slate-900/5 px-6 py-3 md:px-8 flex items-center gap-8 md:gap-12 max-w-4xl w-full justify-between transition-all duration-300 pointer-events-auto ring-1 ring-black/5">
                    <div className="flex items-center gap-2">
                        <img src="/hanna-logo.png" alt="Hanna" className="h-7 w-auto" />
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-0.5 font-sans">
                            hanna<span className="text-hana-primary">.</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })} className="text-text-secondary hover:text-hana-primary font-medium text-sm transition-colors font-sans">Solution</button>
                        <button onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })} className="text-text-secondary hover:text-hana-primary font-medium text-sm transition-colors font-sans">Impact</button>
                        <a href="/features" className="text-text-secondary hover:text-hana-primary font-medium text-sm transition-colors font-sans">Features</a>
                    </div>

                    <button
                        onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                        className="bg-hana-accent text-white px-5 py-2.5 md:px-6 rounded-full text-xs md:text-sm font-bold transition-all hover:bg-hana-primary transform active:scale-95 shadow-md font-sans">
                        Book Demo
                    </button>
                </div>
            </nav>

            <main>
                {/* 1. Hero */}
                <HeroB2B />

                {/* 2. Problem */}
                <ProblemB2B />

                {/* 3. Solution */}
                <SolutionB2B />

                {/* 4. Impact */}
                <ImpactB2B />

                {/* 5. Intelligence Layer */}
                <OneBrainB2B />

                {/* 6. Technology */}
                <TechnologyB2B />

                {/* 7. Economics */}
                <EconomicsB2B />

                {/* 8. Closing CTA */}
                <ClosingB2B />
            </main>

            {/* Footer */}
            <FooterB2B />
        </div>
    );
};

export default LandingPageB2B;
