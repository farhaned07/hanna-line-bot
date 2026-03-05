import React from 'react';
import { TEAM_B2B } from '../constants-b2b';
import FadeIn from './animations/FadeIn';

const Team: React.FC = () => {
    return (
        <section className="py-24 bg-cool-gray">
            <div className="container mx-auto px-6 max-w-[1280px]">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl lg:text-[40px] font-bold text-hana-accent mb-4 font-sans tracking-tight">Leadership</h2>
                        <p className="text-slate-body max-w-2xl mx-auto text-lg font-body leading-relaxed">
                            {TEAM_B2B.headline}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TEAM_B2B.members.map((member, index) => (
                        <FadeIn key={index} delay={index * 0.2}>
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-hover transition-all duration-300 text-center group">
                                <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-5xl mb-6 shadow-inner border-4 border-white group-hover:scale-110 transition-transform duration-300">
                                    {index === 0 ? '👨‍⚕️' : index === 1 ? '👩‍💻' : '👨‍💼'}
                                </div>
                                <h3 className="text-2xl font-bold text-hana-accent mb-2 font-sans">{member.name}</h3>
                                <p className="text-hana-primary font-bold text-xs uppercase tracking-widest mb-4 font-sans">{member.role}</p>
                                <p className="text-slate-body text-sm leading-relaxed font-body">
                                    "{member.bio}"
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
