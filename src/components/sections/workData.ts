export const SERVICE_NAMES = [
  'UI/UX Design',
  'Search & SEO',
  'Branding & Identity',
  'App Development',
  'Web Design & Build',
  'Social & Content',
] as const;

export type ServiceName = (typeof SERVICE_NAMES)[number];

export type MockupKind = 'dashboard' | 'workspace' | 'landing' | 'brand';

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  year: string;
  sector: string;
  services: ServiceName[];
  summary: string;
  accent: string;
  timeline: string;
  mockup: MockupKind;
  /** Set to a real image path when a screenshot is available. */
  screenshot: string;
  /** Kept for reference only — the section no longer displays stock photos. */
  image: string;
  imageAlt: string;
  challenge: string;
  approach: string;
  outcomes: string[];
  metrics: ProjectMetric[];
}

export const MOCKUP_LABELS: Record<MockupKind, string> = {
  dashboard: 'dashboard',
  workspace: 'workspace',
  landing: 'landing page',
  brand: 'brand board',
};

export const PROJECTS: Project[] = [
  {
    slug: 'classly',
    name: 'Classly',
    year: '2025',
    sector: 'Education SaaS',
    services: ['UI/UX Design', 'App Development'],
    summary: 'Attendance and fee management for coaching institutes.',
    accent: '#2b7ffb',
    timeline: '8 weeks',
    mockup: 'dashboard',
    screenshot: '',
    image: 'https://picsum.photos/seed/skyline-work-1/1200/900',
    imageAlt: 'Classly coaching institute attendance and fee management dashboard interface',
    challenge:
      'Coaching institutes were tracking attendance and fee payments across registers and spreadsheets, which meant missed dues, slow reports and a lot of admin work.',
    approach:
      'We designed a simple dashboard for daily attendance and fee tracking, then built it as a fast web app that works on the devices staff already use.',
    outcomes: [
      'Attendance, fee status and reminders in one dashboard',
      'Clear, filterable reports for owners and admins',
      'Responsive build for desktop and mobile',
    ],
    metrics: [],
  },
  {
    slug: 'hazz',
    name: 'Hazz',
    year: '2024',
    sector: 'Workspace platform',
    services: ['UI/UX Design', 'App Development'],
    summary: 'Role-based workspace for super admins, admins and employees.',
    accent: '#19b954',
    timeline: '6 weeks',
    mockup: 'workspace',
    screenshot: '',
    image: 'https://picsum.photos/seed/skyline-work-2/1200/900',
    imageAlt: 'Hazz role-based internal workspace and permissions admin portal',
    challenge:
      "Different roles needed different things from one product, but everyone was seeing the same cluttered screens and had to hunt for what mattered to them.",
    approach:
      "We mapped each role's daily tasks, designed clear role-based views and navigation, and built a consistent component system across the whole app.",
    outcomes: [
      'Tailored views for super admins, admins and employees',
      'Simpler navigation and clearer permissions',
      'A reusable design system for faster future updates',
    ],
    metrics: [],
  },
  {
    slug: 'aura-fintech',
    name: 'Aura Fintech',
    year: '2024',
    sector: 'Fintech',
    services: ['Web Design & Build', 'Search & SEO'],
    summary: 'Conversion-focused landing page for a fintech startup.',
    accent: '#fb6b07',
    timeline: '5 weeks',
    mockup: 'landing',
    screenshot: '',
    image: 'https://picsum.photos/seed/skyline-work-3/1200/900',
    imageAlt: 'Aura Fintech modern conversion-optimized financial platform landing page',
    challenge:
      'A new fintech product needed a landing page that explained a complex offer quickly and could be found in search.',
    approach:
      'We designed a focused, conversion-led landing page and set up the technical SEO foundations: page structure, metadata, speed and keyword-led content.',
    outcomes: [
      'A clear page story from headline to sign-up',
      'Technical SEO foundations in place at launch',
      'Fast, mobile-friendly build',
    ],
    metrics: [],
  },
  {
    slug: 'haven-hospitality',
    name: 'Haven Hospitality',
    year: '2023',
    sector: 'Hospitality',
    services: ['Branding & Identity', 'Web Design & Build'],
    summary: 'Brand refresh and website for a hospitality business.',
    accent: '#fcc80c',
    timeline: '6 weeks',
    mockup: 'brand',
    screenshot: '',
    image: 'https://picsum.photos/seed/skyline-work-4/1200/900',
    imageAlt: 'Haven Hospitality bespoke branding and boutique hotel reservation website',
    challenge:
      "The look and the website didn't match the quality of the experience on offer.",
    approach:
      'We refreshed the identity with logo, colour, type and guidelines, then designed a warm, image-led website that makes the offer and enquiries easy to find.',
    outcomes: [
      'Refreshed visual identity with brand guidelines',
      'Image-led, responsive website',
      'A clear path to enquiry on every page',
    ],
    metrics: [],
  },
];

export const WORK_PROOF = [
  { value: '50+', label: 'projects delivered' },
  { value: '4.9★', label: 'client rating' },
  { value: '3x', label: 'average growth' },
];
