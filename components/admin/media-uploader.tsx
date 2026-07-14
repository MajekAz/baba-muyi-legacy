"use client";

import { FileAudio, FileText, ImageIcon, Upload, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { hasSupabasePublicEnv } from "@/lib/env";
import { validateUploadFile } from "@/lib/validation/admin";

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
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [message, setMessage] = useState("");
  const supabaseConfigured = useMemo(() => hasSupabasePublicEnv(), []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const nextFiles = Array.from(fileList).map((file) => ({
      file,
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      error: validateUploadFile(file),
      previewUrl: file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/")
        ? URL.createObjectURL(file)
        : undefined
    }));

    setFiles((current) => [...current, ...nextFiles]);
  }

  function submitUploads() {
    if (!supabaseConfigured) {
      setMessage("Supabase is not configured yet. Files were validated locally but not uploaded.");
      return;
    }

    setMessage("Upload plumbing is ready; connect Supabase storage credentials to enable real uploads.");
  }

  return (
    <div className="grid gap-6">
      <label
        className="grid min-h-48 cursor-pointer place-items-center rounded border-2 border-dashed border-archive-navy/20 bg-white p-8 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <Upload className="text-archive-brown" aria-hidden="true" />
        <span className="mt-3 block font-semibold text-archive-navy">Drop files here or choose files</span>
        <span className="mt-1 block text-sm text-slate-600">JPG, PNG, WebP, AVIF, MP4, WebM, MP3, WAV, M4A, PDF</span>
        <input
          className="sr-only"
          multiple
          onChange={(event) => addFiles(event.target.files)}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.avif,.mp4,.webm,.mp3,.wav,.m4a,.pdf"
        />
      </label>

      {files.length > 0 ? (
        <div className="grid gap-3">
          {files.map((item) => {
            const Icon = iconFor(item.file.type);
            return (
              <article className="rounded border border-archive-navy/12 bg-white p-4" key={item.id}>
                <div className="flex gap-4">
                  <div className="grid h-20 w-20 place-items-center overflow-hidden rounded bg-archive-cream">
                    {item.previewUrl && item.file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" className="h-full w-full object-cover" src={item.previewUrl} />
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
                      <p className="mt-2 text-sm text-slate-600">PDF preview will use signed URLs after Supabase storage is connected.</p>
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
        <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" onClick={submitUploads} type="button">
          Upload validated files
        </button>
        <button className="rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" onClick={() => setFiles([])} type="button">
          Clear selection
        </button>
      </div>
      {message ? <p className="text-sm font-semibold text-archive-brown">{message}</p> : null}
    </div>
  );
}
