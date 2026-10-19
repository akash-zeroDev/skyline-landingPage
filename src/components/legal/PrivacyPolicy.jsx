import { useEffect } from 'react';
import './PrivacyPolicy.css';

const LAST_UPDATED = '19 October 2026';
const CONTACT_EMAIL = 'hello@skylinedigitalmedia.com';

const SECTIONS = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    blocks: [
      {
        type: 'p',
        text: 'Skyline Digital Media ("Skyline", "we", "us" or "our") is a design and engineering studio. This Privacy Policy explains how we collect, use, share and protect personal information when you visit our website, contact us, or work with us as a client.',
      },
      {
        type: 'p',
        text: 'For the purposes of the UK and EU General Data Protection Regulation (GDPR), Skyline Digital Media is the data controller responsible for your personal information.',
      },
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    blocks: [
      {
        type: 'p',
        text: 'We only collect the information we need to run our studio and respond to you. This falls into three broad categories:',
      },
      {
        type: 'ul',
        items: [
          'Information you give us. When you submit our contact form or email us, we collect your name, email address, company name, the services you are interested in, your budget and timeline, and the details of your message.',
          'Information we collect automatically. Like most websites, our hosting provider records standard server logs such as your IP address, browser type, device type, referring page and the pages you visit, together with the date and time of your visit.',
          'Information from working together. If you become a client, we may hold project correspondence, contracts, invoices and billing details necessary to deliver and administer our services.',
        ],
      },
    ],
  },
  {
    id: 'how-we-use-information',
    title: 'How we use your information',
    blocks: [
      { type: 'p', text: 'We use the information we collect to:' },
      {
        type: 'ul',
        items: [
          'respond to your enquiries and provide the information or quotes you request;',
          'deliver, manage and support the services we provide to clients;',
          'send administrative messages such as project updates, invoices and service notices;',
          'keep our website secure, diagnose technical problems and understand how it is used so we can improve it;',
          'comply with our legal, accounting and tax obligations; and',
          'with your consent, send you occasional studio news and updates that we think may interest you.',
        ],
      },
      {
        type: 'p',
        text: 'We do not sell your personal information, and we do not use it for automated decision-making or profiling that produces legal effects.',
      },
    ],
  },
  {
    id: 'legal-bases',
    title: 'Legal bases for processing',
    blocks: [
      {
        type: 'p',
        text: 'Where GDPR applies, we rely on the following legal bases to process your personal information:',
      },
      {
        type: 'ul',
        items: [
          'Contract — to provide services you have engaged us for, and to take steps at your request before entering into a contract.',
          'Legitimate interests — to respond to enquiries, secure and improve our website, and pursue our legitimate business interests, in a way that does not override your rights.',
          'Consent — where you have opted in, for example to receive marketing emails. You can withdraw consent at any time.',
          'Legal obligation — to keep records and comply with applicable laws, such as tax and accounting requirements.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and analytics',
    blocks: [
      {
        type: 'p',
        text: 'Our website uses only the minimal cookies and local storage needed to function correctly. We do not use advertising cookies and we do not track you across other websites.',
      },
      {
        type: 'p',
        text: 'If we use privacy-friendly, aggregated analytics to understand which pages are useful, the data is not used to identify you personally. You can block or delete cookies at any time through your browser settings; the core of the site will continue to work.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'How we share information',
    blocks: [
      {
        type: 'p',
        text: 'We treat your information as confidential. We do not sell, rent or trade it. We only share it with a small number of trusted service providers who help us run the studio, and only to the extent needed to do so:',
      },
      {
        type: 'ul',
        items: [
          'Hosting and infrastructure providers that serve our website and store data securely on our behalf;',
          'Email and delivery providers used to send and receive correspondence, including contact form submissions;',
          'Accounting and payment providers used to invoice and process payments.',
        ],
      },
      {
        type: 'p',
        text: 'We may also disclose information where we are required to do so by law, to enforce our agreements, or to protect the rights, property or safety of Skyline Digital Media, our clients or others.',
      },
    ],
  },
  {
    id: 'international-transfers',
    title: 'International data transfers',
    blocks: [
      {
        type: 'p',
        text: 'Some of our service providers may process data outside the UK and the European Economic Area. Where that happens, we take steps to ensure your information receives an equivalent level of protection, using recognised safeguards such as standard contractual clauses approved by the relevant authorities.',
      },
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep your information',
    blocks: [
      {
        type: 'p',
        text: 'We keep personal information only for as long as we need it for the purposes described in this policy. Contact enquiries that do not lead to a project are typically deleted within 24 months. Client records, invoices and related correspondence are kept for as long as required to provide our services and to meet legal, tax and accounting obligations, after which they are securely deleted.',
      },
    ],
  },
  {
    id: 'security',
    title: 'How we protect your data',
    blocks: [
      {
        type: 'p',
        text: 'We take the security of your information seriously. We use encryption in transit (HTTPS), restrict access to personal data to those who need it, and keep our systems and dependencies up to date. No method of transmission or storage is completely secure, but we work to protect your information using appropriate technical and organisational measures.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your privacy rights',
    blocks: [
      {
        type: 'p',
        text: 'Depending on where you live, you may have the right to:',
      },
      {
        type: 'ul',
        items: [
          'access the personal information we hold about you;',
          'ask us to correct information that is inaccurate or incomplete;',
          'ask us to delete your information where there is no good reason for us to keep it;',
          'object to, or ask us to restrict, certain processing;',
          'ask us to transfer your information to you or another provider in a portable format; and',
          'withdraw consent at any time, where processing is based on consent.',
        ],
      },
      {
        type: 'p',
        text: `To exercise any of these rights, email us at ${CONTACT_EMAIL}. We will respond within one month and will never charge a fee for a reasonable request. If you are unhappy with how we have handled your information, you have the right to complain to your local data protection authority.`,
      },
    ],
  },
  {
    id: 'third-party-links',
    title: 'Third-party links',
    blocks: [
      {
        type: 'p',
        text: 'Our website may link to third-party sites or services we do not control. This Privacy Policy does not apply to them, and we are not responsible for their content or privacy practices. We encourage you to read the privacy policy of any site you visit.',
      },
    ],
  },
  {
    id: 'children',
    title: "Children's privacy",
    blocks: [
      {
        type: 'p',
        text: 'Our services are intended for businesses and are not directed at children. We do not knowingly collect personal information from anyone under the age of 16. If you believe a child has provided us with personal information, please contact us and we will delete it.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    blocks: [
      {
        type: 'p',
        text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or the law. When we do, we will revise the "last updated" date at the top of this page. We encourage you to review this page periodically.',
      },
    ],
  },
];

export default function PrivacyPolicy({ onNavigateHome }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Privacy Policy — Skyline Digital Media';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="legal-page-wrapper">
      <div className="legal-bg-glow" aria-hidden="true" />

      <div className="legal-container">
        <div className="legal-top-nav">
          <button
            type="button"
            className="legal-back-link"
            onClick={onNavigateHome}
            aria-label="Back to Skyline Digital Media home"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>

        <header className="legal-header">
          <p className="legal-eyebrow">LEGAL</p>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-meta">
            Last updated <time dateTime="2026-10-19">{LAST_UPDATED}</time>
          </p>
          <p className="legal-lede">
            This policy explains what personal information Skyline Digital Media
            collects, why we collect it, and the choices and rights you have. We
            have written it in plain language — if anything is unclear, please
            get in touch.
          </p>
        </header>

        <div className="legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            <h2 className="legal-toc-title">On this page</h2>
            <ol className="legal-toc-list">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal-article">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-section"
                aria-labelledby={`${section.id}-heading`}
              >
                <h2 id={`${section.id}-heading`} className="legal-section-title">
                  {section.title}
                </h2>
                {section.blocks.map((block, index) =>
                  block.type === 'ul' ? (
                    <ul key={index} className="legal-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={index} className="legal-paragraph">
                      {block.text}
                    </p>
                  )
                )}
              </section>
            ))}

            <div className="legal-callout">
              <h2 className="legal-callout-title">Questions about your data?</h2>
              <p className="legal-callout-text">
                Email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
                get back to you as soon as we can.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
