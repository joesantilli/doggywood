import { NextResponse } from "next/server";
import { getHealthPayload } from "@/server/health";

export async function GET() {
  const { statusCode, body } = await getHealthPayload();
  return NextResponse.json(body, { status: statusCode });
}
