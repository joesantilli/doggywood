import { z } from "zod";

export const entrySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  mobile: z.string().trim().min(7, "Enter a valid mobile number"),
  petName: z.string().trim().min(1, "Dog's name is required"),
  rulesAgreed: z.literal("on", {
    errorMap: () => ({ message: "Please agree to the Official Rules." }),
  }),
});

export type EntryInput = z.infer<typeof entrySchema>;
export type VerifyDogPrefill = Partial<Omit<EntryInput, "rulesAgreed">>;

export const verificationChannelSchema = z.enum(["email", "mobile"]);
export type VerificationChannel = z.infer<typeof verificationChannelSchema>;

export function parseEntryForm(formData: FormData) {
  return entrySchema.safeParse({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    petName: String(formData.get("petName") ?? ""),
    rulesAgreed: formData.get("rulesAgreed") === "on" ? "on" : "",
  });
}

const videoTypes = new Set(["video/mp4", "video/quicktime", "video/webm"]);

export function validateVideoFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Upload a vertical video that is 30 seconds or less.";
  }

  if (file.size > 500 * 1024 * 1024) {
    return "Video must be 500MB or less.";
  }

  if (file.type && !videoTypes.has(file.type)) {
    return "Use MP4, MOV, or WEBM.";
  }

  return null;
}
