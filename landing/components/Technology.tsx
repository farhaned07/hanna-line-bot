import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TECHNOLOGY_B2B } from '../constants-b2b';
import { ShieldCheck, Lock, Server, CheckCircle2, Layout } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const Technology: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Fake distinct cards data mapped from the pillars for visual variety
    const cards = [
        {
            type: 'status',
            title: 'HIPAA Compliant',
            subtitle: 'Data Privacy',
            value: '100%',
            icon: <ShieldCheck className="w-5 h-5" />,
            color: 'bg-white'
        },
        {
            type: 'image',
            src: '/nurse-dashboard-hero.jpg', // Reusing dashboard as a "Security Center" view
            alt: 'Security Center',
            shape: 'rounded-[40px]'
        },
        {
            type: 'circle',
            title: 'Only yours.',
            color: 'bg-[#FFDE00]', // Vibrant Yellow
            textColor: 'text-black',
            icon: <Lock className="w-8 h-8 opacity-80" />
        },
        {
            type: 'stats',
            number: '256',
            label: 'Bit Encryption',
            sublabel: 'Bank-grade security standards',
            flags: true,
            color: 'bg-white'
        },
        {
            type: 'circle',
            title: 'Very safe.',
            color: 'bg-hana-accent', // Brand Blue/Purple equivalent
            textColor: 'text-white',
            icon: <ShieldCheck className="w-8 h-8 opacity-80" />
        },
        {
            type: 'status',
            title: '99.9% Uptime',
            subtitle: 'Reliability',
            value: 'Active',
            icon: <Server className="w-5 h-5" />,
            color: 'bg-white'
        }
    ];

    return (
        <section className="py-32 bg-surface overflow-hidden relative" id="technology">
            <div className="container mx-auto px-6 max-w-[1400px] mb-16 relative z-10 text-center">
                <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                        Security
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-sans tracking-tight mb-4">
                        Your data <span className="font-serif italic font-light text-slate-500">truly</span><br />
                        belongs to you
                    </h2>
                </FadeIn>
            </div>

            {/* Drag/Scroll Container */}
            <div ref={containerRef} className="w-full overflow-x-scroll no-scrollbar pl-6 md:pl-[max(2rem,calc((100vw-1400px)/2))] pb-20 pt-10 cursor-grab active:cursor-grabbing">
                <div className="flex gap-6 md:gap-8 w-max">
                    {/* Card 1: Status Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="w-[280px] h-[320px] bg-white rounded-[32px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-hana-primary">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Privacy</p>
                            <h3 className="text-2xl font-bold text-slate-900">HIPAA<br />Ready</h3>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-slate-700">Compliant</span>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                    </motion.div>

                    {/* Card 2: Image Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="w-[320px] h-[320px] rounded-[40px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative group"
                    >
                        <img
                            src="/nurse-dashboard-hero.jpg"
                            alt="Security"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-bold text-lg">Infrastructure<br />Visualization</p>
                        </div>
                    </motion.div>

                    {/* Card 3: Yellow Circle */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-[320px] h-[320px] rounded-full bg-[#FFDE00] flex flex-col items-center justify-center text-center p-8 shadow-[0_20px_40px_-15px_rgba(255,222,0,0.3)]"
                    >
                        <Lock className="w-10 h-10 text-black mb-4 opacity-80" />
                        <h3 className="text-4xl font-serif italic font-medium text-black leading-tight">
                            Only<br />Yours.
                        </h3>
                    </motion.div>

                    {/* Card 4: Stats Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="w-[360px] h-[320px] bg-slate-100 rounded-[32px] p-8 flex flex-col justify-center relative shadow-inner overflow-hidden"
                    >
                        {/* Decorative blurry blobs inside */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300 rounded-full blur-[40px] opacity-50"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full blur-[40px] opacity-50"></div>

                        <div className="relative z-10">
                            <span className="text-6xl font-bold text-slate-900 font-serif italic block mb-2">256</span>
                            <p className="text-lg font-bold text-slate-700 leading-tight">
                                Bit Encryption<br />Standard
                            </p>
                            <div className="mt-6 flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">🇺🇸</div>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">🇪🇺</div>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">🇹🇭</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 5: Purple Circle */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        className="w-[320px] h-[320px] rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6d9dad] flex flex-col items-center justify-center text-center p-8 shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] text-white"
                    >
                        <ShieldCheck className="w-12 h-12 mb-4 opacity-90" />
                        <h3 className="text-3xl font-serif font-light leading-tight">
                            Very<br />safe.
                        </h3>
                    </motion.div>
                </div>
            </div>

            {/* Floating Label */}
            <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 text-xs font-bold text-slate-500">
                <Layout className="w-3 h-3" />
                Wait, there's more→
            </div>
        </section>
    );
};

export default Technology;
