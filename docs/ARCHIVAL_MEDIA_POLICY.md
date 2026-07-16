# Archival Media Policy

LegacyHub preserves archival originals.

## Core Rules

- Never overwrite the original uploaded file.
- Store optimised, thumbnail and restored files as separate versions.
- Record version type, storage path, checksum where practical, restoration notes, restorer and restoration date.
- Keep restored versions linked to the original media item.
- Do not store signed URLs or private file contents in audit logs.

## Version Types

- `original`: the file supplied by the archive team or contributor.
- `web_optimised`: a delivery-friendly derivative.
- `thumbnail`: a small preview image.
- `restored`: a restoration or repair output.

## Deletion and Archive

The first media milestone uses safe archival status changes rather than destructive deletion. Object deletion should remain permission-checked, audited and reversible where practical.

## Future Work

Malware scanning, image optimisation workers, OCR, transcription and AI restoration are intentionally deferred.
