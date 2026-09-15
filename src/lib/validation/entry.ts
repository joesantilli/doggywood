import { z } from "zod";

export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
export const MAX_VIDEO_DURATION_SECONDS = 30;

export const entrySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  mobile: z.string().trim().min(7, "Enter a valid mobile number"),
  petName: z.string().trim().min(1, "Dog's name is required"),
  caption: z.string().trim().max(280, "Caption must be 280 characters or less").optional(),
  rulesAgreed: z.literal("on", {
    errorMap: () => ({ message: "Please agree to the Official Rules." }),
  }),
});

export type EntryInput = z.infer<typeof entrySchema>;
export type VerifyDogPrefill = Partial<Omit<EntryInput, "rulesAgreed" | "caption">>;

export const verificationChannelSchema = z.enum(["email", "mobile"]);
export type VerificationChannel = z.infer<typeof verificationChannelSchema>;

export function parseEntryForm(formData: FormData) {
  const caption = String(formData.get("caption") ?? "").trim();

  return entrySchema.safeParse({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    petName: String(formData.get("petName") ?? ""),
    caption: caption.length > 0 ? caption : undefined,
    rulesAgreed: formData.get("rulesAgreed") === "on" ? "on" : "",
  });
}

const videoTypes = new Set(["video/mp4", "video/quicktime", "video/webm"]);
const videoExtensions = [".mp4", ".mov", ".webm"];

export function validateVideoFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Upload a video that is 30 seconds or less.";
  }

  if (file.size > MAX_VIDEO_BYTES) {
    return "Video must be 500MB or less.";
  }

  const name = file.name.toLowerCase();
  const hasAcceptedExtension = videoExtensions.some((extension) => name.endsWith(extension));

  if (file.type && !videoTypes.has(file.type) && !hasAcceptedExtension) {
    return "Use MP4, MOV, or WEBM.";
  }

  if (!file.type && !hasAcceptedExtension) {
    return "Use MP4, MOV, or WEBM.";
  }

  return null;
}

export function validateVideoDuration(durationSeconds: number | null) {
  if (durationSeconds == null || Number.isNaN(durationSeconds)) {
    return null;
  }

  if (durationSeconds > MAX_VIDEO_DURATION_SECONDS + 0.05) {
    return "Video must be 30 seconds or less.";
  }

  return null;
}

export function formatVideoDuration(durationSeconds: number) {
  const total = Math.max(0, Math.round(durationSeconds));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function readVideoDurationSeconds(file: File): Promise<number | null> {
  if (typeof document === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    const finish = (value: number | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };

    video.onloadedmetadata = () => {
      finish(Number.isFinite(video.duration) ? video.duration : null);
    };
    video.onerror = () => {
      finish(null);
    };

    video.src = url;
  });
}
