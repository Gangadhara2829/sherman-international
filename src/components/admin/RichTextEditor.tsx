'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  RemoveFormatting,
  Type,
  Eye,
  Edit3,
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
  { label: 'Normal Size (16px)', value: '16px' },
  { label: 'Small (13px)', value: '13px' },
  { label: 'Medium / Lead (18px)', value: '18px' },
  { label: 'Large Subheading (22px)', value: '22px' },
  { label: 'Extra Large Title (28px)', value: '28px' },
  { label: 'Huge Accent (34px)', value: '34px' },
];

const BLOCK_FORMATS = [
  { label: 'Normal Paragraph', tag: 'p' },
  { label: 'Heading 2 (Subheading)', tag: 'h2' },
  { label: 'Heading 3 (Section Title)', tag: 'h3' },
  { label: 'Heading 4 (Minor Header)', tag: 'h4' },
];

export default function RichTextEditor({
  value,
  onChange,
  label = 'Full Narrative Text',
  placeholder = 'Type and format your narrative content here...',
  helperText = 'Use the formatting toolbar below to style headings, lists, bold text, alignment, and font sizes.',
  minHeight = '280px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Toolbar state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [currentBlock, setCurrentBlock] = useState('p');
  const [selectedFontSize, setSelectedFontSize] = useState('16px');

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
      setIsBulletList(document.queryCommandState('insertUnorderedList'));
      setIsNumberedList(document.queryCommandState('insertOrderedList'));

      if (document.queryCommandState('justifyCenter')) setAlignment('center');
      else if (document.queryCommandState('justifyRight')) setAlignment('right');
      else if (document.queryCommandState('justifyFull')) setAlignment('justify');
      else setAlignment('left');

      // Detect current block format
      const blockValue = document.queryCommandValue('formatBlock')?.toLowerCase() || 'p';
      if (['h2', 'h3', 'h4', 'p'].includes(blockValue)) {
        setCurrentBlock(blockValue);
      }
    } catch (e) {
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

    // Apply inline style with span
    try {
      const span = document.createElement('span');
      span.style.fontSize = size;

      if (!range.collapsed) {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);

        // Reselect wrapped span
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
      } else {
        // Collapsed cursor: create an empty span with zero-width space
        span.innerHTML = '&#8203;';
        range.insertNode(span);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.addRange(newRange);
      }
    } catch (e) {
      // Fallback cross-node formatting
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
                ? 'bg-white text-sherman-700 shadow-2xs'
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
                ? 'bg-white text-sherman-700 shadow-2xs'
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
            <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1.5 select-none sticky top-0 z-10 backdrop-blur-xs">
              {/* Block Format Dropdown */}
              <select
                value={currentBlock}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="h-8 px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 outline-none hover:border-slate-400 focus:border-sherman-600 transition-colors"
                title="Heading / Block Level"
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

              {/* Inline Formatting (B, I, U) */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('bold')}
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
                  isUnderline
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* Alignments (Left, Center, Right, Justify) */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('justifyLeft')}
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
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
                className={`p-1.5 rounded-lg border transition-colors ${
                  isBulletList
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('insertOrderedList')}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isNumberedList
                    ? 'bg-sherman-100 text-sherman-800 border-sherman-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

              {/* History & Clear */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('undo')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('redo')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd('removeFormat')}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
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
                Preview Mode
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    previewTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Light Mode (Home Page)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    previewTheme === 'dark'
                      ? 'bg-[#061d43] text-white shadow-2xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Dark Mode (About Us Page)
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
    </div>
  );
}
