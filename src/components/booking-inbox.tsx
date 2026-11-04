"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

type BookingStatus = "NEW" | "CONTACTED" | "ACCEPTED" | "DECLINED";
type ApprovalEmailStatus = "NOT_SENT" | "SENT" | "FAILED" | "NOT_CONFIGURED";

type BookingRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  projectType: string;
  message: string;
  status: BookingStatus;
  approvalEmailStatus: ApprovalEmailStatus;
  approvalEmailSentAt: string | null;
  createdAt: string;
};

const statusLabels: Record<BookingStatus, string> = {
  NEW: "Needs review",
  CONTACTED: "Contacted",
  ACCEPTED: "Approved",
  DECLINED: "Declined",
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "The request could not be completed.";
    throw new Error(message);
  }

  return payload as T;
}

export function BookingInbox() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void requestJson<{ data: BookingRecord[] }>("/api/admin/bookings")
      .then(({ data }) => {
        if (active) setBookings(data);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        if (loadError instanceof Error && loadError.message === "Authentication required.") {
          router.replace("/admin/login");
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Booking requests could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);
    setError("");
    try {
      const response = await requestJson<{ data: BookingRecord }>("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setBookings((current) => current.map((booking) => booking.id === id ? response.data : booking));
      if (response.data.status === "ACCEPTED" && response.data.approvalEmailStatus !== "SENT") {
        setError("Request approved, but its email was not sent. Use the customer contact links below to notify them.");
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Booking status could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function retryApprovalEmail(booking: BookingRecord) {
    setUpdatingId(booking.id);
    setError("");
    try {
      const response = await requestJson<{ data: BookingRecord }>("/api/admin/bookings/" + booking.id + "/approval-email", {
        method: "POST",
      });
      setBookings((current) => current.map((item) => item.id === booking.id ? response.data : item));
      if (response.data.approvalEmailStatus !== "SENT") {
        setError("Approval email still could not be sent. Notify the customer using the contact links below.");
      }
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Approval email could not be retried.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section id="admin-bookings" data-admin-search-create="Open booking requests" data-admin-search-category="Booking inbox" className="mt-14 scroll-mt-28 border-t-2 border-[#171713]/20 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#171713]/20 pb-4">
        <div>
          <p className="editorial-eyebrow">Studio operations</p>
          <h2 className="editorial-heading mt-2 text-3xl">Booking enquiries</h2>
          <p className="mt-2 text-sm text-[#171713]/60">New requests need your review. Approve requests you can take on, or decline them.</p>
        </div>
        <span className="text-xs text-[#171713]/50">{bookings.length} recent requests</span>
      </div>

      {error && <p role="alert" className="mt-5 border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{error}</p>}
      {loading ? (
        <p className="py-8 text-sm text-[#171713]/60">Loading booking requests…</p>
      ) : bookings.length === 0 ? (
        <p className="py-8 text-sm text-[#171713]/60">No booking requests have been received yet.</p>
      ) : (
        <ul className="divide-y divide-[#171713]/15">
          {bookings.map((booking) => (
            <li key={booking.id} data-admin-search-record data-admin-search-label={booking.name} data-admin-search-keywords={`${booking.email} ${booking.phone ?? ""} ${booking.service} ${booking.projectType} ${booking.message} ${booking.status} booking request enquiry`} data-admin-search-category={`Booking · ${statusLabels[booking.status]}`} className="grid gap-4 py-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="editorial-heading text-xl">{booking.name}</h3>
                  <a href={`mailto:${booking.email}`} className="inline-flex items-center gap-1.5 break-all text-xs text-[#80643a] underline underline-offset-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {booking.email}
                  </a>
                  {booking.phone && (
                    <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1.5 text-xs text-[#80643a] underline underline-offset-2">
                      <Phone className="h-3.5 w-3.5 shrink-0" /> {booking.phone}
                    </a>
                  )}
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[#171713]/55">
                  {booking.service} · {booking.projectType}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#171713]/75">{booking.message}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-[#171713]/50">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
                {booking.status === "ACCEPTED" && (
                  <div className={`mt-4 border px-3 py-3 text-xs ${booking.approvalEmailStatus === "SENT" ? "border-emerald-800/20 bg-emerald-950/5 text-emerald-900" : "border-amber-800/20 bg-amber-950/5 text-amber-950"}`}>
                    {booking.approvalEmailStatus === "SENT"
                      ? `Approval email sent${booking.approvalEmailSentAt ? ` on ${new Date(booking.approvalEmailSentAt).toLocaleString()}` : ""}.`
                      : "Booking approved, but no approval email has been sent yet."}
                    {booking.approvalEmailStatus !== "SENT" && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={updatingId === booking.id}
                          onClick={() => void retryApprovalEmail(booking)}
                          className="underline underline-offset-2 disabled:opacity-60"
                        >
                          {booking.approvalEmailStatus === "NOT_CONFIGURED" ? "Try email again" : "Retry approval email"}
                        </button>
                        <a
                          href={`mailto:${booking.email}?subject=${encodeURIComponent("Your booking request is approved | Taban Uncle Records")}&body=${encodeURIComponent(`Hello ${booking.name},\n\nYour booking request has been approved. We will contact you to confirm scheduling and any remaining details.\n\nTaban Uncle Records`)}`}
                          className="underline underline-offset-2"
                        >
                          Open email draft
                        </a>
                        {booking.phone && (
                          <a
                            href={`https://wa.me/${booking.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${booking.name}, your booking request with Taban Uncle Records has been approved. We will contact you to confirm scheduling and any remaining details.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            Send WhatsApp manually
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
                  Request status
                  <select
                    value={booking.status}
                    disabled={updatingId === booking.id}
                    onChange={(event) => void updateStatus(booking.id, event.target.value as BookingStatus)}
                    className="editorial-input mt-1 min-w-40 disabled:opacity-60"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                {(booking.status === "NEW" || booking.status === "CONTACTED") && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={updatingId === booking.id}
                      onClick={() => void updateStatus(booking.id, "ACCEPTED")}
                      className="editorial-button-dark min-h-9 px-4 py-2 text-[9px] disabled:opacity-60"
                    >
                      Approve request
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === booking.id}
                      onClick={() => void updateStatus(booking.id, "DECLINED")}
                      className="editorial-button-outline min-h-9 px-4 py-2 text-[9px] disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
