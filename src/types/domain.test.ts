import { describe, expect, it } from "vitest";
import {
  CONTEST_STATUSES,
  DOG_CATEGORIES,
  ENTRY_STATUSES,
  MODERATION_STATUSES,
  RATING_VALUES,
  USER_ROLES,
  USER_STATUSES,
  VIDEO_STATUSES,
  contestStatusSchema,
  dogCategorySchema,
  entryStatusSchema,
  moderationStatusSchema,
  ratingValueSchema,
  userRoleSchema,
  userStatusSchema,
  videoStatusSchema,
} from "@/types/domain";

describe("domain enums", () => {
  it("accepts the approved user roles and statuses", () => {
    expect(USER_ROLES).toEqual([
      "user",
      "moderator",
      "administrator",
      "super_administrator",
    ]);
    expect(USER_STATUSES).toEqual(["active", "suspended", "deleted"]);
    expect(userRoleSchema.parse("moderator")).toBe("moderator");
    expect(userStatusSchema.parse("active")).toBe("active");
  });

  it("accepts approved dog, video, contest, entry, and moderation values", () => {
    expect(DOG_CATEGORIES).toEqual(["esa", "psd", "service_dog", "pet"]);
    expect(dogCategorySchema.parse("service_dog")).toBe("service_dog");
    expect(VIDEO_STATUSES).toContain("technical_reject");
    expect(videoStatusSchema.parse("ready")).toBe("ready");
    expect(CONTEST_STATUSES).toContain("voting_only");
    expect(contestStatusSchema.parse("open")).toBe("open");
    expect(ENTRY_STATUSES).toContain("pending_moderation");
    expect(entryStatusSchema.parse("approved")).toBe("approved");
    expect(MODERATION_STATUSES).toEqual([
      "pending",
      "approved",
      "rejected",
      "escalated",
      "removed",
    ]);
    expect(moderationStatusSchema.parse("escalated")).toBe("escalated");
  });

  it("accepts rating values from one to five only", () => {
    expect(RATING_VALUES).toEqual([1, 2, 3, 4, 5]);
    expect(ratingValueSchema.parse(5)).toBe(5);
    expect(ratingValueSchema.safeParse(0).success).toBe(false);
    expect(ratingValueSchema.safeParse(6).success).toBe(false);
  });

  it("rejects values that are not in the approved domain", () => {
    expect(userRoleSchema.safeParse("owner").success).toBe(false);
    expect(videoStatusSchema.safeParse("winner").success).toBe(false);
    expect(moderationStatusSchema.safeParse("flagged").success).toBe(false);
  });
});
