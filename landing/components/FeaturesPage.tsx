import React from 'react';
import { ArrowLeft, Brain, MessageCircle, LayoutDashboard, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from './animations/FadeIn';

const FeaturesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface font-body text-text-primary">
            {/* Navigation */}
            <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6">
                <div className="bg-white/90 backdrop-blur-3xl border border-white/60 rounded-full shadow-xl shadow-slate-900/5 px-6 py-3 md:px-8 flex items-center gap-8 md:gap-12 max-w-4xl w-full justify-between ring-1 ring-black/5">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/hanna-logo.png" alt="Hanna" className="h-7 w-auto" />
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-text-primary font-sans">
                            hanna<span className="text-hana-primary">.</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                        className="bg-hana-accent text-white px-5 py-2.5 md:px-6 rounded-full text-xs md:text-sm font-bold transition-all hover:bg-hana-primary shadow-md font-sans">
                        Book Demo
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-hana-dark via-hana-accent to-hana-primary/80">
                <div className="container mx-auto max-w-[1280px]">
                    <FadeIn>
                        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white font-sans tracking-tight mb-6">
                            Features & Capabilities
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-xl text-white/70 max-w-2xl font-medium">
                            Discover how Hanna multiplies nurse capacity through supervised AI, intelligent monitoring, and seamless integration with existing workflows.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Feature 1: Intelligence Layer */}
            <section className="py-24 px-6 bg-white" id="intelligence">
                <div className="container mx-auto max-w-[1280px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hana-primary/10 text-hana-accent text-xs font-bold uppercase tracking-widest mb-6">
                                    <Brain className="w-4 h-4" />
                                    Intelligence Layer
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                                    One Brain. Every Patient. Every Day.
                                </h2>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    Hanna's intelligence layer processes daily patient interactions and transforms them into actionable insights for care teams.
                                </p>
                                <ul className="space-y-4">
                                    {['Automated daily symptom detection', 'Medication adherence tracking', 'Trend analysis across patient population', 'Risk stratification and prioritization'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-hana-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="bg-slate-50 rounded-[2rem] p-8 aspect-square flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-hana-primary to-hana-accent flex items-center justify-center">
                                    <Brain className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Feature 2: LINE Integration */}
            <section className="py-24 px-6 bg-slate-50" id="line-integration">
                <div className="container mx-auto max-w-[1280px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn delay={0.2} className="order-2 lg:order-1">
                            <div className="bg-white rounded-[2rem] p-8 aspect-square flex items-center justify-center shadow-lg">
                                <div className="w-32 h-32 rounded-2xl bg-[#00B900] flex items-center justify-center">
                                    <MessageCircle className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn className="order-1 lg:order-2">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B900]/10 text-[#00B900] text-xs font-bold uppercase tracking-widest mb-6">
                                    <MessageCircle className="w-4 h-4" />
                                    LINE Integration
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                                    Meet Patients Where They Are
                                </h2>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    No app downloads. No training. Patients use LINE—Thailand's most popular messaging platform—to report vitals, symptoms, and medication adherence.
                                </p>
                                <ul className="space-y-4">
                                    {['Zero friction onboarding', 'Thai language support', 'Voice note collection', 'Photo & document sharing'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#00B900] mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Feature 3: Nurse Dashboard */}
            <section className="py-24 px-6 bg-white" id="dashboard">
                <div className="container mx-auto max-w-[1280px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hana-primary/10 text-hana-accent text-xs font-bold uppercase tracking-widest mb-6">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Nurse Dashboard
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                                    Mission Control for Care Teams
                                </h2>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    A purpose-built dashboard that shows nurses exactly who needs attention—and why. No noise, just actionable priorities.
                                </p>
                                <ul className="space-y-4">
                                    {['Real-time patient status overview', 'Priority-ranked alert queue', 'Full conversation history', 'One-click escalation to physicians'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-hana-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="bg-slate-50 rounded-[2rem] p-8 aspect-square flex items-center justify-center">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                    <LayoutDashboard className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Feature 4: Governance & Safety */}
            <section className="py-24 px-6 bg-slate-50" id="governance">
                <div className="container mx-auto max-w-[1280px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn delay={0.2} className="order-2 lg:order-1">
                            <div className="bg-white rounded-[2rem] p-8 aspect-square flex items-center justify-center shadow-lg">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <Shield className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn className="order-1 lg:order-2">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-widest mb-6">
                                    <Shield className="w-4 h-4" />
                                    Governance & Safety
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-sans tracking-tight mb-6">
                                    Built for Healthcare Compliance
                                </h2>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    Hanna is designed with healthcare governance at its core. Every AI action is supervised, logged, and auditable.
                                </p>
                                <ul className="space-y-4">
                                    {['Human-in-the-loop for all clinical decisions', 'Full audit trail and logging', 'PDPA-compliant data handling', 'Role-based access controls'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-gradient-to-br from-hana-dark via-hana-accent to-hana-primary/80">
                <div className="container mx-auto max-w-[1280px] text-center">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-sans tracking-tight mb-6">
                            Ready to multiply your nurse capacity?
                        </h2>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Book a 30-minute demo to see how Hanna can transform your care team's efficiency.
                        </p>
                        <button
                            onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/farhan-sabbir07/30min' })}
                            className="bg-white text-hana-accent px-8 py-4 rounded-full text-base font-bold hover:bg-hana-light hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2 group"
                        >
                            Book a Demo
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-surface text-center">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} Hanna AI. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default FeaturesPage;
