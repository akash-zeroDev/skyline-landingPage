import { useState, useId } from 'react';
import CustomDropdown from './CustomDropdown';
import './ContactPage.css';

const SERVICES_OPTIONS = [
  'Web applications',
  'Websites',
  'Mobile apps',
  'Design systems',
  'Brand identity',
  'Prototyping',
  'Strategy',
];

const BUDGET_OPTIONS = [
  '$5k – $15k',
  '$15k – $40k',
  '$40k – $100k',
  '$100k+',
  'Not sure',
];

const TIMELINE_OPTIONS = [
  'ASAP',
  '1 – 2 months',
  '3 – 6 months',
  'Flexible',
];

export default function ContactPage({ onNavigateHome, isInline = false }) {
  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const budgetId = useId();
  const timelineId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [],
    budget: '',
    timeline: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverError, setServerError] = useState('');

  const toggleService = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name (minimum 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please share a brief summary of your project (minimum 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setSubmitSuccess(true);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      services: [],
      budget: '',
      timeline: '',
      message: '',
    });
    setErrors({});
    setSubmitSuccess(false);
    setPreviewUrl(null);
    setServerError('');
  };

  return (
    <div className={`contact-page-wrapper ${isInline ? 'is-inline-mode' : ''}`}>
      <div className="contact-bg-glow" aria-hidden="true" />

      <div className="contact-container">
        {/* Top Navigation Row (Only on dedicated page) */}
        {!isInline && (
          <div className="contact-top-nav">
            <button
              type="button"
              className="contact-back-link"
              onClick={onNavigateHome}
              aria-label="Back to Skyline Digital Media home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        )}

        <div className="contact-layout-grid">
          {/* LEFT COLUMN: HERO COPY & SOCIAL PROOF */}
          <div className="contact-left-col">
            <p className="contact-eyebrow">START A PROJECT</p>

            <h1 className="contact-title">
              <span className="marker-underline-wrap">
                START
                <span className="marker-underline-bar" aria-hidden="true" />
              </span>{' '}
              A
              <br />
              <span className="contact-title-italic">project.</span>
            </h1>

            <p className="contact-desc">
              Tell us what you are building. We will review the details and come back with honest feedback, a rough timeline, and a clear next step.
            </p>

            <ul className="contact-checklist">
              <li>
                <span className="check-circle" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Reply within 24 hours</span>
              </li>
              <li>
                <span className="check-circle" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>No sales team, talk to the makers</span>
              </li>
            </ul>

            <div className="contact-availability-badge">
              <div className="availability-header">
                <span className="availability-status-dot" aria-hidden="true" />
                <p className="availability-title">CURRENTLY TAKING NEW WORK</p>
              </div>
              <p className="availability-sub">Two project slots left for Q4</p>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE FORM CARD */}
          <div className="contact-form-card">
            {submitSuccess ? (
              <div className="contact-success-card">
                <div className="success-icon-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="success-heading">Inquiry Received!</h3>
                <p className="success-subtext">
                  Thank you, <strong>{formData.name}</strong>. We have received your project details and will review them within 24 hours.
                </p>

                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-email-btn"
                  >
                    <span>📬 View Email Preview (Ethereal)</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}

                <button
                  type="button"
                  className="send-another-btn"
                  onClick={handleReset}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                {/* Name & Email Row */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor={nameId} className="form-label">
                      NAME *
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      required
                    />
                    {errors.name && <p className="field-error-text">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor={emailId} className="form-label">
                      EMAIL *
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      className="form-input"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      required
                    />
                    {errors.email && <p className="field-error-text">{errors.email}</p>}
                  </div>
                </div>

                {/* Company / Organization */}
                <div className="form-group">
                  <label htmlFor={companyId} className="form-label">
                    COMPANY / ORGANIZATION
                  </label>
                  <input
                    id={companyId}
                    type="text"
                    className="form-input"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company: e.target.value }))
                    }
                  />
                </div>

                {/* Services You Need */}
                <div className="form-group">
                  <span className="form-label">SERVICES YOU NEED</span>
                  <div className="service-pills-wrap">
                    {SERVICES_OPTIONS.map((service) => {
                      const isSelected = formData.services.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          className={`service-pill-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => toggleService(service)}
                        >
                          {isSelected && (
                            <svg
                              className="pill-check-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          <span>{service}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Range & Timeline */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor={budgetId} className="form-label">
                      BUDGET RANGE
                    </label>
                    <CustomDropdown
                      id={budgetId}
                      placeholder="Select a budget"
                      options={BUDGET_OPTIONS}
                      value={formData.budget}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, budget: val }))
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={timelineId} className="form-label">
                      TIMELINE
                    </label>
                    <CustomDropdown
                      id={timelineId}
                      placeholder="Select a timeline"
                      options={TIMELINE_OPTIONS}
                      value={formData.timeline}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, timeline: val }))
                      }
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="form-group">
                  <label htmlFor={messageId} className="form-label">
                    PROJECT DETAILS *
                  </label>
                  <textarea
                    id={messageId}
                    rows="5"
                    className="form-textarea"
                    placeholder="What are you building, who is it for, and what does success look like?"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, message: e.target.value }));
                      if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    required
                  />
                  {errors.message && (
                    <p className="field-error-text">{errors.message}</p>
                  )}
                </div>

                {serverError && (
                  <p className="field-error-text" style={{ textAlign: 'center' }}>
                    {serverError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="spinner"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>SEND INQUIRY</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
