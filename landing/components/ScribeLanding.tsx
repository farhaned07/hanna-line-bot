import React, { useEffect, useRef } from 'react';

const ScribeLanding: React.FC = () => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#FAFAFA', color: '#1A1A1A' }}>

            {/* ═══════ NAV ═══════ */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(250, 250, 250, 0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src="/hanna-logo.png" alt="Hanna" style={{ width: 32, height: 32, borderRadius: 8 }} />
                        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>
                            Hanna <span style={{ fontWeight: 400, color: '#888', fontSize: 14 }}>Care Intelligence</span>
                        </span>
                    </div>
                    <a
                        href="/scribe/app"
                        style={{
                            padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                            background: '#1A1A1A', color: '#fff', textDecoration: 'none',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Try Free
                    </a>
                </div>
            </nav>

            {/* ═══════ HERO ═══════ */}
            <section style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px', textAlign: 'center',
            }}>
                <div style={{ maxWidth: 800 }}>
                    <div className="animate-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#30D158', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                            Clinical Documentation AI
                        </p>
                        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20 }}>
                            Doctor speaks.<br />
                            <span style={{ color: '#30D158' }}>AI writes.</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#666', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 40px' }}>
                            Clinical notes generated in seconds, not hours. SOAP notes, progress notes, and more — from your voice.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="/scribe/app"
                                style={{
                                    padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700,
                                    background: '#1A1A1A', color: '#fff', textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                Try Free — No Credit Card
                            </a>
                            <a
                                href="#how-it-works"
                                style={{
                                    padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600,
                                    background: 'transparent', color: '#1A1A1A', textDecoration: 'none',
                                    border: '1.5px solid #E0E0E0', transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1A1A1A'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E0E0E0'; }}
                            >
                                See How It Works
                            </a>
                        </div>
                    </div>
                    <div className="animate-on-scroll" style={{ marginTop: 60, opacity: 0, transform: 'translateY(40px)', transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }}>
                        <img
                            src="/hero-scribe.png"
                            alt="Doctor using Hanna Scribe"
                            style={{ width: '100%', maxWidth: 420, margin: '0 auto', borderRadius: 24 }}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════ PAIN POINTS ═══════ */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
                            The problem is <span style={{ color: '#FF453A' }}>real</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#888' }}>Documentation is the #1 cause of physician burnout</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {[
                            { emoji: '😩', stat: '3 hours', desc: 'lost daily on documentation', sub: 'That\'s 15 hours/week — almost 2 full workdays' },
                            { emoji: '⏱️', stat: '5–8 fewer', desc: 'patients seen per day', sub: 'Every hour charting is an hour not treating' },
                            { emoji: '💰', stat: '฿15,000', desc: 'in lost revenue daily', sub: 'Per clinic — that\'s ฿450,000/month left on the table' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="animate-on-scroll"
                                style={{
                                    padding: 32, borderRadius: 20,
                                    background: '#FAFAFA', border: '1px solid #F0F0F0',
                                    textAlign: 'center', opacity: 0, transform: 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.1}s`,
                                }}
                            >
                                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.emoji}</div>
                                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>{item.stat}</div>
                                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.desc}</div>
                                <div style={{ fontSize: 14, color: '#999' }}>{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ HOW IT WORKS ═══════ */}
            <section id="how-it-works" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
                            Simple as <span style={{ color: '#30D158' }}>1, 2, 3</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#888' }}>Your first SOAP note in under 60 seconds</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
                        {[
                            { step: '1', icon: '🎙️', title: 'Tap & Record', desc: 'Open the app, tap record, and speak during your consultation as you normally would.', color: '#3478F6' },
                            { step: '2', icon: '⚡', title: 'AI Generates', desc: 'In seconds, Hanna generates a structured SOAP note from your conversation.', color: '#30D158' },
                            { step: '3', icon: '📋', title: 'Review & Export', desc: 'Edit if needed, finalize, and export as PDF or copy to your system.', color: '#FF9F0A' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="animate-on-scroll"
                                style={{
                                    padding: 36, borderRadius: 24,
                                    background: '#fff', border: '1px solid #F0F0F0',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    opacity: 0, transform: 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.15}s`,
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: `${item.color}15`, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: 24, marginBottom: 20,
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{
                                    fontSize: 12, fontWeight: 700, color: item.color,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                                }}>
                                    Step {item.step}
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.3px' }}>{item.title}</h3>
                                <p style={{ fontSize: 15, color: '#888', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ FEATURES ═══════ */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
                            Built for <span style={{ color: '#30D158' }}>clinicians</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#888' }}>Everything you need, nothing you don't</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {[
                            { icon: '📝', title: 'Multiple Templates', desc: 'SOAP, Progress Notes, Free Text — choose your format for each consult.' },
                            { icon: '🌏', title: 'Thai & English', desc: 'Transcription and notes in Thai, English, or mixed — handles medical terminology.' },
                            { icon: '🤖', title: 'AI Commands', desc: '"Make it shorter", "Add differential diagnosis" — edit notes with natural language.' },
                            { icon: '🔄', title: 'Shift Handover', desc: 'Auto-generated shift summaries with patient statuses for seamless handoff.' },
                            { icon: '📱', title: 'Works on Your Phone', desc: 'No installation needed. PWA works on any phone, tablet, or desktop browser.' },
                            { icon: '🔒', title: 'Supervised AI', desc: 'Every note is reviewed by the clinician. AI assists, never replaces your judgment.' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="animate-on-scroll"
                                style={{
                                    padding: 28, borderRadius: 18,
                                    background: '#FAFAFA', border: '1px solid #F0F0F0',
                                    opacity: 0, transform: 'translateY(16px)',
                                    transition: `all 0.5s ease ${(i % 3) * 0.1}s`,
                                }}
                            >
                                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.2px' }}>{item.title}</h3>
                                <p style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ VISION ═══════ */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #FAFAFA 0%, #F0F4F0 100%)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <div className="animate-on-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#30D158', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                            The Bigger Picture
                        </p>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
                            Scribe is just the <span style={{ color: '#30D158' }}>beginning</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, marginBottom: 48 }}>
                            From consultation to recovery — one continuous thread of care.
                        </p>
                    </div>
                    <div className="animate-on-scroll" style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 48, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.15s' }}>
                        {[
                            { icon: '🎙️', label: 'Document', active: true },
                            { icon: '→', label: '' },
                            { icon: '📋', label: 'Care Plan', active: false },
                            { icon: '→', label: '' },
                            { icon: '📱', label: 'Follow-up', active: false },
                        ].map((item, i) => (
                            item.label === '' ? (
                                <span key={i} style={{ fontSize: 24, color: '#CCC' }}>→</span>
                            ) : (
                                <div
                                    key={i}
                                    style={{
                                        padding: '20px 28px', borderRadius: 16,
                                        background: item.active ? '#fff' : '#fff',
                                        border: item.active ? '2px solid #30D158' : '1px solid #E0E0E0',
                                        boxShadow: item.active ? '0 4px 16px rgba(48, 209, 88, 0.15)' : 'none',
                                        textAlign: 'center', minWidth: 120,
                                    }}
                                >
                                    <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: item.active ? '#30D158' : '#888' }}>
                                        {item.label}
                                        {item.active && <div style={{ fontSize: 11, color: '#30D158', marginTop: 2 }}>Available now</div>}
                                        {!item.active && <div style={{ fontSize: 11, color: '#CCC', marginTop: 2 }}>Coming soon</div>}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="animate-on-scroll" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.3s' }}>
                        {[
                            'Auto care plans from notes',
                            'Patient follow-up via LINE',
                            'Medication adherence tracking',
                        ].map((text, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#888' }}>
                                <span style={{ color: '#CCC' }}>○</span> {text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ TRUST ═══════ */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="animate-on-scroll" style={{
                        display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center',
                        opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease',
                    }}>
                        <img src="/illust-trust.png" alt="Supervised AI" style={{ width: '100%', maxWidth: 300, borderRadius: 24 }} />
                        <div style={{ maxWidth: 440 }}>
                            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', marginBottom: 16 }}>
                                Supervised AI.<br />
                                <span style={{ color: '#30D158' }}>You decide.</span>
                            </h2>
                            <p style={{ fontSize: 16, color: '#888', lineHeight: 1.7, marginBottom: 20 }}>
                                Hanna doesn't replace clinicians — it makes them faster. Every note is reviewed and approved by you before it's finalized. AI assists, never acts alone.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    'AI writes → you review & confirm',
                                    'AI flags risk → alerts your team, never acts alone',
                                    'Full audit trail for every note',
                                ].map((text, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                                        <span style={{ color: '#30D158', fontWeight: 700 }}>✓</span>
                                        <span style={{ color: '#555' }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ PRICING ═══════ */}
            <section id="pricing" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 60, opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
                            Simple, transparent <span style={{ color: '#30D158' }}>pricing</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#888' }}>Start free. Upgrade when you're ready.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                        {[
                            {
                                name: 'Free', price: '฿0', period: '/month', desc: 'Try Scribe risk-free',
                                features: ['10 notes/month', 'SOAP template', 'Thai & English', 'Works on phone'],
                                cta: 'Start Free', ctaBg: '#F0F0F0', ctaColor: '#1A1A1A', popular: false,
                            },
                            {
                                name: 'Pro', price: '฿1,990', period: '/person/mo', desc: 'For solo practitioners',
                                features: ['Unlimited notes', 'All templates', 'AI commands', 'PDF export', 'Shift handover', 'LINE support'],
                                cta: 'Start Pro', ctaBg: '#1A1A1A', ctaColor: '#fff', popular: true,
                            },
                            {
                                name: 'Clinic', price: '฿4,990', period: '/month', desc: 'For your whole team (≤5)',
                                features: ['Everything in Pro', 'Up to 5 team members', 'Team invite links', 'Shared note access', 'Usage analytics', 'Dedicated support'],
                                cta: 'Start Clinic', ctaBg: '#F0F0F0', ctaColor: '#1A1A1A', popular: false,
                            },
                        ].map((plan, i) => (
                            <div
                                key={i}
                                className="animate-on-scroll"
                                style={{
                                    padding: 32, borderRadius: 24, position: 'relative',
                                    background: '#fff', border: plan.popular ? '2px solid #30D158' : '1px solid #F0F0F0',
                                    boxShadow: plan.popular ? '0 8px 32px rgba(48, 209, 88, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                                    opacity: 0, transform: 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.1}s`,
                                }}
                            >
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                        background: '#30D158', color: '#fff', padding: '4px 16px', borderRadius: 20,
                                        fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                                    }}>
                                        POPULAR
                                    </div>
                                )}
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>{plan.desc}</p>
                                <div style={{ marginBottom: 24 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>{plan.price}</span>
                                    <span style={{ fontSize: 14, color: '#999' }}>{plan.period}</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                                    {plan.features.map((f, j) => (
                                        <li key={j} style={{ fontSize: 14, color: '#666', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ color: '#30D158' }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/scribe/app"
                                    style={{
                                        display: 'block', textAlign: 'center',
                                        padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700,
                                        background: plan.ctaBg, color: plan.ctaColor, textDecoration: 'none',
                                        transition: 'all 0.2s', border: plan.popular ? 'none' : '1px solid #E0E0E0',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {plan.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#999' }}>
                        Hospital? <strong>฿49,900/month</strong> for up to 50 clinicians. <a href="mailto:hello@hanna.care" style={{ color: '#30D158', fontWeight: 600, textDecoration: 'none' }}>Contact us →</a>
                    </p>
                </div>
            </section>

            {/* ═══════ FINAL CTA ═══════ */}
            <section style={{
                padding: '100px 24px', textAlign: 'center',
                background: 'linear-gradient(180deg, #FAFAFA 0%, #F0FAF2 100%)',
            }}>
                <div className="animate-on-scroll" style={{ maxWidth: 600, margin: '0 auto', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
                        Start documenting <span style={{ color: '#30D158' }}>smarter</span>
                    </h2>
                    <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, marginBottom: 36 }}>
                        Your first 10 notes are free. No credit card. No installation. Works on your phone.
                    </p>
                    <a
                        href="/scribe/app"
                        style={{
                            display: 'inline-block', padding: '18px 48px', borderRadius: 14,
                            fontSize: 18, fontWeight: 700, background: '#1A1A1A', color: '#fff',
                            textDecoration: 'none', transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Try Hanna Scribe Free →
                    </a>
                </div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '40px 24px', background: '#1A1A1A', color: '#888',
                textAlign: 'center', fontSize: 14,
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                        <a href="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy</a>
                        <a href="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</a>
                        <a href="mailto:hello@hanna.care" style={{ color: '#888', textDecoration: 'none' }}>hello@hanna.care</a>
                    </div>
                    <p style={{ color: '#555' }}>© 2025 Hanna Care Intelligence. All rights reserved.</p>
                </div>
            </footer>

            {/* ═══════ SCROLL ANIMATION CSS ═══════ */}
            <style>{`
        .animate-on-scroll { will-change: opacity, transform; }
        .animate-visible { opacity: 1 !important; transform: translateY(0) !important; }
        @media (max-width: 768px) {
          nav > div { padding: 12px 16px !important; }
        }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
        </div>
    );
};

export default ScribeLanding;
