import { adminJson, isPrismaError, requireAdminApi, validateJson } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { bookingStatusSchema } from "@/lib/admin-validation";
import { sendBookingApprovalEmail } from "@/lib/booking-notifications";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const bookings = await getPrismaClient().booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return adminJson({ data: bookings });
  } catch (error) {
    console.error("Admin booking requests could not be loaded.", error);
    return adminJson({ error: "Booking requests are temporarily unavailable." }, 503);
  }
}

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = await validateJson(request, bookingStatusSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const prisma = getPrismaClient();

    if (parsed.data.status !== "ACCEPTED") {
      const booking = await prisma.booking.update({
        where: { id: parsed.data.id },
        data: { status: parsed.data.status },
      });
      return adminJson({ data: booking, notificationMessage: null });
    }

    const transitioned = await prisma.booking.updateMany({
      where: { id: parsed.data.id, status: { not: "ACCEPTED" } },
      data: {
        status: "ACCEPTED",
        approvalEmailStatus: "NOT_SENT",
        approvalEmailSentAt: null,
      },
    });
    const booking = await prisma.booking.findUnique({ where: { id: parsed.data.id } });
    if (!booking) return adminJson({ error: "Booking request was not found." }, 404);
    if (transitioned.count === 0) {
      return adminJson({ data: booking, notificationMessage: null });
    }

    const email = await sendBookingApprovalEmail(booking);
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        approvalEmailStatus: email.status,
        approvalEmailSentAt: email.sentAt,
      },
    });
    return adminJson({ data: updatedBooking, notificationMessage: email.message });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return adminJson({ error: "Booking request was not found." }, 404);
    }

    console.error("Admin booking status could not be updated.", error);
    return adminJson({ error: "Booking request could not be updated right now." }, 503);
  }
}
