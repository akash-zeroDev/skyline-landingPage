import { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({
  id,
  placeholder = 'Select an option',
  options = [],
  value = '',
  onChange,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleSelect = (option) => {
    if (onChange) onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(options.length - 1);
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0 && focusedIndex < options.length) {
        handleSelect(options[focusedIndex]);
      } else {
        setIsOpen((prev) => !prev);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className} ${isOpen ? 'is-open' : ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden native select for accessibility and automated test compatibility */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="custom-dropdown-native-hidden"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Visible Custom Trigger Button */}
      <button
        type="button"
        className={`custom-dropdown-trigger ${value ? 'has-value' : 'is-placeholder'}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-dropdown-label">
          {value || placeholder}
        </span>
        <svg
          className={`custom-dropdown-chevron ${isOpen ? 'rotate' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Custom Animated Dropdown Menu Panel */}
      {isOpen && (
        <ul className="custom-dropdown-menu" role="listbox" tabIndex={-1}>
          {options.map((opt, index) => {
            const isSelected = value === opt;
            const isFocused = focusedIndex === index;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className={`custom-dropdown-item ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''}`}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span className="custom-dropdown-item-text">{opt}</span>
                {isSelected && (
                  <svg
                    className="custom-dropdown-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
