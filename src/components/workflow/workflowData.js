export const WORKFLOW_PHASES = [
  {
    id: '01',
    phase: 'PHASE 01',
    label: 'Discover',
    title: 'DISCOVER & AUDIT',
    tagline: 'Understand the problem before we design a single screen.',
    description:
      'We start by understanding your business, your audience and what success looks like. We audit what you already have, agree on clear goals, and map out the work before anything gets built.',
    activities: [
      {
        title: 'Goals & KPIs',
        desc: "What we're trying to achieve, and how we'll know it's working.",
      },
      {
        title: 'Audience & Competitors',
        desc: "Who you're for, and what everyone else in your space is doing.",
      },
      {
        title: 'Site & SEO Audit',
        desc: "A review of what you have now, what's working and what's holding you back.",
      },
      {
        title: 'Scope & Timeline',
        desc: "A clear plan of what's included, what's not, and when it ships.",
      },
    ],
    deliverable: 'Audit summary, project brief and roadmap',
    needFromYou: 'Analytics access, brand assets and one decision-maker',
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
    label: 'Strategy',
    title: 'STRATEGY & STRUCTURE',
    tagline: 'A blueprint everyone agrees on before the build.',
    description:
      'We turn the findings into a plan: what we need to say, who we are saying it to, and how the product fits together. You see the sitemap, the main journeys and the key pages mapped out before design begins.',
    activities: [
      {
        title: 'Positioning & Messaging',
        desc: 'A simple story that explains what you do and why it matters.',
      },
      {
        title: 'Sitemap & User Flows',
        desc: 'Every page and path mapped out before a single screen is designed.',
      },
      {
        title: 'SEO & Content Plan',
        desc: 'The pages and topics that will bring the right people to you.',
      },
      {
        title: 'Wireframes',
        desc: 'Low-fidelity layouts that lock the structure without the distraction.',
      },
    ],
    deliverable: 'Strategy document, sitemap and wireframes',
    needFromYou: 'Sign-off on the plan',
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
    label: 'Design',
    title: 'DESIGN & MOTION',
    tagline: 'Interfaces that look sharp and feel effortless.',
    description:
      'We design the look, the feel and the flow, from the brand details to every screen. You review real designs in weekly demos and give feedback while changes are still quick and easy.',
    activities: [
      {
        title: 'Brand & Visual Identity',
        desc: 'Colours, type and details that make you look like you.',
      },
      {
        title: 'Design System',
        desc: 'Reusable styles and components so everything stays consistent.',
      },
      {
        title: 'Interactive Prototypes',
        desc: 'Clickable designs you can actually try before we build.',
      },
      {
        title: 'Responsive & Usability Checks',
        desc: 'Designs refined to work on every screen and feel easy to use.',
      },
    ],
    deliverable: 'Final designs, prototype and brand guidelines',
    needFromYou: 'Quick feedback on weekly demos',
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
    label: 'Build',
    title: 'BUILD & TEST',
    tagline: 'Fast, accessible and ready to scale.',
    description:
      "We build your site or app, connect the tools you already use and test everything across devices. Nothing goes live until it's quick, accessible and working the way it should.",
    activities: [
      {
        title: 'Web & App Development',
        desc: 'We build the pages and features exactly as designed.',
      },
      {
        title: 'CMS & Integrations',
        desc: 'Connect the tools you use so your team can update things easily.',
      },
      {
        title: 'Accessibility & Speed',
        desc: 'Built to be usable by everyone and quick to load.',
      },
      {
        title: 'QA Testing',
        desc: 'We test across devices and browsers and fix issues before launch.',
      },
    ],
    deliverable: 'A fully tested build on a private preview link',
    needFromYou: 'Final content, approvals and domain/hosting access',
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
    label: 'Grow',
    title: 'LAUNCH & GROW',
    tagline: 'Launch is the starting line, not the finish.',
    description:
      "We launch, then keep improving. We set up clear reporting so you can see what's working, keep your content and SEO moving, and hand everything over cleanly so you're never stuck.",
    activities: [
      {
        title: 'Smooth Launch',
        desc: 'We handle the switch-over and publish everything live.',
      },
      {
        title: 'Tracking & Reporting',
        desc: 'Clear reporting so you can see what is working.',
      },
      {
        title: 'SEO, Social & Content',
        desc: 'Ongoing content and SEO so you keep growing after launch.',
      },
      {
        title: 'Handover & Support',
        desc: "Docs, a walkthrough and ongoing support so you're never stuck.",
      },
    ],
    deliverable: 'Live product, reporting dashboard and handover docs',
    needFromYou: 'A monthly check-in',
    theme: {
      primary: '#10B981', // Launch Mint
      orb1: 'rgba(110, 231, 183, 0.52)', // mint
      orb2: 'rgba(253, 224, 71, 0.35)',  // warm gold
      orb3: 'rgba(56, 189, 248, 0.30)',  // cyan
    },
  },
];
