import React from 'react';

interface FormattedContentProps {
  content?: string | null;
  className?: string;
  variant?: 'light' | 'dark';
}

/**
 * Checks if a string contains HTML markup tags.
 */
export function isRichHtml(content?: string | null): boolean {
  if (!content) return false;
  return /<(p|div|h[1-6]|ul|ol|li|strong|b|em|i|u|span|br|blockquote|table)[\s>]/i.test(content);
}

/**
 * Converts legacy plain text with double newlines into clean semantic HTML paragraphs.
 */
export function plainTextToHtml(text?: string | null): string {
  if (!text) return '<p><br></p>';
  if (isRichHtml(text)) return text;

  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '<p><br></p>';

  return paragraphs
    .map((p) => `<p>${p.replace(/\r?\n/g, '<br />')}</p>`)
    .join('');
}

/**
 * FormattedContent component renders rich formatted HTML safely while maintaining
 * complete backward-compatibility with plain text content.
 */
export default function FormattedContent({
  content,
  className = '',
  variant = 'light',
}: FormattedContentProps) {
  if (!content || !content.trim()) return null;

  const isHtml = isRichHtml(content);

  // If plain text (legacy or unformatted), render as clean semantic paragraphs
  if (!isHtml) {
    const paragraphs = content
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
      <div className={`space-y-4 ${className}`}>
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={
              variant === 'dark'
                ? 'text-slate-200 leading-relaxed font-normal'
                : 'text-slate-700 leading-relaxed font-normal'
            }
          >
            {para}
          </p>
        ))}
      </div>
    );
  }

  // Render Rich HTML with dedicated corporate typography classes
  return (
    <div
      className={`sherman-rich-content ${
        variant === 'dark' ? 'sherman-rich-dark' : 'sherman-rich-light'
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
