"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  name: string;
  initialContent?: string;
  placeholder?: string;
};

export function RichTextEditor({ name, initialContent = "", placeholder = "Write approved content..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder })
    ],
    content: initialContent || "<p></p>"
  });

  return (
    <div className="rounded border border-slate-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 p-2">
        {[
          ["Bold", () => editor?.chain().focus().toggleBold().run()],
          ["Italic", () => editor?.chain().focus().toggleItalic().run()],
          ["Quote", () => editor?.chain().focus().toggleBlockquote().run()],
          ["Bullets", () => editor?.chain().focus().toggleBulletList().run()],
          ["Numbers", () => editor?.chain().focus().toggleOrderedList().run()],
          ["Rule", () => editor?.chain().focus().setHorizontalRule().run()]
        ].map(([label, action]) => (
          <button
            className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-archive-navy hover:bg-archive-cream"
            key={label as string}
            onClick={action as () => void}
            type="button"
          >
            {label as string}
          </button>
        ))}
      </div>
      <EditorContent className="prose max-w-none p-4 focus:outline-none [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:outline-none" editor={editor} />
      <input name={name} type="hidden" value={editor?.getHTML() ?? initialContent} readOnly />
    </div>
  );
}
