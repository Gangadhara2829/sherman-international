/**
 * HTML Sanitizer for Rich Text Content
 * Prevents stored XSS attacks by stripping disallowed tags, event handlers, and unsafe protocols
 * while preserving legitimate corporate styling, typography, links, lists, and formatting.
 */

// Permitted HTML tags for formatted editorial content
const ALLOWED_TAGS = new Set([
  'p', 'div', 'span', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'sub', 'sup',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

// Dangerous tags whose entire contents should be removed
const DANGEROUS_TAGS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^>]*>/gi,
  /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  /<input\b[^>]*>/gi,
  /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
  /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
  /<base\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
];

/**
 * Sanitizes HTML string safely on the server side.
 */
export function sanitizeHtml(rawHtml?: string | null): string {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  let sanitized = rawHtml;

  // 1. Remove dangerous blocks completely (including their content)
  for (const pattern of DANGEROUS_TAGS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // 2. Remove all event handlers (e.g. onclick=..., onerror=..., onload=...)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Process all remaining HTML tags
  sanitized = sanitized.replace(/<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g, (fullMatch, tagName, attrs) => {
    const tagLower = tagName.toLowerCase();

    // If tag is not allowed, strip it completely
    if (!ALLOWED_TAGS.has(tagLower)) {
      return '';
    }

    // If it's a closing tag, return clean closing
    if (fullMatch.startsWith('</')) {
      return `</${tagLower}>`;
    }

    // Parse and sanitize attributes for opening tag
    if (!attrs) {
      return `<${tagLower}>`;
    }

    const cleanedAttrs: string[] = [];

    // Match attributes: name="value" or name='value' or name=value
    const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
    let match: RegExpExecArray | null;

    while ((match = attrRegex.exec(attrs)) !== null) {
      const attrName = match[1].toLowerCase();
      const attrVal = match[2] ?? match[3] ?? match[4] ?? '';

      // Skip event handlers
      if (attrName.startsWith('on')) continue;

      // Handle href on <a> tags
      if (attrName === 'href' && tagLower === 'a') {
        const valTrimmed = attrVal.trim().toLowerCase();
        // Prevent javascript:, data:, vbscript:
        if (
          valTrimmed.startsWith('javascript:') ||
          valTrimmed.startsWith('data:') ||
          valTrimmed.startsWith('vbscript:')
        ) {
          continue;
        }
        cleanedAttrs.push(`href="${escapeAttr(attrVal.trim())}"`);
        continue;
      }

      // Handle target on <a> tags
      if (attrName === 'target' && tagLower === 'a') {
        cleanedAttrs.push(`target="${escapeAttr(attrVal)}"`);
        continue;
      }

      // Handle class
      if (attrName === 'class') {
        cleanedAttrs.push(`class="${escapeAttr(attrVal)}"`);
        continue;
      }

      // Handle style (filter out expression(), url(javascript:), etc.)
      if (attrName === 'style') {
        const styleLower = attrVal.toLowerCase();
        if (
          !styleLower.includes('expression(') &&
          !styleLower.includes('javascript:') &&
          !styleLower.includes('-moz-binding')
        ) {
          cleanedAttrs.push(`style="${escapeAttr(attrVal)}"`);
        }
        continue;
      }

      // Allow title, id, align
      if (['title', 'id', 'align'].includes(attrName)) {
        cleanedAttrs.push(`${attrName}="${escapeAttr(attrVal)}"`);
      }
    }

    // Enforce rel="noopener noreferrer" for external or target="_blank" links
    if (tagLower === 'a') {
      const hasTarget = cleanedAttrs.some((a) => a.startsWith('target='));
      if (hasTarget) {
        cleanedAttrs.push('rel="noopener noreferrer"');
      }
    }

    const attrsString = cleanedAttrs.length > 0 ? ' ' + cleanedAttrs.join(' ') : '';
    const isSelfClosing = ['br', 'hr'].includes(tagLower);

    return `<${tagLower}${attrsString}${isSelfClosing ? ' /' : ''}>`;
  });

  return sanitized;
}

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
