import { adminJson, isPrismaError, requireAdminApi } from "@/lib/admin-api";
import { isSameOriginRequest } from "@/lib/admin-auth";
import { sendBookingApprovalEmail } from "@/lib/booking-notifications";
import { getPrismaClient } from "@/lib/prisma";

type ApprovalEmailRouteContext = {
  params: Promise<{ bookingId: string }>;
};

export async function POST(request: Request, { params }: ApprovalEmailRouteContext) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Request origin was not accepted." }, 403);
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { bookingId } = await params;
    const prisma = getPrismaClient();
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return adminJson({ error: "Booking request was not found." }, 404);
    if (booking.status !== "ACCEPTED") {
      return adminJson({ error: "Approve the booking before sending its approval email." }, 409);
    }
    if (booking.approvalEmailStatus === "SENT") {
      return adminJson({ data: booking, notificationMessage: "Approval email was already sent." });
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
    console.error("Booking approval email retry could not be completed.", error);
    return adminJson({ error: "Approval email could not be retried right now." }, 503);
  }
}
