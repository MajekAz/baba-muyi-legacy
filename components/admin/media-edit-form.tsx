"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { updateMediaItem } from "@/lib/media/actions";
import type { MediaAlbum, MediaRecord } from "@/lib/media/types";

type MediaWorkflowAction = {
  label: string;
  value: string;
  style: "primary" | "secondary" | "danger";
  confirm?: {
    title: string;
    description: string;
    confirmLabel: string;
  };
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived"
};

const moderationLabels: Record<string, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Returned",
  hidden: "Hidden"
};

const visibilityLabels: Record<string, string> = {
  public: "Public",
  preview: "Preview only",
  private: "Private",
  family_only: "Family only",
  registered: "Registered users",
  invited: "Invited users",
  specific_users: "Specific users",
  password_protected: "Password protected"
};

function workflowActions(status: string): MediaWorkflowAction[] {
  if (status === "archived") {
    return [
      {
        label: "Restore",
        value: "restore",
        style: "secondary",
        confirm: {
          title: "Restore this media?",
          description: "This will move the media back to draft so it can be reviewed again.",
          confirmLabel: "Restore"
        }
      }
    ];
  }

  if (status === "published") {
    return [
      { label: "Save changes", value: "save_changes", style: "secondary" },
      {
        label: "Unpublish",
        value: "unpublish",
        style: "secondary",
        confirm: {
          title: "Unpublish this media?",
          description: "This will remove the media from the public gallery and archive while preserving the file.",
          confirmLabel: "Unpublish"
        }
      },
      {
        label: "Archive",
        value: "archive",
        style: "danger",
        confirm: {
          title: "Archive this media?",
          description: "Archived media is removed from published views and ordinary media workflows.",
          confirmLabel: "Archive"
        }
      }
    ];
  }

  if (status === "in_review") {
    return [
      { label: "Approve", value: "approve", style: "secondary" },
      {
        label: "Approve & Publish",
        value: "approve_publish",
        style: "primary",
        confirm: {
          title: "Approve and publish this media?",
          description: "This will approve the record, make it public, and display it in the public gallery and archive.",
          confirmLabel: "Approve & Publish"
        }
      },
      { label: "Return to draft", value: "return_draft", style: "secondary" }
    ];
  }

  return [
    { label: "Save draft", value: "save_draft", style: "secondary" },
    { label: "Submit for review", value: "submit_review", style: "secondary" },
    {
      label: "Publish",
      value: "publish",
      style: "primary",
      confirm: {
        title: "Publish this media?",
        description: "This will approve the media, set visibility to Public, and display it in public archive views.",
        confirmLabel: "Publish"
      }
    }
  ];
}

function actionClass(style: MediaWorkflowAction["style"]) {
  if (style === "primary") return "rounded bg-archive-gold px-5 py-3 text-sm font-semibold text-archive-navy shadow-sm disabled:opacity-50";
  if (style === "danger") return "rounded border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 disabled:opacity-50";
  return "rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy disabled:opacity-50";
}

export function MediaEditForm({ record, albums }: { record: MediaRecord; albums: MediaAlbum[] }) {
  const [workflowAction, setWorkflowAction] = useState("save_changes");
  const workflowInputRef = useRef<HTMLInputElement>(null);
  const actions = workflowActions(record.publicationStatus);
  const isPublic = record.publicationStatus === "published" && record.visibility === "public" && record.moderationStatus === "approved";

  const chooseWorkflowAction = (value: string) => {
    if (workflowInputRef.current) workflowInputRef.current.value = value;
    setWorkflowAction(value);
  };

  return (
    <form action={updateMediaItem} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <input type="hidden" name="id" value={record.id} />
      <input type="hidden" name="currentPublicationStatus" value={record.publicationStatus} />
      <input type="hidden" name="workflowAction" ref={workflowInputRef} value={workflowAction} readOnly />
      <div className={isPublic ? "rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" : "rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"} role="status">
        {isPublic
          ? "This media is published and visible in the public archive."
          : "This media is awaiting approval or is private, so it is not visible in the public archive."}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Title<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="title" defaultValue={record.title} required /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Slug<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="slug" defaultValue={record.slug} required /></label>
      </div>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">Description<textarea className="min-h-24 rounded border border-slate-300 px-3 py-2 font-normal" name="description" defaultValue={record.description} /></label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Caption<textarea className="min-h-20 rounded border border-slate-300 px-3 py-2 font-normal" name="caption" defaultValue={record.caption} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Alt text<textarea className="min-h-20 rounded border border-slate-300 px-3 py-2 font-normal" name="altText" defaultValue={record.altText} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Date<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="approximateDate" defaultValue={record.approximateDate} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Precision<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="datePrecision" defaultValue={record.datePrecision}>
          <option value="unknown">Unknown</option><option value="year">Year</option><option value="month">Month</option><option value="day">Day</option><option value="circa">Circa</option><option value="range">Range</option>
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Location<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="location" defaultValue={record.location} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">People shown<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="peopleShown" defaultValue={record.peopleShown.join(", ")} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Source<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="source" defaultValue={record.source} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Copyright owner<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="copyrightOwner" defaultValue={record.copyrightOwner} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Licence<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="licence" defaultValue={record.licence} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Album<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="albumId" defaultValue={record.albumId ?? ""}>
          <option value="">Unassigned</option>
          {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Verification<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="verificationStatus" defaultValue={record.verificationStatus} aria-describedby="media-verification-help">
          <option value="unverified">Unverified</option><option value="family_memory">Family memory</option><option value="partially_verified">Partially verified</option><option value="verified">Verified</option>
        </select><span className="text-xs font-normal text-slate-600" id="media-verification-help">Workflow buttons set approval automatically when publishing.</span></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Visibility<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="visibility" defaultValue={record.visibility} aria-describedby="media-visibility-help">
          <option value="private">Private</option><option value="family_only">Family only</option><option value="public">Public</option>
        </select><span className="text-xs font-normal text-slate-600" id="media-visibility-help">Use workflow buttons for public publishing changes.</span></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Publication<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="publicationStatus" defaultValue={record.publicationStatus} aria-describedby="media-publication-help">
          <option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select><span className="text-xs font-normal text-slate-600" id="media-publication-help">Current status: {statusLabels[record.publicationStatus] ?? record.publicationStatus}.</span></label>
      </div>
      <input type="hidden" name="moderationStatus" value={record.moderationStatus} />
      <dl className="grid gap-3 rounded border border-archive-navy/12 bg-archive-cream/35 p-4 text-sm md:grid-cols-3">
        <div><dt className="font-semibold text-archive-navy">Publication</dt><dd>{statusLabels[record.publicationStatus] ?? record.publicationStatus}</dd></div>
        <div><dt className="font-semibold text-archive-navy">Review</dt><dd>{moderationLabels[record.moderationStatus] ?? record.moderationStatus}</dd></div>
        <div><dt className="font-semibold text-archive-navy">Visibility</dt><dd>{visibilityLabels[record.visibility] ?? record.visibility}</dd></div>
      </dl>
      <div aria-label="Media workflow actions" className="flex flex-wrap items-center gap-3">
        {actions.map((action) => action.confirm ? (
          <ConfirmSubmitButton
            className={actionClass(action.style)}
            confirmLabel={action.confirm.confirmLabel}
            description={action.confirm.description}
            key={action.value}
            name="workflowAction"
            onConfirm={() => chooseWorkflowAction(action.value)}
            title={action.confirm.title}
            value={action.value}
          >
            {action.label}
          </ConfirmSubmitButton>
        ) : (
          <button className={actionClass(action.style)} key={action.value} name="workflowAction" onClick={() => chooseWorkflowAction(action.value)} type="submit" value={action.value}>
            {action.label}
          </button>
        ))}
        <Link className="rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" href={`/admin/media/${record.id}/view`} target="_blank">
          Preview
        </Link>
      </div>
    </form>
  );
}
