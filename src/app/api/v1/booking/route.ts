import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/prisma";

const bookingRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(320).toLowerCase(),
  phone: z.union([
    z.literal(""),
    z.string().trim().min(7).max(40).regex(/^\+?[0-9\s().-]+$/, "Enter a valid phone number."),
  ]).optional().transform((value) => value || null),
  service: z.string().trim().min(2, "Please choose a service.").max(80),
  projectType: z.string().trim().min(2, "Please describe the project type.").max(160),
  message: z.string().trim().min(10, "Please include a brief for the project.").max(5000),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const booking = await getPrismaClient().booking.create({
      data: parsed.data,
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Booking request received.",
        data: booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save booking request.", error);
    return NextResponse.json(
      { ok: false, error: "Booking service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
