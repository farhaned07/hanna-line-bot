import React from 'react';
import {
    Clock, AlertTriangle, Hospital, ShieldCheck, Phone, Activity, ArrowRight,
    MessageCircle, Users, CheckCircle, Smartphone, Calendar, UserCheck, Flame, Layout
} from 'lucide-react';

// ============================================
// HERO SECTION
// ============================================
export const HERO_B2B = {
    headline: "10x Nurse Capacity Through Supervised AI",
    subheadline: "Your nurses focus on exceptions. Hanna handles the rest.",
    heroBullets: [
        "Hanna is supervised care infrastructure for closing the gap between clinical visits."
    ],
    ctaPrimary: "See the demo",
    ctaSecondary: "Let's talk",
    socialProof: [
        "Licensed clinicians in the loop",
        "Thai language fluency",
        "HIPAA/PDPA compliant"
    ]
};

// ============================================
// PROBLEM SECTION ("The Problem Is Real")
// ============================================
export const PROBLEM_B2B = {
    headline: "Thailand is short 50,000 nurses.",
    subheadline: "You can't hire your way out.",
    context: "The gap between visits is where healthcare fails.",
    points: [
        {
            title: "Nurses are overworked.",
            icon: <Clock className="w-6 h-6 text-red-500" />
        },
        {
            title: "Patients fall through the cracks.",
            icon: <AlertTriangle className="w-6 h-6 text-red-500" />
        },
        {
            title: "You can't scale fast enough.",
            icon: <Users className="w-6 h-6 text-red-500" />
        }
    ],
    summary: "The gap between visits is where healthcare fails."
};

// ============================================
// SOLUTION SECTION ("The Solution" & "How It Actually Works")
// ============================================
export const SOLUTION_B2B = {
    headline: "Hanna multiplies your team's impact.",
    subheadline: "",
    steps: [
        {
            title: "Daily patient check-ins",
            description: "(LINE, no app)",
            icon: <MessageCircle className="w-6 h-6 text-hana-primary" />
        },
        {
            title: "Tracks vitals, meds, symptoms automatically",
            description: "",
            icon: <Activity className="w-6 h-6 text-hana-primary" />
        },
        {
            title: "Alerts nurses only when action is needed",
            description: "",
            icon: <UserCheck className="w-6 h-6 text-hana-primary" />
        },
        {
            title: "Gives nurses full context to act fast",
            description: "",
            icon: <ShieldCheck className="w-6 h-6 text-hana-primary" />
        }
    ],
    outcome: [
        "Hanna bridges the gap with daily patient check-ins via LINE (Thai language, no app download needed).",
        "Your clinical team sees everything in real-time. They decide what happens. Hanna coordinates.",
        "This is supervised care infrastructure. Not autonomous AI. Not a black box."
    ]
};

// ============================================
// IMPACT SECTION ("Why This Works (In Theory)")
// ============================================
export const IMPACT_B2B = {
    headline: "1 Nurse → 200 Patients. In Control. Proactive.",
    subheadline: "No burnout. No compromises.",
    comparison: {
        traditional: {
            label: "Before Hanna",
            items: [
                "1 nurse → 20 patients",
                "Overwhelmed",
                "Reactive"
            ]
        },
        hanna: {
            label: "With Hanna",
            highlight: "1 nurse → 200 patients. In control. Proactive."
        }
    },
    strategy: {
        headline: "Why This Works",
        text: "No burnout. No compromises.",
        reductions: [],
        quote: "No burnout. No compromises."
    }
};

// ============================================
// ONEBRAIN INTELLIGENCE LAYER
// ============================================
export const ONE_BRAIN_B2B = {
    headline: "Powered by OneBrain™ Intelligence.",
    subheadline: "The engine that makes 10x capacity possible.",
    features: [
        {
            title: "Contextual Awareness",
            description: "Remembers every patient interaction, lab result, and vital history."
        },
        {
            title: "Clinical Guardrails",
            description: "Built-in safety protocols that escalate risks instantly."
        },
        {
            title: "Adaptive Learning",
            description: "Gets smarter with every nurse decision and feedback loop."
        }
    ]
};

// ============================================
// TECHNOLOGY SECTION ("The Tech You Need to Know")
// ============================================
// ============================================
// TECHNOLOGY SECTION ("The Tech You Need to Know")
// ============================================
export const TECHNOLOGY_B2B = {
    headline: "Built for Scale. Designed for Control.",
    subheadline: "",
    pillars: [
        {
            title: "Supervised AI Governance",
            items: ["AI follows clinical rules. Humans stay in control."],
            icon: <ShieldCheck className="w-10 h-10 text-hana-primary" />
        },
        {
            title: "Continuous Out-of-Hospital Visibility",
            items: ["See patient status between visits."],
            icon: <Activity className="w-10 h-10 text-hana-primary" />
        },
        {
            title: "Exception-Only Care Orchestration",
            items: ["Nurses act only when needed."],
            icon: <UserCheck className="w-10 h-10 text-hana-primary" />
        },
        {
            title: "Clinical-Grade Reporting & Auditability",
            items: ["Clear reports. Full traceability."],
            icon: <CheckCircle className="w-10 h-10 text-hana-primary" />
        }
    ],
    footer: ""
};

// ============================================
// COMPARISON SECTION mapped to "What Happens Next"
// ============================================
export const COMPARISON_B2B = {
    headline: "What Happens Next",
    columns: [
        { header: "Timeline", accessor: "time" },
        { header: "Activity", accessor: "activity" }
    ],
    rows: [
        { time: "Week 1", activity: "Discovery call. Map your workflow. Define success metrics." },
        { time: "Week 2-3", activity: "Pilot setup. Integration. Team training." },
        { time: "Week 4", activity: "Go live with your first cohort." },
        { time: "Ongoing", activity: "Real-time feedback. Rapid iteration. Outcome tracking." },
        { time: "Goal", activity: "This is a partnership, not a sale." }
    ]
};

// ============================================
// ECONOMICS SECTION mapped to "Why This Moment"
// ============================================
export const ECONOMICS_B2B = {
    headline: "Serve more patients without hiring more staff.",
    subheadline: "",
    points: [],
    punchline: "",
    strategicShift: {
        headline: "",
        text: "",
        highlight: ""
    }
};

// ============================================
// WHO IT'S FOR mapped to "What We're Looking For"
// ============================================
export const AUDIENCE_B2B = [
    {
        id: "partners",
        label: "Visionary Leaders",
        challenge: "We're not selling software yet. We're building with visionary healthcare leaders who see the problem and want to solve it.",
        solution: "Deploy with a real patient cohort. Give us honest feedback. Help us validate the model. Be part of the story of healthcare that actually works.",
        fit: "Pilot Partners Needed",
        icon: <Users className="w-5 h-5" />
    }
];

// ============================================
// CLOSING SECTION ("The Long Game")
// ============================================
export const CLOSING_B2B = {
    headline: "Close the Gap.",
    subheadline: "You don't need 100 more nurses for 100 more patients. You need Hanna.",
    text: "Start Your Pilot",
    tagline: ""
};

// ============================================
// FAQ - Minimal or Hidden
// ============================================
export const FAQ_B2B = {
    insurers: [],
    clinics: []
};

// ============================================
// CTA & Footer ("Join Us")
// ============================================
export const FINAL_CTA_B2B = {
    headline: "Join Us",
    subheadline: "We're building the bridge between visits. Healthcare leaders who want outcomes—not demos—are already talking to us.",
    ctaPrimary: "Let's talk – 30-minute fit call",
    ctaSecondary: "See the demo – 2-minute prototype",
    email: "farhan@hanna.care"
};

export const FOOTER_B2B = {
    links: [
        { label: "About Hanna", href: "#" },
        { label: "Contact", href: "mailto:farhan@hanna.care" }
    ],
    resources: [],
    social: {
        linkedin: "#",
        email: "farhan@hanna.care"
    },
    legal: "© 2026 Hanna. Hanna is supervised care infrastructure. Not a licensed healthcare provider."
};

// ============================================
// PILOT SECTION
// ============================================
export const PILOT_B2B = {
    headline: "Partnership Pilot Program",
    features: [
        "Full access to Hanna platform",
        "Weekly clinical review meetings",
        "Custom integration support",
        "Priority feature requests"
    ],
    pricing: {
        title: "Pilot Partnership",
        description: "We invest in your success. No upfront costs for selected partners."
    },
    timeline: [
        { month: "Month 1", event: "Integration & Training" },
        { month: "Month 2", event: "Soft Launch (Small Cohort)" },
        { month: "Month 3", event: "Full Rollout & Review" }
    ],
    cta: "Apply for Pilot",
    scarcity: "Limited spots for Q1 2026"
};

// ============================================
// TEAM SECTION
// ============================================
export const TEAM_B2B = {
    headline: "Bridging the gap between clinical excellence and technical innovation.",
    members: [
        {
            name: "Dr. Farhan",
            role: "Clinical Lead",
            bio: "Experienced clinician focused on patient outcomes."
        },
        {
            name: "Engineering Lead",
            role: "Technology",
            bio: "Building scalable, secure healthcare infrastructure."
        },
        {
            name: "Operations Lead",
            role: "Operations",
            bio: "Ensuring smooth implementation and support."
        }
    ]
};
