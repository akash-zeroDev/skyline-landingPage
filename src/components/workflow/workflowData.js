export const WORKFLOW_PHASES = [
  {
    id: '01',
    phase: 'PHASE 01',
    title: 'DISCOVER & AUDIT',
    tagline: 'Deconstruct the problem before writing a single line of code.',
    description:
      'We dive deep into your product vision, user behaviors, technical architecture constraints, and market opportunities to define clear benchmarks and remove uncertainty.',
    activities: [
      {
        title: 'Stakeholder Alignment',
        desc: 'Uncover core business KPIs, non-negotiable constraints, and launch timelines.',
      },
      {
        title: 'User Friction Audit',
        desc: 'Identify conversion drop-offs, user bottlenecks, and workflow friction.',
      },
      {
        title: 'Technical Feasibility',
        desc: 'Review API boundaries, data pipelines, hosting requirements, and scalability limits.',
      },
      {
        title: 'Competitive Differentiation',
        desc: 'Analyze category leaders to pinpoint unique positioning and design leverage.',
      },
    ],
    deliverables: [
      'Product Strategy Brief',
      'Technical Feasibility Matrix',
      'User Journey Blueprint',
    ],
    badge: 'Sprint 01 · Foundational Clarity',
    theme: {
      primary: '#10B981', // Emerald / Mint Accent
      orb1: 'rgba(110, 231, 183, 0.45)', // #6EE7B7 mint glow
      orb2: 'rgba(186, 230, 253, 0.50)', // soft sky cyan
      orb3: 'rgba(21, 27, 92, 0.08)',    // subtle navy depth
    },
  },
  {
    id: '02',
    phase: 'PHASE 02',
    title: 'ARCHITECTURE & STRATEGY',
    tagline: 'Bulletproof system foundations and interaction blueprints.',
    description:
      'We architect the technical backbone, database schemas, edge network contracts, and end-to-end information flow before opening Figma or spinning up repositories.',
    activities: [
      {
        title: 'System Architecture',
        desc: 'Define database schema, caching policies, state stores, and external integrations.',
      },
      {
        title: 'Information Architecture',
        desc: 'Structure navigation hierarchies, user mental models, and content relationships.',
      },
      {
        title: 'API & Contract Design',
        desc: 'Establish type-safe schemas, mutation contracts, and payload optimization.',
      },
      {
        title: 'Low-Fi Structural Validation',
        desc: 'Map end-to-end user workflows with clickable low-fidelity wireframe skeletons.',
      },
    ],
    deliverables: [
      'System Architecture Blueprint',
      'API Contract Specification',
      'Clickable Wireframe Skeleton',
    ],
    badge: 'Sprint 02 · Structural Precision',
    theme: {
      primary: '#0284C7', // Sky Blue
      orb1: 'rgba(56, 189, 248, 0.42)', // sky blue
      orb2: 'rgba(167, 243, 208, 0.40)', // mint highlight
      orb3: 'rgba(99, 102, 241, 0.12)',  // soft indigo
    },
  },
  {
    id: '03',
    phase: 'PHASE 03',
    title: 'BESPOKE DESIGN & MOTION',
    tagline: 'Tactile, high-conversion interfaces that captivate and delight.',
    description:
      'We craft an iconic visual language tailored to your brand, pairing high-contrast typography and custom design tokens with fluid, 60fps micro-interactions.',
    activities: [
      {
        title: 'Design System & Tokens',
        desc: 'Define bespoke typography, accessible color ramps, spacing scales, and states.',
      },
      {
        title: 'Interactive Prototypes',
        desc: 'Build high-fidelity prototypes modeling micro-motion, hover states, and transitions.',
      },
      {
        title: 'Responsive Stress Testing',
        desc: 'Exhaustive responsive adaptation across mobile, tablet, desktop, and ultrawide.',
      },
      {
        title: 'Usability Walkthroughs',
        desc: 'Test real customer scenarios to eliminate friction and elevate perceived performance.',
      },
    ],
    deliverables: [
      'Production Figma System',
      'Interactive Motion Prototypes',
      'Design Token Specification',
    ],
    badge: 'Sprint 03 · Visual Excellence',
    theme: {
      primary: '#8B5CF6', // Purple / Violet
      orb1: 'rgba(196, 181, 253, 0.48)', // soft violet
      orb2: 'rgba(110, 231, 183, 0.42)', // mint harmony
      orb3: 'rgba(244, 114, 182, 0.15)', // rose tint
    },
  },
  {
    id: '04',
    phase: 'PHASE 04',
    title: 'ENGINEERING & RIGOROUS QA',
    tagline: 'High-velocity, production-grade code engineered to ship.',
    description:
      'We write clean, modular, accessible code backed by automated testing suites, sub-second load times, and buttery 60fps frame rates across every target device.',
    activities: [
      {
        title: 'Modern Frontend Engineering',
        desc: 'Component architecture with React 19, Framer Motion, and zero bundle bloat.',
      },
      {
        title: 'Edge APIs & Data Integration',
        desc: 'Resilient backend persistence, email SMTP delivery, and optimized endpoints.',
      },
      {
        title: 'Accessibility & Cross-Browser',
        desc: 'WCAG 2.1 AA compliance, keyboard navigation, and Safari/Chrome parity.',
      },
      {
        title: 'Automated QA Testing',
        desc: 'End-to-end regression testing with Playwright, zero layout shifts, and 95+ Lighthouse.',
      },
    ],
    deliverables: [
      'Clean Git Repository & CI/CD',
      'Automated Test Suite',
      'Performance & Security Audit',
    ],
    badge: 'Sprint 04 · Production Engineering',
    theme: {
      primary: '#0D9488', // Teal / Emerald
      orb1: 'rgba(94, 234, 212, 0.45)', // teal
      orb2: 'rgba(110, 231, 183, 0.48)', // mint
      orb3: 'rgba(21, 27, 92, 0.10)',    // navy depth
    },
  },
  {
    id: '05',
    phase: 'PHASE 05',
    title: 'SHIP, SCALE & ITERATE',
    tagline: 'Frictionless launch, telemetry instrumentation, and sustained velocity.',
    description:
      'We deploy your product to global edge infrastructure, instrument real-time telemetry, and remain by your side to iterate based on real customer feedback.',
    activities: [
      {
        title: 'Zero-Downtime Deployment',
        desc: 'Global CDN edge distribution, DNS verification, and asset compression.',
      },
      {
        title: 'Telemetry & Monitoring',
        desc: 'Real-time error tracking, user session telemetry, and Core Web Vitals monitoring.',
      },
      {
        title: 'Handover & Documentation',
        desc: 'Comprehensive engineering walkthroughs, architecture docs, and developer guides.',
      },
      {
        title: 'Growth & Iteration Sprint',
        desc: 'Post-launch feedback analysis, conversion optimization, and roadmap momentum.',
      },
    ],
    deliverables: [
      'Live Edge Deployment',
      'Telemetry & Error Dashboard',
      'Handover Documentation & Video Guides',
    ],
    badge: 'Sprint 05 · Launch & Growth',
    theme: {
      primary: '#10B981', // Launch Mint
      orb1: 'rgba(110, 231, 183, 0.52)', // mint
      orb2: 'rgba(253, 224, 71, 0.35)',  // warm gold
      orb3: 'rgba(56, 189, 248, 0.30)',  // cyan
    },
  },
];
