'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  RemoveFormatting,
  Type,
  Palette,
  Highlighter,
  Eye,
  Edit3,
  X,
  Check,
} from 'lucide-react';
import { isRichHtml, plainTextToHtml } from '@/components/FormattedContent';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  minHeight?: string;
}

const FONT_SIZES = [
  { label: 'Small (12px)', value: '12px' },
  { label: 'Body Small (14px)', value: '14px' },
  { label: 'Normal Size (16px)', value: '16px' },
  { label: 'Medium / Lead (18px)', value: '18px' },
  { label: 'Subheading (20px)', value: '20px' },
  { label: 'Section Title (24px)', value: '24px' },
  { label: 'Large Title (28px)', value: '28px' },
  { label: 'Extra Large (32px)', value: '32px' },
  { label: 'Huge Accent (36px)', value: '36px' },
];

const BLOCK_FORMATS = [
  { label: 'Normal Paragraph', tag: 'p' },
  { label: 'Heading 1 (Main Header)', tag: 'h1' },
  { label: 'Heading 2 (Subheading)', tag: 'h2' },
  { label: 'Heading 3 (Section Title)', tag: 'h3' },
  { label: 'Heading 4 (Minor Header)', tag: 'h4' },
];

const PRESET_TEXT_COLORS = [
  { label: 'Default Dark', value: '#0f172a' },
  { label: 'Sherman Navy', value: '#061d43' },
  { label: 'Sherman Blue', value: '#0284c7' },
  { label: 'Amber Accent', value: '#d97706' },
  { label: 'Slate Muted', value: '#64748b' },
  { label: 'Success Green', value: '#16a34a' },
  { label: 'Alert Red', value: '#dc2626' },
  { label: 'White', value: '#ffffff' },
];

const PRESET_HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent' },
  { label: 'Yellow Amber', value: '#fef3c7' },
  { label: 'Light Blue', value: '#e0f2fe' },
  { label: 'Light Green', value: '#dcfce7' },
  { label: 'Light Rose', value: '#ffe4e6' },
  { label: 'Light Slate', value: '#f1f5f9' },
];

export default function RichTextEditor({
  value,
  onChange,
  label = 'Content Text',
  placeholder = 'Type and format your narrative content here...',
  helperText = 'Use the formatting toolbar below to style headings, lists, bold text, colors, alignment, and links.',
  minHeight = '240px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Toolbar state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [currentBlock, setCurrentBlock] = useState('p');
  const [selectedFontSize, setSelectedFontSize] = useState('16px');

  // Color & Link Popovers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);

  // Track if editor content is initialized
  const initializedRef = useRef(false);

  // Sync initial content once or on external prop change (e.g., initial fetch)
  useEffect(() => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const formattedInitial = plainTextToHtml(value);

    if (!initializedRef.current || (currentHtml !== formattedInitial && document.activeElement !== editorRef.current)) {
      editorRef.current.innerHTML = formattedInitial;
      initializedRef.current = true;
    }
  }, [value]);

  // Synchronize state from contentEditable to parent
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
    updateToolbarState();
  }, [onChange]);

  // Inspect current selection formatting
  const updateToolbarState = () => {
    if (!editorRef.current) return;

    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrike(document.queryCommandState('strikeThrough'));
      setIsBulletList(document.queryCommandState('insertUnorderedList'));
      setIsNumberedList(document.queryCommandState('insertOrderedList'));

      if (document.queryCommandState('justifyCenter')) setAlignment('center');
      else if (document.queryCommandState('justifyRight')) setAlignment('right');
      else if (document.queryCommandState('justifyFull')) setAlignment('justify');
      else setAlignment('left');

      // Detect current block format
      const blockValue = document.queryCommandValue('formatBlock')?.toLowerCase() || 'p';
      if (['h1', 'h2', 'h3', 'h4', 'p'].includes(blockValue)) {
        setCurrentBlock(blockValue);
      }
    } catch {
      // Ignored if selection unavailable
    }
  };

  // Execute standard formatting commands
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    handleInput();
  };

  // Block format changer
  const handleBlockChange = (tag: string) => {
    setCurrentBlock(tag);
    if (editorRef.current) {
      editorRef.current.focus();
    }

    try {
      document.execCommand('formatBlock', false, `<${tag}>`);
    } catch {
      try {
        document.execCommand('formatBlock', false, tag);
      } catch (err) {
        console.warn('formatBlock fallback error:', err);
      }
    }
    handleInput();
  };

  // Font size changer
  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    try {
      const span = document.createElement('span');
      span.style.fontSize = size;

      if (!range.collapsed) {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);

        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
      } else {
        span.innerHTML = '&#8203;';
        range.insertNode(span);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.addRange(newRange);
      }
    } catch {
      document.execCommand('fontSize', false, '7');
      if (editorRef.current) {
        const fontTags = editorRef.current.querySelectorAll('font[size="7"]');
        fontTags.forEach((font) => {
          const replacement = document.createElement('span');
          replacement.style.fontSize = size;
          replacement.innerHTML = font.innerHTML;
          font.parentNode?.replaceChild(replacement, font);
        });
      }
    }

    handleInput();
  };

  // Text Color changer
  const applyTextColor = (color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
    handleInput();
  };

  // Highlight (Background) Color changer
  const applyHighlightColor = (color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (color === 'transparent') {
      document.execCommand('removeFormat', false);
    } else {
      try {
        document.execCommand('hiliteColor', false, color);
      } catch {
        document.execCommand('backColor', false, color);
      }
    }
    setShowHighlightPicker(false);
    handleInput();
  };

  // Open Link Modal with saved selection
  const openLinkDialog = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelectionRange(selection.getRangeAt(0).cloneRange());
    }
    setLinkUrl('https://');
    setShowLinkModal(true);
  };

  // Apply Link
  const applyLink = () => {
    if (!linkUrl || !linkUrl.trim()) return;

    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (savedSelectionRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRange);
    }

    const cleanUrl = linkUrl.trim();
    document.execCommand('createLink', false, cleanUrl);

    // Ensure links have target and rel
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll('a');
      links.forEach((a) => {
        if (a.getAttribute('href') === cleanUrl) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.className = 'text-sherman-700 hover:text-navy underline font-medium';
        }
      });
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setSavedSelectionRange(null);
    handleInput();
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-slate-800">
            {label}
          </label>
          {helperText && (
            <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-white text-sherman-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-sherman-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs focus-within:border-sherman-600 focus-within:ring-2 focus-within:ring-sherman-100 transition-all">
        {activeTab === 'edit' ? (
          <>
            {/* Toolbar */}
            <div className="bg-slate-50/95 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1.5 select-none sticky top-0 z-10 backdrop-blur-xs">
              {/* Block Format Dropdown */}
              <select
                value={currentBlock}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="h-8 px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 outline-none hover:border-slate-400 focus:border-sherman-600 transition-colors cursor-pointer"
                title="Heading / Paragraph Format"
              >
                {BLOCK_FORMATS.map((f) => (
                  <option key={f.tag} value={f.tag}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Font Size Dropdown */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 h-8">
                <Type className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <select
                  value={selectedFontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="text-xs font-semibold bg-transparent text-slate-700 outline-none pr-1 cursor-pointer"
                  title="Font Size"
                >
                  {FONT_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Inline Formatting: Bold, Italic, Underline, Strikethrough */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('bold')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isBold
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('italic')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isItalic
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('underline')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isUnderline
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('strikeThrough')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isStrike
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Text Color Picker */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowHighlightPicker(false);
                  }}
                  className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Text Color"
                >
                  <Palette className="w-4 h-4 text-sherman-700" />
                </button>

                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-slate-300 rounded-xl shadow-lg z-30 min-w-[170px] space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Text Color
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PRESET_TEXT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => applyTextColor(c.value)}
                          className="w-6 h-6 rounded-md border border-slate-300 transition-transform hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
                      <input
                        type="color"
                        onChange={(e) => applyTextColor(e.target.value)}
                        className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer"
                        title="Custom Color"
                      />
                      <span className="text-[11px] text-slate-600">Custom...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight / Background Color Picker */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowHighlightPicker(!showHighlightPicker);
                    setShowColorPicker(false);
                  }}
                  className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Highlight Color"
                >
                  <Highlighter className="w-4 h-4 text-amber-500" />
                </button>

                {showHighlightPicker && (
                  <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-slate-300 rounded-xl shadow-lg z-30 min-w-[170px] space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Highlight Color
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PRESET_HIGHLIGHT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => applyHighlightColor(c.value)}
                          className="w-7 h-6 rounded-md border border-slate-300 text-[10px] font-bold flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        >
                          {c.value === 'transparent' ? 'None' : ''}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
                      <input
                        type="color"
                        onChange={(e) => applyHighlightColor(e.target.value)}
                        className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer"
                        title="Custom Highlight"
                      />
                      <span className="text-[11px] text-slate-600">Custom...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Alignments: Left, Center, Right, Justify */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('justifyLeft')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  alignment === 'left'
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('justifyCenter')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  alignment === 'center'
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('justifyRight')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  alignment === 'right'
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('justifyFull')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  alignment === 'justify'
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Justify Text"
              >
                <AlignJustify className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Lists */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('insertUnorderedList')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isBulletList
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Bulleted List"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('insertOrderedList')}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isNumberedList
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              {/* Indent / Outdent */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('outdent')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Outdent / Decrease Indent"
              >
                <Outdent className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('indent')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Indent / Increase Indent"
              >
                <Indent className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Hyperlinks */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={openLinkDialog}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4 text-blue-600" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('unlink')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4 text-slate-400" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* History: Undo / Redo */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('undo')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('redo')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>

              {/* Clear Formatting */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('removeFormat')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear Formatting"
              >
                <RemoveFormatting className="w-4 h-4" />
              </button>
            </div>

            {/* Editable WYSIWYG Content Area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onKeyUp={updateToolbarState}
              onMouseUp={updateToolbarState}
              className="p-4 sm:p-5 outline-none sherman-rich-content sherman-rich-light focus:outline-none overflow-y-auto"
              style={{ minHeight }}
              data-placeholder={placeholder}
            />
          </>
        ) : (
          /* Live Preview Mode */
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Formatted Preview
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
                    previewTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Light Theme
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
                    previewTheme === 'dark'
                      ? 'bg-[#061d43] text-white shadow-2xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Dark Hero Theme
                </button>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border transition-colors ${
                previewTheme === 'dark'
                  ? 'bg-[#061d43] border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
              style={{ minHeight }}
            >
              <div
                className={`sherman-rich-content ${
                  previewTheme === 'dark' ? 'sherman-rich-dark' : 'sherman-rich-light'
                }`}
                dangerouslySetInnerHTML={{
                  __html: isRichHtml(value) ? value : plainTextToHtml(value),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hyperlink Dialog Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <LinkIcon className="w-4 h-4 text-sherman-700" />
                <span>Insert or Edit Hyperlink</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Target URL (Website, Document, or Page Route)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /contact"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                }}
              />
              <p className="text-[11px] text-slate-400">
                Links open securely in a new tab with noopener protection.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Insert Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
