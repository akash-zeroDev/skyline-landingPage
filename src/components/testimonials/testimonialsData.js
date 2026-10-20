import { CLIENT_RATING, STUDIO_PROOF } from '../../data/studioProof';

// Optional: add `avatar: '/path/to/photo.jpg'` to any entry to replace the
// generated initials avatar with a real image (alt text stays empty because
// the client's name is already rendered next to it).
export const TESTIMONIALS = [
  {
    name: 'Ananya Rao',
    role: 'Co-founder',
    company: 'Aura Fintech',
    quote:
      'Skyline rebuilt our entire product site and the difference was immediate. Sign-ups went up by more than half in the first month, and the new brand finally looks as serious as our tech.',
    result: '+56% sign-ups',
    accent: 'blue',
    featured: true,
  },
  {
    name: 'Rohan Mehta',
    role: 'Head of Growth',
    company: 'Nimbus SaaS',
    quote:
      "They understood our audience faster than any agency we've worked with. The new landing page doubled our demo requests.",
    result: '2x demo requests',
    accent: 'green',
  },
  {
    name: 'Priya Nair',
    role: 'Founder',
    company: 'Fitloop',
    quote:
      'Our app launched on time and the feedback has been incredible. Clean design, zero drama.',
    result: `${CLIENT_RATING}★ app rating`,
    accent: 'orange',
  },
  {
    name: 'Karan Malhotra',
    role: 'Marketing Lead',
    company: 'Brightleaf Organics',
    quote:
      'The SEO work paid off within a quarter. We now rank on the first page for the keywords that actually bring in customers.',
    result: '+180% organic traffic',
    accent: 'yellow',
  },
  {
    name: 'Sara Iqbal',
    role: 'Owner',
    company: 'Studio Verve',
    quote:
      'Communication was great throughout. They treated our brand like it was their own.',
    result: 'Rebrand in 5 weeks',
    accent: 'blue',
  },
  {
    name: 'Dev Patel',
    role: 'CMO',
    company: 'Urban Crate',
    quote:
      "Our social presence went from sporadic to something we're proud of. Engagement has tripled.",
    result: '3x engagement',
    accent: 'orange',
  },
];

export const RATING_SUMMARY = [
  { value: `${CLIENT_RATING}★`, label: 'average rating' },
  STUDIO_PROOF[0],
  { value: '98%', label: 'clients return' },
];
