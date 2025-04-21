





'use client';

import { useEffect, useRef } from 'react';
import EditorJS, { BlockToolConstructable, OutputData } from '@editorjs/editorjs';



"import tools for writing canvas"
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import CheckList from '@editorjs/checklist';

interface EditorProps {
  onChange?: (data: OutputData) => void;
  initialData?: OutputData | null;
  readOnly?: boolean;
}

const EDITOR_TOOLS: { [toolName: string]: unknown } = {
  header: {
    class: Header,
    config: {
      placeholder: 'Type your heading...',
      levels: [1, 2, 3],
      defaultLevel: 2
    }
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  code: Code,
  inlineCode: InlineCode,
  table: {
    class: Table,
    inlineToolbar: true
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote\'s author'
    }
  },
  marker: Marker,
  delimiter: Delimiter,
  checklist: {
    class: CheckList,
    inlineToolbar: true
  }
};

export default function Editor({ onChange, initialData, readOnly = false }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initEditor = async () => {
      if (editorRef.current) {
        try {
          await editorRef.current.isReady;
          await editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Failed to destroy editor:', e);
        }
      }

      try {
        const editor = new EditorJS({
          holder: containerRef.current ?? undefined,
          tools: EDITOR_TOOLS as { [toolName: string]: BlockToolConstructable },
          data: initialData ?? undefined,
          readOnly,
          placeholder: 'Start writing your blog post...',
          inlineToolbar: true,
          autofocus: true,
          minHeight: 0,
          onChange: async () => {
            try {
              const content = await editor.save();
              onChange?.(content);
            } catch (e) {
              console.error('Failed to save content:', e);
            }
          },
          onReady: () => {
            const style = document.createElement('style');
            style.textContent = `
              .codex-editor {
                position: relative;
              }
              .codex-editor__redactor {
                padding-bottom: 50px !important;
              }
              .ce-block__content {
                max-width: none !important;
                margin: 0 !important;
                position: relative !important;
              }
              .ce-toolbar__content {
                max-width: none !important;
                position: relative !important;
              }
             .cdx-block {
                max-width: none !important;
              }
              .ce-paragraph {
                font-size: 1.125rem !important;
                line-height: 1.75 !important;
                color: #1f2937 !important;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                padding: 0.5rem 0 !important;
                margin: 0 !important;
                position: relative !important;
              }
              .ce-block {
                margin: 0 !important;
                position: relative !important;
              }
              .ce-block {
                margin: 0 !important;
                position: relative !important;
              }
              .ce-paragraph[data-placeholder]:empty::before {
                color: #9ca3af !important;
                font-style: normal !important;
                opacity: 0.8 !important;
              }
              .ce-header {
                padding: 0.75rem 0 !important;
                margin: 0 !important;
                position: relative !important;
              }
              h1.ce-header {
                font-size: 2.25rem !important;
                font-weight: 700 !important;
                color: #111827 !important;
                line-height: 1.2 !important;
              }
              h2.ce-header {
                font-size: 1.875rem !important;
                font-weight: 600 !important;
                color: #1f2937 !important;
                line-height: 1.3 !important;
              }
              Here is the remaining code:
TypeScript
              h3.ce-header {
                font-size: 1.5rem !important;
                font-weight: 600 !important;
                color: #374151 !important;
                line-height: 1.4 !important;
              }
              .cdx-quote {
                background: #f9fafb !important;
                padding: 1rem !important;
                border-left: 4px solid #14b8a6 !important;
                margin: 1rem 0 !important;
              }
              .cdx-quote__text {
                font-size: 1.125rem !important;
                color: #4b5563 !important;
                font-style: italic !important;
                margin: 0 !important;
              }
              .cdx-quote__caption {
                color: #6b7280 !important;
                margin-top: 0.5rem !important;
              }
              .ce-code {
                background-color: #f3f4f6 !important;
                padding: 1rem !important;
                border-radius: 0.375rem !important;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                margin: 0.5rem 0 !important;
              }
              .cdx-checklist__item {
                padding: 0.25rem 0 !important;
              }
              .cdx-checklist__item-checkbox {
                border: 2px solid #d1d5db !important;
                border-radius: 4px !important;
                margin-right: 0.5rem !important;
              }
              .cdx-checklist__item--checked .cdx-checklist__item-checkbox {
                background: #14b8a6 !important;
                border-color: #14b8a6 !important;
              }
              .ce-toolbar__plus {
                color: #14b8a6 !important;
                width: 24px !important;
                height: 24px !important;
                left: -30px !important;
                margin-top: 6px !important;
              }
              .ce-toolbar__settings-btn {
                color: #14b8a6 !important;
                width: 24px !important;
                height: 24px !important;
                right: -30px !important;
                margin-top: 6px !important;
              }
              .cdx-marker {
                background: rgba(20, 184, 166, 0.3) !important;
              }
              .ce-inline-toolbar {
                background: white !important;
                border: 1px solid #e5e7eb !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                z-index: 100 !important;
              }
              .ce-conversion-toolbar {
                background: white !important;
                border: 1px solid #e5e7eb !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                z-index: 100 !important;
              }
              .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
                background-color: #f0fdfa !important;
              }
              .ce-toolbar__actions {
                right: 0 !important;
              }
              .ce-block--selected .ce-block__content {
                background: #f0fdfa !important;
              }
              .codex-editor--empty::before {
                color: #9ca3af !important;
                font-style: normal !important;
              }
              .ce-toolbar {
                z-index: 99 !important;
              }
              .ce-toolbar__content {
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
              }
              .ce-popover {
                z-index: 101 !important;
              }
            `;
            document.head.appendChild(style);
          }
        });

        editorRef.current = editor;
      } catch (e) {
        console.error('Failed to initialize editor:', e);
      }
    };

    initEditor();

    return () => {
      const cleanup = async () => {
        if (editorRef.current) {
          try {
            await editorRef.current.isReady;
            await editorRef.current.destroy();
            editorRef.current = null;
          } catch (e) {
            console.error('Failed to cleanup editor:', e);
          }
        }
      };
      cleanup();
    };
  }, [readOnly, initialData, onChange]);

  return (
    <div className="relative w-full">
      <div 
        className={`
          Here is the remaining code:
TypeScript
          relative min-h-[500px] w-full bg-white rounded-lg border border-gray-200 overflow-hidden
          ${readOnly ? 'cursor-not-allowed opacity-75' : 'hover:border-teal-500 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20'}
        `}
      >
        <div ref={containerRef} className="prose prose-lg max-w-none p-6 overflow-y-auto" style={{ minHeight: '500px' }} />
      </div>
      
      {/* Editor Tips */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>⌘ + Enter for new paragraph</span>
          <span>Tab for tools</span>
        </div>
        <div className="flex items-center gap-4">
          <span># for headers</span>
          <span>* for lists</span>
          <span>&gt; for quotes</span>
        </div>
      </div>
    </div>
  );
}
