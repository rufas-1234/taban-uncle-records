import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME, isSameOriginRequest } from "@/lib/admin-auth";
import { adminJson } from "@/lib/admin-api";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  (await cookies()).delete(ADMIN_COOKIE_NAME);
  return adminJson({ ok: true });
}
