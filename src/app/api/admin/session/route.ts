import { cookies } from "next/headers";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isAdminSessionConfigured,
  isSameOriginRequest,
  shouldUseSecureCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { adminJson, getAuthenticatedAdmin, validateJson } from "@/lib/admin-api";
import { adminLoginSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  const { admin, response } = await getAuthenticatedAdmin();
  if (response) return response;
  return adminJson({ user: admin });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const parsed = await validateJson(request, adminLoginSchema);
  if (!parsed.ok) return parsed.response;

  if (!isAdminSessionConfigured()) {
    return adminJson({ error: "Admin sessions are not configured on this server." }, 503);
  }

  try {
    const account = await getPrismaClient().adminAccount.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, passwordHash: true, isActive: true },
    });

    if (!account?.isActive || !(await verifyAdminPassword(parsed.data.password, account.passwordHash))) {
      return adminJson({ error: "Email or password is incorrect." }, 401);
    }

    const token = createAdminSessionToken(account.id);
    (await cookies()).set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: shouldUseSecureCookie(request),
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return adminJson({ ok: true });
  } catch (error) {
    console.error("Admin login could not be completed.", error);
    return adminJson({ error: "Admin login is temporarily unavailable." }, 503);
  }
}
