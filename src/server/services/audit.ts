import "server-only";
import type { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const auditService = {
  record(data: {
    actorUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
  }) {
    return getPrisma().auditEvent.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
      },
    });
  },
};
