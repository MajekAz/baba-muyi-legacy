"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, LinkIcon, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useState } from "react";

type RichTextEditorProps = {
  name: string;
  initialContent?: string;
  placeholder?: string;
  onDirty?: () => void;
};

export function RichTextEditor({ name, initialContent = "", placeholder = "Write approved content...", onDirty }: RichTextEditorProps) {
  const [html, setHtml] = useState(initialContent);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder })
    ],
    content: initialContent || "<p></p>",
    onUpdate({ editor: currentEditor }) {
      const nextHtml = currentEditor.getHTML();
      setHtml(nextHtml);
      if (nextHtml !== initialContent) {
        onDirty?.();
      }
    }
  });

  const tools = [
    { label: "Heading 2", icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", icon: Heading3, action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bold", icon: Bold, action: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, action: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Quote", icon: Quote, action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Bulleted list", icon: List, action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, action: () => editor?.chain().focus().toggleOrderedList().run() },
    {
      label: "Link",
      icon: LinkIcon,
      action: () => {
        const href = window.prompt("Paste a safe URL");
        if (href) editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
      }
    },
    { label: "Undo", icon: Undo2, action: () => editor?.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, action: () => editor?.chain().focus().redo().run() }
  ];

  return (
    <div className="rounded border border-slate-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 p-2">
        {tools.map(({ label, icon: Icon, action }) => (
          <button
            aria-label={label}
            className="inline-flex size-9 items-center justify-center rounded border border-slate-200 text-archive-navy hover:bg-archive-cream"
            key={label}
            onClick={action}
            title={label}
            type="button"
          >
            <Icon aria-hidden="true" size={16} />
          </button>
        ))}
      </div>
      <EditorContent className="prose max-w-none p-4 focus:outline-none [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:outline-none" editor={editor} />
      <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-600">
        {html === initialContent ? "Saved state clear" : "Unsaved changes"}
      </div>
      <input name={name} type="hidden" value={html} readOnly />
    </div>
  );
}
