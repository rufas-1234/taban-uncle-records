import { hashAdminPassword, isSameOriginRequest } from "@/lib/admin-auth";
import {
  adminJson,
  isPrismaError,
  requireSeniorAdminApi,
  validateJson,
} from "@/lib/admin-api";
import { publisherCreateSchema, publisherStatusSchema } from "@/lib/admin-validation";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireSeniorAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const accounts = await getPrismaClient().adminAccount.findMany({
      orderBy: [{ createdAt: "asc" }],
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
    return adminJson({ data: accounts });
  } catch (error) {
    console.error("Admin publisher accounts could not be loaded.", error);
    return adminJson({ error: "Publisher accounts are temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireSeniorAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, publisherCreateSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const account = await getPrismaClient().adminAccount.create({
      data: {
        email: parsed.data.email,
        passwordHash: await hashAdminPassword(parsed.data.password),
        role: "PUBLISHER",
      },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
    return adminJson({ data: account }, 201);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return adminJson({ error: "An account with this email already exists." }, 409);
    }
    console.error("Publisher account could not be created.", error);
    return adminJson({ error: "Publisher account could not be created right now." }, 503);
  }
}

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireSeniorAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, publisherStatusSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const prisma = getPrismaClient();
    const result = await prisma.adminAccount.updateMany({
      where: { id: parsed.data.id, role: "PUBLISHER" },
      data: { isActive: parsed.data.isActive },
    });

    if (result.count === 0) {
      return adminJson({ error: "Publisher account was not found." }, 404);
    }

    const account = await prisma.adminAccount.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
    return adminJson({ data: account });
  } catch (error) {
    console.error("Publisher account status could not be updated.", error);
    return adminJson({ error: "Publisher account could not be updated right now." }, 503);
  }
}
