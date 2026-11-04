"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.union([
    z.literal(""),
    z.string().trim().min(7, "Enter at least 7 characters for your phone number.").max(40).regex(/^\+?[0-9\s().-]+$/, "Enter a valid phone number."),
  ]),
  service: z.string().min(2, "Please select a service."),
  projectType: z.string().min(2, "Please tell us what kind of project this is."),
  message: z.string().min(10, "Tell us a little more about your brief."),
});

type BookingValues = z.infer<typeof bookingSchema>;

const defaultValues: BookingValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  projectType: "",
  message: "",
};

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  async function onSubmit(values: BookingValues) {
    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const response = await fetch("/api/v1/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Unable to submit booking request.");
      }

      setSubmitState("success");
      reset();
    } catch (error) {
      setSubmitState("error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-y border-[#171713]/20 py-7">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="editorial-eyebrow">Project enquiry</p>
          <h2 className="editorial-heading mt-2 text-3xl sm:text-4xl">Tell us what you have in mind.</h2>
        </div>
        <p className="max-w-xs text-xs leading-6 text-[#171713]/55">A few details help us prepare for a good first conversation.</p>
      </div>

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <label className="space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
          <span>Full name</span>
          <input {...register("name")} autoComplete="name" className="editorial-input" placeholder="Your name" />
          {errors.name && <span className="block normal-case tracking-normal text-red-700">{errors.name.message}</span>}
        </label>

        <label className="space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
          <span>Email address</span>
          <input {...register("email")} type="email" autoComplete="email" className="editorial-input" placeholder="you@example.com" />
          {errors.email && <span className="block normal-case tracking-normal text-red-700">{errors.email.message}</span>}
        </label>
        <label className="space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
          <span>Phone number (optional)</span>
          <input {...register("phone")} type="tel" autoComplete="tel" className="editorial-input" placeholder="+211 ..." />
          {errors.phone && <span className="block normal-case tracking-normal text-red-700">{errors.phone.message}</span>}
        </label>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
        <label className="space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
          <span>Service</span>
          <select {...register("service")} className="editorial-input">
            <option value="">Select a service</option>
            <option value="music-recording">Music recording</option>
            <option value="music-production">Music production</option>
            <option value="mixing-mastering">Mixing and mastering</option>
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
            <option value="commercial-content">Commercial content</option>
          </select>
          {errors.service && <span className="block normal-case tracking-normal text-red-700">{errors.service.message}</span>}
        </label>

        <label className="space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
          <span>Project type</span>
          <input {...register("projectType")} className="editorial-input" placeholder="Single, campaign, event, album..." />
          {errors.projectType && <span className="block normal-case tracking-normal text-red-700">{errors.projectType.message}</span>}
        </label>
      </div>

      <label className="mt-6 block space-y-1.5 text-xs uppercase tracking-[0.14em] text-[#171713]/65">
        <span>Project brief</span>
        <textarea {...register("message")} rows={5} className="editorial-input resize-y" placeholder="Tell us about your vision, timeline, concept, and any references or shoot details." />
        {errors.message && <span className="block normal-case tracking-normal text-red-700">{errors.message.message}</span>}
      </label>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="editorial-button-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Send Request"}
          <ArrowRight className="h-4 w-4" />
        </button>

        {submitState === "success" && (
          <p role="status" className="inline-flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Request received. We’ll review it and contact you.
          </p>
        )}

        {submitState === "error" && (
          <p role="alert" className="text-sm text-red-700">Something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}
