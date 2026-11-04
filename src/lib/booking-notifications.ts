import type { Booking } from "@/generated/prisma/client";

type ApprovalEmailResult =
  | { status: "SENT"; sentAt: Date; message: string }
  | { status: "NOT_CONFIGURED"; sentAt: null; message: string }
  | { status: "FAILED"; sentAt: null; message: string };

export async function sendBookingApprovalEmail(booking: Booking): Promise<ApprovalEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !from) {
    return {
      status: "NOT_CONFIGURED",
      sentAt: null,
      message: "Approval email is not configured. Contact the customer manually.",
    };
  }

  const studioName = "Taban Uncle Records";
  const text = [
    `Hello ${booking.name},`,
    "",
    `Your ${studioName} booking request has been approved.`,
    "",
    `Service: ${booking.service}`,
    `Project: ${booking.projectType}`,
    "",
    "We will contact you to confirm scheduling and any remaining details.",
    "",
    studioName,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [booking.email],
        subject: "Your booking request is approved | Taban Uncle Records",
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("Resend rejected a booking approval email.", { status: response.status });
      return {
        status: "FAILED",
        sentAt: null,
        message: "The booking was approved, but the approval email could not be sent.",
      };
    }

    return {
      status: "SENT",
      sentAt: new Date(),
      message: "Booking approved and approval email sent.",
    };
  } catch (error) {
    console.error("Booking approval email delivery failed.", error);
    return {
      status: "FAILED",
      sentAt: null,
      message: "The booking was approved, but the approval email could not be sent.",
    };
  }
}
