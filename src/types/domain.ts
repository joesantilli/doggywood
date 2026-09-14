import { z } from "zod";

export const USER_ROLES = [
  "user",
  "moderator",
  "administrator",
  "super_administrator",
] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

export const USER_STATUSES = ["active", "suspended", "deleted"] as const;
export const userStatusSchema = z.enum(USER_STATUSES);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const DOG_CATEGORIES = ["esa", "psd", "service_dog", "pet"] as const;
export const dogCategorySchema = z.enum(DOG_CATEGORIES);
export type DogCategory = z.infer<typeof dogCategorySchema>;

export const VIDEO_STATUSES = [
  "draft",
  "uploading",
  "processing",
  "ready",
  "technical_reject",
  "removed",
] as const;
export const videoStatusSchema = z.enum(VIDEO_STATUSES);
export type VideoStatus = z.infer<typeof videoStatusSchema>;

export const CONTEST_STATUSES = [
  "draft",
  "scheduled",
  "open",
  "voting_only",
  "closed",
  "finalized",
  "cancelled",
] as const;
export const contestStatusSchema = z.enum(CONTEST_STATUSES);
export type ContestStatus = z.infer<typeof contestStatusSchema>;

export const ENTRY_STATUSES = [
  "draft",
  "submitted",
  "pending_moderation",
  "approved",
  "rejected",
  "removed",
  "winner",
] as const;
export const entryStatusSchema = z.enum(ENTRY_STATUSES);
export type EntryStatus = z.infer<typeof entryStatusSchema>;

export const RATING_VALUES = [1, 2, 3, 4, 5] as const;
export const ratingValueSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type RatingValue = z.infer<typeof ratingValueSchema>;

export const MODERATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "escalated",
  "removed",
] as const;
export const moderationStatusSchema = z.enum(MODERATION_STATUSES);
export type ModerationStatus = z.infer<typeof moderationStatusSchema>;
