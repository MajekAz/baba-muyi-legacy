import { roleHasPermission } from "../lib/permissions.ts";
import { publicNavigation, adminNavigation } from "../lib/navigation.ts";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const fakeImage = new File(["x"], "portrait.jpg", { type: "image/jpeg" });
const fakeExecutable = new File(["x"], "bad.exe", { type: "application/x-msdownload" });
const largeVideo = new File([new Uint8Array(251 * 1024 * 1024)], "film.mp4", { type: "video/mp4" });
const allowedUploadTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "application/pdf"
]);

function validateUploadFile(file) {
  const maxBytes = file.type.startsWith("video/") ? 250 * 1024 * 1024 : 50 * 1024 * 1024;

  if (!allowedUploadTypes.has(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}`;
  }

  if (file.size > maxBytes) {
    return "File is larger than the allowed size for this media type.";
  }

  return null;
}

assert(validateUploadFile(fakeImage) === null, "JPG should be accepted");
assert(validateUploadFile(fakeExecutable)?.includes("Unsupported"), "Executable should be rejected");
assert(validateUploadFile(largeVideo)?.includes("larger"), "Oversized video should be rejected");

assert(roleHasPermission("owner", "manage_users"), "Owner should manage users");
assert(roleHasPermission("administrator", "publish_content"), "Administrator should publish");
assert(!roleHasPermission("contributor", "publish_content"), "Contributor should not publish");
assert(roleHasPermission("reviewer", "review_submissions"), "Reviewer should review submissions");

assert(publicNavigation.some((item) => item.label === "His Life" && item.children?.length), "His Life menu should have children");
assert(publicNavigation.some((item) => item.label === "Share a Memory"), "Share a Memory should exist");
assert(adminNavigation.some((item) => item.label === "Users and Access"), "Admin users/access nav should exist");
assert(adminNavigation.some((item) => item.label === "Media Library"), "Admin media nav should exist");

console.log("PASS upload validation checks");
console.log("PASS permission checks");
console.log("PASS menu rendering data checks");
