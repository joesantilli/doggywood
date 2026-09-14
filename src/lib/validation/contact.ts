import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .refine((value) => value.replace(/\D/g, "").length >= 7, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  spamCode: z.string().trim().min(1, "Enter the anti-spam code"),
  spamToken: z.string().min(1, "Anti-spam verification is missing"),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function parseContactForm(data: unknown) {
  return contactSchema.safeParse(data);
}
