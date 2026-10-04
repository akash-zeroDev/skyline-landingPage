import React from 'react';
import { CONTENT, FILE, TYPE } from './config';
import { PdfFileIcon } from './icons';

/**
 * FileCard: Resource preview card for slot "file" (Chunk 3 of 7).
 * Displays a branded PDF document tile, document filename with ellipsis truncation,
 * metadata filesize, and an accessible interactive "Preview" pill button.
 */
export default function FileCard({ className = '', style = {}, ...rest }) {
  return (
    <article
      data-slot="file"
      aria-label={`${CONTENT.file.name}, ${CONTENT.file.size}`}
      className={`wwd-card wwd-card-file ${className}`}
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'calc(var(--r) * var(--card-radius))',
        boxShadow: 'var(--card-shadow)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        paddingLeft: 'calc(var(--r) * 11)',
        paddingRight: 'calc(var(--r) * 11.33)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        ...style,
      }}
      {...rest}
    >
      <style>{`
        .wwd-file-preview-btn:focus-visible {
          outline: 2px solid rgba(17, 26, 92, 0.60);
          outline-offset: 2px;
        }
        .wwd-file-preview-btn:hover {
          background-color: rgba(26, 15, 92, 0.04);
        }
      `}</style>

      {/* Document Icon Tile */}
      <div data-part="file-icon" aria-hidden="true" style={{ display: 'flex', flexShrink: 0, marginRight: 'calc(var(--r) * 7)' }}>
        <PdfFileIcon />
      </div>

      {/* Text Meta Column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 0,
          flex: 1,
          marginRight: 'calc(var(--r) * 2.5)',
        }}
      >
        <p
          data-part="file-name"
          style={{
            margin: 0,
            padding: 0,
            fontSize: `calc(var(--r) * ${TYPE.fileName})`,
            lineHeight: `calc(var(--r) * ${TYPE.fileNameLineHeight})`,
            fontWeight: 500,
            color: FILE.COLORS.name,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '-0.02em',
          }}
        >
          {CONTENT.file.name}
        </p>

        <p
          data-part="file-meta"
          style={{
            margin: 0,
            padding: 0,
            marginTop: 'calc(var(--r) * 1)',
            fontSize: `calc(var(--r) * ${TYPE.fileMeta})`,
            lineHeight: `calc(var(--r) * ${TYPE.fileMetaLineHeight})`,
            fontWeight: 400,
            color: FILE.COLORS.meta,
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          {CONTENT.file.size}
        </p>
      </div>

      {/* Interactive Preview Button */}
      <button
        type="button"
        data-part="file-button"
        aria-label={`Preview ${CONTENT.file.name}`}
        onClick={() => {}}
        className="wwd-file-preview-btn"
        style={{
          width: 'calc(var(--r) * 62)',
          height: 'calc(var(--r) * 25.5)',
          borderRadius: 'calc(var(--r) * 13)',
          border: `1px solid ${FILE.COLORS.buttonBorder}`,
          background: 'transparent',
          color: FILE.COLORS.buttonText,
          fontSize: `calc(var(--r) * ${TYPE.button})`,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        }}
      >
        <span data-part="button-text">{CONTENT.file.button}</span>
      </button>
    </article>
  );
}
