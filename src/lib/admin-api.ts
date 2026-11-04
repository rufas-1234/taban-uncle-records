import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { getPrismaClient } from "@/lib/prisma";

export function adminJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function getAuthenticatedAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);
  if (!session) {
    return { admin: null, response: adminJson({ error: "Authentication required." }, 401) };
  }

  try {
    const admin = await getPrismaClient().adminAccount.findUnique({
      where: { id: session.adminId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!admin?.isActive) {
      return { admin: null, response: adminJson({ error: "Authentication required." }, 401) };
    }

    return { admin, response: null };
  } catch (error) {
    console.error("Admin account could not be verified.", error);
    return { admin: null, response: adminJson({ error: "Admin authentication is temporarily unavailable." }, 503) };
  }
}

export async function requireAdminApi() {
  const { response } = await getAuthenticatedAdmin();
  return response;
}

export async function requireSeniorAdminApi() {
  const { admin, response } = await getAuthenticatedAdmin();
  if (response) return response;
  return admin?.role === "SENIOR_ADMIN"
    ? null
    : adminJson({ error: "Only a Senior Admin can manage publisher accounts." }, 403);
}

export async function validateJson<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ ok: true; data: z.output<T> } | { ok: false; response: NextResponse }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { ok: false, response: adminJson({ error: "Invalid JSON payload." }, 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: adminJson({ error: parsed.error.flatten().fieldErrors }, 400),
    };
  }

  return { ok: true, data: parsed.data };
}

export function isPrismaError(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}
