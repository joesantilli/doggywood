import "server-only";
import { getPrisma } from "@/lib/db";

export const inquiryRepository = {
  create(data: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return getPrisma().contactInquiry.create({ data });
  },

  countRecentByIp(ipAddress: string, since: Date) {
    return getPrisma().contactInquiry.count({
      where: { ipAddress, createdAt: { gt: since } },
    });
  },
};
