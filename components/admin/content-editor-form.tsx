"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { saveCmsCoreContent } from "@/lib/cms-core-actions";
import { cmsCoreCollections, type CmsCoreCollection, type CmsCoreRecord } from "@/lib/cms-core-config";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { MediaRelationOption, MediaRelationState } from "@/lib/media/types";

type ContentEditorFormProps = {
  collection: CmsCoreCollection;
  record?: CmsCoreRecord | null;
  canPublish?: boolean;
  mediaOptions?: MediaRelationOption[];
  mediaRelations?: MediaRelationState;
};

type EditorActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const initialState: EditorActionState = {
  ok: true,
  message: ""
};

type WorkflowAction = {
  label: string;
  value: string;
  style: "primary" | "secondary" | "danger";
  confirm?: {
    title: string;
    description: string;
    confirmLabel: string;
  };
};

function workflowActions(status: CmsCoreRecord["status"], canPublish: boolean, hasRecord: boolean): WorkflowAction[] {
  if (status === "archived") {
    return [
      ...(canPublish ? [{ label: "Restore to draft", value: "restore_draft", style: "secondary" as const }] : []),
      ...(hasRecord ? [] : [{ label: "Save draft", value: "save_draft", style: "secondary" as const }])
    ];
  }

  if (status === "published") {
    return [
      { label: "Save changes", value: "save_changes", style: "secondary" },
      ...(canPublish ? [
        {
          label: "Unpublish",
          value: "unpublish",
          style: "secondary" as const,
          confirm: {
            title: "Unpublish this content?",
            description: "This will move the content back to draft and remove it from public archive pages.",
            confirmLabel: "Unpublish"
          }
        },
        {
          label: "Archive",
          value: "archive",
          style: "danger" as const,
          confirm: {
            title: "Archive this content?",
            description: "Archived content is removed from public archive pages and ordinary editorial lists.",
            confirmLabel: "Archive"
          }
        }
      ] : [])
    ];
  }

  if (status === "scheduled") {
    return [
      { label: "Save changes", value: "save_changes", style: "secondary" },
      ...(canPublish ? [
        {
          label: "Publish now",
          value: "publish_now",
          style: "primary" as const,
          confirm: {
            title: "Publish now?",
            description: "This will publish the content immediately if visibility and verification checks pass.",
            confirmLabel: "Publish now"
          }
        },
        { label: "Unschedule", value: "unschedule", style: "secondary" as const }
      ] : [])
    ];
  }

  if (status === "in_review") {
    return [
      { label: "Return to draft", value: "return_draft", style: "secondary" },
      ...(canPublish ? [{
        label: "Publish",
        value: "publish",
        style: "primary" as const,
        confirm: {
          title: "Publish this content?",
          description: "This will make the content visible on public archive pages when visibility is Public.",
          confirmLabel: "Publish"
        }
      }] : [])
    ];
  }

  return [
    { label: "Save draft", value: "save_draft", style: "secondary" },
    { label: "Submit for review", value: "submit_review", style: "secondary" },
    ...(canPublish ? [
      {
        label: "Publish",
        value: "publish",
        style: "primary" as const,
        confirm: {
          title: "Publish this content?",
          description: "This will make the content visible on public archive pages when visibility is Public.",
          confirmLabel: "Publish"
        }
      },
      { label: "Schedule", value: "schedule", style: "secondary" as const }
    ] : [])
  ];
}

function actionClass(style: WorkflowAction["style"]) {
  if (style === "primary") return "rounded bg-archive-gold px-5 py-3 text-sm font-semibold text-archive-navy shadow-sm disabled:opacity-50";
  if (style === "danger") return "rounded border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 disabled:opacity-50";
  return "rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy disabled:opacity-50";
}

export function ContentEditorForm({ collection, record, canPublish = false, mediaOptions = [], mediaRelations = { featuredMediaId: "", relatedMediaIds: [] } }: ContentEditorFormProps) {
  const [state, formAction, pending] = useActionState(saveCmsCoreContent, initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [workflowAction, setWorkflowAction] = useState("save_changes");
  const wasDirtyRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const workflowInputRef = useRef<HTMLInputElement>(null);
  const formId = useId().replace(/:/g, "");
  const config = cmsCoreCollections[collection];
  const currentStatus = record?.status ?? "draft";
  const actions = workflowActions(currentStatus, canPublish, Boolean(record));
  const markDirty = () => {
    wasDirtyRef.current = true;
    setIsDirty(true);
  };

  const chooseWorkflowAction = (value: string) => {
    if (workflowInputRef.current) {
      workflowInputRef.current.value = value;
    }
    setWorkflowAction(value);
  };

  useEffect(() => {
    if (!state.ok) {
      isSubmittingRef.current = false;
      wasDirtyRef.current = true;
      setIsDirty(true);
    }
  }, [state.ok]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!wasDirtyRef.current || isSubmittingRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (!wasDirtyRef.current || isSubmittingRef.current) return;
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || target.getAttribute("target") === "_blank") return;
      if (!window.confirm("You have unsaved changes. Leave this page?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onPopState = () => {
      if (!wasDirtyRef.current) return;
      if (!window.confirm("You have unsaved changes. Leave this page?")) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    window.history.replaceState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  function fieldError(name: string) {
    return state.fieldErrors?.[name]?.[0];
  }

  function describedBy(name: string, hasHelp = true) {
    const parts = [];
    if (hasHelp) parts.push(`${formId}-${name}-help`);
    if (fieldError(name)) parts.push(`${formId}-${name}-error`);
    return parts.length ? parts.join(" ") : undefined;
  }

  return (
    <form
      action={formAction}
      className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm"
      onChangeCapture={markDirty}
      onSubmit={() => {
        isSubmittingRef.current = true;
      }}
    >
      <input name="id" type="hidden" value={record?.id ?? ""} />
      <input name="collection" type="hidden" value={collection} />
      <input name="currentStatus" type="hidden" value={currentStatus} />
      <input name="workflowAction" ref={workflowInputRef} type="hidden" value={workflowAction} readOnly />
      {!state.ok ? (
        <div aria-live="polite" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
          {state.message}
        </div>
      ) : null}
      {state.ok && state.message ? (
        <div aria-live="polite" className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor={`${formId}-title`}>Title <span className="text-red-700">(required)</span></label>
        <input aria-describedby={describedBy("title")} aria-invalid={Boolean(fieldError("title"))} className="rounded border border-slate-300 px-3 py-2" defaultValue={record?.title ?? ""} id={`${formId}-title`} name="title" placeholder={`${config.label} title`} required />
        <p className="text-xs text-slate-600" id={`${formId}-title-help`}>Use the public-facing title for this record.</p>
        {fieldError("title") ? <p className="text-xs font-semibold text-red-700" id={`${formId}-title-error`}>{fieldError("title")}</p> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor={`${formId}-slug`}>Slug <span className="text-slate-500">(optional if title is unique)</span></label>
          <input aria-describedby={describedBy("slug")} aria-invalid={Boolean(fieldError("slug"))} className="rounded border border-slate-300 px-3 py-2" defaultValue={record?.slug ?? ""} id={`${formId}-slug`} name="slug" placeholder="approved-content-slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          <p className="text-xs text-slate-600" id={`${formId}-slug-help`}>Lowercase letters, numbers, and hyphens only.</p>
          {fieldError("slug") ? <p className="text-xs font-semibold text-red-700" id={`${formId}-slug-error`}>{fieldError("slug")}</p> : null}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor={`${formId}-status`}>Status <span className="text-red-700">(required)</span></label>
          <select aria-describedby={`${formId}-status-help`} className="rounded border border-slate-300 px-3 py-2" defaultValue={record?.status ?? "draft"} id={`${formId}-status`} name="status">
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            {canPublish ? <option value="scheduled">Scheduled</option> : null}
            {canPublish ? <option value="published">Published</option> : null}
            {canPublish ? <option value="archived">Archived</option> : null}
          </select>
          <p className="text-xs text-slate-600" id={`${formId}-status-help`}>Use the workflow buttons below for publishing actions.</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-visibility`}>
          Visibility <span className="text-red-700">(required)</span>
          <select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.visibility ?? "private"} id={`${formId}-visibility`} name="visibility">
            <option value="private">Private</option>
            <option value="preview">Preview</option>
            <option value="public">Public</option>
            <option value="family_only">Family members</option>
            <option value="specific_users">Specific users</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-verificationStatus`}>
          Verification status <span className="text-red-700">(required)</span>
          <select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.verificationStatus ?? "unverified"} id={`${formId}-verificationStatus`} name="verificationStatus">
            <option value="unverified">Unverified</option>
            <option value="family_memory">Family memory</option>
            <option value="partially_verified">Partially verified</option>
            <option value="verified">Verified</option>
          </select>
        </label>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor={`${formId}-sortOrder`}>Sort order <span className="text-slate-500">(optional)</span></label>
          <input aria-describedby={describedBy("sortOrder")} aria-invalid={Boolean(fieldError("sortOrder"))} className="rounded border border-slate-300 px-3 py-2" defaultValue={record?.sortOrder ?? 0} id={`${formId}-sortOrder`} name="sortOrder" placeholder="0" type="number" min="0" />
          <p className="text-xs text-slate-600" id={`${formId}-sortOrder-help`}>Lower numbers appear first where ordering is supported.</p>
          {fieldError("sortOrder") ? <p className="text-xs font-semibold text-red-700" id={`${formId}-sortOrder-error`}>{fieldError("sortOrder")}</p> : null}
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-author`}>
          Author or contributor <span className="text-slate-500">(optional)</span>
          <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.author ?? ""} id={`${formId}-author`} name="author" placeholder="Family archive team" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-category`}>
          Category <span className="text-slate-500">(optional)</span>
          <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.category ?? ""} id={`${formId}-category`} name="category" placeholder="Leadership" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-tags`}>
          Tags or source notes <span className="text-slate-500">(optional)</span>
          <input aria-describedby={`${formId}-tags-help`} className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.tags ?? ""} id={`${formId}-tags`} name="tags" placeholder="family-reviewed, transcript" />
          <span className="text-xs font-normal text-slate-600" id={`${formId}-tags-help`}>Use simple comma-separated notes until full tag management is added.</span>
        </label>
      </div>
      {collection === "timeline" ? (
        <div className="grid gap-2 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-eventDate`}>
            Event date <span className="text-slate-500">(optional)</span>
            <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.eventDate ?? ""} id={`${formId}-eventDate`} name="eventDate" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-dateLabel`}>
            Date certainty <span className="text-red-700">(required)</span>
            <select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.dateLabel ?? "date to be confirmed"} id={`${formId}-dateLabel`} name="dateLabel">
              <option value="exact">Exact</option>
              <option value="approximate">Approximate</option>
              <option value="decade">Decade</option>
              <option value="date to be confirmed">Date to be confirmed</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-location`}>
            Location <span className="text-slate-500">(optional)</span>
            <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.location ?? ""} id={`${formId}-location`} name="location" placeholder="Bariga" />
          </label>
        </div>
      ) : null}
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor={`${formId}-summary`}>Summary <span className="text-slate-500">(optional)</span></label>
        <textarea aria-describedby={describedBy("summary")} aria-invalid={Boolean(fieldError("summary"))} className="min-h-24 rounded border border-slate-300 px-3 py-2" defaultValue={record?.summary ?? ""} id={`${formId}-summary`} name="summary" placeholder="A short public summary" />
        <p className="text-xs text-slate-600" id={`${formId}-summary-help`}>Keep this concise; it may appear on public listing pages.</p>
        {fieldError("summary") ? <p className="text-xs font-semibold text-red-700" id={`${formId}-summary-error`}>{fieldError("summary")}</p> : null}
      </div>
      <RichTextEditor initialContent={record?.contentHtml ?? ""} name="contentHtml" onDirty={markDirty} />
      <fieldset className="grid gap-3 rounded border border-archive-navy/12 bg-archive-cream/35 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">Media relationships</legend>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-featuredMediaId`}>
          Featured media <span className="text-slate-500">(optional)</span>
          <select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={mediaRelations.featuredMediaId} id={`${formId}-featuredMediaId`} name="featuredMediaId">
            <option value="">No featured media</option>
            {mediaOptions.map((media) => (
              <option key={media.id} value={media.id}>{media.title} ({media.mediaType.replace("_", " ")})</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-relatedMediaIds`}>
          Related media <span className="text-slate-500">(optional)</span>
          <select className="min-h-32 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={mediaRelations.relatedMediaIds} id={`${formId}-relatedMediaIds`} multiple name="relatedMediaIds">
            {mediaOptions.map((media) => (
              <option key={media.id} value={media.id}>{media.title} ({media.mediaType.replace("_", " ")})</option>
            ))}
          </select>
        </label>
        <p className="text-xs leading-5 text-slate-600">
          Linked media is reused from the library. Removing a relationship does not delete the file.
        </p>
      </fieldset>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-seoTitle`}>
          SEO title <span className="text-slate-500">(optional)</span>
          <input aria-describedby={`${formId}-seoTitle-help`} className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.seoTitle ?? ""} id={`${formId}-seoTitle`} name="seoTitle" placeholder="Public search title" />
          <span className="text-xs font-normal text-slate-600" id={`${formId}-seoTitle-help`}>Used for search previews when provided.</span>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-metaDescription`}>
          Meta description <span className="text-slate-500">(optional)</span>
          <input aria-describedby={`${formId}-metaDescription-help`} className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.metaDescription ?? ""} id={`${formId}-metaDescription`} name="metaDescription" placeholder="Short search description" />
          <span className="text-xs font-normal text-slate-600" id={`${formId}-metaDescription-help`}>Keep under 240 characters.</span>
        </label>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-scheduledPublicationDate`}>
          Scheduled publication date <span className="text-slate-500">(optional)</span>
          <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.scheduledPublicationDate ?? ""} id={`${formId}-scheduledPublicationDate`} name="scheduledPublicationDate" type="datetime-local" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy" htmlFor={`${formId}-publishedAt`}>
          Published date <span className="text-slate-500">(optional)</span>
          <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" defaultValue={record?.publishedAt ? record.publishedAt.slice(0, 16) : ""} id={`${formId}-publishedAt`} name="publishedAt" type="datetime-local" />
        </label>
      </div>
      <p aria-live="polite" className="text-xs font-semibold text-slate-600">
        {isDirty ? "Unsaved changes" : "No unsaved changes"}
      </p>
      <div aria-label="Editorial workflow actions" className="flex flex-wrap items-center gap-3">
        {actions.map((action) => action.confirm ? (
          <ConfirmSubmitButton
            className={actionClass(action.style)}
            confirmLabel={action.confirm.confirmLabel}
            description={action.confirm.description}
            disabled={pending}
            key={action.value}
            name="workflowAction"
            onConfirm={() => chooseWorkflowAction(action.value)}
            pendingLabel="Working..."
            title={action.confirm.title}
            value={action.value}
          >
            {pending ? "Working..." : action.label}
          </ConfirmSubmitButton>
        ) : (
          <button className={actionClass(action.style)} disabled={pending} key={action.value} name="workflowAction" onClick={() => chooseWorkflowAction(action.value)} type="submit" value={action.value}>
            {pending ? "Saving..." : action.label}
          </button>
        ))}
        {record ? (
          <Link className="rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" href={`/admin/content/${collection}/${record.id}/preview`}>
            Preview
          </Link>
        ) : null}
      </div>
    </form>
  );
}
