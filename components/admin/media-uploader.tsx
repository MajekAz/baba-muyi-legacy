"use client";

import { FileAudio, FileText, ImageIcon, RotateCcw, Upload, Video, X } from "lucide-react";
import { useActionState, useMemo, useRef, useState } from "react";
import { uploadMediaFiles } from "@/lib/media/actions";
import { validateMediaUpload } from "@/lib/media/validation";

type QueuedFile = {
  file: File;
  id: string;
  error: string | null;
  previewUrl?: string;
};

function iconFor(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return FileAudio;
  return FileText;
}

export function MediaUploader() {
  const [state, action, pending] = useActionState(uploadMediaFiles, { ok: false, message: "" });
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const validCount = useMemo(() => files.filter((item) => !item.error).length, [files]);

  function syncInputFiles(nextFiles: QueuedFile[]) {
    if (!inputRef.current) return;
    const transfer = new DataTransfer();
    nextFiles.filter((item) => !item.error).forEach((item) => transfer.items.add(item.file));
    inputRef.current.files = transfer.files;
  }

  async function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const nextFiles = await Promise.all(Array.from(fileList).map(async (file) => {
      const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
      const validation = validateMediaUpload({ filename: file.name, mimeType: file.type, size: file.size, bytes });
      return {
        file,
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        error: validation.ok ? null : validation.message,
        previewUrl: file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/")
          ? URL.createObjectURL(file)
          : undefined
      };
    }));

    setFiles((current) => {
      const merged = [...current, ...nextFiles];
      syncInputFiles(merged);
      return merged;
    });
  }

  function clearFiles() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <form action={action} className="grid gap-6 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-serif text-2xl text-archive-navy">Upload media</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Files are private by default and enter review before publication. Originals are preserved; later versions are recorded separately.
        </p>
      </div>
      <label
        className="grid min-h-48 cursor-pointer place-items-center rounded border-2 border-dashed border-archive-navy/20 bg-archive-cream/50 p-8 text-center transition hover:border-archive-gold"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void addFiles(event.dataTransfer.files);
        }}
      >
        <Upload className="text-archive-brown" aria-hidden="true" />
        <span className="mt-3 block font-semibold text-archive-navy">Drop files here or choose files</span>
        <span className="mt-1 block text-sm text-slate-600">JPEG, PNG, WebP, AVIF, PDF, MP3, WAV, M4A, MP4, WebM</span>
        <input
          className="sr-only"
          multiple
          name="files"
          onChange={(event) => void addFiles(event.target.files)}
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.avif,.mp4,.webm,.mp3,.wav,.m4a,.pdf"
        />
      </label>

      {files.length ? (
        <div className="grid gap-3" aria-live="polite">
          <p className="text-sm font-semibold text-archive-navy">{validCount} of {files.length} files ready</p>
          {files.map((item) => {
            const Icon = iconFor(item.file.type);
            return (
              <article className="rounded border border-archive-navy/12 bg-white p-4" key={item.id}>
                <div className="flex gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded bg-archive-cream">
                    {item.previewUrl && item.file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={`Preview of ${item.file.name}`} className="h-full w-full object-cover" src={item.previewUrl} />
                    ) : (
                      <Icon aria-hidden="true" className="text-archive-brown" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-archive-navy">{item.file.name}</p>
                    <p className="text-sm text-slate-600">{item.file.type || "Unknown type"} · {Math.round(item.file.size / 1024)} KB</p>
                    {item.previewUrl && item.file.type.startsWith("video/") ? (
                      <video className="mt-3 max-h-40 rounded" controls src={item.previewUrl} />
                    ) : null}
                    {item.previewUrl && item.file.type.startsWith("audio/") ? (
                      <audio className="mt-3 w-full" controls src={item.previewUrl} />
                    ) : null}
                    {item.file.type === "application/pdf" ? (
                      <p className="mt-2 text-sm text-slate-600">PDF files are stored privately and viewed through authorised links.</p>
                    ) : null}
                    {item.error ? <p className="mt-2 text-sm font-semibold text-red-700">{item.error}</p> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={!validCount || pending} type="submit">
          {pending ? "Uploading..." : "Upload validated files"}
        </button>
        <button className="inline-flex items-center gap-2 rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" onClick={clearFiles} type="button">
          <X aria-hidden="true" className="size-4" />
          Clear
        </button>
        <button className="inline-flex items-center gap-2 rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" type="submit" disabled={!validCount || pending}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Retry ready files
        </button>
      </div>
      {pending ? <p className="text-sm font-semibold text-archive-brown" aria-live="polite">Upload in progress. Keep this page open.</p> : null}
      {state.message ? <p className={`text-sm font-semibold ${state.ok ? "text-green-700" : "text-red-700"}`} aria-live="polite">{state.message}</p> : null}
    </form>
  );
}
